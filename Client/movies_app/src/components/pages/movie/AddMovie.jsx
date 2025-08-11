import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./movies.css";
import { addMovie } from "../../../utils/movieService";

function AddMovie() {
  const MOVIE_URL = "http://localhost:8081/movies";
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [movieData, setMovieData] = useState({
    name: "",
    genres: "",
    image: "",
    premiered: "",
  });

  const [errors, setErrors] = useState({});

  // Predefined list of valid genres (all lowercase)
  const validGenres = ["drama", "action", "comedy", "horror", "science fiction", "romance", "thriller","adventure","musical","fantasy","mystery","cartoon"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMovieData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    let newErrors = {};

    if (!movieData.name.trim()) newErrors.name = "Name is required";
    
    // Validate genres to check it's not empty and split into an array
    if (!movieData.genres.trim()) {
      newErrors.genres = "Genre is required";
    } else {
      const genresArray = movieData.genres.split(",").map((genre) => genre.trim().toLowerCase()); // Convert to lowercase

      // Check if all entered genres are valid (case-insensitive)
      const invalidGenres = genresArray.filter((genre) => !validGenres.includes(genre));

      if (invalidGenres.length > 0) {
        newErrors.genres = `Invalid genres: ${invalidGenres.join(", ")}`;
      }
    }

    if (!movieData.image.trim()) newErrors.image = "Image url is required";
    
    // Validate premiered date using Date.parse() to check if it's a valid date
    if (!movieData.premiered.trim()) {
      newErrors.premiered = "Premiered date is required";
    } else {
      const parsedDate = Date.parse(movieData.premiered); // Parse the date entered
      if (isNaN(parsedDate)) {
        newErrors.premiered = "Invalid date format. Please use the date picker or enter a valid date (YYYY-MM-DD).";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      console.log("Submitting movie data:", movieData);

      // Convert genres to an array (case-insensitive)
      const genresArray = movieData.genres.split(",").map((genre) => genre.trim().toLowerCase());

      // Convert premiered to the full ISO format
      const premieredDate = new Date(movieData.premiered).toISOString(); // Convert to ISO format

      const response = await addMovie(MOVIE_URL, { ...movieData, genres: genresArray, premiered: premieredDate });
      console.log("Server response:", response);

      if (response) {
        const newMovie = {
          ...movieData,
          _id: response._id,
          genres: genresArray, // Ensure genres are in array format
          premiered: premieredDate, // Ensure premiered is in ISO format
        };

        console.log("Dispatching to Redux:", newMovie);
        dispatch({ type: "ADD_MOVIE", payload: newMovie });

        setMovieData({
          name: "",
          genres: "",
          image: "",
          premiered: "",
        });

        navigate("/main/movies");
      } else {
        console.error("No response received from server");
      }
    } catch (error) {
      console.error("Error adding movie:", error.response?.data || error.message);
    }
  };

  return (
    <div>
      <h2>Add New Movie</h2>
      <form onSubmit={handleSubmit}>
        <div className="movie-input-container" style={{maxWidth:"400px"}}>
          <label>Name: </label>
          <input type="text" name="name" value={movieData.name} onChange={handleChange} />
          {errors.name && <span className="error">{errors.name}</span>}
        </div>

        <div className="movie-input-container" style={{maxWidth:"400px"}}>
          <label>Genres: </label>
          <input type="text" name="genres" value={movieData.genres} onChange={handleChange} />
          {errors.genres && <span className="error">{errors.genres}</span>}
        </div>

        <div className="movie-input-container">
          <label>Image Url: </label>
          <input type="url" name="image" value={movieData.image} onChange={handleChange} />
          {errors.image && <span className="error">{errors.image}</span>}
        </div>

        <div className="movie-input-container">
          <label>Premiered: </label>
          <input
            type="date"
            name="premiered"
            value={movieData.premiered}
            onChange={handleChange}
          />
          {errors.premiered && <span className="error">{errors.premiered}</span>}
        </div>
        <br />
        <div className="button-container">
          <button type="submit">Save</button>
          <button type="button" onClick={() => navigate("/main/movies")}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddMovie;
