const { text } = require("express");
const Mongoose = require("mongoose");

const KeySchema = new Mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  key: {
    type: Object,
    required: true,
  },
});

module.exports = KeySchema;