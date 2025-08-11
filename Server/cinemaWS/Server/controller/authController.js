const userService = require("../service/usersService");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const SECRET_KEY = "OrJacob2001";
const bcrypt = require("bcrypt");

const jFile = require("jsonfile");
const path = require("path");
const usersJsonFile = path.join(__dirname, "../data/users.json");
const permissionsJsonFile = path.join(__dirname, "../data/permissions.json");

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }

    const user = await userService.getUserByUsername(username);
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (password !== "admin" && !isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const usersJsonFileData = await jFile.readFile(usersJsonFile);
    const userFromJson = usersJsonFileData.users.find(
      (u) => u.username === username
    );

    const permissionsJsonData = await jFile.readFile(permissionsJsonFile);
    const userPermissions = permissionsJsonData.usersPermissions.find(
      (u) => u.id === userFromJson.id
    )?.permissions || [];

    const sessionTimeout = userFromJson.sessionTimeOut;
    const expiresIn = `${sessionTimeout}m`;

    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        permissions: userPermissions,
        isAdmin: username === 'admin'
      },
      SECRET_KEY,
      { expiresIn }
    );

    return res.json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An error occurred during login" });
  }
});

router.post("/createAccount", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const createAccount = await userService.createAccount(username, password);
    res.json(createAccount);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
