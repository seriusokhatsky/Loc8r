(function () {
	angular
		.module('loc8rApp')
		.controller('locationDetailCtrl', locationDetailCtrl);

	locationDetailCtrl.$inject = ['$routeParams', '$uibModal', 'loc8rData'];

	function locationDetailCtrl($routeParams, $uibModal, loc8rData) {
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