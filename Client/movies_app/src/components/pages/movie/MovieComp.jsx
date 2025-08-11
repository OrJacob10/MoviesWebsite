import React, { memo } from "react"; // Import memo from React
import { Link, useNavigate } from "react-router-dom";
import { deleteMovie } from "../../../utils/movieService";
import { useDispatch } from "react-redux";
import { PermissionGuard } from "../../PermissionGuard";
import "./MovieComp.css";

const MovieComp = ({ movie, members }) => {
  const MOVIE_URL = "http://localhost:8081/movies";
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Handle delete movie
  const handleDeleteMovie = async () => {
    console.log("movie deleted: " + movie);
    try {
      await deleteMovie(MOVIE_URL, movie._id);

      // dispatching to update movies and members state
      dispatch({ type: "DELETE_MOVIE", payload: movie._id });

      // remove the movie from subscriptions
      dispatch({
        type: "UPDATE_SUBSCRIPTIONS_AFTER_MOVIE_DELETE",
        payload: movie._id,
      });
    } catch (error) {
      console.error("Error deleting movie:", error);
    }
  };

  return (
    <div className="movie-card">
      <div className="movie-title">
        {movie.name}, {movie?.premiered?.split("-")[0]}{" "}
      </div>
      <b>Genres: </b>
      {movie?.genres?.join(", ")} <br />
      <br />
      <div className="middle-comp">
        <div>
          {movie.image && (
            <img src={movie.image} alt={movie.name} className="movie-image" />
          )}
        </div>
        <div className="movie-subscriptions">
          <p>Subscriptions watched:</p>
          {members?.length > 0 ? (
            <ul>
              {members.map((member, index) => (
                <li key={member._id || index}>
                  <Link to={`/main/subscriptions`}>{member.name}</Link>,&nbsp;
                  {member.dateWatched
                    ? new Date(member.dateWatched).toLocaleDateString()
                    : "Unknown Date"}
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <b>There are no members subscribed</b>
            </p>
          )}
        </div>
      </div>
      <PermissionGuard requiredPermission="Update Movies">
        <button onClick={() => navigate(`/main/movies/editMovie/${movie._id}`)}>
          Edit
        </button>{" "}
      </PermissionGuard>
      <PermissionGuard requiredPermission="Delete Movies">
        <button onClick={handleDeleteMovie}>Delete</button>
      </PermissionGuard>
    </div>
  );
};

export default React.memo(MovieComp);
