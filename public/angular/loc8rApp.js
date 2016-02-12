var locationListCtrl = function($scope, loc8rData) {
	$scope.message = 'Searching for nearby places'
	loc8rData
		.success(function(data) {
			$scope.message = (data.length > 0) ? '' : 'No locations found';
			
			$scope.data = {
				locations: data
			};
		})
		.error(function(e) {
			$scope.message = 'Sorry, something went wrong'
			console.log(e);
		});
};

var formatDistance = function() {
	return function(l) {
		var numDistance = l, unit;
		if(l > 1000) {
			unit = 'km';
			numDistance = parseFloat(l/1000).toFixed(1);
		} else {
			unit = 'm';
		}
		return numDistance + unit;
	};
};

var ratingStars = function() {
	return {
		scope: {
			thisRating: '=rating'
		},
		templateUrl: '/angular/rating-stars.html'
	};
};

var loc8rData = function($http) {
	return $http.get('/api/locations/?lng=30.209210&lat=48.756087&maxDistance=2000')
};

angular
	.module('loc8rApp', [])
	.controller('locationListCtrl', locationListCtrl)
	.filter('formatDistance', formatDistance)
	.directive('ratingStars', ratingStars)
	.service('loc8rData', loc8rData);