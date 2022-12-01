const jwt = require('jsonwebtoken');

// <-- JWT secret --> //
const JWT_Secret = "Abdeali@786#123";

const fetchUser = (req, res, next) => {

    /* get the userId by jwt token and put it to reqest body (object) */

    const token = req.header("auth-token");

    if (!token) {
        res.status(401).json({ error: "Unauthorized activity" });
    }

    try {

        const data = jwt.verify(token, JWT_Secret);

        // console.log("Data is  : ",data);

        req.userId = data.userId;

        // console.log("Id is : ",data.userId);

        next(); // -> it is a function it will call after the middleware completes its work.

    } catch (error) {

        res.status(400).json({error : "Unauthorized activity"})

    }

}

module.exports = fetchUser;