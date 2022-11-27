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
          type:date,
          default:date.now    
    },

});

module.exports = mongoose.model('user',userSchema);