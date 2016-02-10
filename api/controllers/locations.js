var mongoose = require('mongoose');
var Loc = mongoose.model('Location');

var sendJsonResponse = function(res, status, content) {
	res.status(status);
	res.json(content);
};

var theEarth = (function() { 
	var earhRadius = 6371; // in km

	var getDistanceFromRads = function(rads) {
		return parseFloat( rads * earhRadius );
	};

	var getRadsFromDistance = function(distance) {
		return parseFloat( distance / earhRadius );
	};

	return {
		getDistanceFromRads: getDistanceFromRads,
		getRadsFromDistance: getRadsFromDistance,
	};

})();

module.exports.locationsListByDistance = function(req, res) {

	var lng = parseFloat(req.query.lng);
	var lat = parseFloat(req.query.lat);
	var maxDistance = (req.query.maxDistance && req.query.maxDistance > 0) ? parseFloat(req.query.maxDistance) : 5000;

	var point = {
		type: "Point",
		coordinates: [lng, lat]
	};
	var geoOptions = {
		spherical: true,
		maxDistance: maxDistance,
		num: 10
	};
	Loc.geoNear(point, geoOptions, function(err, results, stats) {
		var locations = [];
		results.forEach(function(doc) {
			locations.push({
				distance: parseInt(doc.dis),
				name: doc.obj.name,
				address: doc.obj.address,
				rating: doc.obj.rating,
				facilities: doc.obj.facilities,
				_id: doc.obj._id
			}); 
		});
		sendJsonResponse(res, 200, locations);
	});
};

module.exports.locationCreate = function(req, res) {

	Loc.create({
		name: req.body.name,
		address: req.body.address,
		facilities: req.body.facilities.split(","),
		coords: [
			parseFloat(req.body.lng),
			parseFloat(req.body.lat)
		],
		openingTimes: [
			{
				days: req.body.days1,
				opening: req.body.opening1,
				closing: req.body.closing1,
				closed: req.body.closed1
			}
		],
		reviews: []
	}, function(err, location) {
		if(err) {
			sendJsonResponse(res, 400, err);
		} else {
			sendJsonResponse(res, 201, location);
		}
	});
	
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