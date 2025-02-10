const mongoose = require("mongoose");


const journalSchema = new mongoose.Schema({
    City: {
        type:String,
    },
    Country: {
        type: String,
        required: true, 
    },
    Entry: {
        type: String,
        required: true,
    },
    Review: {
        type: String,
        enum: ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'],
      },
})

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    passport: [journalSchema]
})

const User = mongoose.model("User", userSchema);

module.exports = User;