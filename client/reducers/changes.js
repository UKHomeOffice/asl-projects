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
