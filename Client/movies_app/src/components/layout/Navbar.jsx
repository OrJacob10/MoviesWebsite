import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../utils/authService";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const username = useSelector((state) => state.auth.username);

  const handleClick = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    dispatch({ type: "LOGOUT" });
    navigate("/");
  };

  const isActive = (path) => {
    // Check if the current path starts with the given path
    return location.pathname.startsWith(path);
  };

  return (
    <div className="navbar-container">
      <button
        className={`navbar-button ${isActive("/main/movies") ? "active" : ""}`}
        onClick={() => handleClick("/main/movies")}
      >
        Movies
      </button>

      <button
        className={`navbar-button ${isActive("/main/subscriptions") ? "active" : ""}`}
        onClick={() => handleClick("/main/subscriptions")}
      >
        Subscriptions
      </button>

      {username === "admin" && (
        <button
          className={`navbar-button ${isActive("/main/users") ? "active" : ""}`}
          onClick={() => handleClick("/main/users")}
        >
          Users Management
        </button>
      )}

      <button className="logout-button" onClick={handleLogout}>
        Log Out
      </button>
    </div>
  );
}

export default Navbar;
