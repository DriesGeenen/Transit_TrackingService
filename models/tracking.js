const mongoose = require('mongoose');

const trackingSchema = mongoose.Schema({
    trackingCode : {
        type: String,
        unique: true,
        required: true
    },
    truck : {
        type: String,
        required: true
    }
});

const Tracking = module.exports = mongoose.model('Tracking', trackingSchema);