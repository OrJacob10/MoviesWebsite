const express = require("express");
const app = express();
const PORT = 8081;
const cors = require("cors");

app.use(express.json());
app.use(cors());

// database connection
require("./Server/config/database");

const userAutentication = require("./Server/middleware/userAuthentication");

const authController = require("./Server/controller/authController");
app.use("/auth", authController);

const membersController = require("./Server/controller/membersController");
app.use("/members", userAutentication, membersController);

const moviesController = require("./Server/controller/moviesController");
app.use("/movies", userAutentication, moviesController);

const subscriptionsController = require("./Server/controller/subscriptionsController");
app.use("/subscriptions", userAutentication, subscriptionsController);

const userController = require("./Server/controller/userController");
app.use("/users",userAutentication, userController);

const errorHandler = require("./Server/middleware/errorHandler");
app.use(errorHandler);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
