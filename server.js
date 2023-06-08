const express = require("express")
const connectDB = require("./db");
const app = express()
const PORT = 5000

//Connecting the Database
connectDB();

//grant access to user's data from body
app.use(express.json());
//import route.js
app.use("/api/auth", require("./Auth/route"));

const server = app.listen(PORT, () =>
  console.log(`Server Connected to port ${PORT}`)
);

// Handling Error
process.on("unhandledRejection", err => {
  console.log(`An error occurred: ${err.message}`);
  server.close(() => process.exit(1));
})