const mongoose=require('mongoose');

const userSchema = new mongoose.Schema({

    name:{
          type:String,
          required:true    
    },

    email:{
          type:String,
          required:true,  
          unique:true 
    },

    password:{
          type:String,
          required:true    
    },

    date:{
          type:Date,
          default:Date.now    
    },

});

const User= mongoose.model('user',userSchema);
User.createIndexes(); // -> to maintain uniqueness in collection's document.
module.exports = User;