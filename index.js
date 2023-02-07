// This file is an Express Server //
const connectToMongo = require('./dataBase'); // -> it is a function
const express = require('express');
const path = require('path');
const app = express();
const port = 5000;
const cors = require('cors')

// if we want to use local API or call API from brwoser than this middalware is needed //
app.use(cors());

// request to connect with MongoDB //
connectToMongo();

// Middlware if we want to use "request body" //
app.use(express.json());

// index page for localhost:5000 //
app.get('/',(req,res)=>{
    res.send(`<h1>Backend Server for inotebook </h1>`)
})

// sending to routes (avialable routes) //
app.use('/api/auth',require(path.join(__dirname,"./routes/auth")));
app.use('/api/notes',require(path.join(__dirname,"./routes/notes")));

app.listen(port, () => {
  console.log(`iNoteBook Backend listening on port http://localhost:${port}`)
})