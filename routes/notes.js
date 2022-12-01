const express = require('express');
const router = express.Router();
const Notes = require('../models/modNotes');
const fetchUser = require('../middleware/fetchUser');


/* ROUTER 1 : fetch all notes of logged in user using GET at "api/notes/fetchNotes"  */
router.get('/fetchNotes', fetchUser, async (req, res) => {

    try {
        const allNotes = await Notes.find({ id: req.userId })

        res.json(allNotes);

    } catch (error) {

        console.log(error.message);

        res.status.json({ error: "unkonwn error! Try again!!" })
    }

})

module.exports = router;