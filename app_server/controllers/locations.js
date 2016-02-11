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

var renderHomepage = function(req, res, responseBody) {
	var message = '';

	if(responseBody.constructor !== Array) {
		message = 'API lookup error';
		responseBody = [];
	} else if( !responseBody.length) {
		message = 'No places found near you';
	}

	res.render('location-list', { 
		title: 'Home list',
		pageHeader: {
			title: 'Loc8r',
			strapline: 'Find places to go work with wifi!'
		},
		sidebar: 'Loc8r helps you to find places to work when out and about.',
		locations: responseBody,
		message: message
	});
}

module.exports.homelist = function(req, res){

	var path = '/api/locations';

	var requestOptions = {
		url: apiOptions.server + path,
		method: 'GET',
		json: {},
		qs: {
			lng: 30.209210,
			lat: 48.756087,
			maxDistance: 2000
		}
	};

	request(requestOptions, function(err, response, body) {
		var data = '';
		data = body;
		if(err) {
			console.log(err);
		} else if(response.statusCode == 200 && data.length) {
			// Convert meters to kilometers if needed
			for (var i = data.length - 1; i >= 0; i--) {
				data[i].distance = _formatDistance(data[i].distance);
			};
			renderHomepage(req, res, body);
		} else {
			console.log(response.statusCode);
		}
		renderHomepage(req, res, data);
	});
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

module.exports.locationInfo = function(req, res){

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
			renderInfoPage(req, res, data);

		} else {
			console.log(response.statusCode);
		}
		renderInfoPage(req, res, data);
	});

};

module.exports.addReview = function(req, res){
	res.render('location-review-form', { title: 'Review Starcups' });
};