const express = require("express");
const moviesService = require("../service/moviesService");
const mongoose = require("mongoose");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const movies = await moviesService.getMovies();
    res.json(movies);
  } catch (error) {
    next(error); 
  }
});

router.get("/for-subscriptions", async (req, res, next) => {
  try {
    const movies = await moviesService.getMoviesForSubscriptions();
    res.json(movies);
  } catch (error) {
    next(error); 
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next({ status: 400, message: "Invalid ID format" });
    }

    const movie = await moviesService.getMovieById(id);
    if (!movie) {
      return next({ status: 404, message: "Movie not found" });
    }

    res.json(movie);
  } catch (error) {
    next(error); 
  }
});

router.post("/", async (req, res, next) => {
  try {
    const movieData = req.body;

    if (!movieData.name || !movieData.genres || !movieData.image || !movieData.premiered) {
      return next({ status: 400, message: "All the fields are mandatory" });
    }

    const newMovie = await moviesService.addMovie(movieData);
    res.status(201).json(newMovie);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next({ status: 400, message: "Invalid ID format" });
    }

    const updatedData = req.body;

    const updatedMovie = await moviesService.updateMovie(id, updatedData);
    if (!updatedMovie) {
      return next({ status: 404, message: "Movie not found" });
    }

    res.json(updatedMovie);
  } catch (error) {
    next(error); 
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next({ status: 400, message: "Invalid ID format" });
    }

    const deletedMovie = await moviesService.deleteMovie(id);
    console.log(deletedMovie)
    if (!deletedMovie) {
      return next({ status: 404, message: "Movie not found" });
    }

    res.json({ message: "Movie deleted successfully" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
