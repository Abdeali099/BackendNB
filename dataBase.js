// This file will connect with dataBase :- MongoDB //

const mongoose = require('mongoose');

const mongoURI = "mongodb://localhost:27017/InoteBook";

const connectToMongo = () => {

    mongoose.connect(mongoURI,()=>{
        console.log("Connected to Mongo Succefully");
    })
}

module.exports = connectToMongo; /* we use JS module instead of ES6 module  because it is NodeJs */