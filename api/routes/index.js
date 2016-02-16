var express = require('express');
var router = express.Router();
var ctrlLocations = require('../controllers/locations');
var ctrlReviews = require('../controllers/reviews');
var ctrlAuth = require('../controllers/authentication');
var jwt = require('express-jwt'); 

var auth = jwt({
	secret: process.env.JWT_SECRET,
	userProperty: 'payload'
});

router.get('/locations', ctrlLocations.locationsListByDistance);
router.post('/locations', ctrlLocations.locationCreate);
router.get('/locations/:locationid', ctrlLocations.locationsReadOne);
router.put('/locations/:locationid', ctrlLocations.locationUpdateOne);
router.delete('/locations/:locationid', ctrlLocations.locationDelete);

router.get('/locations/:locationid/reviews', ctrlReviews.reviewsList);
router.post('/locations/:locationid/reviews', auth, ctrlReviews.reviewCreate);
router.get('/locations/:locationid/reviews/:reviewid', ctrlReviews.reviewsReadOne);
router.put('/locations/:locationid/reviews/:reviewid', auth, ctrlReviews.reviewUpdateOne);
router.delete('/locations/:locationid/reviews/:reviewid', auth, ctrlReviews.reviewDelete);

router.post('/login', ctrlAuth.login);
router.post('/register', ctrlAuth.register);

module.exports = router;