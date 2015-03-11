var GpsProto = Object.create(HTMLDivElement.prototype);

Object.defineProperties(GpsProto, {
	"hidden": {
		get: function () {
			return this.style.visibility === "hidden";
		},
		set: function (value) {
			value ? this.hide() : this.show();
		}
	},
	"width": {
		get: function () {
			return this.w;
		},
		set: function (value) {
			this.w = value;
			this.draw();
		}
	},
	"height": {
		get: function () {
			return this.h;
		},
		set: function (value) {
			this.h = value;
			this.draw();
		}
	},
	"coordinates": {
		get: function () {
			return [this.latitude, this.longitude];
		},
		set: function (coords) {
			this.latitude = coords[0];
			this.longitude = coords[1];
		}
	},
	"latitude": {
		get: function () {
			return this.lat;
		},
		set: function (latitude) {
			this.lat = latitude;
		}
	},
	"longitude": {
		get: function () {
			return this.lon;
		},
		set: function (longitude) {
			this.lon = longitude;
		}
	},
	"watch": {
		enumerable: false,
		configurable: true,
		writable: false,
		value: function (prop, handler) {
			var oldVal = this[prop],
				newVal = oldVal,
				getter = function () {
					return newVal;
				},
				setter = function (val) {
					oldVal = newVal;
					return newVal = handler.call(this, prop, oldVal, val);
				};
			if (delete this[prop]) { // can't watch constants
				Object.defineProperty(this, prop, {
					get: getter,
					set: setter,
					enumerable: true,
					configurable: true
				});
			}
		}
	},
	"unwatch": {
		enumerable: false,
		configurable: true,
		writable: false,
		value: function (prop) {
			var val = this[prop];
			delete this[prop]; // remove accessor
			this[prop] = val;
		}
	}
});

GpsProto.createdCallback = function () {
	var shadow = this.createShadowRoot();
	var map = document.createElement("img");
	var _this = this;

	if (geoAvailable()) {
		navigator.geolocation.getCurrentPosition(function (position) {
			_this.latitude = position.coords.latitude;
			_this.longitude = position.coords.longitude;
			_this.accuracy = position.coords.accuracy;
			_this.w = parseInt(_this.style.width);
			_this.h = parseInt(_this.style.height);
			map.setAttribute("draggable", "false");
			shadow.appendChild(map);
			_this.draw();
		}, function (error) {
			alert(error);
		}, {
			enableHighAccuracy: true,
			timeout: 5000,
			maximumAge: 60000
		});
	}
};

GpsProto.hide = function () {
	this.style.visibility = "hidden";
};

GpsProto.show = function () {
	this.style.visibility = "visible";
};

//Async method a callback must be used
GpsProto.getCoordinates = function (callback) {
	return [this.latitude, this.longitude];
};


GpsProto.setDimension = function () {
	;
};

//set new location to show in the map
GpsProto.setLocation = function (latitude, longitude) {
	const MAX_LATITUDE = 90.00,
		MAX_LONGITUDE = 180.00;

	this.latitude = parseFloat(latitude);
	this.longitude = parseFloat(longitude);
	if (this.latitude < -MAX_LATITUDE || this.latitude > MAX_LATITUDE || this.longitude < -MAX_LONGITUDE || this.longitude > MAX_LONGITUDE) {
		throw new RangeError("Latitude must be between <-90º and 90º> and longitude between <-180º 180º>", "gpscomp.js", "60"/*todo*/);
	} else {
		this.draw();
	}
};

GpsProto.draw = function () {
	var mark = "&markers=color:blue%7Clabel:S%7C" + this.latitude + "," + this.longitude;

	this.shadowRoot.querySelector("img").src = "http://maps.googleapis.com/maps/api/staticmap?center=" +
	mark + "&zoom=" + this.latitude + "," + "12&size=" + this.w + "x" + this.h + "&sensor=false&markers=" + this.longitude;
};

var geoAvailable = function () {
	return navigator.geolocation !== undefined;
};

GPS = document.registerElement('x-map', {
	prototype: GpsProto
});