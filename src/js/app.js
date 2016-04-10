ko.bindingHandlers.map = {

	init: function(element,valueAccessor,allValuesAccessor,viewModel) {
		var mapObj = ko.utils.unwrapObservable(valueAccessor());
		var latLng = new google.map.LatLng(
			ko.utils.unwrapObservable(mapObj.lat),
			ko.utils.unwrapObservable(mapObj.lng));
		var mapOptions = { center: latLng,
							zoom: 10,
							mapTypeId: google.maps.mapTypeId.ROADMAP};

		mapObj.googleMap = new google.maps.Map(element, mapOptions);

	}
};

/*function MapViewModel() {
	var self = this;

	self.lat = data.Lat;
	self.lng = data.lng;

	var map;

	function initMap() {
	  map = new google.maps.Map(document.getElementById('map'), {
	    center: {lat: 41.994654, lng: -73.875959},
	    zoom: 15
	  });
	}
}*/

ko.applyBindings(new mapViewModel());