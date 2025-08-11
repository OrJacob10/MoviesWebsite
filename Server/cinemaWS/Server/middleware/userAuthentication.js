const jwt = require("jsonwebtoken");
const SECRET_KEY = "OrJacob2001";

const jFile = require("jsonfile");
const path = require("path");
const permissionsJsonFile = path.join(__dirname, "../data/permissions.json");

// mapping the kinds of requests to the permissions names (in order to check them later in authorization)
const permissionMapping = {
  "/movies": {
    GET: "View Movies",
    POST: "Create Movies",
    PUT: "Update Movies",
    DELETE: "Delete Movies",
  },
  "/subscriptions": {
    GET: "View Subscriptions",
  },
  "/members": {
    GET: "View Subscriptions",
    POST: "Create Subscriptions",
    DELETE: "Delete Subscriptions",
    PUT: "Update Subscriptions",
  },
};

// a middleware that authenticate every api call
const userAuthorization = async (req, res, next) => {
  try {
    const token = req.headers["token"];
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Token not provided" });
    }

    const decoded = jwt.verify(token, SECRET_KEY);

    // If user is admin, allow all actions
    if (decoded.isAdmin) {
      req.user = decoded;
      return next();
    }

    let route = req.originalUrl.split("?")[0]; // Remove query params

    // Special case: movies for subscriptions
    if (route === "/movies/for-subscriptions") {
      console.log("Route matches /movies/for-subscriptions");
      if (decoded.permissions.includes("View Subscriptions")) {
        req.user = decoded;
        return next();
      } else {
        return res.status(403).json({
          success: false,
          message:
            "Permission denied: You need 'View Subscriptions' to access this resource",
        });
      }
    }

    if (route.startsWith("/movies/")) route = "/movies";
    else if (route.startsWith("/subscriptions/")) route = "/subscriptions";
    else if (route.startsWith("/members/")) route = "/members";

    const method = req.method;
    const requiredPermission = permissionMapping[route]?.[method];

    // Special case: for subscribing to movies (not adding members)
    if (route === "/subscriptions" && method === "POST") {
      req.user = decoded;
      return next();
    }

    if (!requiredPermission) {
      return res.status(403).json({
        success: false,
        message: "No permission mapping for this route",
      });
    }

    // Check permissions directly from token
    if (!decoded.permissions.includes(requiredPermission)) {
      return res.status(403).json({
        success: false,
        message: `Permission denied: You need '${requiredPermission}' to access this resource`,
      });
    }

    req.user = decoded;
    next();
    
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired",
        expired: true,
      });
    }
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

module.exports = userAuthorization;
