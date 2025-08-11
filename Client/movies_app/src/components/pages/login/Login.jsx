import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../../../utils/authService";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./Login.css"; // Import the CSS file
import { startSessionMonitor } from "../../../utils/tokenExpiredHandler";

function Login() {
  const LOGIN_URL = "http://localhost:8081/auth/login";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!username.trim()) newErrors.username = "username is required";
    if (!password.trim()) newErrors.password = "password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoginError("");
    const userDetails = { username, password };

    try {
      const response = await login(LOGIN_URL, userDetails);

      if (response?.data?.token) {
        const token = response.data.token;

        localStorage.setItem("token", token);
        dispatch({ type: "LOGIN", payload: response.data });

        // Start monitoring the session after login
        startSessionMonitor(token, () => {
          alert("Session expired. Redirecting to login.");
          localStorage.removeItem("token");
          window.location.href = "/";
        });

        console.log("Token Stored:", localStorage.getItem("token"));
        setUsername("");
        setPassword("");
        navigate("/main");
      } else {
        setLoginError("Invalid username or password");
        console.log("No token received!");
      }
    } catch (error) {
      setLoginError("Invalid username or password");
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login Page</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-input-container">
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {errors.username && <span className="error">{errors.username}</span>}
        </div>
        <div className="form-input-container">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <span className="error">{errors.password}</span>}
        </div>
        <input type="submit" value="Login" className="submit-btn-login" /> <br />
        {loginError && <span className="error">{loginError}</span>}
      </form>
      <br />
      <div className="new-user-link">
        New User? <Link to="/createAccount">Create Account</Link>
      </div>
    </div>
  );
}

export default Login;
