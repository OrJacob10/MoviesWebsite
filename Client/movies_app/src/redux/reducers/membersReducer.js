const initialState = {
  members: [],
};

const membersReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOAD_MEMBERS": {
      return { ...state, members: action.payload };
    }

    case "ADD_MEMBER": {
      return { ...state, members: [...state.members, action.payload] };
    }

    case "UPDATE_MEMBER": {
      return {
        ...state,
        members: state.members.map((member) =>
          member._id === action.payload._id ? action.payload : member
        ),
      };
    }

    case "DELETE_MEMBER": {
      return {
        ...state,
        members: state.members.filter((member) => member._id !== action.payload),
      };
    }

    case "UPDATE_MEMBER_MOVIES": {
      const updatedMembers = state.members.map((member) => {
        if (member._id === action.payload.memberId) {
          // Ensure moviesSubscribed is always an array
          const updatedMoviesSubscribed = Array.isArray(member.moviesSubscribed)
            ? [...member.moviesSubscribed, action.payload.newMovie]
            : [action.payload.newMovie];

          return {
            ...member,
            moviesSubscribed: updatedMoviesSubscribed,
          };
        }
        return member;
      });

      return { ...state, members: updatedMembers };
    }

    case "DELETE_MOVIE": {
      return {
        ...state,
        members: state.members.map((member) => ({
          ...member,
          moviesSubscribed: Array.isArray(member.moviesSubscribed)
            ? member.moviesSubscribed.filter((sub) => sub._id !== action.payload)
            : [],
        })),
      };
    }

    default:
      return state;
  }
};

export default membersReducer;

