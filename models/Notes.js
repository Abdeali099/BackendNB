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
        type: date,
        default: date.now
    },

});

module.exports = mongoose.model('notes', notesSchema);