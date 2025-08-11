const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    name: String,
    genres: [String],
    image: String,
    premiered: Date
    
}, {versionKey: false});

const model = mongoose.model('Movie', movieSchema);

module.exports = model;