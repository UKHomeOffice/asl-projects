import omit from 'lodash/omit';
import debounce from 'lodash/debounce';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import pick from 'lodash/pick'

import * as types from './types';
import database from '../database';
import { showMessage, throwError } from './messages';
import sendMessage from './messaging';
import { getConditions } from '../helpers';
import cleanProtocols from '../helpers/clean-protocols';
import sha from 'sha.js';

const CONDITIONS_FIELDS = ['conditions', 'retrospectiveAssessment'];

const jsondiff = require('jsondiffpatch').create({
  objectHash: obj => {
    return obj.id || sha('sha256').update(obj).digest('hex');
  }
});

const getUrl = (state, suffix) => {
  const url = state.application.basename.replace(/\/edit?/, '').replace(/\/full-application?/, '');
  return `${url}${suffix}`;
};

export function loadProjects() {
  return dispatch => {
    return database()
      .then(db => db.list())
      .then(projects => dispatch({ type: types.LOAD_PROJECTS, projects }))
      .catch(error => dispatch({ type: types.ERROR, error }));
  };
}

export function loadProject(id) {
  return dispatch => {
    return database()
      .then(db => db.read(id))
      .then(project => dispatch({ type: types.LOAD_PROJECT, project }))
      .catch(error => dispatch({ type: types.ERROR, error }));
  };
}

export function setProject(project) {
  return {
    type: types.SET_PROJECT,
    project
  }
}

export function createProject(project) {
  return dispatch => {
    return database()
      .then(db => db.create(project))
      .then(project => {
        dispatch({ type: types.CREATE_PROJECT, project });
        dispatch(showMessage('Project created!'));
        return project;
      })
      .catch(error => dispatch({ type: types.ERROR, error }));
  };
}

export function importProject(project) {
  project = omit(project, 'id');
  return dispatch => {
    return database()
      .then(db => db.create(project))
      .then(project => dispatch({ type: types.CREATE_PROJECT, project }))
      .then(() => dispatch(showMessage('Project imported!')))
      .catch(error => dispatch({ type: types.ERROR, error }));
  };
}

export function deleteProject(id) {
  return dispatch => {
    return database()
      .then(db => db.delete(id))
      .then(() => dispatch({ type: types.DELETE_PROJECT, id }))
      .then(() => dispatch(showMessage('Project deleted!')))
      .catch(error => dispatch({ type: types.ERROR, error }));
  };
}

export function updateProject(project) {
  return {
    type: types.UPDATE_PROJECT,
    project
  }
}

export function addChange(change) {
  return {
    type: types.ADD_CHANGE,
    change
  }
}

export function addChanges(changes = {}) {
  return {
    type: types.ADD_CHANGES,
    granted: changes.granted || [],
    latest: changes.latest || []
  }
}

export function updateSavedProject(project) {
  return {
    type: types.UPDATE_SAVED_PROJECT,
    project
  }
}

export function isSyncing() {
  return {
    type: types.IS_SYNCING
  }
}

export function doneSyncing() {
  return {
    type: types.DONE_SYNCING
  }
}

export function syncError() {
  return {
    type: types.SYNC_ERROR
  }
}

export function syncErrorResolved() {
  return {
    type: types.SYNC_ERROR_RESOLVED
  }
}

const debouncedUpdate = debounce((id, data, dispatch) => {
  return database()
    .then(db => db.update(id, data))
    .then(() => updateSavedProject(data))
    // TODO: notify user autosaved.
    .catch(err => dispatch({ type: types.ERROR, err }))
}, 500, { maxWait: 5000 })

export function indexedDBSync(data) {
  return (dispatch, getState) => {
    const project = getState().project;
    const newState = { ...project, ...data };
    dispatch(updateProject(newState));
    const id = project.id;
    return debouncedUpdate(id, newState, dispatch);
  };
}

const conditionsToSync = (state) => {
  if (state.application.isSyncing) {
    return null;
  }
  const projectConditions = getConditionsToSync(state.project);
  if (!isEqual(getConditionsToSync(state.savedProject), projectConditions)) {
    return projectConditions;
  }
  return state.project.protocols.reduce((data, protocol) => {
    if (data) {
      return data;
    }
    const protocolConditions = getConditionsToSync(state.project, protocol.id);
    if (!isEqual(getConditionsToSync(state.savedProject, protocol.id), protocolConditions)) {
      return protocolConditions;
    }
    return null;
  }, null);
};

const getConditionsToSync = (project, protocolId) => {
  if (protocolId) {
    const protocol = project.protocols.find(p => p.id === protocolId);
    return {
      ...pick(protocol, CONDITIONS_FIELDS),
      protocolId
    };
  }
  return pick(project, CONDITIONS_FIELDS);
};

const syncConditions = (dispatch, getState) => {
  const state = getState();
  const data = conditionsToSync(state);
  if (!data) {
    return Promise.resolve();
  }

  dispatch(isSyncing());

  const params = {
    state,
    method: 'PUT',
    url: getUrl(state, '/conditions'),
    data
  }

  return Promise.resolve()
    .then(() => sendMessage(params))
    .then(() => {
      dispatch(doneSyncing())
      if (state.application.syncError) {
        dispatch(syncErrorResolved());
        dispatch(showMessage('Saved successfully'))
      }
    })
    .then(() => dispatch(updateSavedProject(applyConditions(state.savedProject, data))))
    .then(() => syncConditions(dispatch, getState))
    .catch(err => {
      return onSyncError(syncConditions, err, dispatch, getState)
    });
};

const applyConditions = (state, conditions) => {
  if (conditions.protocolId) {
    const protocols = state.protocols.map(p => {
      if (p.id === conditions.protocolId) {
        return { ...p, ...pick(conditions, CONDITIONS_FIELDS) };
      }
      return p;
    });
    return { ...state, protocols };
  }
  return { ...state, ...pick(conditions, CONDITIONS_FIELDS) };
};

const shouldSyncProject = state => {
  if (state.application.isSyncing) {
    return false;
  }
  return !isEqual(state.savedProject, state.project);
};

const onSyncError = (func, err, dispatch, getState, ...args) => {
  console.error(err);
  dispatch(doneSyncing());
  dispatch(syncError());
  const errorCount = getState().application.errorCount;
  if (err.code === 'UPDATE_REQUIRED') {
    return dispatch(throwError('This software has been updated. You must refresh your browser to avoid losing work.'));
  }
  if (errorCount > 5) {
     return dispatch(throwError('Failed to save your changes. Try refreshing your browser to continue. If the problem persists then please report to aspeltechnicalqueries@homeoffice.gov.uk'));
  }
  dispatch(throwError(`Failed to save, trying again in ${Math.pow(2, errorCount)} seconds`));
  return setTimeout(() => func(dispatch, getState, ...args), 1000 * Math.pow(2, errorCount));
};

function getProjectWithConditions(project) {
  return {
    ...project,
    conditions: getConditions(project),
    protocols: (project.protocols || []).map(protocol => {
      return {
        ...protocol,
        conditions: getConditions(protocol, project)
      };
    })
  };
}

const wait = t => new Promise(resolve => setTimeout(resolve, t));

const syncProject = (dispatch, getState) => {
  const state = getState();

  if (!shouldSyncProject(state)) {
    return Promise.resolve();
  }

  dispatch(isSyncing());

  // don't evaluate conditions on legacy projects
  const project = state.application.schemaVersion > 0
    ? getProjectWithConditions(state.project)
    : state.project;

  const patch = jsondiff.diff(state.savedProject, project);
  if (!patch) {
    return Promise.resolve();
  }

  const params = {
    state,
    method: 'PUT',
    url: state.application.basename,
    data: patch
  };

  return Promise.resolve()
    .then(() => dispatch(updateProject(project)))
    .then(() => sendMessage(params))
    .then(json => {
      dispatch(addChanges(json.changes))
      dispatch(doneSyncing())
      if (state.application.syncError) {
        dispatch(syncErrorResolved());
        dispatch(showMessage('Saved successfully'))
      }
    })
    .then(() => {
      const patched = jsondiff.patch(state.savedProject, patch);
      dispatch(updateSavedProject(patched));
    })
    .then(() => wait(2000))
    .then(() => syncProject(dispatch, getState))
    .catch(err => {
      onSyncError(syncProject, err, dispatch, getState)
    });
}

const debouncedSyncConditions = debounce((dispatch, getState) => {
  return syncConditions(dispatch, getState)
}, 1000, { maxWait: 5000, leading: true });

export function updateRetrospectiveAssessment(retrospectiveAssessment) {
  return (dispatch, getState) => {
    const state = getState();
    const newState = {
      ...state.project,
      retrospectiveAssessment
    };
    dispatch(updateProject(newState));
    return debouncedSyncConditions(dispatch, getState);
  }
}

export function updateConditions(type, conditions, protocolId) {
  return (dispatch, getState) => {
    const state = getState();
    const newConditions = !protocolId
      ? [
        ...(state.project.conditions || []).filter(condition => condition.type !== type),
        ...conditions
      ]
      : [
        ...((state.project.protocols || [])
          .find((p => p.id === protocolId) || {}).conditions || []).filter(condition => condition.type !== type),
        ...conditions
      ]

    const newState = cloneDeep(state.project);
    if (protocolId) {
      newState.protocols = newState.protocols.map(protocol => {
        if (protocol.id === protocolId) {
          return { ...protocol, conditions: newConditions }
        }
        return protocol;
      })
    } else {
      newState.conditions = type === 'legacy' ? conditions : newConditions;
    }
    dispatch(updateProject(newState));
    return debouncedSyncConditions(dispatch, getState)
  }
}

export function fetchQuestionVersions(key, { version, type, isRa }) {

  return (dispatch, getState) => {
    const state = getState();

    const params = {
      state,
      url: getUrl(state, `/question/${key}?version=${version}&type=${type}&isRa=${isRa}`)
    }

    return Promise.resolve()
      .then(() => sendMessage(params))
      .then(value => dispatch({ type: types.LOAD_QUESTION_VERSIONS, value, key, version }))
      .catch(error => dispatch({ type: types.ERROR, error }));
  }
}

const debouncedSyncProject = debounce((...args) => {
  return syncProject(...args);
}, 2000, { maxWait: 20000, leading: false });

export const ajaxSync = props => {
  return (dispatch, getState) => {
    const { project, application: { establishment, schemaVersion } } = getState();
    const newState = cleanProtocols(project, props, establishment, schemaVersion);

    dispatch(updateProject(newState));
    return debouncedSyncProject(dispatch, getState);
  };
};
