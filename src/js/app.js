var map;
var currentMarker = false;
var yelpResults;

var randomString = function(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for(var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

/*Yelp API search values*/
var baseURL = 'https://api.yelp.com/v2/search?'


var oauth_consumer_keyVal = 'o7io1ZSwVn_Gcxj4MqsgkQ';
var oauth_tokenVal = '3Rka9DQ66lV8bxGac4DSEcgt6Ze95TfM';
var oauth_signature_methodVal = 'HMAC-SHA1';
var oauth_signatureVal = 'oZstoMIkks8R3kXJGM5uFzDipas';
var oauth_timestamp = '&oauth_timestamp=';
var oauth_nonce = '&oauth_nonce=';

function initMap() {
	var latLng = {lat: 41.994654, lng: -73.875959};
	var markerArray = [];

	map = new google.maps.Map(document.getElementById('map'), {
		center: latLng,
		zoom: 15
	});
}

// For IE and Chrome compatability
if(!('contains' in String.prototype)) {
    String.prototype.contains = function(str, startIndex) {
        return -1 !== String.prototype.indexOf.call(this, str, startIndex);
    };
}

function addMarker(latLng,map,name) {

	var marker = new google.maps.Marker({
		position: latLng,
		map: map,
		animation: google.maps.Animation.DROP,
		title: name
	});
}

function createMarkers(locationData,map) {
	console.log(locationData);

	var yelpLogo = './images/yelp-logo-xsmall.png';

	locationData['businesses'].forEach(function(business) {

		var latLng = {lat: business['location']['coordinate']['latitude'], lng: business['location']['coordinate']['longitude']},
			name = business['name'],
			phoneNum = business['display_phone'],
			description = business['snippet_text'],
			businessURL = business['url'],
			ratingImg = business['rating_img_url_small'],
			reviewCount = business['review_count'],
			img = business['image_url'];

		var contentString = '<div id="content">' +
		'<div id="placeImg"><img src="' + img + '"></img></div>' +
		'<div id="yelpLogo"><a href="http://www.yelp.com" target="_blank"><img src="' + yelpLogo + '"></img></a></div>' +
		'<h3 id="placeName">' + name + '</h3>' +
		'<img src="' + ratingImg + '"></img>' + '(' + reviewCount + ')' +
		'<p><a href="tel: +' + phoneNum + '">' + phoneNum + '</a></p>' +
		'<p>' + description + '<a href="' + businessURL + '" target="_blank">(read more...)</a></p>' +
		'</div>';



		var infowindow = new google.maps.InfoWindow({
			content: contentString,
			maxWidth: 350
		});

		var marker = new google.maps.Marker({
				position: latLng,
				map: map,
				animation: google.maps.Animation.DROP,
				title: name
			});

		 marker.addListener('click', function() {
		 	if (currentMarker) {
		 		currentMarker.close();
		 	}

		 	currentMarker = infowindow;
			infowindow.open(map,marker);
		});
	})
}

function nonce_generate() {
  return (Math.floor(Math.random() * 1e12).toString());
}


function searchYelp(termVal,locationVal,categoryVal) {

	var httpMethod = 'GET',
		url = 'http://api.yelp.com/v2/search?',
		parameters = {
			location: locationVal,
			term: termVal,
			category_filter: categoryVal,
			oauth_consumer_key: oauth_consumer_keyVal,
			oauth_token: oauth_tokenVal,
			oauth_nonce: nonce_generate(),
			oauth_timestamp: Math.floor(Date.now()/1000),
			oauth_signature_method: oauth_signature_methodVal,
			callback: 'cb'
		},
		consumerSecret = 'Xzz7g7qJMMY6-rs8zX8KTtxtBZY',
		tokenSecret = 'oZstoMIkks8R3kXJGM5uFzDipas',
		encodedSignature = oauthSignature.generate(httpMethod,url,parameters,consumerSecret,tokenSecret);
		parameters.oauth_signature = encodedSignature;

		var settings = {
			url: url,
			data: parameters,
			cache: true,
			dataType: 'jsonp',
			jsonpCallback: 'cb',
			success: function(results) {
				createMarkers(results,map);
				yelpResults = results;
			},
			error: function(error) {
				console.log(error);
			}
		};

		$.ajax(settings);
}

searchYelp('food','Red+Hook,NY+12571','restaurants');

var filterBox = $('.filter-box'),
	menu = $('.filter-menu'),
 	close = $('.close-button'),
	map = $('#map');

map.click(function() {
	menu.removeClass('is-active');
	filterBox.blur(); // we have to remove focus or else it can't gain focus and reopen the menu!
});

filterBox.focus(function() {
	menu.addClass('is-active');
});

close.click(function() {
	menu.removeClass('is-active');
});

function FilterViewModel() {
	var self = this;

	self.filteredLocations = ko.observableArray();

	self.removeDuplicates = function() {
		current = self.filteredLocations()[0];

		for (var i=0; i < self.filteredLocations().length; i++){
			console.log(self.filteredLocations());
			if (current.name === self.filteredLocations()[i].name) {
				self.filteredLocations()[i].name = 'erase';
			} else {
				current = self.filteredLocations()[i];
			}
		}

		self.filteredLocations.remove(function(locationPiece) {
			return locationPiece.name === 'erase';
		});
	}

	self.filterLocations = function(input,locationData) {

		locationData['businesses'].forEach(function(business) {

			var name = business['name'],
				categoryArray = business['categories'],
				address = business['location']['display_address'],
				latLng = {lat: business['location']['coordinate']['latitude'], lng: business['location']['coordinate']['longitude']},
				location = [business['location']['city'],business['location']['neighborhoods'],business['location']['state_code']];

			var found = false;

			categoryArray.forEach(function(categories) {
				categories.forEach(function(category) {

					if(!found && category.toLowerCase().contains(input.toLowerCase())) {
						self.filteredLocations.push({name: name,
							address: address[0] + ' ' + address[1],
							category: categoryArray[0][0],
							latLng: latLng
						});
						found = true;
					}
				})
			})

			if (!found) {
				location.forEach(function(locationPiece) {
					if(!found && locationPiece !== undefined && locationPiece.toLowerCase().contains(input.toLowerCase())) {
						self.filteredLocations.push({name: name,
							address: address[0] + ' ' + address[1],
							category: categoryArray[0][0],
							latLng: latLng
						});
						found = true;
					}
				})
			}

			if (!found) {
				address.forEach(function(addressPiece) {
					if(!found && addressPiece.toLowerCase().contains(input.toLowerCase())) {
						self.filteredLocations.push({name: name,
							address: address[0] + ' ' + address[1],
							category: categoryArray[0][0],
							latLng: latLng
						});
						found = true;
					}
				})
			}

			if (name.toLowerCase().contains(input.toLowerCase()) && !found) {
				self.filteredLocations.push({name: name,
					address: address[0] + ' ' + address[1],
					category: categoryArray[0][0],
					latLng: latLng
				});
				found = true;
			}


			if (input === '') {
				self.filteredLocations.removeAll();
			}

			if (!found) {
				self.filteredLocations.remove(function(locationPiece) {
					return locationPiece.name === name;
				});
			}

			found = false;
		})

		self.filteredLocations.sort(function(left,right) {
		// sort results alphabetically

			return left.name == right.name ? 0 : (left.name < right.name ? -1: 1)
		})

		removeDuplicates();
	}

	self.centerMap = function(location) {
		menu.removeClass('is-active');
		filterBox.blur();
		map.setCenter(location.latLng);
	}
}

ko.applyBindings(FilterViewModel);

filterBox.on('input', function() {
	filterLocations($(this).val(),yelpResults);
}).trigger('input');