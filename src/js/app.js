var map;

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

var filterBox = $('.filter-box');
var menu = $('.filter-menu');
var close = $('.close-button');

filterBox.focus(function() {
	menu.addClass('is-active');
});

close.click(function() {
	menu.removeClass('is-active');
});





