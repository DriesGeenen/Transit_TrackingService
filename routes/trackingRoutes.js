'use strict';

module.exports = function (app) {
    var TrackingController = require('../controllers/trackingController');
    var AuthHelper = require('../helpers/authHelper');

    //app.route('/trackings')
    //    .get(AuthHelper.adminRequired, TrackingController.getAllTrackings)
    //    .post(AuthHelper.authServiceRequired, TrackingController.addTracking);

    //app.route('/trackings/:id')
    //    .get(AuthHelper.adminOrSelfRequired, TrackingController.getTrackingById)
    //    .delete(AuthHelper.adminOrSelfRequired, TrackingController.deleteTracking)
    //    .put(AuthHelper.authServiceRequired, TrackingController.updateTracking);

    app.route('/trackings')
        .get(TrackingController.getAllTrackings)
        .post(TrackingController.addTracking);

    app.route('/trackings/code/:code')
        .get(TrackingController.getDriverByCode);

    app.route('/trackings/generate')
        .post(TrackingController.generateTrackingCodes);

    app.route('/trackings/:id')
        .get(TrackingController.getTrackingById)
        .delete(TrackingController.deleteTracking)
        .put(TrackingController.updateTracking);
};