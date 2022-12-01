const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Notes = require('../models/modNotes');
const fetchUser = require('../middleware/fetchUser');

// <-- validation array for creation --> //
const addNoteValidation = [
    body('title', 'Enter title  minmum length of 3 characters.').isLength({ min: 3 }),
    body('content', 'Enter content minimum length of 5 characters.').isLength({ min: 6 })
];

/* ROUTER 1 : fetch all notes of logged in user using GET at "api/notes/fetchNotes"  -> Login Require */
router.get('/fetchNotes', fetchUser, async (req, res) => {

    try {
        const allNotes = await Notes.find({ user: req.userId })

        res.json(allNotes);

    } catch (error) {

        console.log(error.message);

        res.status.json({ error: "unkonwn error! Try again!!" })
    }

})

/* ROUTER 2 : add notes of logged in user using POST at "api/notes/addNotes"  -> Login Require */
router.post('/addNotes', fetchUser, addNoteValidation, async (req, res) => {

    try {

        // Finds the validation errors in this request and wraps them in an object with handy functions. //
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // retrive data from requst body //

        const tempNotesOBJ = {

            user: req.userId,
            title: req.body.title,
            content: req.body.content,
            tag: req.body.tag

        }

        const notes = new Notes(tempNotesOBJ);

        const savedNotes = await notes.save();

        res.json(savedNotes)

    } catch (error) {

        console.log(error.message);

        res.status.json({ error: "unkonwn error! Try again!!" })
    }

})

module.exports = router; 