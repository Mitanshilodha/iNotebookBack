const mongoose = require('mongoose')

const mongoURI = "mongodb+srv://lodhamitanshi:ml09@cluster0.eqgxzwx.mongodb.net/test"



const connectToMongo=()=>{
    mongoose.connect(mongoURI, ()=>{
          console.log("Connected to mongo successfully");
    })
}

module.exports= connectToMongo;