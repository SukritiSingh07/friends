const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const session = require("express-session");
const MongoStore = require("connect-mongo");
const User = require("../models/user");

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.cookie("token", token, { httpOnly: true, maxAge: 3600000 }); 
    res.status(201).json({
      message: "User registered successfully!",
      user: { id: newUser._id, username: newUser.username },
      success: true,
      token: token
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Error creating user", error });
  }
});

router.post("/signin", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.cookie("token", token, { httpOnly: true, maxAge: 3600000 }); 

    res.status(200).json({
      message: "Login successful!",
      user: { id: user._id, username: user.username },
      success: true,
      token: token
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Error logging in", error });
  }
});



module.exports = router;
