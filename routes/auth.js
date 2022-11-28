const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/modUser');

/* creating a user using : "POST" at "api/auth/" (don't require authorization) */

router.post('/', [

    body('name', 'Enter valid name it must be minmum length of 3.').isLength({ min: 3 }),
    body('email', 'Enter valid Email.').isEmail(),
    body('password', 'Enter strong password length must be minimum 6.').isLength({ min: 6 }),

], (req, res) => {

    /* <-- Adding validaion --> */

    // Finds the validation errors in this request and wraps them in an object with handy functions.

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    }).then(newUser => res.json(newUser))
        .catch(error => res.json({ msg: "User already exist.", "error": error }));


    /* <--- without validation  --->
    
    console.log(req.body);

    const newUser=User(req.body);
    
    console.log(newUser);

    newUser.save();

    res.send("testing mode!")
    
    */

})

module.exports = router;