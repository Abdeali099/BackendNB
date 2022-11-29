const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/modUser');

// <-- validation array --> //

const validationArray = [
    body('name', 'Enter valid name it must be minmum length of 3.').isLength({ min: 3 }),
    body('email', 'Enter valid Email.').isEmail(),
    body('password', 'Enter strong password length must be minimum 6.').isLength({ min: 6 }),
];

/* creating a user using : "POST" at "api/auth/createUser" (don't require authorization) */

router.post('/createUser', validationArray, async (req, res) => {

    /* <-- Adding validaion --> */

    // Finds the validation errors in this request and wraps them in an object with handy functions. //

    try {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // <-- check whether user already exist or not with same email -->

        let userExist = await User.findOne({ email: req.body.email });

        if (userExist) {
            return res.status(400).json({ error: "User already exists." })
        }

        /* Creating user using mongoose model */
        let newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
        })

        res.json(newUser);

    } catch (error) {

        console.error(error.message);

        res.status(500).json({ error: error.message })

    }

    /*     Creating user using mongoose model ==> without async and await
   
       User.create({
           name: req.body.name,
           email: req.body.email,
           password: req.body.password,
       }).then(newUser => res.json(newUser))
           .catch(error => res.json({ msg: "User already exist.", "error": error })); */


    /* <--- without validation  --->
    
    console.log(req.body);

    const newUser=User(req.body);
    
    console.log(newUser);

    newUser.save();

    res.send("testing mode!")
    
    */

})

module.exports = router;