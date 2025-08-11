import { useState, useEffect } from "react";
import { getMember, updateMember } from "../../../utils/membersService";
import { useDispatch } from "react-redux";
import { useNavigate, useParams} from "react-router-dom";
import "./Subscriptions.css"

function editMember() {
  const memberId = useParams().memberId;
  const MEMBERS_URL = "http://localhost:8081/members";
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [memberName, setMemberName] = useState(false);
  const [memberData, setMemberData] = useState({
    name: "",
    email: "",
    city: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchMember = async () => {
      const member = await getMember(MEMBERS_URL, memberId);
      if(member ) {
        setMemberData(member);
        setMemberName(member.name);
      }
    };
    fetchMember();
  }, [memberId]); // to not render everytime if the memberId does not change

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMemberData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    let newErrors = {};

    if (!memberData.name.trim()) newErrors.name = "Name is required";
    if (!memberData.email.trim()) newErrors.email = "Email is required";
    if (!memberData.city.trim()) newErrors.city = "City is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      console.log("updating member data:", memberData);
      const response = await updateMember(MEMBERS_URL,memberId, memberData);
      console.log("Server response:", response);

      if (response) {

        console.log("Dispatching to Redux:", memberData);
        dispatch({ type: "UPDATE_MEMBER", payload: memberData });

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
      console.error(
        "Error adding member:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div>
      <h2>Edit Member: {memberName}</h2>
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
          <button type="submit">Update</button>
          <button type="button" onClick={() => navigate("/main/subscriptions")}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default editMember;
