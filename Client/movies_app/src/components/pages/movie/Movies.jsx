import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getAllMovies } from "../../../utils/movieService";
import { getAllMembers } from "../../../utils/membersService";
import MovieComp from "./MovieComp";
import { useLocation } from "react-router-dom";
import "./movies.css";
import { PermissionGuard } from "../../PermissionGuard";

function Movies() {
  const MOVIES_URL = "http://localhost:8081/movies";
  const MEMBERS_URL = "http://localhost:8081/members";

  const dispatch = useDispatch();
  const movies = useSelector((state) => state.movies.movies);
  const members = useSelector((state) => state.members.members);
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();

  const [filteredMovies, setFilteredMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedButton, setSelectedButton] = useState("all"); // all movies button is selected or not
  const [error, setError] = useState(null); // State to hold error messages

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchFromURL = searchParams.get("search") || ""; // get movie name from URL

  // Fetch Movies
  useEffect(() => {
    if (movies.length === 0 && token) {
      const fetchMovies = async () => {
        try {
          const moviesData = await getAllMovies(MOVIES_URL);
          dispatch({ type: "LOAD_MOVIES", payload: moviesData });
        } catch (error) {
          console.log(error.response.data.message);
          setError(error.response?.data?.message);
        }
      };
      fetchMovies();
    }
  }, [token, dispatch]);

  // Fetch Members
  useEffect(() => {
    if (members.length === 0) {
      const fetchMembers = async () => {
        try {
          const membersData = await getAllMembers(MEMBERS_URL);
          dispatch({ type: "LOAD_MEMBERS", payload: membersData });
        } catch (error) {
          console.log("failed to load members");
        }
      };
      fetchMembers();
    }
  }, [token, dispatch]);

  // Filter Movies based on search
  useEffect(() => {
    if (searchFromURL) {
      const filtered = movies.filter((movie) =>
        movie.name.toLowerCase().startsWith(searchFromURL.toLowerCase())
      );
      setFilteredMovies(filtered);
      setSearchQuery(searchFromURL);
      setSelectedButton(""); // Deselect "All Movies"
    } else {
      setFilteredMovies(movies);
      setSelectedButton("all"); // Default to all movies
    }
  }, [movies, location.search]);

  const handleSearch = () => {
    navigate(`/main/movies?search=${searchQuery}`); // Update URL
  };

  const showAllMovies = () => {
    setFilteredMovies(movies);
    setSearchQuery("");
    setSelectedButton("all");
  };

  return (
    <>
      <div className="movies-title">Movies</div>

      {!token ? (
        <p>Not Authorized, please login</p>
      ) : (
        <>
          {/* Display error message here */}
          <div className="movies-controls">
            <PermissionGuard requiredPermission="View Movies">
              <button
                className={`movies-button ${
                  selectedButton === "all" ? "active" : ""
                }`}
                onClick={showAllMovies}
              >
                All Movies
              </button>
            </PermissionGuard>

            <PermissionGuard requiredPermission="Create Movies">
              <button
                className={`movies-button ${
                  selectedButton === "add" ? "active" : ""
                }`}
                onClick={() => {
                  setSelectedButton("add");
                  navigate(`/main/movies/addMovie?search=${searchQuery}`);
                }}
              >
                Add Movie
              </button>
            </PermissionGuard>

            <PermissionGuard requiredPermission="View Movies">
              <span>Find Movie:</span>
              <input
                className="movies-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="movies-button" onClick={handleSearch}>
                Find
              </button>
            </PermissionGuard>
          </div>
          {error ? (
            <p style={{ color: "red" }}>{error}</p>
          ) : filteredMovies.length === 0 ? (
            <p>No matching movies.</p>
          ) : (
            filteredMovies.map((movie) => {
              const subscribedMembers = members
                .map((member) => {
                  // Find the movie this member watched
                  const subscription = member.moviesSubscribed?.find(
                    (sub) => sub._id === movie._id
                  );

                  return subscription
                    ? {
                        name: member.name,
                        dateWatched: subscription.dateWatched,
                      }
                    : null;
                })
                .filter(Boolean);

              return (
                <MovieComp
                  key={movie._id}
                  movie={movie}
                  members={subscribedMembers}
                />
              );
            })
          )}
        </>    
      )}
    </>
  );
}

export default Movies;