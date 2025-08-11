import { useEffect, useState } from "react";
import { addUser } from "../../../utils/usersService";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getUser, updateUser } from "../../../utils/usersService";
import "./users.css";

function EditUser() {
  const  userId  = useParams().userId;
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

  const [username, setUsername] = useState("");
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
// Fetches the user data when the component mounts and sets the state
  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUser(USERS_URL, userId);
      if(user ) {
        setUserData(user);
        setUsername(user.username);
      }
    };
    fetchUser();
  }, [userId]); // to not render everytime if the userId does not change

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };


const handleCheckboxChange = (permission) => {
    setUserData((prev) => {
      // update permissions according to the user checked boxes
      const updatedPermissions = prev.permissions.includes(permission)
        ? prev.permissions.filter((perm) => perm !== permission) // Remove if already selected
        : [...prev.permissions, permission]; // Add if not selected

      // Function that add "View" permission if all other permissions are selected
      const autoAddView = (actions, viewPermission) => 
        // actions.every returns true if permissionsList includes all permissions except the view,then if true => check the View checkbox
        actions.some((perm) => updatedPermissions.includes(perm)) && 
        !updatedPermissions.includes(viewPermission) &&
        updatedPermissions.push(viewPermission);

      autoAddView(
        ["Create Subscriptions", "Delete Subscriptions", "Update Subscriptions"],
        "View Subscriptions"
      );

      autoAddView(
        ["Create Movies", "Delete Movies", "Update Movies"],
        "View Movies"
      );

      // Return the updated state object to setUserData
      return { ...prev, permissions: updatedPermissions };
    });
};


  const validateForm = () => {
    const newErrors = {};
    // trim - remove whitespaces
    if (!userData.firstName.trim()) newErrors.firstName = "Required";
    if (!userData.lastName.trim()) newErrors.lastName = "Required";
    if (!userData.username.trim()) newErrors.username = "Required";
    if (userData.username.toLowerCase() === "admin" && username.toLowerCase() !== "admin")
      newErrors.username = "Can't be 'admin'";
    if (!userData.sessionTimeOut) newErrors.sessionTimeOut = "Required";
    if (userData.permissions.length === 0)
      newErrors.permissions = "Select at least one";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; "Returns true if there are no errors (form is valid), otherwise returns false."
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return; // means that we have an error 

    try {
      console.log("Submitting user data:", userData);
      const response = await updateUser(USERS_URL, userId, userData); // adding the user in the database/json files
      console.log("Server response:", response);

      if (response) {
        const updatedUser = {
          ...userData,
        };

        console.log("Dispatching to Redux:", updatedUser);
        dispatch({ type: "UPDATE_USER", payload: updatedUser }); // updating the user in our redux state

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
      console.error(
        "Error updated user:",
        error.response?.data || error.message
      );
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

export default EditUser;
