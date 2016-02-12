angular.module('loc8rApp', ['ngRoute']);

function config($routeProvider) {
	$routeProvider
		.when('/', function() {

		})
		.otherwise({redirectTo: '/'});
}

angular
	.module('loc8rApp')
	.config(['$routeProvider', config]);