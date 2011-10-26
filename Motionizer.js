/**
 * @fileOverview Rotates an element in 3d space relative to device motion
 * @author Chris Bateman
 * @version 1.0
 */


/**
 * @class Motionizer
 * @param {String|Element} elem The Id of the element to manipulate, or a reference to the element.
 * @param {Number} [sensitivity] Constant for smoothing motion values. (0.0 < n <= 1.0) Default is 0.22.
 */
var Motionizer = function(elem, sensitivity) {
	
	/**
	 * @function
	 * @author Paul Irish
	 * @see http://paulirish.com/2011/requestanimationframe-for-smart-animating/
	 */
	window.requestAnimFrame = (function() {
		return window.requestAnimationFrame || 
			window.webkitRequestAnimationFrame || 
			window.mozRequestAnimationFrame || 
			window.oRequestAnimationFrame || 
			window.msRequestAnimationFrame || 
			function(callback, element){
				window.setTimeout(callback, 1000 / 60);
			};
	})();
	
	
	/**
	 * Class variables
	 * @private
	 * @var _hasMotion		{Boolean} - Whether we can access device motion data
	 * @var _element			{Element} - The DOM element to be animated
	 * @var _smoothing		{Number} - Smoothing value.
	 * @var _orientation		{Number} - Device orientation [0, 90, 180, -90]
	 */
	var _hasMotion = !!window.DeviceMotionEvent;
	var _element;
	var _smoothing = sensitivity || 0.2;
	var _orientation = 0;
	
	
	/**
	 * @constructs
	 * @private
	 */
	var _init = function() {
		if (!_hasMotion) {
			return;
		}
		
		if (typeof elem == "object") {
			_element = elem;
		} else {
			_element = document.getElementById(elem);
		}
		
		window.addEventListener("devicemotion", function(ev) {
			_acceleration.ev = ev.accelerationIncludingGravity;
		}, false);
		
		window.addEventListener("orientationchange", function(ev) {
			_orientation = window.orientation;
		}, false);
		
		_orientation = window.orientation;
		
		_animate();
	}
	
	
	
	/**
	 * @class
	 * @private
	 */
	var _acceleration = {
		ev: {},
		lastX: 0,
		lastY: 0,
		lastZ: -0,
		
		/** 
		 * @private
		 * @returns {Number} Smoothed value of X
		 */
		getAccelX: function() {
			_acceleration.lastX = _acceleration.smooth(_acceleration.ev.x || 0, _acceleration.lastX);
			return _acceleration.lastX;
		},
		
		/** 
		 * @private
		 * @returns {Number} Smoothed value of Y
		 */
		getAccelY: function() {
			_acceleration.lastY = _acceleration.smooth(_acceleration.ev.y || 0, _acceleration.lastY);
			return _acceleration.lastY;
		},
		
		/** 
		 * @private
		 * @returns {Number} Smoothed value of Z
		 */
		getAccelZ: function() {
			_acceleration.lastZ = _acceleration.smooth(_acceleration.ev.z || -0, _acceleration.lastZ);
			return _acceleration.lastZ;
		},
		
		/** 
		 * @private
		 * @description High pass smoothing filter
		 * @param {Number} newVal The current value
		 * @param {Number} oldVal The last recorded value
		 * @returns {Number} Smoothed value
		 */
		smooth: function(newVal, oldVal) {
			return (newVal * _smoothing) + (oldVal * (1.0 - _smoothing));
		},
		
		/** 
		 * @private
		 * @returns {Number} Value of X in degrees
		 */
		convertXDeg: function() {
			return _acceleration.lastX * 9;
		},
		
		/** 
		 * @private
		 * @returns {Number} Value of Y in degrees
		 */
		convertYDeg: function() {
			var val = _acceleration.lastY * 9;
			if (_acceleration.lastZ > 0) {
				val = (180 - val);
			}
			return val;
		},
		
		/** 
		 * @private
		 * @returns {Number} Value of X in degrees, corrected for device orientation.
		 */
		getXDeg: function() {
			switch (_orientation) {
				case 90:
					return -_acceleration.convertXDeg();
					break;
				case 0:
					return -_acceleration.convertYDeg();
					break;
				case -90:
					return _acceleration.convertXDeg();
					break;
				case 180:
					return _acceleration.convertYDeg();
					break;
			}
		},
		
		/** 
		 * @private
		 * @returns {Number} Value of Y in degrees, corrected for device orientation.
		 */
		getYDeg: function() {
			switch (_orientation) {
				case 90:
					return _acceleration.convertYDeg();
					break;
				case 0:
					return -_acceleration.convertXDeg();
					break;
				case -90:
					return -_acceleration.convertYDeg();
					break;
				case 180:
					return _acceleration.convertXDeg();
					break;
			}
		}
	};
	
	
	
	/** 
	 * @private
	 */
	var _animate = function() {
		requestAnimFrame(_animate);
		
		var x = _acceleration.getAccelX();
		var y = _acceleration.getAccelY();
		var z = _acceleration.getAccelZ();
		
		var xDeg = _acceleration.getXDeg();
		var yDeg = _acceleration.getYDeg();
		
		var style = "rotateX(" + xDeg + "deg) rotateY(" + yDeg + "deg)";
		_element.style.webkitTransform = style;
		_element.style.mozTransform = style;
		_element.style.transform = style;
	};
	
	
	
	_init();
};