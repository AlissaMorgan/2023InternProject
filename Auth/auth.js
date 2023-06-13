//Import User model
const { error } = require("console");
const User = require("../models/User");
const bcrypt = require("bcryptjs")
//Create
exports.register = async (req, res, next) => {
    const {username, password} = req.body;
    if (password.length < 6) {
      return res.status(400).json({ message: "Password less than 6 characters" })
    }
    bcrypt.hash(password, 10).then(async (hash) => {
      await User.create({
        username,
        password: hash,
      })
        .then((user) =>
          res.status(200).json({
            message: "User successfully created",
             user: username,
          })
        )
        .catch((error) =>
          res.status(400).json({
            message: "User not successful created",
            error: error.message,
          })
        );
    });
  };

//Read
exports.login = async (req, res, next) => {
  const { username, password } = req.body
  // Check if username and password is provided
  if (!username || !password) {
    return res.status(400).json({
      message: "Username or Password not present",
    })
  }
  try {
    const user = await User.findOne({ username });
    if (!user) {
      res.status(400).json({
        message: "Login not successful",
        error: "User not found",
      })
    } else {
      // comparing given password with hashed password
      bcrypt.compare(password, user.password).then(function (result) {
        result
          ? res.status(200).json({
              message: "Login successful",
              user,
            })
          : res.status(400).json({ message: "Login not succesful" })
      })
    }
  } catch (error) {
    res.status(400).json({
      message: "An error occurred",
      error: error.message,
    })
  }
}

//Delete
exports.deleteUser = async (req, res, next) => {
  const { id } = req.body
  await User.findById(id)
    .then(user => user.deleteOne())
    .then(user =>
      res.status(201).json({ message: "User successfully deleted", user })
    )
    .catch(error =>
      res
        .status(400)
        .json({ message: "An error occurred", error: error.message })
    )
}