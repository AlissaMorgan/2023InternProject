// connect application to MongoDB
const Mongoose = require("mongoose")
// name of db is /internProj
const localDB = 'mongodb://127.0.0.1:27017/encrptDB';

const connectDBEncrypt = async () => {
  try{
    await Mongoose.connect(localDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  console.log("MongoDB Connected: Encrypted")
  }catch(err){
    console.log(err);
  }
}

module.exports = connectDBEncrypt