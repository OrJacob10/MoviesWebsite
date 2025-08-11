const express = require("express");
const app = express();
const PORT = 8080;
const cors = require('cors');
app.use(express.json());

app.use(cors());

// database connection
require("./Server/config/database");

// data from the movies and members WS 
const getDataFromWS = require("./Server/data/getDataFromWS");
(async () => {
  try {
    console.log("Fetching data of members and movies from WS...");
    await getDataFromWS.fetchData();
    console.log("Data synced successfully!");
  } catch (error) {
    console.error("Error during data sync:", error.message);
  }
})();

const membersController = require("./Server/controller/membersController");
app.use("/members", membersController);

const moviesController = require("./Server/controller/moviesController");
app.use("/movies", moviesController);

const subscriptionsController = require("./Server/controller/subscriptionsController");
app.use("/subscriptions", subscriptionsController);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
