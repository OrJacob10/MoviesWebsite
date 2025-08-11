import { useState } from "react";
import { addMember } from "../../../utils/membersService";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./Subscriptions.css";

function AddMember() {
  const MEMBERS_URL = "http://localhost:8081/members";
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [memberData, setMemberData] = useState({
    name: "",
    email: "",
    city: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMemberData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    let newErrors = {};

    if (!memberData.name.trim()) newErrors.name = "Name is required";
    if (!memberData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(memberData.email.trim())) {
      newErrors.email = "Invalid email format";
    }

    if (!memberData.city.trim()) newErrors.city = "City is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      console.log("Submitting member data:", memberData);
      const response = await addMember(MEMBERS_URL, memberData);
      console.log("Server response:", response);

      if (response) {
        const newMember = {
          ...memberData,
          _id: response._id,
        };

        console.log("Dispatching to Redux:", newMember);
        dispatch({ type: "ADD_MEMBER", payload: newMember });

        setMemberData({
          name: "",
          email: "",
          city: "",
        });

        navigate("/main/subscriptions");
      } else {
        console.error("No response received from server");
      }
    } catch (error) {
      console.log("Caught error:", error);
      console.log("Message:", error.message);
      console.log("Type of message:", typeof error.message);

      if (error.message === "Email already exists") {
        setErrors((prevErrors) => ({ ...prevErrors, email: error.message }));
      } else {
        console.error("Error adding member:", error.message);
      }
    }
  };

  return (
    <div>
      <h2>Add New Member</h2>
      <form onSubmit={handleSubmit}>
        <div className="subscription-input-container">
          <label>Name: </label>
          <input
            type="text"
            name="name"
            value={memberData.name}
            onChange={handleChange}
          />
          {errors.name && <span className="error">{errors.name}</span>}
        </div>

        <div className="subscription-input-container">
          <label>Email: </label>
          <input
            type="text"
            name="email"
            value={memberData.email}
            onChange={handleChange}
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>

        <div className="subscription-input-container">
          <label>City: </label>
          <input
            type="text"
            name="city"
            value={memberData.city}
            onChange={handleChange}
          />
          {errors.city && <span className="error">{errors.city}</span>}
        </div>

        <br />
        <div className="button-container">
          <button type="submit">Save</button>
          <button type="button" onClick={() => navigate("/main/subscriptions")}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddMember;
