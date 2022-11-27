const express = require('express');
const router = express.Router();

router.get('/',(req,res)=>{

    let temp={
        name : "abdeali",
        age : 15
    }

    res.json(temp);
})

module.exports= router;