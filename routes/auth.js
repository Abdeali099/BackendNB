const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/modUser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// <-- JWT secret --> //
const JWT_Secret = "Abdeali@786#123";

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

        // <-- Securing Password --> //

        const salt = await bcrypt.genSalt(10); // -> generate salts. (10 represent)

        // console.log("salt is  : ",salt);

        const securedPassword = await bcrypt.hash(req.body.password,salt);

        // console.log("password is  : ",securedPassword);

        /* Creating user using mongoose model */
        let newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: securedPassword
        })

        /* <-- generating token --> */

        const dataToSend={
            newUserId : newUser.id
        }

        const authToken = jwt.sign(dataToSend,JWT_Secret); // -> return promise (sync function)

        // console.log(authToken);        

        res.json({authToken});

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