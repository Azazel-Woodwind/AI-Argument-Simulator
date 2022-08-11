const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

// @desc register new user
// @route POST /api/users
// @access PUBLIC
const registerUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400);
    throw new Error("Missing fields");
  }

  const userExists = await User.findOne({ username });

  if (userExists) {
    res.status(400);
    throw new Error("Username already in use");
  }

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    username,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      username,
    });
  } else {
    res.status(400);
    throw new Error("Invalid data");
  }
});

// @desc Authenticate a user
// @route POST /api/users/login
// @access PUBLIC
const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400);
    throw new Error("Please fill in all fields");
  }

  const user = await User.findOne({ username });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    res.status(400);
    throw new Error("Incorrect username or password");
  }

  console.log("logged in");
  res.status(200).json({
    _id: user.id,
    username: user.username,
    token: generateToken(user._id),
  });
});

// @desc Get user data
// @route GET /api/users/me
// @access PRIVATE
const getMe = asyncHandler(async (req, res) => {
  const { _id, username } = req.user;
  res.status(200).json({
    id: _id,
    username,
  });
});

// Generate JWT
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });

module.exports = {
  loginUser,
  registerUser,
  getMe,
};
