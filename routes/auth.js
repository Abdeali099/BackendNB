const express = require('express');
const router = express.Router();

/* Validation for Request Header  */
const { body, validationResult } = require('express-validator');

/* User Modal  */
const User = require('../models/modUser');

/* For Authentication  */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/* whenever Login Require this middlware will be used */
const fetchUser = require('../middleware/fetchUser');


// <-- JWT secret --> //
const JWT_Secret = "Abdeali@786#123";

// <-- validation array for creation --> //
const createValidation = [
    body('name', 'Enter valid name it must be minmum length of 3.').isLength({ min: 3 }),
    body('email', 'Enter valid Email.').isEmail(),
    body('password', 'Enter strong password length must be minimum 6.').isLength({ min: 6 })
];

// <-- validation array for login --> //
const loginValidation = [
    body('email', 'Enter valid Email.').isEmail(),
    body('password', `Password can't be blank.`).exists().isLength({min:6})
];

// <--- Result of API call (by default is "False" ) --> //
let Success = false;

/* ROUTE 1 : creating a user using : "POST" at "api/auth/createUser" (don't require authorization) */
router.post('/createUser', createValidation, async (req, res) => {

    try {

        /* <-- Adding validaion --> */

        // Finds the validation errors in this request and wraps them in an object with handy functions. //

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({Success,errors: errors.array() });
        }

        // <-- check whether user already exist or not with same email -->

        let userExist = await User.findOne({ email: req.body.email });

        if (userExist) {
            return res.status(400).json({Success,Error: "User already exists." })
        }

        // <-- Securing Password --> //

        const salt = await bcrypt.genSalt(10); // -> generate salts. (10 represent)

        const securedPassword = await bcrypt.hash(req.body.password, salt);

        /* Creating user using mongoose model */
        let newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: securedPassword
        })

        /* <-- generating token --> */

        const dataToSend = {
            userId: newUser._id
        }

        /* I misatke here i give name as "newUserId" instead of userId */

        const authToken = jwt.sign(dataToSend, JWT_Secret); // -> return promise (sync function)

        // console.log(authToken);        

        res.status(200).json({Success:true, authToken });

    } catch (error) {

        console.error(error.message);

        res.status(500).json({Success,Error: error.message })

    }

    /*     Creating user using mongoose model ==> without async and await
   
       User.create({
           name: req.body.name,
           email: req.body.email,
           password: req.body.password,
       }).then(newUser => res.json(newUser))
           .catch(error => res.json({Success, msg: "User already exist.", "error": error })); */


    /* <--- without validation  --->
    
    console.log(req.body);

    const newUser=User(req.body);
    
    console.log(newUser);

    newUser.save();

    res.send("testing mode!")
    
    */

})


/* ROUTE 2 :  login a user using : "POST" at "api/auth/login" (don't require authorization) */
router.post('/login', loginValidation, async (req, res) => {

    try {

        /* check validation */
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({Success, errors: errors.array() });
        }

        /* destructuring to retrive email,password */
        const { email, password } = req.body;

        /* checking user exist or not by email */

        let userExist = await User.findOne({ email });

        if (!userExist) {

            return res.status(400).json({Success, Error: "Please login with proper credintial" })

        }

        /* if email exist compare password */

        let comparePassword = await bcrypt.compare(password, userExist.password);

        if (!comparePassword) { /* how? : !comparePassword => !true=false && !false=true */

            return res.status(400).json({Success, Error: "Please login with proper credintial" })

        }

        /* <-- generating token --> */

        const dataToSend = {
            userId: userExist._id
        }

        const authToken = jwt.sign(dataToSend, JWT_Secret); // -> return promise (sync function)


        res.json({Success:true, authToken });


    } catch (error) {

        console.log(error.message);

        res.status(500).json({Success, Error: error.message })

    }

})

/* ROUTE 3 : fetch data of logged in  user using : "POST" at "api/auth/user" (require authorization) */

router.post('/user', fetchUser, async (req, res) => {

    // -> whenever I required a login I have to use fetchUser middleware . //

    try {

        const userId = req.userId;

        // console.log(userId);

        const authorizedUser = await User.findById(userId).select("-password"); // -> it will select all data except password. //

        res.json({Success:true,authorizedUser});

    } catch (error) {

        console.log(error.message);

        res.status(500).json({Success, Error: error.message })
    }

})

module.exports = router;