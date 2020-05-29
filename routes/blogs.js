const router = require('express').Router();
const verify = require('./verifyToken');

const { upload } = require('../middlewares/Blog')
const Blog = require('../models/Blog');
const { cloudinary } = require('../middlewares/Blog');


// Get All blogs
router.get('/', async (req, res) => {
    try {
        const blogs = await Blog.find();
        res.json(blogs);
    } catch (err) {
        res.json({ message: err });
    }
});

// get blog by userid 
router.get('/user/:userId', async (req, res) => {
    console.log(req.params.userId);
    try {
        const blog = await Blog.find({ userId: req.params.userId });
        res.json(blog);
    } catch (err) {
        res.json({ message: err });
    }
});

// get blog by id 
router.get('/:blogId', async (req, res) => {
    // console.log(req.params.blogId);
    try {
        const blog = await Blog.findById(req.params.blogId);
        res.json(blog);
    } catch (err) {
        res.json({ message: err });
    }
});

// Add new blog
router.post('/', verify, upload, async (req, res) => {
    let tags = [];
    if (req.body.tags) {
        tags = req.body.tags.split(",");
    }

    if (req.file) {
        const photo = await cloudinary.v2.uploader.upload(req.file.path);
        req.body.photo = photo.url;
    }

    const blog = new Blog({
        userId: req.body.userId,
        blogTitle: req.body.blogTitle,
        blogBody: req.body.blogBody,
        tags: tags,
        blogImg: req.file ? req.body.photo : 'https://res.cloudinary.com/db1ckwlpt/image/upload/v1590793718/blog.jpg.jpg'
    });
    // console.log(req.body.tags);

    try {
        const savedBlog = await blog.save();
        res.json(savedBlog);
    } catch (err) {
        res.json({ message: err });
    }
});

// Delete a specific blog
router.delete('/:blogId', verify, async (req, res) => {
    try {
        const removedBlog = await Blog.deleteOne({ _id: req.params.blogId });
        res.json(removedBlog);
    } catch (err) {
        res.json({ message: err });
    }
});

// Update a specific blog

router.put('/:blogId', verify, upload, async (req, res) => {

    let tags = [];
    if (req.body.tags) {
        tags = req.body.tags.split(",");
    }

    if (req.file) {
        const photo = await cloudinary.v2.uploader.upload(req.file.path);
        req.body.photo = photo.url;
    }

    const blog = new Blog({
        _id: req.params.blogId,
        userId: req.body.userId,
        blogImg: req.file ? req.body.photo : 'https://res.cloudinary.com/db1ckwlpt/image/upload/v1590793718/blog.jpg.jpg',
        blogTitle: req.body.blogTitle,
        blogBody: req.body.blogBody,
        tags: tags
    });
    Blog.updateOne({ _id: req.params.blogId }, blog)
        .then((b) => {
            console.log(b);
            res.json(blog);
        })
        .catch((err) => {
            res.json({ message: err })
        })
})

module.exports = router;