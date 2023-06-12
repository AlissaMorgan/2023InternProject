const express = require("express");
const router = express.Router();
const { register, login, deleteUser, deleteAllUsers, getUsers } = require("./Auth");

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/deleteUser").delete(deleteUser);
router.route("/deleteAllUsers").delete(deleteAllUsers);
router.route("/getUsers").get(getUsers);

module.exports = router;