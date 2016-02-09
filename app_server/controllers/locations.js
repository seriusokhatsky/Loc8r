module.exports.homelist = function(req, res){
	res.render('location-list', { 
		title: 'Home list',
		pageHeader: {
			title: 'Loc8r',
			strapline: 'Find places to go work with wifi!'
		},
		sidebar: 'Loc8r helps you to find places to work when out and about.',
		locations: [
			{
				name: 'Starcaps',
				address: '125 High Street, Reading, RG5 1PS',
				rating: 2,
				facilities: [ 'Hot Drinks', 'Foods', 'Premium WiFi'],
				disatance: '100m'
			},
			{
				name: 'Pan Kaban',
				address: '125 High Street, Reading, RG5 1PS',
				rating: 5,
				facilities: [ 'Hot Drinks', 'Foods', 'Premium WiFi'],
				disatance: '100m'
			},
		]
	});
};

module.exports.locationInfo = function(req, res){
	res.render('location-info', { 
		title: 'Location info',
		location: {
			name: 'Starcaps',
			address: '125 High Street, Reading, RG5 1PS',
			rating: 2,
			openingTimes: [
				{
					days: 'Monday - Friday',
					opening: '7:00am',
					closing: '7:00pm',
					closed: false
				},
				{
					days: 'Saturday',
					opening: '8:00am',
					closing: '5:00pm',
					closed: false
				},
				{
					days: 'Sunday',
					opening: '7:00am',
					closed: true
				}
			],
			facilities: [ 'Hot Drinks', 'Foods', 'Premium WiFi'],
			coords: {
				lat: 51.455041,
				lng: -0.3690884
			},
			disatance: '100m',
			reviews: [
				{
					author: 'Simon Holmes 1',
					date: '16 July 2013',
					rating: 5,
					review: 'What a great place. I can\'t say enough good things about'
				},
				{
					author: 'Simon Holmes 2',
					date: '16 July 2013',
					rating: 3,
					review: 'What a great place. I can\'t say enough good things about'
				},
				{
					author: 'Simon Holmes 44',
					date: '16 July 2013',
					rating: 2,
					review: 'What a great place. I can\'t say enough good things about'
				},
			]
		},
		sidebar: {
			context: 'is on Loc8r because it has accessible wifi and space to sit down with your laptop and get some work done.',
			callToAction: 'If you\'ve been and you like it - or if you don\'t - please leave a review to help other people just like you.'
		}
	});
};

module.exports.addReview = function(req, res){
	res.render('location-review-form', { title: 'Review Starcups' });
};