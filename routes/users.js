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
        let user = await User.findById(req.user._id);
        if (!user.following.includes(req.params.userId)) {
            const followedUser = await User.findById(req.user._id);
            followedUser.following.push(req.params.userId);
            followedUser.save();

            const findUser = await User.findOne({ _id: req.params.userId });
            findUser.followers.push(req.user._id);
            findUser.save();

            res.json(followedUser);
            console.log(followedUser);
        }
        else {
            res.status(409).send({ message: "You already followed this user" })

        }

        next();
    } catch (err) {
        res.json({ message: err });
    }
});

// unfollow specific user
router.post('/unfollow/:userId', verify, async (req, res, next) => {
    console.log(req.params.userId);

    try {

        let user = await User.findById(req.user._id);
        if (user.following.includes(req.params.userId)) {
            const followedUser = await User.findById(req.user._id);
            followedUser.following.pull(req.params.userId);
            followedUser.save();

            const findUser = await User.findOne({ _id: req.params.userId });
            findUser.followers.pull(req.user._id);
            findUser.save();

            res.json(followedUser);
            console.log(followedUser);
        }
        else {
            res.status(409).send({ message: "You aren't following this user" })
        }


        next();
    } catch (err) {
        res.json({ message: err });
    }
})



module.exports = router;