const express = require('express');
const router = express.Router();
const User = require('../models/User');

/* creating a user using : "POST" at "api/auth/" (don't require authorization) */

router.post('/', (req, res) => {

    console.log(req.body);

    const newUser=User(req.body);
    
    console.log(newUser);

    newUser.save();

    res.send("testing mode!")

})

module.exports = router;