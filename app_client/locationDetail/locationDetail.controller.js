(function () {
	angular
		.module('loc8rApp')
		.controller('locationDetailCtrl', locationDetailCtrl);

	locationDetailCtrl.$inject = ['$routeParams', '$location', '$uibModal', 'loc8rData', 'authentication'];

	function locationDetailCtrl($routeParams, $location, $uibModal, loc8rData, authentication) {
		var vm = this;

		vm.locationid = $routeParams.locationid;

		vm.pageHeader = {
			title: 'Location detail page',
			strapline: vm.locationid
		}; 

		loc8rData.locationById(vm.locationid)
			.success(function(data) {
				vm.location = data;
				vm.pageHeader = {
					title: vm.location.name
				}; 
			})
			.error(function (e) {
				console.log(e);
			});

		vm.isLoggedIn = authentication.isLoggedIn();

		vm.currentPath = $location.path();

		vm.popupReviewForm = function() {
			var modalInstance = $uibModal.open({
				templateUrl: '/reviewModal/reviewModal.view.html',
				controller: 'reviewModalCtrl as vm',
				resolve: {
					locationData: function() {
						return {
							locationid: vm.locationid,
							locationName: vm.location.name
						};
					}
				}
			});

			modalInstance.result.then(function (data) {
				vm.location.reviews.push(data);
			});
		};
	}
})();