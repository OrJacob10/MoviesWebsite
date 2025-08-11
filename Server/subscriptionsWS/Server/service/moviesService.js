const moviesRepo = require('../repo/moviesRepo');
const moviesModel = require("../model/moviesModel");
const subscriptionsModel = require("../model/subscriptionsModel");

const getAllMovies = async () => {
    return moviesRepo.getAllMovies();
}

const getMovieById = async (id) => {
    return moviesRepo.getMovieById(id);
}

const addMovie = async (movie) => {
    const response = await moviesRepo.addMovie(movie);
    return response;
}

const updateMovie = async (id, movie) => {
    await moviesRepo.updateMovie(id, movie);
    return 'Updated';
}

const deleteMovie = async (id) => {
    try {
        // Delete the movie
        const deletedMovie = await moviesModel.findByIdAndDelete(id);
        
        if (!deletedMovie) {
            throw new Error("Movie not found");
        }

        // Delete all subscriptions related to this movie
        await subscriptionsModel.deleteMany({ movieId: id });
        
        return { message: "Movie and related subscriptions deleted successfully" };
    } catch (error) {
        console.error("Error in deleteMovie service:", error);
        throw error;
    }
}

module.exports = {getAllMovies, getMovieById, addMovie, updateMovie, deleteMovie};