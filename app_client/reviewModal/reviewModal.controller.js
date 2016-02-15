(function() {
	angular
		.module('loc8rApp')
		.controller('reviewModalCtrl', reviewModalCtrl);

		reviewModalCtrl.$inject = ['$uibModalInstance', 'loc8rData', 'locationData'];

		function reviewModalCtrl($uibModalInstance, loc8rData, locationData) {
			var vm = this;

			vm.formData = {};

			vm.locationData = locationData;

			vm.formError = "";

			vm.doAddReview = function(locationid, data) {
				
				loc8rData.addReviewById(locationid, {
					author: data.name,
					rating: data.rating,
					text: data.reviewText
				})
					.success(function(data) {
						vm.modal.close(data);
					})
					.error(function(e) {
						vm.formError = "Your review has not been saved, try again";
					});

			};

			vm.onSubmit = function() {

				if(!vm.formData.name || !vm.formData.rating || !vm.formData.reviewText) {
					vm.formError = 'All fields are required, please try again.';
				} else {
					vm.doAddReview(vm.locationData.locationid, vm.formData);
				}

				return false;
			};

			vm.modal = {
				close: function(result) {
					$uibModalInstance.close(result);
				},
				cancel: function() {
					$uibModalInstance.dismiss('cancel');
				}
			};

		}
})();