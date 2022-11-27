// This file is Express Server //
const connectToMongo = require('./dataBase'); // -> it is a function
const express = require('express');
const app = express();
const port = 3000;

// request to connect with MongoDB //
connectToMongo();


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})