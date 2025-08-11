const axios = require('axios');
const URL = "http://localhost:8080/movies";

const getMovies = async () => {
  const {data: movies} = await axios.get(URL);
  return movies;
};

const getMoviesForSubscriptions = async () => {
  const {data: movies} = await axios.get(`${URL}/for-subscriptions`);
  return movies;
};

const getMovieById = async (id) => {
  const {data: movie} = await axios.get(`${URL}/${id}`);
  return movie;
};

const addMovie = async (data) => {
  const response = await axios.post(URL, data);
  console.log(response.data);
  return response.data;
};

const updateMovie = async (id, data) => {
  const respose = await axios.put(`${URL}/${id}`, data);
  return respose.data; 
};

const deleteMovie = async (id) => {
  const respose = await axios.delete(`${URL}/${id}`);
  return respose.data; 
};

module.exports = {
  getMovies,
  getMoviesForSubscriptions,
  getMovieById,
  addMovie,
  updateMovie,
  deleteMovie,
};
