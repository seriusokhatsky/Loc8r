module.exports.homelist = function(req, res){
	res.render('location-list', { title: 'Home list' });
};

module.exports.locationInfo = function(req, res){
	res.render('location-info', { title: 'Location info' });
};

module.exports.addReview = function(req, res){
	res.render('location-review-form', { title: 'Location add review' });
};