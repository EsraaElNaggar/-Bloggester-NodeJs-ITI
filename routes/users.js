const router = require('express').Router();
const verify = require('./verifyToken');

const User = require('../models/User');


// Get All users
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.json({ message: err });
    }
});

// get user by id
router.get('/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        res.json(user);
    } catch (err) {
        res.json({ message: err });
    }
});

// // get current user
// router.get('/current', async (req, res) => {
//     try {
//         const user = await User.findById(req.user._id);
//         res.json(user);
//     } catch (err) {
//         res.json({ message: err });
//     }
// });

// follow specific user
router.post('/follow/:userId', verify, async (req, res, next) => {
    try {
        const findUser = await User.findOne({ _id: req.params.userId });
        findUser.followers.push(req.user._id);
        findUser.save();

        const followedUser = await User.findById(req.user._id);
        followedUser.following.push(req.params.userId);
        followedUser.save();

        res.json(findUser);
        next();
    } catch (err) {
        res.json({ message: err });
    }
});

// unfollow specific user
router.post('/unfollow/:userId', verify, async (req, res, next) => {
    console.log(req.params.userId);

    try {
        const findUser = await User.findOne({ _id: req.params.userId });
        findUser.followers.pull(req.user._id);
        findUser.save();

        const followedUser = await User.findById(req.user._id);
        followedUser.following.pull(req.params.userId);
        followedUser.save();

        res.json(findUser);
        next();
    } catch (err) {
        res.json({ message: err });
    }
})



module.exports = router;