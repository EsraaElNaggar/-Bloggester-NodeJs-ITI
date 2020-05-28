const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const { upload } = require('../middlewares/Blog')

// Validation
const Joi = require('@hapi/joi');


// register validation
const registerSchema = Joi.object({
    firstName: Joi.string()
        .min(2)
        .max(255)
        .required(),
    lastName: Joi.string()
        .min(2)
        .max(255)
        .required(),
    userEmail: Joi.string()
        .min(6)
        .required()
        .email(),
    userPassword: Joi.string()
        .min(8)
        .required(),
    userImg: Joi.string()
        .default("img.png"),
    userTitle: Joi.string(),
    followers: Joi.number(),
    following: Joi.number()
});


router.post('/register', upload, async (req, res) => {
    // Validate data before add
    const { error } = registerSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message)

    // check if user is already in
    const userEmailExist = await User.findOne({ userEmail: req.body.userEmail })
    if (userEmailExist) return res.status(400).send('Email already exists');

    // hash userPassword..
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.userPassword, salt);

    // create new user
    const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        userTitle: req.body.userTitle,
        userEmail: req.body.userEmail,
        userPassword: hashPassword,
        userImg: `${req.protocol}://${req.headers.host}/uploads/${req.file ? req.file.filename : `${req.protocol}://${req.headers.host}/uploads/img.png`}`
    });
    try {
        const savedUser = await user.save();
        res.send({ user: user._id });
    } catch (err) {
        res.status(400).send(err);
    }
});



// login validation
const loginSchema = Joi.object({
    userEmail: Joi.string()
        .min(6)
        .required()
        .email(),
    userPassword: Joi.string()
        .min(8)
        .required()
});

router.post('/login', async (req, res) => {
    // Validate data before add
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message)

    // check if userEmail is already in
    const user = await User.findOne({ userEmail: req.body.userEmail })
    if (!user) return res.status(400).send('Email is not found');

    // userPassword is correct
    const validPass = await bcrypt.compare(req.body.userPassword, user.userPassword);
    if (!validPass) return res.status(400).send('Invalid Password');

    // create n assign a token
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET)
    res.header('auth-token', token).send({ "token": token, "user": user });
});


module.exports = router;