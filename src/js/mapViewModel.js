function mapViewModel() {

	var self = this;

	self.myMap = ko.observable({
		lat: ko.observable(41.994654),
		lng: ko.observable(-73.875959)
	});
}