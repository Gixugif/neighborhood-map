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
var oauth_consumer_key = 'o7io1ZSwVn_Gcxj4MqsgkQ';
var oauth_token = '3Rka9DQ66lV8bxGac4DSEcgt6Ze95TfM';
var oauth_signature_method = 'hmac-sha1';
var oauth_signature = 'oZstoMIkks8R3kXJGM5uFzDipas';
var oauth_timestamp;
var oauth_nonce;


/*Yelp API search values*/
var baseURL = 'https://api.yelp.com/v2/search?'


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

function yelpSearch(term,location,category_filter) {
	var searchURL = baseURL + 'term=' + term + '&location=' + location + '&category_filter=' \
	+ '&oauth_consumer_key=' + oauth_consumer_key + '&oauth_token=' + oauth_token + '&oauth_signature_method=' \
	+ oauth_signature_method + '&oauth_timestamp=' + (new Date).getTime() * 1000 + '&oauth_nonce=' + randomString(10);

	var oReq = new XMLHttpRequest();
	oReq.open('get',searchURL,true);
	oReq.send();

	return oReq;
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