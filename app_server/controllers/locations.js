var request = require('request');
var apiOptions = {
	server: 'http://localhost:3000'
}

if( process.env.NODE_ENV == 'production' ) {
	apiOptions.server = 'https://arcane-shore-85602.herokuapp.com';
}

var _formatDistance = function(l) {
	var numDistance = l, unit;
	if(l > 1000) {
		unit = 'km';
		numDistance = parseFloat(l/1000).toFixed(1);
	} else {
		unit = 'm';
	}
	return numDistance + unit;
}

var renderHomepage = function(req, res) {
	var message = '';

	res.render('location-list', { 
		title: 'Home list',
		pageHeader: {
			title: 'Loc8r',
			strapline: 'Find places to go work with wifi!'
		},
		sidebar: 'Loc8r helps you to find places to work when out and about.',
		locations: [],
		message: message
	});
}

var renderAddReview = function(req, res, message, review) {

	getLocationInfo(req, res, function(req, res, data) {
		res.render('location-review-form', { 
			title: 'Leave review for '  + data.name,
			message: message,
			review: review,
			location: data,
			url: req.originalUrl
		});
	});


}

var _showError = function (req, res, status) {
	var title, content;
	if (status === 404) {
		title = "404, page not found";
		content = "Oh dear. Looks like we can't find this page. Sorry.";
	} else {
		title = status + ", something's gone wrong";
		content = "Something, somewhere, has gone just a little bit wrong.";
	}
	res.status(status);
	res.render('generic-text', {
		title : title,
		content : content
	});
};

module.exports.homelist = function(req, res){
	renderHomepage(req, res);
};

var renderInfoPage = function(req, res, locationDetails) {
	var message = '';

	if(!locationDetails.name) {
		message = 'Location not found';
	}

	res.render('location-info', { 
		title: 'Location info',
		message: message,
		location: locationDetails,
		sidebar: {
			context: 'is on Loc8r because it has accessible wifi and space to sit down with your laptop and get some work done.',
			callToAction: 'If you\'ve been and you like it - or if you don\'t - please leave a review to help other people just like you.'
		}
	});
};

var getLocationInfo = function(req, res, callback) {
	var path = '/api/locations/' + req.params.locationid;

	var requestOptions = {
		url: apiOptions.server + path,
		method: 'GET',
		json: {},
		qs: {}
	};

	request(requestOptions, function(err, response, body) {
		var data = body;

		if(err) {
			console.log(err);
		} else if(response.statusCode == 200) {
			data.coords = {
				lng: body.coords[0],
				lat: body.coords[1]
			};
			callback(req, res, data);

		} else {
			_showError(req, res, response.statusCode);
		}
	});
};

module.exports.locationInfo = function(req, res){

	getLocationInfo(req, res, function(req, res, data) {
		renderInfoPage(req, res, data);
	});

};

module.exports.addReview = function(req, res){
	renderAddReview(req, res, '', {
		author: '',
		rating: 5,
		text: ''
	});
};

module.exports.doAddReview = function(req, res){
	var path = '/api/locations/' + req.params.locationid + '/reviews';

	var newReview = {
		author: req.body.author,
		rating: parseInt(req.body.rating, 10),
		text: req.body.text
	};

	var requestOptions = {
		url: apiOptions.server + path,
		method: 'POST',
		json: newReview
	};

	request(requestOptions, function(err, response, body) {
		var data = body;

		if(err) {
			console.log(err);
		} else if(response.statusCode == 400 && body.name && body.name == 'ValidationError') {
			renderAddReview(req, res, 'All fields are required to fill, please try again', newReview);
		} else if(response.statusCode == 201) {
			res.redirect('/location/' + req.params.locationid);
		} else {
			_showError(req, res, response.statusCode);
		}
	});
};