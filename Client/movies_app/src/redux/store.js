import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./reducers/usersReducer";
import moviesReducer from "./reducers/moviesReducer";
import subscriptionsReducer from "./reducers/subscriptionsReducer";
import membersReducer from "./reducers/membersReducer";
import authReducer from "./reducers/authReducer";

export const store = configureStore({
  reducer: {
    users: usersReducer,
    movies: moviesReducer,
    subscriptions: subscriptionsReducer,
    members: membersReducer,
    auth: authReducer
  },
});

export default store;
