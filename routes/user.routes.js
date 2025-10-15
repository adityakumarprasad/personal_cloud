const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register',
    body('email').trim().isEmail(),
    body('password').trim().isLength({ min: 5 }),
    body('username').trim().isLength({ min: 5 }),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array(), message: 'Invalid Data' });
        }

        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await userModel.create({
            username,
            email,
            password: hashedPassword
        });

        res.redirect('/user/login');
    }
);

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login',
    body('email').trim().isEmail(),
    body('password').trim().isLength({ min: 5 }),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array(), message: 'Invalid Data' });
        }

        const { email, password } = req.body;
        const user = await userModel.findOne({
            email: email
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid Credentials' });
        }

        const token = jwt.sign({
            userId: user._id,
            email: user.email,
            username: user.username
        }, process.env.JWT_SECRET);

        res.cookie('token' , token);
        res.redirect('/');
    }
);

router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/user/login');
});

module.exports = router;