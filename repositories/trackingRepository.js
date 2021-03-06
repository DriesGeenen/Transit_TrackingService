'use strict';

var mongoose = require('mongoose');
var Tracking = mongoose.model('Tracking');

exports.getAllTrackings = function () {
    return Tracking.find({}).select('-password');
};

exports.getTrackingById = function (id) {
    return Tracking.findById(id).select('-password');
};

exports.getDriverByCode = function (code) {
    return Tracking.findOne({trackingCode: code});
};

exports.addTracking = function (newTracking) {
    return newTracking.save();
};

exports.updateTracking = function (id, tracking) {
    return Tracking.update({_id: id}, tracking);
};

exports.deleteTracking = function (id) {
    return Tracking.remove({_id: id});
};

exports.deleteTrackingByEcmrId = function (ecmrid) {
    return Tracking.remove({ecmrId: ecmrid});
};