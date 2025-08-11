const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    password: String
}, {versionKey: false});

const model = mongoose.model('User', userSchema);

module.exports = model;