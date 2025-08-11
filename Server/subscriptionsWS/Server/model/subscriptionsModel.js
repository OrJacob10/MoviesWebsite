const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
    movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' },
    dateWatched: Date
}, { versionKey: false });

const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription;
