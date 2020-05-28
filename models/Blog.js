const mongoose = require('mongoose');

const BlogSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    blogTitle: {
        type: String,
        required: true
    },
    blogBody: {
        type: String,
        required: true
    },
    blogImg: {
        type: String,
        default: 'blog.jpg'
    },
    currentDate: {
        type: Date,
        default: Date.now
    }
});


module.exports = mongoose.model('Blog', BlogSchema);