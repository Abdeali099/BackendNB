// This file is Express Server //
const connectToMongo = require('./dataBase'); // -> it is a function
const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// request to connect with MongoDB //
connectToMongo();

app.get('/',(req,res)=>{
    res.send(`<h1>Hello My Name is Abdeali</h1>`)
})

// sending to routes (avialable routes) //
app.use('/api/auth',require(path.join(__dirname,"./routes/auth")));
app.use('/api/notes',require(path.join(__dirname,"./routes/notes")));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})