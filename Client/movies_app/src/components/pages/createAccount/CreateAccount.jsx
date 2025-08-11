import { useNavigate } from "react-router-dom";
import "./CreateAccount.css";
import { createAccount } from "../../../utils/authService";
import { useState } from "react";

function CreateAccount() {
  const AUTH_URL = "http://localhost:8081/auth/createAccount";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userDetails = { username, password };

    try {
      const response = await createAccount(AUTH_URL, userDetails);

      console.log("User Created:");
      navigate("/");
    } catch (error) {
      console.error("Failed to create user:", error);
    }
  };

  return (
    <div className="create-account-container">
      <h2 className="create-account-title">Create Account Page</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-input-container">
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="form-input-container">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <input type="submit" value="Create" className="submit-btn" />
      </form>
    </div>
  );
}

export default CreateAccount;
