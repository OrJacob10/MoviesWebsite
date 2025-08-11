const membersURL = "https://jsonplaceholder.typicode.com/users";
const moviesURL = "https://api.tvmaze.com/shows";

const membersModel = require("../model/membersModel");
const moviesModel = require("../model/moviesModel");
const axios = require("axios");

// fetching starting data (movies, members)
const fetchData = async () => {
  try {
    // Check if data already exists in the database
    const membersCount = await membersModel.countDocuments();
    const moviesCount = await moviesModel.countDocuments();

    if (membersCount === 0) {
      const members = await axios.get(membersURL);
      const membersFromWs = members.data.map((member) => ({
        name: member.name,
        email: member.email,
        city: member.address.city
      }));

      await membersModel.insertMany(membersFromWs);
      console.log("Members data inserted.");
    } else {
      console.log("Members data already exists in the database.");
    }

    if (moviesCount === 0) {
      const movies = await axios.get(moviesURL);
      const moviesFromWs = movies.data.map((movie) => ({
        name: movie.name,
        genres: movie.genres,
        image: movie.image.medium,
        premiered: new Date(movie.premiered)
      }));
      await moviesModel.insertMany(moviesFromWs);
      console.log("Movies data inserted.");
    } else {
      console.log("Movies data already exists in the database.");
    }
  } catch (err) {
    console.error('Error in fetchData:', err);
    throw err;
  }
};

module.exports = { fetchData };
