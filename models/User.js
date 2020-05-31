const mongoose = require('mongoose');

const UserSchemna = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    lastName: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    userEmail: {
        type: String,
        required: true,
        max: 255,
        min: 6
    },
    userPassword: {
        type: String,
        required: true,
        max: 1024,
        min: 8
    },
    userImg: {
        type: String,
        default: 'img.png'
    },
    userTitle: {
        type: String,
        required: false
    },
    followers: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
});

module.exports = mongoose.model('User', UserSchemna);