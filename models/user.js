const mongoose = require("mongoose");


const journalSchema = new mongoose.Schema({
    city: {
        type:String,
    },
    country: {
        type: String,
        required: true, 
    },
    entry: {
        type: String,
        required: true,
    },
    review: {
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