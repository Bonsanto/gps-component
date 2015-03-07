var GpsProto = Object.create(HTMLDivElement.prototype);

GpsProto.createdCallback = function () {
	var shadow = this.createShadowRoot();
	var map = document.createElement("img");

	if (geoAvailable()) {
		navigator.geolocation.getCurrentPosition(function (position) {
			var lati = position.coords.latitude;
			var long = position.coords.longitude;
			var acc = position.coords.accuracy;
			var mark = "&markers=color:blue%7Clabel:S%7C" + lati + "," + long;

			map.src = "http://maps.googleapis.com/maps/api/staticmap?center=" +
			mark + "&zoom=" + lati + "," + "12&size=400x400&sensor=false&markers=" + long;

			shadow.appendChild(map);
		}, function (error) {
			alert(error);
		}, {
			enableHighAccuracy: true,
			timeout: 5000,
			maximumAge: 60000
		});
	}
};

Object.defineProperties(GpsProto, {
	"hidden": {
		get: function () {
			return this.style.visibility === "hidden";
		},
		set: function (value) {
			value ? this.hide() : this.show();
		}
	}
});

GpsProto.hide = function () {
	this.style.visibility = "hidden";
};

GpsProto.show = function () {
	this.style.visibility = "visible";
};

var geoAvailable = function () {
	return navigator.geolocation !== undefined;
};

GPS = document.registerElement('x-map', {
	prototype: GpsProto
});