const initialState = {
  subscriptions: [],
};

const subscriptionsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOAD_SUBSCRIPTIONS": {
      return { ...state, subscriptions: action.payload };
    }

    case "ADD_SUBSCRIPTION": {
      return {
        ...state,
        subscriptions: [...state.subscriptions, action.payload],
      };
    }

    case "UPDATE_SUBSCRIPTION": {
      const subscriptions = [...state.subscriptions];
      const index = subscriptions.findIndex(
        (user) => user.id === action.payload.id // Ensure this checks 'id' properly.
      );

      if (index !== -1) {
        subscriptions[index] = action.payload;
      }

      return { ...state, subscriptions };
    }

    case "DELETE_MOVIE": {
      return {
        ...state,
        subscriptions: state.subscriptions.filter(
          (sub) => sub.movieId !== action.payload
        ),
      };
    }

    case "DELETE_MEMBER": {
      return {
        ...state,
        subscriptions: state.subscriptions.filter(
          (sub) => sub.memberId !== action.payload
        ),
      };
    }

    case "DELETE_SUBSCRIPTION": {
      return {
        ...state,
        subscriptions: state.subscriptions.filter(
          (subscription) => subscription.id !== action.payload
        ),
      };
    }

    default:
      return state;
  }
};

export default subscriptionsReducer;
