const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");
const itemRoutes = require("./routes/itemRoutes");
const matchRoutes = require("./routes/matchRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const chatRoutes = require("./routes/chatRoutes");

const app = express();

connectDB();

const corsOptions = {
  origin: "*", // More permissive for production
};
app.use(cors(corsOptions));
app.use(express.json());

app.use("/api", itemRoutes);
app.use("/api", matchRoutes);
app.use("/api", notificationRoutes);
app.use("/api", chatRoutes);

app.get("/api/health", (req, res) => {
  res.json({ message: "Lost And Found Backend Working!" });
});

// Serve static files from the frontend/dist folder
const frontendPath = path.join(__dirname, "../../frontend/dist");
app.use(express.static(frontendPath));

// Handle React routing, return all requests to React app
app.get("*", (req, res) => {
  // If it's an API route that doesn't exist, return 404
  if (req.path.startsWith("/api")) {
    return res.status(404).json({ message: "API endpoint not found" });
  }
  // Otherwise serve the React app
  res.sendFile(path.join(frontendPath, "index.html"));
});

module.exports = app;
