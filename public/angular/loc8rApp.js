var locationListCtrl = function($scope, loc8rData, gelocation) {

	$scope.message = 'Checking your location';
	
	$scope.getData = function(position) {
		$scope.$apply(function() {
			$scope.message = 'Searching for nearby places';
			$scope.coords = position.coords;
		});

		loc8rData.getLocationByCoords(position.coords.longitude, position.coords.latitude)
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

	$scope.showError = function(error) {
		$scope.$apply(function() {
			$scope.message = error.message;
		});
	};

	$scope.noGeo = function() {
		$scope.$apply(function() {
			$scope.message = 'Geolocation not supported by this browser';
		});
	};

	gelocation.getPosition($scope.getData, $scope.showError, $scope.noGeo);


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
	var getLocationByCoords = function(lng, lat) {
		return $http.get('/api/locations/?lng=' + lng + '&lat=' + lat + '&maxDistance=2000');
	};

	return {
		getLocationByCoords: getLocationByCoords
	};
};

var gelocation = function() {

	var getPosition = function(cbSuccess, cbError, cbNoGeo) {
		if(navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(cbSuccess, cbError);
		} else {
			cbNoGeo();
		}
	};

	return {
		getPosition: getPosition
	};
};

angular
	.module('loc8rApp', [])
	.controller('locationListCtrl', locationListCtrl)
	.filter('formatDistance', formatDistance)
	.directive('ratingStars', ratingStars)
	.service('loc8rData', loc8rData)
	.service('gelocation', gelocation);