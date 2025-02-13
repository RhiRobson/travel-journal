const express = require('express');
const router = express.Router();
const User = require('../models/user.js');


router.get('/:id', async (req, res) => {
    const userId = req.params.id;
    const user = await User.findById(userId);
    res.render('user/home.ejs', {user})
})

router.get('/:id/journals/new', async (req, res) => {
    const userId = req.params.id;
    res.render('journal/new.ejs', {userId});
})

router.get('/:id/journals/:journalId', async (req, res) => {
    const userId = req.params.id;
    const journalId = req.params.journalId;

    const user = await User.findById(userId);
    const journal = user.passport.id(journalId);
    
    res.render('journal/show.ejs', {journal, userId});
})

router.get('/:id/journals/:journalId/edit', async (req, res) => {
    const userId = req.params.id;
    const journalId = req.params.journalId;

    const user = await User.findById(userId);
    const journal = user.passport.id(journalId);
    
    res.render('journal/edit.ejs', {journal, userId});
})

router.post('/:id/journals', async (req, res) => {
    const userId = req.params.id;
    const date = req.body.date;
    const city = req.body.city;
    const country = req.body.country;
    const entry = req.body.entry;
    const review = req.body.review;

    const user = await User.findById(userId);
    user.passport.push({date, city, country, entry, review});
    await user.save();

    res.redirect(`/users/${userId}`)
})

router.put('/:id/journals/:journalId', async (req, res) => {
    const userId = req.params.id;
    const journalId = req.params.journalId;
    const newEntry = req.body.entry;
    const newReview = req.body.review;

    const user = await User.findById(userId);
    const journal = user.passport.id(journalId);

    journal.entry = newEntry;
    journal.review = newReview;

    await user.save();

    res.redirect(`/users/${userId}/journals/${journalId}`);
})

router.delete('/:id/journals/:journalId', async (req, res) => {
    const userId = req.params.id;
    const journalId = req.params.journalId;

    const user = await User.findById(userId);

    user.passport.pull({_id: journalId})

    await user.save();

    res.redirect(`/users/${userId}`);
})

module.exports = router;
