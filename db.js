// connect application to MongoDB
const Mongoose = require("mongoose")
// name of db is /internProj
const localDB = 'mongodb://127.0.0.1:27017/encrptDB';

const connectDB = async () => {
  try{
    await Mongoose.connect(localDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  console.log("MongoDB Connected")
  }catch(err){
    console.log(err);
  }
}

module.exports = connectDB