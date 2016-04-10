var self = this;

var map;

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 41.994654, lng: -73.875959},
		zoom: 15
	});
}