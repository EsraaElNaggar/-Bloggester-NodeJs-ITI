const mongoose = require('mongoose');

const UserSchemna = mongoose.Schema({
    firstName: {
        type: String,
        require: true,
        min: 6,
        max: 255
    },
    lastName: {
        type: String,
        require: true,
        min: 6,
        max: 255
    },
    userEmail: {
        type: String,
        require: true,
        max: 255,
        min: 6
    },
    userPassword: {
        type: String,
        require: true,
        max: 1024,
        min: 8
    },
    userImg: {
        type: String,
        require: false,
        default: 'img.png'
    },
    userTitle: {
        type: String,
        require: false
    },
    followers: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
});

module.exports = mongoose.model('User', UserSchemna);