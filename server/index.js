const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session"); 
const MongoStore = require("connect-mongo"); 
const authRoutes = require("./routes/auth");
const friendsRoutes = require("./routes/friends");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:3000", 
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, 
  })
);

mongoose
  .connect("mongodb://127.0.0.1:27017/auth", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

app.use(bodyParser.json());

const authenticateToken = (req, res, next) => {
  // Extract token from Authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1]; // Extract the token from the "Bearer <token>" string

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user information to the request object
    req.user = { id: decoded.id };

    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    console.error("Invalid or expired token:", err);
    res.status(403).json({ message: "Invalid or expired token." });
  }
};

app.use("/", authRoutes); 

app.use("/friends", authenticateToken, friendsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
