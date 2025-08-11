const moviesService = require("../service/moviesService");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

router.get("/", async (req, res) => {
  try {
    const movies = await moviesService.getAllMovies();
    return res.json(movies);
  } catch (e) {
    return res.status({ error: e.message });
  }
});

router.get("/for-subscriptions", async (req, res) => {
  try {
    const movies = await moviesService.getAllMovies();
    const moviesForSubscriptions = movies.map(movie => ({
      _id: movie._id,
      name: movie.name
    }));
    return res.json(moviesForSubscriptions);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID input" });
    }

    const movie = await moviesService.getMovieById(id);
    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }
    return res.json(movie);
  } catch (e) {
    return res.status({ error: e.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const movie = req.body;
    const status = await moviesService.addMovie(movie);
    return res.json(status);
  } catch (e) {
    return res.status({ error: e.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID input" });
    }

    const movie = req.body;
    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }

    const status = await moviesService.updateMovie(id, movie);
    return res.json(status);
  } catch (e) {
    return res.status({ error: e.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID input" });
    }
    const status = await moviesService.deleteMovie(id);
    return res.json(status);
  } catch (e) {
    return res.status({ error: e.message });
  }
});

module.exports = router;
