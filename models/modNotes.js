const mongoose = require('mongoose');

const notesSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },

    content: {
        type: String,
        required: true,
    },

    tag: {
        type: String,
        default: "General"
    },

    date: {
        type: Date,
        default: Date.now
    },

});

const Notes=  mongoose.model('notes', notesSchema);
module.exports = Notes;