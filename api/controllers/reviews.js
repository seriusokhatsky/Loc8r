var mongoose = require('mongoose');
var Loc = mongoose.model('Location');
var User = mongoose.model('User');

var getAuthor = function(req, res, callback) {
	if (req.payload && req.payload.email) {
		User
			.findOne({ email : req.payload.email })
			.exec(function(err, user) {
				if (!user) {
					sendJSONresponse(res, 404, {
						"message": "User not found"
					});
				} else if (err) {
					console.log(err);
					sendJSONresponse(res, 404, err);
					return;
				}
				callback(req, res, user.name);
			});
	} else {
		sendJSONresponse(res, 404, {
			"message": "User not found"
		});
		return; 
	}
};

var sendJsonResponse = function(res, status, content) {
	res.status(status);
	res.json(content);
};

var updateAverageRating = function(locationid) {
	Loc
		.findById(locationid)
		.select('reviews rating')
		.exec(function(err, location) {
			if( ! err ) {
				doSetAvarageRating(location);
			} 
		});
};

var doSetAvarageRating = function(location) {
	
	var reviewCount, total = 0, reviews;
	if( location.reviews && location.reviews.length > 0) {
		reviews = location.reviews;
		reviewsCount = location.reviews.length;
		for (var i = reviewsCount - 1; i >= 0; i--) {
			total += reviews[i].rating
		};

		location.rating = parseInt(total / reviewsCount, 10);

		location.save(function(err, location) {
			if(err) {
				console.log(err);
			} else {
				console.log('Average rating now is ', location.rating);
			}
		});
	}
}

var doAddReview = function(req, res, location, author) {
	if( ! location ) {
		sendJsonResponse(res, 404, {
			message: 'Location not found'
		});
		return;
	}

	location.reviews.push({
		author: author,
		rating: req.body.rating,
		review: req.body.text
	});

	location.save(function(err, location) {
		var thisReview;
		if(err) {
			sendJsonResponse(res, 400, err);
		} else {
			updateAverageRating(location._id);
			thisReview = location.reviews[location.reviews.length - 1];
			sendJsonResponse(res, 201, thisReview);
		}
	});
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

	getAuthor(req, res, function(req, res, userName) {

		if( req.params && req.params.locationid ) {
			var locationid = req.params.locationid;

			Loc
				.findById(locationid)
				.select('reviews')
				.exec(function(err, location) {
					if( err ) {
						sendJsonResponse(res, 404, err);
						return;
					}
					
					doAddReview(req, res, location, userName);

				});
		} else {
			sendJsonResponse(res, 404, {
				message: 'No location id in request'
			});
		}		
	});
	
};

module.exports.reviewUpdateOne = function(req, res) {
	if( ! req.params.locationid || ! req.params.reviewid   ) {
		sendJsonResponse(res, 404, {
			message: 'No location or review id in request'
		});
		return;
	}

	Loc
		.findById(req.params.locationid)
		.select('reviews')
		.exec(function(err, location) {
			var thisReview;
			if( ! location ) {
				sendJsonResponse(res, 404, {
					message: 'Location to update not found'
				});
				return;
			} else if( err ) {
				sendJsonResponse(res, 404, err);
				return;
			}			

			if(location.reviews && location.reviews.length > 0 ) {
				thisReview = location.reviews.id(req.params.reviewid);

				thisReview.author = req.body.author;
				thisReview.rating = req.body.rating;
				thisReview.review = req.body.text;

				location.save(function(err, location) {
					if(err) {
						sendJsonResponse(res, 400, err);
					} else {
						updateAverageRating(location._id);
						sendJsonResponse(res, 201, thisReview);
					}
				});
			} else {
				sendJsonResponse(res, 404, {
					message: 'No reviews to update'
				});
			}
		});
};

module.exports.reviewDelete = function(req, res) {
	if( ! req.params.locationid || ! req.params.reviewid   ) {
		sendJsonResponse(res, 404, {
			message: 'No location or review id in request'
		});
		return;
	}

	Loc
		.findById(req.params.locationid)
		.select('reviews')
		.exec(function(err, location) {
			var thisReview;
			if( ! location ) {
				sendJsonResponse(res, 404, {
					message: 'Location to remove review not found'
				});
				return;
			} else if( err ) {
				sendJsonResponse(res, 404, err);
				return;
			}			

			if(location.reviews && location.reviews.length > 0 ) {
				if (!location.reviews.id(req.params.reviewid)) {
					sendJsonResponse(res, 404, {
						"message": "reviewid not found"
					});
				}

				location.reviews.id(req.params.reviewid).remove();

				location.save(function(err, location) {
					if(err) {
						sendJsonResponse(res, 404, err);
					} else {
						updateAverageRating(location._id);
						sendJsonResponse(res, 204, null);
					}
				});
			} else {
				sendJsonResponse(res, 404, {
					message: 'No reviews to delete'
				});
			}
		});
};