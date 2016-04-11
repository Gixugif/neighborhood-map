var map;

function initMap() {
	var latLng = {lat: 41.994654, lng: -73.875959}

	map = new google.maps.Map(document.getElementById('map'), {
		center: latLng,
		zoom: 15
	});

	var marker = new google.maps.Marker({
		position: latLng,
		map: map,
		title: 'Red Hook, NY'
	})
}


