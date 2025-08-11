import axios from "axios";

const getToken = () => localStorage.getItem("token"); 

const getAllMovies = async (url) => {
  const response = await axios.get(url, {
    headers: { token: getToken() },
  });

  return response.data;
};

const getMovie = async (url, id) =>{
  const response = await axios.get(`${url}/${id}`, {
    headers: { token: getToken() },
  });
  return response.data;
}


const addMovie = async (url, movie) => {
  const response = await axios.post(url, movie, {
    headers: { token: getToken() },
  });

  return response.data;
};

const updateMovie = async (url, id, movie) => {
  const response = await axios.put(`${url}/${id}`, movie, {
    headers: { token: getToken() },
  });
  return response.data;
};

const deleteMovie = async (url, id) => {
  const response = await axios.delete(`${url}/${id}`, {
    headers: { token: getToken() },
  });
  return response.data;
};

export { getAllMovies, getMovie, addMovie, updateMovie, deleteMovie };
