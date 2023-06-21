//Import User model
const { error } = require("console");
const User = require("../models/User");
const bcrypt = require("bcryptjs")
//Checking the crypto module
const crypto = require('crypto');
const algorithm = 'aes-256-cbc'; //Using AES encryption
//const key = "12345678123456781234567812345678"; //For loginEncryption and registerEncryption routes
const iv = crypto.randomBytes(16);
//Keys DB
const mongoose = require("mongoose");
const keyDbUrl = 'mongodb://127.0.0.1:27017/storingKeysDB';
const KeySchema = require("../models/Key");

//Create
exports.register = async (req, res, next) => {
  const { username, password } = req.body;
  if (password.length < 6) {
    return res.status(400).json({ message: "Password less than 6 characters" });
  }
  bcrypt.hash(password, 10).then(async (hash) => {
    await User.create({
      username: username,
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
};

//Encrypting text
function encrypt(text, key) {
  let localKey = Buffer.from(key);
  let cipher = crypto.createCipheriv(algorithm, localKey, iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
}

// Decrypting text
function decrypt(text, key) {
  let iv = Buffer.from(text.iv, 'hex');
  let encryptedText = Buffer.from(text.encryptedData, 'hex');
  let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key, 'hex'), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

//Create W/ encryption
exports.registerEncryption = async (req, res, next) => {
  const { username, password } = req.body;
  if (password.length < 6) {
    return res.status(400).json({ message: "Password less than 6 characters" });
  }
  var encryptedInfo = encrypt(password, key);
    await User.create({
      username: username,
      password: encryptedInfo,
    })
      .then((user) =>
        res.status(200).json({
          message: "User successfully created",
            user,
        })
      )
      .catch((error) =>
        res.status(400).json({
          message: "User not successful created",
          error: error.message,
        })
      );
};

//Read W/ encryption
exports.loginEncryption = async (req, res, next) => {
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
      // compare decrypted password to text password
      var decryptInfo = decrypt(user.password, new Buffer.from(key));
      password == decryptInfo ?
      res.status(200).json({
              message: "Login successful",
              user,
            })
          : res.status(400).json({ message: "Login not succesful" })
    }
  } catch (error) {
    res.status(400).json({
      message: "An error occurred",
      error: error.message,
    })
  }
};

//Create W/ encryption and Key DB
exports.registerEncryptionAndKey = async (req, res, next) => {
  const { username, password } = req.body;
  if (password.length < 6) {
    return res.status(400).json({ message: "Password less than 6 characters" });
  }
  try{
    const localKey = crypto.randomBytes(16).toString('hex');
    var encryptedInfo = encrypt(password, localKey);
    await User.create({
      username: username,
      password: encryptedInfo,
    })
    .then(async (user) => {
      keyDB = mongoose.createConnection(keyDbUrl,
        {
          useNewUrlParser: true,
          useUnifiedTopology: true
        });
        keyDB.on("error", console.error.bind(console, "connection error: "));
        keyDB.once("open", function () {
          console.log("MongoDB Connect to KeyDB is Open");
        });
          const keyModel = mongoose.model('keyModel', KeySchema);
          await keyModel.create({
            username: user.username,
            key: localKey,
          });
      //DEMO: For Demo ONLY
      console.log("REGISTER DEMO. User: ", username, " Key: ", localKey);
      //
      keyDB.close();
      keyDB.once("disconnected", function () {
        console.log("MongoDB Connect to KeyDB is Closed");
      });
      res.status(200).json({
        message: "User successfully created",
          user,
      })
    })
    .catch((error) =>
      res.status(400).json({
        message: "User not successful created",
        error: error.message,
      })
    );
  }catch (error) {
    res.status(400).json({
      message: "An error occurred",
      error: error.message,
    })
  }
};

//Read W/ encryption and Key db
exports.loginEncryptionAndKey = async (req, res, next) => {
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
      // get key from keyDB
      keyDB = mongoose.createConnection(keyDbUrl,
        {
          useNewUrlParser: true,
          useUnifiedTopology: true
        });
        keyDB.on("error", console.error.bind(console, "connection error: "));
        keyDB.once("open", function () {
          console.log("MongoDB Connect to KeyDB is Open");
        });
          const keyModel = mongoose.model('keyModel', KeySchema);
          const userKey = await keyModel.findOne({ username });
      keyDB.close();
      keyDB.once("disconnected", function () {
        console.log("MongoDB Connect to KeyDB is Closed");
      });
      //DEMO: For Demo ONLY
      console.log("LOGIN DEMO. User: ", username, " Key: ", userKey.key);
      // compare decrypted password to text password
      var decryptInfo = decrypt(user.password, new Buffer.from(userKey.key));
      password == decryptInfo ?
      res.status(200).json({
              message: "Login successful",
              user,
            })
          : res.status(400).json({ message: "Login not succesful" })
    }
  } catch (error) {
    res.status(400).json({
      message: "An error occurred",
      error: error.message,
    })
  }
};

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
};


//Delete all
exports.deleteAllUsers = async (req, res, next) => {
  await User.find({})
    .then(async (users) => {
      keyDB = mongoose.createConnection(keyDbUrl,
        {
          useNewUrlParser: true,
          useUnifiedTopology: true
        });
        keyDB.on("error", console.error.bind(console, "connection error: "));
        keyDB.once("open", function () {
          console.log("MongoDB Connect to KeyDB is Open");
        });
          const keyModel = mongoose.model('keyModel', KeySchema);
          await keyModel.deleteMany({})
          .then((keys) => {
            console.log("All deleted ", keys);
          })
          .catch((err) =>
            console.log("keyDB error: ", err)
          );
      keyDB.close();
      keyDB.once("disconnected", function () {
        console.log("MongoDB Connect to KeyDB is Closed");
      });
      const userFunction = users.map((user) => user.deleteOne());
      res.status(200).json({ user: userFunction });
    })
    .catch((err) =>
      res.status(401).json({ message: "Not successful", error: err.message })
    );
};

//Get All Users
exports.getUsers = async (req, res, next) => {
  await User.find({})
    .then((users) => {
      const userFunction = users.map((user) => {
        const container = {};
        container.username = user.username;
        return container;
      });
      res.status(200).json({ user: userFunction });
    })
    .catch((err) =>
      res.status(401).json({ message: "Not successful", error: err.message })
    );
};