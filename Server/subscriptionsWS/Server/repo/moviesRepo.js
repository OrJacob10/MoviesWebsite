const moviesModel = require('../model/moviesModel');

const getAllMovies = () => {
    return moviesModel.find({});
}

const getMovieById = (id) => {
    return moviesModel.findById(id);
}

const addMovie = (movie) => {
    return moviesModel.create(movie);
}

const updateMovie = (id, movie) => {
    return moviesModel.findByIdAndUpdate(id, movie);
}

const deleteMovie = (id) => {
    return moviesModel.findByIdAndDelete(id);
}



module.exports = {getAllMovies, getMovieById, addMovie, updateMovie, deleteMovie};