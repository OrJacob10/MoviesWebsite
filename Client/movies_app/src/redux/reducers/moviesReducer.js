const initialState = {
    movies: [],
  };
  
  const moviesReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'LOAD_MOVIES': {
        return { ...state, movies: action.payload };
      }
  
      case 'ADD_MOVIE': {
        return { ...state, movies: [...state.movies, action.payload] };
      }
  
      case 'UPDATE_MOVIE': {
        const movies = [...state.movies];
        const index = movies.findIndex((movie) => movie._id === action.payload._id);
  
        if (index !== -1) {
            movies[index] = action.payload;
        }
  
        return { ...state, movies };
      }
  
      case 'DELETE_MOVIE': {
        const movies = state.movies.filter((movie) => movie._id !== action.payload);
  
        return { ...state, movies };
      }
  
      default:
        return state;
    }
  };
  
  export default moviesReducer;