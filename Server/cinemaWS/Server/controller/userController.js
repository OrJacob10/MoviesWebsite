const express = require("express");
const usersService = require("../service/usersService");
const mongoose = require("mongoose");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const users = await usersService.getAllUsers();
    res.json(users);
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

    const user = await usersService.getUser(id);
    if (!user) {
      return next({ status: 404, message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const newUser = await usersService.addUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    if (error.message === "Username already exists") {
      return res.status(400).json({ message: error.message });
    }
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

    const updatedUser = await usersService.updateUser(id, updatedData);
    if (!updatedUser) {
      return next({ status: 404, message: "User not found" });
    }

    res.json(updatedUser);
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

    const deletedUser = await usersService.deleteUser(id);
    if (!deletedUser) {
      return next({ status: 404, message: "User not found" });
    }

    res.json(deletedUser);
  } catch (error) {
    next(error);
  }
});

router.put("/permissions/:id", async (req, res, next) => {
  try {
    const userId = req.params.id;
    const newPermissions = req.body.permissions;

    const setUserPermissions = await usersService.setUserPermissions(
      userId,
      newPermissions
    );
    res.json(setUserPermissions);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
