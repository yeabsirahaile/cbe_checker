const express = require("express");
const cors = require("cors"); // Add this line
const apiRoutes = require("./routes/apiRoutes");
const adminRoutes = require("./routes/adminRoutes");
require("dotenv").config();

const app = express();

// Enable CORS for all routes
app.use(cors()); // Allow all origins by default

// If you want to allow specific origins, you can configure CORS like this:
// app.use(cors({
//   origin: "https://your-frontend-domain.com" // Replace with your actual frontend URL
// }));

app.use(express.json());
app.use("/api", apiRoutes);
app.use("/api/admin", adminRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

module.exports = app;
