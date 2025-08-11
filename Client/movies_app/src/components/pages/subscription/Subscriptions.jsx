import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllMembers } from "../../../utils/membersService";
import { getAllMovies } from "../../../utils/movieService";
import { PermissionGuard } from "../../PermissionGuard";
import SubscriptionComp from "./SubscriptionsComp";
import "./Subscriptions.css";

function Subscriptions() {
  const MEMBERS_URL = "http://localhost:8081/members";
  const MOVIES_URL = "http://localhost:8081/movies";

  const dispatch = useDispatch();
  const members = useSelector((state) => state.members.members);
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();

  const [error, setError] = useState(null);
  const [selectedButton, setSelectedButton] = useState("all"); // "All Subscriptions" button selected or not
  const [availableMovies, setAvailableMovies] = useState([]); // State to store all movies

  // Fetch members on initial load
  useEffect(() => {
    if (token) {
      if (members.length === 0) {
        const fetchMembers = async () => {
          try {
            setError(null);
            const membersData = await getAllMembers(MEMBERS_URL);
            dispatch({ type: "LOAD_MEMBERS", payload: membersData });
          } catch (error) {
            console.error("Error fetching subscriptions:", error);
            setError(
              error.response?.data?.message ||
                error.message ||
                "Failed to fetch members"
            );
          }
        };
        fetchMembers();
      }

      // Fetch movies if they are not already fetched
      if (availableMovies.length === 0) {
        const fetchMovies = async () => {
          try {
            const fetchedMovies = await getAllMovies(`${MOVIES_URL}/for-subscriptions`);
            setAvailableMovies(fetchedMovies);
            console.log("Fetched movies:", fetchedMovies);
          } catch (error) {
            console.error("Error fetching movies:", error);
          }
        };
        fetchMovies();
      }
    } else {
      dispatch({ type: "LOGOUT" });
    }
  }, [token, members, availableMovies.length, dispatch]); 

  const showAllMembers = () => {
    setSelectedButton("all");
  };

  return (
    <div className="subscriptions-container">
      <div className="subscriptions-title">Subscriptions</div>

      {!token ? (
        <p>You must be logged in to view subscriptions.</p>
      ) : (
        <>
          <div className="subscriptions-controls">
            <PermissionGuard requiredPermission="View Subscriptions">
              <button
                onClick={showAllMembers}
                style={{
                  backgroundColor: selectedButton === "all" ? "yellow" : "#f9f9f9",
                }}
              >
                All Members
              </button>
            </PermissionGuard>

            <PermissionGuard requiredPermission="Create Subscriptions">
              <button
                style={{
                  backgroundColor: selectedButton === "add" ? "yellow" : "#f9f9f9",
                }}
                onClick={() => {
                  setSelectedButton("add");
                  navigate("/main/subscriptions/addMember");
                }}
              >
                Add Member
              </button>
            </PermissionGuard>
          </div>

          {error ? (
            <p style={{ color: "red" }}>{error}</p>
          ) : members.length === 0 ? (
            <p>Loading...</p>
          ) : (
            members.map((member) => (
              <SubscriptionComp
                key={member._id}
                member={member}
                moviesSubscribed={member.moviesSubscribed || []}
                availableMovies={availableMovies} 
              />
            ))
          )}
        </>
      )}
    </div>
  );
}

export default Subscriptions;
