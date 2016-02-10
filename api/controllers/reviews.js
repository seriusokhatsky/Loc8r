var mongoose = require('mongoose');
var Loc = mongoose.model('Location');

var sendJsonResponse = function(res, status, content) {
	res.status(status);
	res.json(content);
};

module.exports.reviewsReadOne = function(req, res) {
	if( req.params && req.params.locationid && req.params.reviewid ) {
		Loc
			.findById(req.params.locationid)
			.select('name reviews')
			.exec(function(err, location) {
				var response, review;
				if( ! location ) {
					sendJsonResponse(res, 404, {
						message: 'Location not found'
					});
					return;
				} else if( err ) {
					sendJsonResponse(res, 404, err);
					return;
				}

				if(location.reviews && location.reviews.length > 0) {
					review = location.reviews.id(req.params.reviewid);
					if( ! review ) {
						sendJsonResponse(res, 404, {
							message: 'Review not found'
						});
					} else {
						response = {
							review: review,
							location: {
								name: location.name,
								id: req.params.locationid
							}
						};
					}
					sendJsonResponse(res, 200, response);
				} else {
					sendJsonResponse(res, 404, {
						message: 'Review not found'
					});
				}
			});
	} else {
		sendJsonResponse(res, 404, {
			message: 'No location or review id in request'
		});
	}
};

module.exports.reviewsList = function(req, res) {
	if( req.params && req.params.locationid ) {
		Loc
			.findById(req.params.locationid)
			.select('name reviews')
			.exec(function(err, location) {
				var response, reviews;
				if( ! location ) {
					sendJsonResponse(res, 404, {
						message: 'Location not found'
					});
					return;
				} else if( err ) {
					sendJsonResponse(res, 404, err);
					return;
				}

				if(location.reviews && location.reviews.length > 0) {
					var response = {
						reviews: location.reviews,
						location: {
							name: location.name,
							id: req.params.locationid
						}
					};

					sendJsonResponse(res, 200, response);
				} else {
					sendJsonResponse(res, 404, {
						message: 'No reviews for this location'
					});
				}
			});
	} else {
		sendJsonResponse(res, 404, {
			message: 'No location id in request'
		});
	}
};

module.exports.reviewCreate = function(req, res) {
	
};

module.exports.reviewUpdate = function(req, res) {
	
};

module.exports.reviewDelete = function(req, res) {
	
};