var mongoose = require('mongoose');
var Loc = mongoose.model('Location');

var sendJsonResponse = function(res, status, content) {
	res.status(status);
	res.json(content);
};

var theEarth = (function() { 
	var earhRadius = 6371; // in km

	var getDistanceFromRads = function(rads) {
		return rads * earhRadius;
	};

	var getRadsFromDistance = function(distance) {
		return distance / earhRadius;
	};

	return {
		getDistanceFromRads: getDistanceFromRads,
		getRadsFromDistance: getRadsFromDistance,
	};

})();

module.exports.locationsListByDistance = function(req, res) {

	var lng = parseFloat(req.params.lng);
	var lat = parseFloat(req.params.lat);

	var point = {
		type: "Point",
		coordinates: [lng, lat]
	};

	var geoOptions = {
		spherical: true,
		maxDistance: theEarth.getRadsFromDistance(5),
		num: 10
	};

	Loc.geoNear(point, geoOptions, function(err, locations) {
		if( ! locations ) {
			sendJsonResponse(res, 404, {
				message: 'Locations not found'
			});
		} else if( err ) {
			sendJsonResponse(res, 404, err);
		} else {
			sendJsonResponse(res, 200, locations);
		}
	});
};

module.exports.locationCreate = function(req, res) {
	
};

module.exports.locationsReadOne = function(req, res) {
	if( req.params && req.params.locationid ) {
		Loc
			.findById(req.params.locationid)
			.exec(function(err, location) {
				if( ! location ) {
					sendJsonResponse(res, 404, {
						message: 'Location not found'
					});
					return;
				} else if( err ) {
					sendJsonResponse(res, 404, err);
					return;
				}
				sendJsonResponse(res, 200, location);
			});
	} else {
		sendJsonResponse(res, 404, {
			message: 'No location id in request'
		});
	}
};

module.exports.locationUpdate = function(req, res) {
	
};

module.exports.locationDelete = function(req, res) {
	
};