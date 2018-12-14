import * as types from '../actions/types';

const project = (state = {}, action) => {
  switch (action.type) {
    case types.CREATE_PROJECT:
      return {
        ...action.project
      }
  }
  return state;
}

export default function projectsReducer(state = [], action) {
  switch (action.type) {
    case types.LOAD_PROJECTS:
      return action.projects || state;
    case types.CREATE_PROJECT:
      return [
        ...state,
        project(undefined, action)
      ];
    case types.UPDATE_PROJECT:
      return state.map(project => project.id === action.id ? action.project : project);
    case types.DELETE_PROJECT:
      return state.filter(project => project.id !== action.id);
    default:
      return state;
  }
};
