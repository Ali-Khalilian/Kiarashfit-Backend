require("dotenv").config();
const express = require("express");
const fileUpload = require("express-fileupload");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const corsOptions = require("./config/corsOption");
const  credentials  = require("./middleware/credentioals");

require('dotenv').config();

// Database connection
connectDB();

const app = express();

app.use(credentials);

// CORS

app.use('*',cors(corsOptions));

//URL Encoded
app.use(express.urlencoded({ extended: false }));

//JSON Encoded
app.use(express.json());

// Cookie Parser
app.use(cookieParser());

//file uploader
app.use(fileUpload());


//static
app.use(express.static('public'));

//Routes
app.use("/register", require("./routes/register"));
app.use("/auth", require("./routes/auth"));
app.use("/refresh", require("./routes/refresh"));
app.use("/logout", require("./routes/logout"));
app.use("/articles", require("./routes/articleRoutes/article"));
app.use("/bodyChanges", require("./routes/bodyRoutes/body"));
app.use("/orders", require("./routes/orderRoutes/order"));
app.use("/users", require("./routes/userRoutes/user"));

const PORT = process.env.PORT || 3500;

mongoose.connection.once("open", () => {
  console.log("Connected to mongoDB");
  app.listen(PORT, () => {
    console.log(`running on port ${PORT}`);
  });
}); 