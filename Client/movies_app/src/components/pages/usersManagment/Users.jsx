import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getAllUsers } from "../../../utils/usersService";
import UserComp from "./UserComp";
import "./Users.css";

function Users() {
  const USERS_URL = "http://localhost:8081/users";
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.users);
  const token = useSelector((state) => state.auth.token);
  const username = useSelector((state) => state.auth.username);
  const navigate = useNavigate();

  const [selectedButton, setSelectedButton] = useState("all");

  useEffect(() => {
    if (users.length === 0 && token) {
      const fetchUsers = async () => {
        try {
          const usersData = await getAllUsers(USERS_URL);
          console.log("Fetched users data:", usersData);
          dispatch({ type: "LOAD_USERS", payload: usersData });
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      };
      console.log(users);
      fetchUsers();
    }
  }, [token, dispatch]);

  return (
    <div className="users-container">
      <div className="users-title">Users</div>

      {!token || username !== "admin" ? (
        <p className="not-authorized">Not Authorized to view users.</p>
      ) : (
        <>
          <div className="nav-buttons-container">
            <button
              className={`nav-button ${selectedButton === "all" ? "active" : ""}`}
              onClick={() => setSelectedButton("all")}
            >
              All Users
            </button>
            <button
              className={`nav-button ${selectedButton === "add" ? "active" : ""}`}
              onClick={() => {
                setSelectedButton("add");
                navigate("/main/users/addUser");
              }}
            >
              Add User
            </button>
          </div>

          {users.length === 0 ? (
            <p className="loading">Loading...</p>
          ) : (
            users.map((user) => <UserComp key={user.id} user={user} />)
          )}
        </>
      )}
    </div>
  );
}

export default Users;
