'use strict';

var TrackingRepository = require('../repositories/trackingRepository');
const Tracking = require('../models/tracking');
const config = require('../config/config');
const jwt = require('jsonwebtoken');

exports.getAllTrackings = function (req, res) {
    var promise = TrackingRepository.getAllTrackings();
    promise.then(function (trackings) {
        return res.json({success: true, data: trackings});
    }, function (err) {
        return res.status(500).json({success: false, msg: 'Failed to get trackings', error: err});
    });
};

exports.getTrackingById = function (req, res) {
    var promise = TrackingRepository.getTrackingById(req.params.id);
    promise.then(function (tracking) {
        return res.json({success: true, data: tracking});
    }, function (err) {
        return res.status(500).json({success: false, msg: 'Failed to get result', error: err});
    });
};

exports.deleteTracking = function (req, res) {
    var promise = TrackingRepository.deleteTracking(req.params.id);
    promise.then(function () {
        return res.json({success: true, msg: 'Tracking removed'});
    }, function (err) {
        return res.status(500).json({success: false, msg: 'Failed to remove result', error: err});
    });
};


// # Extra functions

exports.updateTracking = function (req, res) {
    var promise = TrackingRepository.updateTracking(req.params.id, req.body);
    promise.then(function () {
        return res.json({success: true, msg: 'Tracking updated'});
    }, function (err) {
        return res.status(500).json({success: false, msg: 'Failed to update tracking', error: err});
    });
};

exports.addTracking = function (req, res) {
    const newTracking = new Tracking(req.body);
    var promise = TrackingRepository.addTracking(newTracking);
    promise.then(function (tracking) {
        return res.json({success: true, msg: 'Tracking created', data: tracking});
    }, function (err) {
        return res.status(500).json({success: false, msg: 'Failed to create tracking', error: err});
    });
};

exports.getDriverByCode = function (req, res) {
    var promise = TrackingRepository.getDriverByCode(req.params.code);
    promise.then(function (tracking) {
        if(tracking){
            return res.json({success: true, driver: tracking.driver});
        }
        return res.status(500).json({success: false, msg: 'Failed to get driver by code'});

    }, function (err) {
        return res.status(500).json({success: false, msg: 'Failed to get driver by code', error: err});
    });
};