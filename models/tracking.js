const mongoose = require('mongoose');

const trackingSchema = mongoose.Schema({
    trackingCode : {
        type: String,
        unique: true,
        required: true
    },
    driver : {
        type: String,
        required: true
    },
    ecmrId : {
        type: String,
        unique: true,
        required: true
    }
});

const Tracking = module.exports = mongoose.model('Tracking', trackingSchema);