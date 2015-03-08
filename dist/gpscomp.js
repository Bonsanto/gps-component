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
			map.setAttribute("draggable", "false");
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

//Async method a callback must be used
GpsProto.getCoordinates = function (callback) {
	;
};


GpsProto.setDimension = function () {
	;
};

//set new location to show in the map
GpsProto.setLocation = function (latitude, longitude) {
	const MAX_LATITUDE = 90.00,
			MAX_LONGITUDE = 180.00;

	if (latitude < -MAX_LATITUDE || latitude > MAX_LATITUDE || longitude < -MAX_LONGITUDE || longitude > MAX_LONGITUDE) {
		throw new RangeError("Latitude must be between <-90º and 90º> and longitude between <-180º 180º>", "gpscomp.js", "60"/*todo*/);
	} else {
		var mark = "&markers=color:blue%7Clabel:S%7C" + latitude + "," + longitude;

		this.shadowRoot.querySelector("img").src = "http://maps.googleapis.com/maps/api/staticmap?center=" +
		mark + "&zoom=" + latitude + "," + "12&size=400x400&sensor=false&markers=" + longitude;
	}
};

var geoAvailable = function () {
	return navigator.geolocation !== undefined;
};

GPS = document.registerElement('x-map', {
	prototype: GpsProto
});