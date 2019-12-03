import debounce from 'lodash/debounce';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import pick from 'lodash/pick'
import { diff, applyChange } from 'deep-diff';

import * as types from './types';
import database from '../database';
import { showMessage, throwError } from './messages';
import sendMessage from './messaging';

const CONDITIONS_FIELDS = ['conditions', 'retrospectiveAssessment'];

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

const shouldSyncConditions = state => {
  if (state.application.isSyncing) {
    return false;
  }
  const hasDiff = !isEqual(pick(state.savedProject, CONDITIONS_FIELDS), pick(state.project, CONDITIONS_FIELDS));
  return hasDiff;
};

const syncConditions = (dispatch, getState, extra = {}) => {
  const state = getState();

  if (!shouldSyncConditions(state)) {
    return Promise.resolve();
  }

  dispatch(isSyncing());

  const params = {
    state,
    method: 'PUT',
    url: `${state.application.basename}/conditions`,
    data: {
      ...pick(state.project, CONDITIONS_FIELDS),
      ...extra
    }
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
    .then(() => dispatch(updateSavedProject(state.project)))
    .then(() => syncConditions(dispatch, getState, extra))
    .catch(err => {
      return onSyncError(syncConditions, err, dispatch, getState, extra)
    });
};

const shouldSyncProject = state => {
  if (state.application.isSyncing) {
    return false;
  }
  return !isEqual(state.savedProject, state.project);
};

const applyPatches = (source, patches = []) => {
  const patched = cloneDeep(source);
  patches.forEach(p => {
    applyChange(patched, p);
  });
  return patched;
};

const onSyncError = (func, err, dispatch, getState, ...args) => {
  console.error(err);
  dispatch(doneSyncing());
  dispatch(syncError());
  dispatch(throwError('Failed to save, trying again'));
  return setTimeout(() => func(dispatch, getState, ...args), 1000);
};

const syncProject = (dispatch, getState) => {
  const state = getState();

  if (!shouldSyncProject(state)) {
    return Promise.resolve();
  }

  dispatch(isSyncing());

  const patch = diff(state.savedProject, state.project);

  const params = {
    state,
    method: 'PUT',
    url: state.application.basename,
    data: patch
  };

  return Promise.resolve()
    .then(() => sendMessage(params))
    .then(() => {
      dispatch(doneSyncing())
      if (state.application.syncError) {
        dispatch(syncErrorResolved());
        dispatch(showMessage('Saved successfully'))
      }
    })
    .then(() => {
      const patched = applyPatches(state.savedProject, patch);
      dispatch(updateSavedProject(patched));
    })
    .then(() => syncProject(dispatch, getState))
    .catch(err => {
      onSyncError(syncProject, err, dispatch, getState)
    });
}

const debouncedSyncConditions = debounce((dispatch, getState, extra) => {
  return syncConditions(dispatch, getState, extra)
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
    return debouncedSyncConditions(dispatch, getState, protocolId && { protocolId })
  }
}

export function fetchQuestionVersions(key) {

  return (dispatch, getState) => {
    const state = getState();

    const params = {
      state,
      url: `question/${key}`
    }

    return Promise.resolve()
      .then(() => sendMessage(params))
      .then(versions => dispatch({ type: types.LOAD_QUESTION_VERSIONS, versions, key }))
      .catch(error => dispatch({ type: types.ERROR, error }));
  }
}

const debouncedSyncProject = debounce((...args) => {
  return syncProject(...args);
}, 1000, { maxWait: 5000, leading: true });

export const ajaxSync = props => {
  return (dispatch, getState) => {
    const { project } = getState();
    const newState = { ...project, ...props };

    dispatch(updateProject(newState));
    return debouncedSyncProject(dispatch, getState);
  };
};
