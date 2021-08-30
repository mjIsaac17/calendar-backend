const express = require("express");
require("dotenv").config();
const cors = require("cors");
const { dbConnection } = require("./db/config");

//Create express server
const app = express();

//Database
dbConnection();

// CORS
app.use(cors());

// Public directory
app.use(express.static("public"));

// Body parser
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth.route"));
app.use("/api/events", require("./routes/events.route"));

// TODO: CRUD

//Listen requests
app.listen(process.env.PORT, () => {
  console.log(`Server running in port ${process.env.PORT}`);
});
