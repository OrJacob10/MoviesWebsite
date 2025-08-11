import axios from "axios";
import { store } from "../redux/store";

const login = async (url, userDetails) => {
  try {
    const response = await axios.post(url, userDetails);
    return response;
  } catch (error) {
    console.error("Login failed:", error.response?.data || error.message);
  }
};

const createAccount = async (url, userDetails) => {
  try {
    const response = await axios.post(url, userDetails);
    return response;
  } catch (error) {
    console.error(
      "Creating Account has failed:",
      error.response?.data || error.message
    );
  }
};

const logout = () => {
  store.dispatch({ type: "LOGOUT" });
  window.location.href = "/"; // Redirect to login page
};

// Decode token and check expiration
const decodeToken = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = JSON.parse(atob(base64));

    if (decoded.exp * 1000 < Date.now()) {
      console.warn("Token expired");
      store.dispatch({ type: "LOGOUT" });
      return null;
    }

    return decoded;
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};

export { login, createAccount, logout, decodeToken };
