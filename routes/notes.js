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

/* ROUTER 3 : update existing notes of logged in user using put at "api/notes/updateNotes/noteId"  -> Login Require */
router.put('/updateNotes/:noteId', fetchUser, async (req, res) => {

    try {

        // retrive data from requst body //
        const { title, content, tag } = req.body;

        // creating a newNote object to upadate with it //
        const newUpdateNote = {};

        /* if below property changes add to in object */
        if (title) {
            newUpdateNote.title = title;
        }

        if (content) {
            newUpdateNote.content = content;
        }

        if (tag) {
            newUpdateNote.tag = tag;
        }

        /* find a note that have to be updated */
        const toBeUpdateNote = await Notes.findById(req.params.noteId);

        /* if note is not exist */
        if (!toBeUpdateNote) {
            return res.status(404).json({ error: "Note doesn't exist!" })
        }

        /* wheter user upadte his notes or not. */
        if (toBeUpdateNote.user.toString() != req.userId) {
            return res.status(401).json({ error: "This activity dont' allowed." })
        }

        /* everything is clear so now update */

        const updatedNote = await Notes.findByIdAndUpdate(req.params.noteId, { $set: newUpdateNote }, { new: true });

        res.json(updatedNote);


    } catch (error) {

        console.log(error.message);

        res.status(400).json({ error: "unkonwn error in Update! Try again!!" })
    }

})

module.exports = router; 