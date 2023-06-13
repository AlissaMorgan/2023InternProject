const express = require("express")
const connectDB = require("./db");
const app = express()
const PORT = 5000

app.set("view engine", "ejs");

//Connecting the Database
connectDB();

//grant access to user's data from body
app.use(express.json());
//import route.js
app.use("/api/auth", require("./Auth/route"));
//view routes
app.get("/", (req, res) => res.render("home"));
app.get("/register", (req, res) => res.render("register"));
app.get("/login", (req, res) => res.render("login"));
app.get("/admin", (req, res) => res.render("user"));

const server = app.listen(PORT, () =>
  console.log(`Server Connected to port ${PORT}`)
);

// Handling Error
process.on("unhandledRejection", err => {
  console.log(`An error occurred: ${err.message}`);
  server.close(() => process.exit(1));
})