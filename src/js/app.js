var map;


var randomString = function(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for(var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

/*Yelp API oauth values*/
var oauth_consumer_key = '&oauth_consumer_key=';
var oauth_consumer_keyVal = 'o7io1ZSwVn_Gcxj4MqsgkQ';
var oauth_token = '&oauth_token=';
var oauth_tokenVal = '3Rka9DQ66lV8bxGac4DSEcgt6Ze95TfM';
var oauth_signature_method = '&oauth_signature_method=';
var oauth_signature_methodVal = 'hmac-sha1';
var oauth_signature = '&oauth_signature='
var oauth_signatureVal = 'oZstoMIkks8R3kXJGM5uFzDipas';
var oauth_timestamp = '&oauth_timestamp=';
var oauth_nonce = '&oauth_nonce=';

/*Yelp search URL values*/
var baseURL = 'https://api.yelp.com/v2/search?';
var term = 'term=';
var location = '&location=';
var category = '&category_filter=';


function initMap() {
	var latLng = {lat: 41.994654, lng: -73.875959};
	var markerArray = [];

	map = new google.maps.Map(document.getElementById('map'), {
		center: latLng,
		zoom: 15
	});

	google.maps.event.addDomListener(window,'load',addMarker({lat: 41.994654, lng: -73.875959},map,'Red Hook, NY'));

}

function addMarker(latLng,map,name) {

	var marker = new google.maps.Marker({
		position: latLng,
		map: map,
		animation: google.maps.Animation.DROP,
		title: name
	});
}

function searhYelp(termVal,locationVal,categoryVal) {
	var searchURL = baseURL + term + termVal + location + locationVal + category + categoryVal + \
	oauth_consumer_key + oauth_consumer_keyVal + oauth_token + oauth_tokenVal + oauth_signature_method + oauth_signature_methodVal + \
    oauth_signature + oauth_signatureVal + oauth_timestamp + (new Date).getTime() * 1000 + oauth_nonce + randomString(10);
}

var filterBox = $('.filter-box');
var menu = $('.filter-menu');
var close = $('.close-button');

filterBox.focus(function() {
	menu.addClass('is-active');
});

close.click(function() {
	menu.removeClass('is-active');
});