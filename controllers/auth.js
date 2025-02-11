const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const bcrypt = require('bcrypt');

router.get('/signup', (req, res) => {
    res.render(`auth/sign-up.ejs`);
})

router.get('/signin', (req, res) => {
    res.render(`auth/sign-in.ejs`);
})

router.post('/signup', async (req, res) => {
    try {

    const username = req.body.username;
    const existingUser = await User.findOne({ username});

    if (existingUser) {
        return res.send('Username already exists');
    }

    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    if (password !== confirmPassword) { 
       return res.send('Passwords do not match');
    }

    const hashedPassword = await bcrypt.hashSync(password, 10);

    await User.create({ username, password: hashedPassword});

    res.render('auth/sign-in.ejs');

    }catch(error) {
        console.log(error);
        res.redirect('/error');
    }
})

router.post('/signin', async (req, res) => {
    try {
    const username = req.body.username;
    const existingUser = await User.findOne({username});
    if (!existingUser) {
        return res.send('Username or password is incorrect');
    }

    const password = req.body.password;
    const isPasswordValid = await bcrypt.compare(password, existingUser.password);

    if (!isPasswordValid) {
        return res.send('Username or password is incorrect');
    }

    req.session.user = {
        username: existingUser.username,
        id: existingUser._id,   
    };

    res.redirect(`/users/${existingUser._id}`);

    }catch(error) {
    console.log(error);
    res.redirect('/error');
    }
})


module.exports = router;