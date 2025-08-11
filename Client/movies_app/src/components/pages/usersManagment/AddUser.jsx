import { useState } from "react";
import { addUser } from "../../../utils/usersService";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./users.css";

function AddUser() {
  const USERS_URL = "http://localhost:8081/users";
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    sessionTimeOut: "",
    permissions: [],
  });

  const [errors, setErrors] = useState({});

  const permissionsList = [
    "View Subscriptions",
    "Create Subscriptions",
    "Delete Subscriptions",
    "Update Subscriptions",
    "View Movies",
    "Create Movies",
    "Delete Movies",
    "Update Movies",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (permission) => {
    setUserData((prev) => {
      let updatedPermissions = [...prev.permissions];

      const isSelected = updatedPermissions.includes(permission);

      if (isSelected) {
        updatedPermissions = updatedPermissions.filter(
          (perm) => perm !== permission
        );
      } else {
        updatedPermissions.push(permission);
      }

      const subsActions = [
        "Create Subscriptions",
        "Delete Subscriptions",
        "Update Subscriptions",
      ];
      const moviesActions = ["Create Movies", "Delete Movies", "Update Movies"];

      const allSubsSelected = subsActions.some((perm) =>
        updatedPermissions.includes(perm)
      );
      const allMoviesSelected = moviesActions.some((perm) =>
        updatedPermissions.includes(perm)
      );

      if (
        allSubsSelected &&
        !updatedPermissions.includes("View Subscriptions")
      ) {
        updatedPermissions.push("View Subscriptions");
      }

      if (allMoviesSelected && !updatedPermissions.includes("View Movies")) {
        updatedPermissions.push("View Movies");
      }

      return { ...prev, permissions: updatedPermissions };
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!userData.firstName.trim()) newErrors.firstName = "Required";
    if (!userData.lastName.trim()) newErrors.lastName = "Required";
    if (!userData.username.trim()) newErrors.username = "Required";
    if (userData.username.toLowerCase() === "admin")
      newErrors.username = "Can't be 'admin'";
    if (!userData.sessionTimeOut.trim()) newErrors.sessionTimeOut = "Required";
    if (userData.permissions.length === 0)
      newErrors.permissions = "Select at least one";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      console.log("Submitting user data:", userData);
      const response = await addUser(USERS_URL, userData);
      console.log("Server response:", response);

      if (response) {
        const newUser = {
          ...userData,
          id: response.id,
          createdDate: response.createdDate,
        };

        console.log("Dispatching to Redux:", newUser);
        dispatch({ type: "ADD_USER", payload: newUser });

        setUserData({
          firstName: "",
          lastName: "",
          username: "",
          sessionTimeOut: "",
          permissions: [],
        });

        navigate("/main/users");
      } else {
        console.error("No response received from server");
      }
    } catch (error) {
      if (error.message === "Username already exists") {
        setErrors((prevErrors) => ({ ...prevErrors, username: error.message }));
      } else {
        console.error("Error adding user:", error.message);
      }
    }
  };

  return (
    <div>
      <h2>Add New User</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <label>First Name: </label>
          <input
            type="text"
            name="firstName"
            value={userData.firstName}
            onChange={handleChange}
          />
          {errors.firstName && (
            <span className="error">{errors.firstName}</span>
          )}
        </div>

        <div className="input-container">
          <label>Last Name: </label>
          <input
            type="text"
            name="lastName"
            value={userData.lastName}
            onChange={handleChange}
          />
          {errors.lastName && <span className="error">{errors.lastName}</span>}
        </div>

        <div className="input-container">
          <label>Username: </label>
          <input
            type="text"
            name="username"
            value={userData.username}
            onChange={handleChange}
          />
          {errors.username && <span className="error">{errors.username}</span>}
        </div>

        <div className="input-container">
          <label>Session Timeout (Minutes): </label>
          <input
            type="number"
            name="sessionTimeOut"
            value={userData.sessionTimeOut}
            onChange={handleChange}
          />
          {errors.sessionTimeOut && (
            <span className="error">{errors.sessionTimeOut}</span>
          )}
        </div>

        <label>Permissions:</label>
        <div>
          {permissionsList.map((permission) => (
            <div key={permission}>
              <input
                type="checkbox"
                checked={userData.permissions.includes(permission)}
                onChange={() => handleCheckboxChange(permission)}
              />
              {permission}
            </div>
          ))}
        </div>
        {errors.permissions && <p className="error">{errors.permissions}</p>}
        <br />
        <div className="button-container">
          <button type="submit">Save</button>
          <button type="button" onClick={() => navigate("/main/users")}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddUser;
