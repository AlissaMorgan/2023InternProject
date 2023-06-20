const express = require("express");
const router = express.Router();
const { register, login, registerEncryption, loginEncryption, registerEncryptionAndKey, loginEncryptionAndKey, deleteUser, deleteAllUsers, getUsers } = require("./Auth");

router.route("/register").post(register);
router.route("/login").post(login);
/* Encryption add on */
router.route("/registerEncryption").post(registerEncryption);
router.route("/loginEncryption").post(loginEncryption);
router.route("/registerEncryptionAndKey").post(registerEncryptionAndKey);
router.route("/loginEncryptionAndKey").post(loginEncryptionAndKey);
/* Regular routes */
router.route("/deleteUser").delete(deleteUser);
router.route("/deleteAllUsers").delete(deleteAllUsers);
router.route("/getUsers").get(getUsers);

module.exports = router;