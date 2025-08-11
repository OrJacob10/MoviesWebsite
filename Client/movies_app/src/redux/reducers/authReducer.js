import { decodeToken } from "../../utils/authService";

const token = localStorage.getItem("token");
const decoded = token ? decodeToken(token) : null;

const initialState = {
  token: token || null,
  username: decoded ? decoded.username : null,
  isAuthenticated: !!token,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN":
      const decodedData = decodeToken(action.payload.token);
      if (!decodedData) return state;

      localStorage.setItem("token", action.payload.token);

      return {
        ...state,
        token: action.payload.token,
        username: decodedData.username,
        isAuthenticated: true,
      };

    case "LOGOUT":
      localStorage.removeItem("token");
      return { token: null, username: null, isAuthenticated: false };

    default:
      return state;
  }
};

export default authReducer;
