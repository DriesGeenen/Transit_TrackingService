'use strict';

const TrackingRepository = require('../repositories/trackingRepository');
const Tracking = require('../models/tracking');
const config = require('../config/config');
const jwt = require('jsonwebtoken');
const uniqid = require('uniqid');
const request = require('request-promise');

const emailServiceUrl = process.env.EMAIL_SERVICE_URL || 'http://localhost:6605/sendmail';

exports.getAllTrackings = function (req, res) {
    const promise = TrackingRepository.getAllTrackings();
    promise.then(function (trackings) {
        return res.json({success: true, data: trackings});
    }, function (err) {
        return res.status(500).json({success: false, msg: 'Failed to get trackings', error: err});
    });
};

exports.getTrackingById = function (req, res) {
    const promise = TrackingRepository.getTrackingById(req.params.id);
    promise.then(function (tracking) {
        return res.json({success: true, data: tracking});
    }, function (err) {
        return res.status(500).json({success: false, msg: 'Failed to get result', error: err});
    });
};

exports.deleteTracking = function (req, res) {
    const promise = TrackingRepository.deleteTracking(req.params.id);
    promise.then(function () {
        return res.json({success: true, msg: 'Tracking removed'});
    }, function (err) {
        return res.status(500).json({success: false, msg: 'Failed to remove result', error: err});
    });
};


exports.updateTracking = function (req, res) {
    const promise = TrackingRepository.updateTracking(req.params.id, req.body);
    promise.then(function () {
        return res.json({success: true, msg: 'Tracking updated'});
    }, function (err) {
        return res.status(500).json({success: false, msg: 'Failed to update tracking', error: err});
    });
};

exports.addTracking = function (req, res) {
    const newTracking = new Tracking(req.body);
    const promise = TrackingRepository.addTracking(newTracking);
    promise.then(function (tracking) {
        return res.json({success: true, msg: 'Tracking created', data: tracking});
    }, function (err) {
        return res.status(500).json({success: false, msg: 'Failed to create tracking', error: err});
    });
};

exports.getDriverByCode = function (req, res) {
    const promise = TrackingRepository.getDriverByCode(req.params.code);
    promise.then(function (tracking) {
        if (tracking) {
            return res.json({success: true, driver: tracking.driver});
        }
        return res.status(500).json({success: false, msg: 'Failed to get driver by code'});

    }, function (err) {
        return res.status(500).json({success: false, msg: 'Failed to get driver by code', error: err});
    });
};

exports.generateTrackingCodes = function (req, res) {
    const requestArray = req.body;

    let index = 0;
    const length = requestArray.length;

    // Such high code quality
    generateTrackingCode();

    function generateTrackingCode() {
        if (index === length) return requestMailTrackingCodes(filterRequestArrayForMailing(requestArray)).then(function (data) {
            return res.json({success:true, data});
        }, function (err) {
            return res.status(500).json({success: false, msg: 'Failed to request email', error: err});
        });

        const trackingCode = uniqid();
        requestArray[index].trackingCode = trackingCode;
        const driver = requestArray[index].driver;

        const newTracking = new Tracking();
        newTracking.trackingCode = trackingCode;
        newTracking.driver = driver;

        const promise = TrackingRepository.addTracking(newTracking);
        promise.then(function () {
            console.log('code generated for ' + driver);
            index++;
            generateTrackingCode();
        }, function (err) {
            return res.status(500).json({success: false, msg: 'Failed to create tracking code', error: err});
        });
    }
};

const requestMailTrackingCodes = function (body) {
    const options = {
        url: emailServiceUrl + '/bulk',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': generateTrackingServiceToken()
        },
        body: JSON.stringify(body)
    };
    return request.post(options);
};

const generateTrackingServiceToken = function () {
    return 'JWT ' + jwt.sign({
        data: {role: 'trackingservice'}
    }, config.secret, {
        expiresIn: 60
    });
};


const filterRequestArrayForMailing = function (requestArray) {
    const out = [];
    for (let i = 0; i < requestArray.length; i++) {
        out.push(filterRequestForMailing(requestArray[i]));
    }
    return out;
};

const filterRequestForMailing = function (request) {
    return {
        trackingCode: request.trackingCode,
        email: request.email,
        //telephone: request.telephone
    }
};