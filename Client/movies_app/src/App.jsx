import {BrowserRouter as Router,Routes,Route,Navigate} from "react-router-dom";
import ProtectedRoute from "./components/protectedRoute";
import MainLayout from "./components/layout/mainLayout";
import Movies from "./components/pages/movie/Movies";
import AddMovie from "./components/pages/movie/AddMovie";
import EditMovie from "./components/pages/movie/EditMovie";
import Users from "./components/pages/usersManagment/Users";
import AddUser from "./components/pages/usersManagment/AddUser";
import EditUser from "./components/pages/usersManagment/EditUser";
import Subscriptions from "./components/pages/subscription/Subscriptions";
import AddMember from "./components/pages/subscription/AddMember";
import EditMember from "./components/pages/subscription/EditMember";
import Login from "./components/pages/login/Login";
import CreateAccount from "./components/pages/createAccount/CreateAccount";
import { useEffect } from "react";
import {jwtDecode} from "jwt-decode";

function App() {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000); // in seconds
      const timeUntilExpiry = (decoded.exp - currentTime) * 1000; // in ms
      console.log(timeUntilExpiry)
      if (timeUntilExpiry <= 0) {
        // Already expired
        alert("Session expired. Redirecting to login.");
        localStorage.removeItem("token");
        window.location.href = "/";
      } else {
        // Set timeout to log out exactly when it expires
        const timeoutId = setTimeout(() => {
          alert("Session expired. Redirecting to login.");
          localStorage.removeItem("token");
          window.location.href = "/";
        }, timeUntilExpiry);

        return () => clearTimeout(timeoutId); // cleanup on unmount
      }
    } catch (err) {
      console.error("Error decoding token:", err);
      localStorage.removeItem("token");
      window.location.href = "/";
    }
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/createAccount" element={<CreateAccount />} />

        <Route path="/main" element={<MainLayout />}>
          {/* Movies */}
          <Route path="movies" element={<Movies />} />
          <Route
            path="movies/addMovie"
            element={
              <ProtectedRoute requiredPermission="Create Movies">
                <AddMovie />
              </ProtectedRoute>
            }
          />
          <Route
            path="movies/editMovie/:movieId"
            element={
              <ProtectedRoute requiredPermission="Update Movies">
                <EditMovie />
              </ProtectedRoute>
            }
          />

          {/* Subscriptions */}
          <Route path="subscriptions" element={<Subscriptions />} />
          <Route
            path="subscriptions/addMember"
            element={
              <ProtectedRoute requiredPermission="Create Subscriptions">
                <AddMember />
              </ProtectedRoute>
            }
          />
          <Route
            path="subscriptions/editMember/:memberId"
            element={
              <ProtectedRoute requiredPermission="Update Subscriptions">
                <EditMember />
              </ProtectedRoute>
            }
          />

          {/* Users */}
          <Route path="users" element={<Users />} />
          <Route path="users/addUser" element={<AddUser />} />
          <Route path="users/editUser/:userId" element={<EditUser />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
