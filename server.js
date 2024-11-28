// server.js
const express = require("express");
const app = express();
const dotenv = require("dotenv");
const initConfig = require("./config/init");
const initDatabase = require("./database/init");
const path = require("path");
const initializeMiddleware = require("./middleware/init");
const appRoutes = require("./routes/App.routes");
const { initializeDirectories } = require("./helpers/Directory.helper");

dotenv.config();

// initConfig(app);
// initDatabase();
initializeDirectories();
initializeMiddleware(app);
app.use("/", express.static(path.join(__dirname, "/public")));
app.use(appRoutes);

// Root route
app.get("/", (req, res) => {
    res.send("Hello from DocGo");
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
