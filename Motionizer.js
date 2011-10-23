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
	 * @var _hasMotion				{Boolean} - Whether we can access device motion data
	 * @var _element					{Element} - The DOM element to be animated
	 * @var _motionAcceleration	{Event} - Last fired DeviceMotion event
	 * @var _lastVals.x				{Number} - Last calculated value of X
	 * @var _lastVals.y				{Number} - Last calculated value of Y
	 * @var _lastVals.z				{Number} - Last calculated value of Z
	 * @var _smoothing				{Number} - Smoothing value.
	 */
	var _hasMotion = !!window.DeviceMotionEvent;
	var _element;
	var _motionAcceleration = {};
	var _lastX = 0;
	var _lastY = 0;
	var _lastZ = 0;
	var _smoothing = sensitivity || 0.22;
	
	
	
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
			_motionAcceleration = ev.accelerationIncludingGravity;
		}, false);
		
		_animate();
	}
	
	
	
	/** 
	 * @private
	 * @returns {Number} Smoothed value of X
	 */
	var _getAccelX = function() {
		_lastX = _smooth(_motionAcceleration.x || 0, _lastX);
		return _lastX.toFixed(2);
	}
	
	/** 
	 * @private
	 * @returns {Number} Smoothed value of Y
	 */
	var _getAccelY = function() {
		_lastY = _smooth(_motionAcceleration.y || 0, _lastY);
		return _lastY.toFixed(2);
	}
	
	/** 
	 * @private
	 * @returns {Number} Smoothed value of Z
	 */
	var _getAccelZ = function() {
		_lastZ = _smooth(_motionAcceleration.z || 0, _lastZ);
		return _lastZ.toFixed(2);
	}
	
	/** 
	 * @private
	 * @description High pass smoothing filter
	 * @param {Number} newVal The current value
	 * @param {Number} oldVal The last recorded value
	 * @returns {Number} Smoothed value
	 */
	var _smooth = function(newVal, oldVal) {
		return (newVal * _smoothing) + (oldVal * (1.0 - _smoothing));
	}
	
	/** 
	 * @private
	 * @param {Number} accel Value of X
	 * @param {Number} z Value of Z
	 * @returns {Number} Value of X in degrees
	 */
	var  _getXDeg = function(accel, z) {
		return -(accel * 9);
	}
	/** 
	 * @private
	 * @param {Number} accel Value of Y
	 * @param {Number} z Value of Z
	 * @returns {Number} Value of Y in degrees
	 */
	var _getYDeg = function(accel, z) {
		var val = accel * 9;
		if (z > 0) {
			val = (180 - val);
		}
		return -val;
	}
	
	/** 
	 * @private
	 */
	var _animate = function() {
		requestAnimFrame(_animate);
		
		var z = _getAccelZ();
		
		var xDeg = _getXDeg(_getAccelX(), z);
		var yDeg = _getYDeg(_getAccelY(), z);
		
		var style = "rotateX(" + yDeg + "deg) rotateY(" + xDeg + "deg)";

		_element.style.webkitTransform = style;
		_element.style.mozTransform = style;
		_element.style.transform = style;
	};
	
	
	_init();
};