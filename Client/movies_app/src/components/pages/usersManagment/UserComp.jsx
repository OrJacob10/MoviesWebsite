import React from "react";
import { useNavigate } from "react-router-dom";
import { deleteUser as deleteUserService } from "../../../utils/usersService";
import { useDispatch } from "react-redux";
import "./UserComp.css";

function UserComp({ user }) {
  const USERS_URL = "http://localhost:8081/users";
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const handleDeleteUser = async () => {
    try {
      await deleteUserService(USERS_URL, user.id);
      console.log("User deleted:", user.id);
      dispatch({ type: "DELETE_USER", payload: user.id });
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div className="user-card">
      <div className="user-info">
        <b>Name: </b>
        {user.firstName} {user.lastName} <br />
        <b>UserName: </b>
        {user.username} <br />
        <b>Session Time Out (Minutes): </b>
        {user.sessionTimeOut} <br />
        <b>Created Date: </b>
        {user.createdDate} <br />
        <b>Permissions: </b>({user?.permissions?.join(", ")})
      </div>
      <div className="action-buttons-container">
        <button
          onClick={() => {
            console.log("the userId passed: " + user.id);
            navigate(`/main/users/editUser/${user.id}`);
          }}
        >
          Edit
        </button>
        <button onClick={handleDeleteUser}>Delete</button>
      </div>
    </div>
  );
}

export default React.memo(UserComp);
