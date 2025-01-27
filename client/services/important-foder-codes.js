
if (this.props.type === 'duration') {
  const defaultDuration = { years: 5, months: 0 };

  // Ensure the value for years excludes 0 as an option
  const sanitizedValue = {
    years: this.props.value?.years > 0 ? this.props.value?.years : defaultDuration.years,
    months: this.props.value?.months ?? defaultDuration.months
  };

  return (
    <Duration
      name={this.props.name}
      label={label}
      hint={hint}
      error={this.props.error}
      value={sanitizedValue}
      onChange={val => this.onFieldChange(val)}
      yearOptions={[1, 2, 3, 4, 5]} // Pass valid options for years explicitly
    />
  );
}



reducer
application.js
import * as types from '../actions/types';

const INITIAL_STATE = {
  schemaVersion: 1,
  readonly: false,
  establishment: null,
  isSyncing: false,
  syncError: false,
  errorCount: 0,
  previousProtocols: {}
};

export default function applicationReducer(state = INITIAL_STATE, action) {
  // use defaults for missing props from server.
  if (!state.hydrated) {
    state = { ...INITIAL_STATE, ...state, hydrated: true };
  }
  switch (action.type) {
    case types.IS_SYNCING:
      return {
        ...state,
        isSyncing: true
      };
    case types.DONE_SYNCING:
      return {
        ...state,
        isSyncing: false
      };
    case types.SET_BASENAME:
      return {
        ...state,
        basename: action.basename
      };
    case types.SYNC_ERROR:
      return {
        ...state,
        syncError: true,
        errorCount: state.errorCount + 1
      };
    case types.SYNC_ERROR_RESOLVED:
      return {
        ...state,
        syncError: false,
        errorCount: 0
      };
    default:
      return state;
  }
}

changes.js
import * as types from '../actions/types';

const INITIAL_STATE = {
  latest: [],
  granted: []
};

const changedItems = (state = [], action) => {
  const paths = action.split('.').map((_, i, arr) => arr.slice(0, i + 1).join('.'));

  return paths.reduce((arr, path) => {
    if (path.match(/^reduction-quantities-/)) {
      path = 'reduction-quantities';
    }
    return arr.includes(path) ? arr : [ ...arr, path ];
  }, state);
};

const changes = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.ADD_CHANGE: {
      return {
        ...state,
        latest: changedItems(state.latest, action.change)
      };
    }

    case types.ADD_CHANGES: {
      const granted = action.granted.reduce((arr, item) => changedItems(arr, item), state.granted);
      const latest = action.latest.reduce((arr, item) => changedItems(arr, item), state.latest);
      return {
        ...state,
        granted,
        latest
      };
    }
  }

  return state;
};

export default changes;



comments.js
import * as types from '../actions/types';

const comments = (state = {}, action) => {
  switch (action.type) {
    case types.COMMENT_ADDED:
      return {
        ...state,
        [action.field]: [
          {
            id: action.id,
            comment: action.comment,
            author: action.author,
            isNew: true,
            isMine: true
          },
          ...(state[action.field] || [])
        ]
      };

    case types.COMMENT_EDITED:
      return {
        ...state,
        [action.field]: (state[action.field] || []).map(comment => {
          if (comment.id === action.id) {
            return {
              ...comment,
              comment: action.comment
            };
          }
          return comment;
        })
      };

    case types.REFRESH_COMMENTS:
      return action.comments;

    case types.COMMENT_DELETED:
      return {
        ...state,
        [action.field]: (state[action.field] || []).map(comment => {
          if (comment.id === action.id) {
            return {
              ...comment,
              deleted: true
            };
          }
          return comment;
        })
      };
  }
  return state;
};

export default comments;

index.js
import { combineReducers } from 'redux';

import projects from './projects';
import project from './project';
import savedProject from './saved-project';
import application from './application';
import message from './message';
import settings from './settings';
import comments from './comments';
import changes from './changes';
import questionVersions from './question-versions';
import staticData from './static';

const rootReducer = combineReducers({
  projects,
  project,
  savedProject,
  application,
  message,
  settings,
  comments,
  changes,
  questionVersions,
  static: staticData
});

export default rootReducer;




message.js
import * as types from '../actions/types';

export default function messageReducer(state = {}, action) {
  switch (action.type) {
    case types.SHOW_MESSAGE:
      return { message: action.message, type: 'alert' };
    case types.SHOW_WARNING:
      return { message: action.message, type: 'warning' };
    case types.ERROR:
      return { message: action.error.message, type: 'error' };
    case types.HIDE_MESSAGE:
      return { message: null };
    default:
      return state;
  }
}


project.js
import * as types from '../actions/types';

const project = (state = {}, action) => {
  switch (action.type) {
    case types.LOAD_PROJECT:
    case types.UPDATE_PROJECT:
    case types.SET_PROJECT:
      return {
        ...action.project
      };
  }
  return state;
};

export default project;

projects.js
import * as types from '../actions/types';

export default function projectsReducer(state = [], action) {
  switch (action.type) {
    case types.LOAD_PROJECTS:
      return action.projects || state;
    case types.CREATE_PROJECT:
      return [...state, action.project];
    case types.UPDATE_PROJECT:
      return state.map(project => project.id === action.id ? action.project : project);
    case types.DELETE_PROJECT:
      return state.filter(project => project.id !== action.id);
    default:
      return state;
  }
}


question-versions.js
import * as types from '../actions/types';

const questionVersions = (state = {}, action) => {

  switch (action.type) {
    case types.LOAD_QUESTION_VERSIONS:
      return {
        ...state,
        [action.key]: {
          ...(state[action.key] || {}),
          [action.version]: action.value
        }
      };
  }
  return state;
};

export default questionVersions;


saved-project.js
import * as types from '../actions/types';

const savedProject = (state = {}, action) => {
  switch (action.type) {
    case types.LOAD_PROJECT:
    case types.SET_PROJECT:
    case types.UPDATE_SAVED_PROJECT:
      return {
        ...action.project
      };
  }
  return state;
};

export default savedProject;


settings.js
import * as types from '../actions/types';

export default function settingsReducer(state = {}, action) {
  switch (action.type) {
    case types.LOAD_SETTINGS:
      return action.settings || state;
    case types.UPDATE_SETTINGS:
      return {
        ...state,
        ...action.settings
      };
    default:
      return state;
  }
}

static.js
const staticReducer = (state = {}) => (state);
export default staticReducer;



action

application.js
import { SET_BASENAME } from './types';

export const setBasename = basename => {
  return {
    type: SET_BASENAME,
    basename
  };
};



comments.js
import sendMessage from './messaging';
import { throwError } from './messages';

import { COMMENT_ADDED, COMMENT_EDITED, COMMENT_DELETED, REFRESH_COMMENTS } from './types';

export const commentAdded = ({ comment, author, field, id }) => {
  return {
    type: COMMENT_ADDED,
    comment,
    author,
    field,
    id
  };
};

export const commentEdited = ({ comment, field, id }) => {
  return {
    type: COMMENT_EDITED,
    comment,
    field,
    id
  };
};

const commentDeleted = ({ id, field }) => ({
  type: COMMENT_DELETED,
  id,
  field
});

const refreshComments = comments => {
  return {
    type: REFRESH_COMMENTS,
    comments
  };
};

const getUrl = (state, suffix) => {
  const url = state.application.basename.replace(/\/edit?/, '').replace(/\/full-application?/, '');
  return `${url}${suffix}`;
};

export const addComment = comment => (dispatch, getState) => {
  const state = getState();
  const params = {
    url: getUrl(state, `/comment`),
    method: 'POST',
    data: comment
  };
  return Promise.resolve()
    .then(() => sendMessage(params))
    .then(({ id }) => {
      dispatch(commentAdded({ ...comment, id, author: state.application.user }));
    })
    .catch(() => {
      dispatch(throwError('Error posting comment'));
    });
};

export const editComment = ({ id, field, comment }) => (dispatch, getState) => {
  const state = getState();
  const params = {
    url: getUrl(state, `/comment/${id}`),
    method: 'PUT',
    data: {
      id,
      field,
      comment
    }
  };

  return Promise.resolve()
    .then(() => dispatch(commentEdited({ field, comment, id })))
    .then(() => sendMessage(params))
    .then(comments => dispatch(refreshComments(comments)))
    .catch(() => {
      dispatch(throwError('Error updating comment'));
    });
};

export const deleteComment = ({ id, field }) => (dispatch, getState) => {
  const state = getState();
  const params = {
    url: getUrl(state, `/comment/${id}`),
    method: 'DELETE'
  };
  return Promise.resolve()
    .then(() => sendMessage(params))
    .then(() => dispatch(commentDeleted({ id, field })))
    .catch(() => {
      dispatch(throwError('Error deleting comment'));
    });
};



messages.js
import * as types from './types';

let hideTimeout;

export function hideMessage() {
  return {
    type: types.HIDE_MESSAGE
  };
}

export function showMessage(message) {
  return (dispatch) => {
    clearTimeout(hideTimeout);
    hideTimeout = setTimeout(() => {
      dispatch(hideMessage());
    }, 5000);
    return dispatch({ type: types.SHOW_MESSAGE, message });
  };
}

export function showWarning(message) {
  return (dispatch) => {
    return dispatch({ type: types.SHOW_WARNING, message });
  };
}

export function throwError(message) {
  return (dispatch) => {
    clearTimeout(hideTimeout);
    return dispatch({ type: types.ERROR, error: { message } });
  };
}

messaging.js
import { version } from '../../package.json';

export function postError({ error, info }) {
  const params = {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify({
      message: error.message,
      stack: error.stack,
      status: error.status,
      url: document.URL,
      ...info
    }),
    headers: {
      'content-type': 'application/json'
    }
  };

  return fetch('/error', params).catch(() => {});
}

export default function sendMessage({ method, data, url }) {
  const params = {
    method,
    credentials: 'include',
    // prevent auto-redirecting request
    // to keycloak if users session expires
    redirect: 'manual',
    body: JSON.stringify(data),
    headers: {
      'content-type': 'application/json',
      // send version header for compatability validation on server
      'x-projects-version': version
    }
  };
  return Promise.resolve()
    .then(() => fetch(url, params))
    .then(response => {
      // detect if redirect was attempted
      if (response.type === 'opaqueredirect') {
        window.onbeforeunload = null;
        window.location.reload();
      }
      return response.json()
        .then(json => {
          if (response.status > 399) {
            const err = new Error(json.message || `Action failed with status code: ${response.status}`);
            Object.assign(err, json);
            throw err;
          }
          return json;
        })
        .catch(err => {
          err.status = response.status;
          throw err;
        });
    });
}


nuke.js
export const nuke = () => {
  indexedDB.deleteDatabase('asl');
  window.location.reload();
};


projects.js
import omit from 'lodash/omit';
import debounce from 'lodash/debounce';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import pick from 'lodash/pick';
import shasum from 'shasum';

import * as types from './types';
import database from '../database';
import { showMessage, showWarning, throwError } from './messages';
import sendMessage, { postError } from './messaging';
import { getConditions } from '../helpers';
import cleanProtocols from '../helpers/clean-protocols';
import sha from 'sha.js';
import { keyBy } from 'lodash';

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
  };
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
  return dispatch => {
    return database()
      .then(db => db.create(omit(project, 'id')))
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
  };
}

export function saveReusableSteps(reusableSteps) {
  return (dispatch, getState) => {
    const state = getState();
    const newState = cloneDeep(state.project);
    const updatedReusableSteps = keyBy(reusableSteps, 'id');
    newState.reusableSteps = {...newState.reusableSteps, ...updatedReusableSteps};
    dispatch(updateProject(newState));
    return debouncedSyncProject(dispatch, getState);
  };
}

export function addChange(change) {
  return {
    type: types.ADD_CHANGE,
    change
  };
}

export function addChanges(changes = {}) {
  return {
    type: types.ADD_CHANGES,
    granted: changes.granted || [],
    latest: changes.latest || []
  };
}

export function updateSavedProject(project) {
  return {
    type: types.UPDATE_SAVED_PROJECT,
    project
  };
}

export function isSyncing() {
  return {
    type: types.IS_SYNCING
  };
}

export function doneSyncing() {
  return {
    type: types.DONE_SYNCING
  };
}

export function syncError() {
  return {
    type: types.SYNC_ERROR
  };
}

export function syncErrorResolved() {
  return {
    type: types.SYNC_ERROR_RESOLVED
  };
}

const debouncedUpdate = debounce((id, data, dispatch) => {
  return database()
    .then(db => db.update(id, data))
    .then(() => updateSavedProject(data))
    // TODO: notify user autosaved.
    .catch(err => dispatch({ type: types.ERROR, err }));
}, 500, { maxWait: 5000 });

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
  };

  return Promise.resolve()
    .then(() => sendMessage(params))
    .then(() => {
      dispatch(doneSyncing());
      if (state.application.syncError) {
        dispatch(syncErrorResolved());
        dispatch(showMessage('Saved successfully'));
      }
    })
    .then(() => dispatch(updateSavedProject(applyConditions(state.savedProject, data))))
    .then(() => syncConditions(dispatch, getState))
    .catch(err => {
      return onSyncError(syncConditions, err, dispatch, getState);
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

const onSyncError = (func, error, dispatch, getState, ...args) => {
  dispatch(doneSyncing());
  dispatch(syncError());
  const errorCount = getState().application.errorCount;
  if (error.code === 'UPDATE_REQUIRED') {
    return dispatch(throwError('This software has been updated. You must refresh your browser to avoid losing work.'));
  }
  console.error(error);
  if (errorCount > 5) {
    postError({ error });
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
    dispatch(updateSavedProject(project));
    dispatch(doneSyncing());
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
      dispatch(addChanges(json.changes));
      dispatch(doneSyncing());
      if (state.application.syncError) {
        dispatch(syncErrorResolved());
        dispatch(showMessage('Saved successfully'));
      }
      return json;
    })
    .then(response => {
      const patched = jsondiff.patch(state.savedProject, patch);
      // always exclude the id from the checksum since it does not exist in the server data and is set locally
      // also exclude any server-computed properties that are returned in the response
      const checksumOmit = [...(response.checksumOmit || []), 'id'];
      if (response.checksum !== shasum(omit(patched, ...checksumOmit))) {
        dispatch(showWarning('This project has been updated elsewhere. [Reload the page]() to get the latest version.'));
      }
      dispatch(updateSavedProject(patched));
    })
    .then(() => wait(2000))
    .then(() => syncProject(dispatch, getState))
    .catch(err => {
      onSyncError(syncProject, err, dispatch, getState);
    });
};

const debouncedSyncConditions = debounce((dispatch, getState) => {
  return syncConditions(dispatch, getState);
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
  };
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
      ];

    const newState = cloneDeep(state.project);
    if (protocolId) {
      newState.protocols = newState.protocols.map(protocol => {
        if (protocol.id === protocolId) {
          return { ...protocol, conditions: newConditions };
        }
        return protocol;
      });
    } else {
      newState.conditions = type === 'legacy' ? conditions : newConditions;
    }
    dispatch(updateProject(newState));
    return debouncedSyncConditions(dispatch, getState);
  };
}

export function fetchQuestionVersions(key, { version, type, isRa }) {

  return (dispatch, getState) => {
    const state = getState();

    const params = {
      state,
      url: getUrl(state, `/question/${key}?version=${version}&type=${type}&isRa=${isRa}`)
    };

    return Promise.resolve()
      .then(() => sendMessage(params))
      .then(value => dispatch({ type: types.LOAD_QUESTION_VERSIONS, value, key, version }))
      .catch(error => dispatch({ type: types.ERROR, error }));
  };
}

const debouncedSyncProject = debounce((...args) => {
  return syncProject(...args);
}, 2000, { maxWait: 20000, leading: false });

export const ajaxSync = changed => {
  return (dispatch, getState) => {
    const { project, savedProject, application: { establishment, schemaVersion } } = getState();
    const newState = cleanProtocols({ state: project, savedState: savedProject, changed, establishment, schemaVersion });

    dispatch(updateProject(newState));
    return debouncedSyncProject(dispatch, getState);
  };
};


session.js
import throttle from 'lodash/throttle';
import sendMessage from './messaging';

const debouncedSendMessage = throttle(sendMessage, 30000);

export const keepAlive = () => {
  return () => {
    return Promise.resolve()
      .then(() => debouncedSendMessage({ url: '/keepalive' }))
      .catch(err => console.error(err));
  };
};


settings.js
import * as types from './types';
import database from '../database';

export function loadSettings() {
  return dispatch => {
    return database()
      .then(db => db.list('settings'))
      .then(settings => dispatch({ type: types.LOAD_SETTINGS, settings: settings[0] }))
      .catch(error => dispatch({ type: types.ERROR, error }));
  };
}

export function updateSettings(key, value) {
  return (dispatch, getState) => {
    const settings = getState().settings;
    if (!settings) {
      return dispatch({ type: types.ERROR, error: new Error(`Settings not set`) });
    }
    return database()
      .then(db => db.update(0, { ...settings, [key]: value }, 'settings'))
      .then(settings => dispatch({ type: types.UPDATE_SETTINGS, settings }))
      .catch(error => dispatch({ type: types.ERROR, error }));
  };
}


types.js
export const LOAD_SETTINGS = 'LOAD_SETTINGS';
export const UPDATE_SETTINGS = 'UPDATE_SETTINGS';

export const IS_SYNCING = 'IS_SYNCING';
export const DONE_SYNCING = 'DONE_SYNCING';
export const SYNC_ERROR = 'SYNC_ERROR';
export const SYNC_ERROR_RESOLVED = 'SYNC_ERROR_RESOLVED';

export const SET_PROJECT = 'SET_PROJECT';
export const LOAD_PROJECT = 'LOAD_PROJECT';
export const LOAD_PROJECTS = 'LOAD_PROJECTS';
export const CREATE_PROJECT = 'CREATE_PROJECT';
export const UPDATE_PROJECT = 'UPDATE_PROJECT';
export const UPDATE_SAVED_PROJECT = 'UPDATE_SAVED_PROJECT';
export const DELETE_PROJECT = 'DELETE_PROJECT';

export const SHOW_MESSAGE = 'SHOW_MESSAGE';
export const SHOW_WARNING = 'SHOW_WARNING';
export const HIDE_MESSAGE = 'HIDE_MESSAGE';

export const COMMENT_ADDED = 'COMMENT_ADDED';
export const COMMENT_EDITED = 'COMMENT_EDITED';
export const COMMENT_DELETED = 'COMMENT_DELETED';
export const REFRESH_COMMENTS = 'REFRESH_COMMENTS';

export const ADD_CHANGE = 'ADD_CHANGE';
export const ADD_CHANGES = 'ADD_CHANGES';
export const LOAD_QUESTION_VERSIONS = 'LOAD_QUESTION_VERSIONS';
export const ERROR = 'ERROR';

export const SET_BASENAME = 'SET_BASENAME';


database/index.js 
export default () => {

  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open('asl');
    request.onerror = reject;
    request.onupgradeneeded = event => {
      const db = event.target.result;
      db.createObjectStore('projects', { autoIncrement: true });
      db.createObjectStore('settings', { autoIncrement: true });
    };
    request.onsuccess = event => {
      const db = event.target.result;
      resolve({
        list: (table = 'projects') => {
          return new Promise((resolve, reject) => {
            const transaction = db.transaction([table]);
            const objectStore = transaction.objectStore(table);

            const request = objectStore.openCursor();
            const result = [];

            request.onsuccess = event => {
              const cursor = event.target.result;
              if (cursor) {
                result.push({
                  id: cursor.key,
                  ...cursor.value
                });
                cursor.continue();
              } else {
                resolve(result);
              }
            };
            transaction.onerror = e => reject(e);
          });
        },
        read: (id, table = 'projects') => {
          return new Promise((resolve, reject) => {
            const transaction = db.transaction([table]);
            const objectStore = transaction.objectStore(table);
            const request = objectStore.get(id);
            request.onsuccess = e => resolve({
              id,
              ...e.target.result
            });
            transaction.onerror = e => reject(e);
          });
        },
        update: (id, data, table = 'projects') => {
          data.updated = Date.now();
          return new Promise((resolve, reject) => {
            const transaction = db.transaction([table], 'readwrite');
            const objectStore = transaction.objectStore(table);
            const request = objectStore.put(data, id);
            request.onsuccess = () => resolve({
              id,
              ...data
            });
            transaction.onerror = e => reject(e);
          });
        },
        create: (item, table = 'projects') => {
          return new Promise((resolve, reject) => {
            const transaction = db.transaction([table], 'readwrite');
            const objectStore = transaction.objectStore(table);
            item.updated = item.updated || Date.now();
            const request = objectStore.add(item);
            request.onsuccess = e => {
              return resolve({
                id: e.target.result,
                ...item
              });
            };
            transaction.onerror = e => reject(e);
          });
        },
        delete: (id, table = 'projects') => {
          return new Promise((resolve, reject) => {
            const transaction = db.transaction([table], 'readwrite');
            const objectStore = transaction.objectStore(table);
            const request = objectStore.delete(id);
            request.onsuccess = () => resolve();
            transaction.onerror = e => reject(e);
          });
        }
      });
    };
  });

};


