const dotenv = require('dotenv');
dotenv.config();
const path = require('path');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');
const methodOverride = require('method-override');
const User = require('./models/user.js');


const PORT = process.env.PORT || 3000;
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}`);
})

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true}));
app.use(methodOverride('_method'));
app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
    })
  );

app.get('/', (req, res) => {
    const user = req.session.user;
    res.render('index.ejs', {user})
})

app.get('/error', (req, res) => {
    res.render('error.ejs');
})

const authController = require('./controllers/auth');
app.use('/auth', authController);

app.get('/users/:id', async (req, res) => {
    const userId = req.params.id;
    const user = await User.findById(userId);
    res.render('user/home.ejs', {user})
})

app.get('/users/:id/journals/new', async (req, res) => {
    const userId = req.params.id;
    res.render('journal/new.ejs', {userId});
})

app.get('/users/:id/journals/:journalId', async (req, res) => {
    const userId = req.params.id;
    const journalId = req.params.journalId;

    const user = await User.findById(userId);
    const journal = user.passport.id(journalId);
    
    res.render('journal/show.ejs', {journal, userId});
})

app.get('/users/:id/journals/:journalId/edit', async (req, res) => {
    const userId = req.params.id;
    const journalId = req.params.journalId;

    const user = await User.findById(userId);
    const journal = user.passport.id(journalId);
    
    res.render('journal/edit.ejs', {journal, userId});
})

app.post('/users/:id/journals', async (req, res) => {
    const userId = req.params.id;
    const city = req.body.city;
    const country = req.body.country;
    const entry = req.body.entry;
    const review = req.body.review;

    const user = await User.findById(userId);
    user.passport.push({city, country, entry, review});
    await user.save();

    res.redirect(`/users/${userId}`)
})

app.put('/users/:id/journals/:journalId', async (req, res) => {
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

app.delete('/users/:id/journals/:journalId', async (req, res) => {
    const userId = req.params.id;
    const journalId = req.params.journalId;

    const user = await User.findById(userId);

    user.passport.pull({_id: journalId})

    await user.save();

    res.redirect(`/users/${userId}`);
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})