import { memo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { deleteMember } from "../../../utils/membersService";
import { addSubscription } from "../../../utils/subscriptionsService";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { PermissionGuard } from "../../PermissionGuard";
import "./SubscriptionComp.css";

function SubscriptionsComp({ member, moviesSubscribed, availableMovies }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [subscribeButtonSelected, setSubscribeButtonSelected] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState();
  const [watchedDate, setWatchedDate] = useState(
    new Date(Date.now()).toISOString().split("T")[0]
  );

  const handleDeleteMember = async () => {
    try {
      await deleteMember("http://localhost:8081/members", member._id);
      dispatch({ type: "DELETE_MEMBER", payload: member._id });
    } catch (error) {
      console.error("Error deleting member:", error);
    }
  };

  const handleSubscribe = () => {
    setSubscribeButtonSelected(!subscribeButtonSelected);
  };

  const handleMovieSubscription = () => {
    if (selectedMovie && watchedDate) {
      const newSubscription = {
        memberId: member._id,
        movieId: selectedMovie._id,
        dateWatched: watchedDate,
      };
      addSubscription("http://localhost:8081/subscriptions", newSubscription);
      dispatch({ type: "ADD_SUBSCRIPTION", payload: newSubscription });

      // Update the member's moviesSubscribed list
      const newMovieSubscribed = {
        _id: selectedMovie._id,
        name: selectedMovie.name,
        dateWatched: watchedDate,
      };

      dispatch({
        type: "UPDATE_MEMBER_MOVIES",
        payload: {
          memberId: member._id,
          newMovie: newMovieSubscribed,
        },
      });

      setSubscribeButtonSelected(false); // Close the movie selection after subscribing
    }
  };

  return (
    <div className="subscription-card">
      <h2 className="subscription-title">{member?.name}</h2>
      <b>Email: </b>
      {member?.email}
      <br />
      <b>City: </b>
      {member?.city}
      <br />
      <PermissionGuard requiredPermission="Update Subscriptions">
        <button
          onClick={() =>
            navigate(`/main/subscriptions/editMember/${member._id}`)
          }
        >
          Edit
        </button>
      </PermissionGuard>
      <PermissionGuard requiredPermission="Delete Subscriptions">
        <button onClick={handleDeleteMember}>Delete</button>
      </PermissionGuard>

      <div className="subscription-movies">
        <b>Movies Watched</b>
        <br />
        <button onClick={handleSubscribe}>Subscribe to new movie</button>
        {subscribeButtonSelected && (
          <div
            style={{
              border: "3px black solid",
              padding: "5px",
              marginTop: "1%",
              width: "87%",
            }}
          >
            <label>Add a new movie</label>
            <br />
            <div className="subscription-inputs-container">
              <select
                value={selectedMovie?._id || ""}
                onChange={(e) => {
                  const movieId = e.target.value;
                  const movie = availableMovies.find(
                    (movie) => movie._id === movieId
                  );
                  setSelectedMovie(movie);
                }}
              >
                <option value="">Select a movie</option>
                {availableMovies
                  .filter(
                    (movie) =>
                      !moviesSubscribed.some((m) => m._id === movie._id)
                  )
                  .map((movie) => (
                    <option key={movie._id} value={movie._id}>
                      {movie.name}
                    </option>
                  ))}
              </select>

              <input
                type="date"
                defaultValue={watchedDate}
                onChange={(e) => setWatchedDate(e.target.value)}
              />
            </div>
            <button onClick={handleMovieSubscription}>Subscribe</button>
          </div>
        )}

        {moviesSubscribed.length > 0 ? (
          <ul>
            {moviesSubscribed.map((movie) => (
              <li key={`${member._id}-${movie._id}`}>
                <Link
                  to={`/main/movies?search=${encodeURIComponent(movie.name)}`}
                >
                  {movie.name}
                </Link>
                , &nbsp;
                {movie.dateWatched
                  ? new Date(movie.dateWatched).toLocaleDateString()
                  : ""}
              </li>
            ))}
          </ul>
        ) : (
          <p>No movies watched yet.</p>
        )}
      </div>
    </div>
  );
}

export default memo(SubscriptionsComp);
