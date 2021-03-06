const mainState = {
  user: {},
  deets: {},
};

const mainReducer = (state = mainState, action) => {
  switch (action.type) {
    case 'USER_LOGIN': {
      return {
        ...state,
        user: action.payload,
      };
    }
    case 'SET_DEETS': {
      return {
        ...state,
        deets: { ...action.payload },
      };
    }
    case 'ERR_MESSAGE': {
      return {
        ...state,
        user: { loginErr: action.payload },
      };
    }
    case 'NEW_TIMER_2': {
      return {
        ...state,
        user: {
          ...state.user,
          custom_timer_1: state.user.custom_timer_2,
          custom_timer_2: action.payload,
        },
      };
    }
    default: {
      return state;
    }
  }
};

export default mainReducer;
