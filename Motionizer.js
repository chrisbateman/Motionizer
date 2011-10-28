/**
 * @class Motionizer
 * @param {String|Element} elem The Id of the element to manipulate, or a reference to the element.
 * @param {Boolean} [rotateZ] Whether to rotate the element around the Z-axis. Default is true.
 */
var Motionizer = function(elem, rotateZ) {
	
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
	 * @var _hasDeviceOrientation	{Boolean} - Whether we can access device motion data
	 * @var _element						{Element} - The DOM element to be animated
	 * @var _windowOrientation		{Number} - Device orientation [0, 90, 180, -90]
	 */
	var _hasDeviceOrientation = !!window.DeviceOrientationEvent;
	var _element;
	var _rotateZ = (typeof rotateZ == "undefined") ? true : rotateZ;
	var _windowOrientation = 0;
	
	
	/**
	 * @constructs
	 * @private
	 */
	var _init = function() {
		if (!_hasDeviceOrientation) {
			return;
		}
		
		if (typeof elem == "object") {
			_element = elem;
		} else {
			_element = document.getElementById(elem);
		}
		
		window.addEventListener("deviceorientation", function(ev) {
			_orientationHelper.ev = ev;
		}, false);
		
		window.addEventListener("orientationchange", function(ev) {
			_windowOrientation = window.orientation;
		}, false);
		
		_windowOrientation = window.orientation;
		
		_animate();
	}
	
	
	
	/**
	 * @class
	 * @private
	 */
	var _orientationHelper = {
		/**
		 * @var ev	{Event} - Last fired DeviceOrientation event
		 */
		ev: {},
		
		/**
		 * @returns {Number} Value of X
		 */
		getX: function() {
			return _orientationHelper.ev.gamma || 0;
		},
		
		/**
		 * @returns {Number} Value of Y
		 */
		getY: function() {
			return _orientationHelper.ev.beta || 0;
		},
		
		/**
		 * @returns {Number} Value of Z
		 */
		getOrientZ: function() {
			return _orientationHelper.ev.alpha || 0;
		},
		
		
		/**
		 * @returns {Number} Value of X in degrees, corrected for device orientation.
		 */
		getXDeg: function() {
			switch (_windowOrientation) {
				case 90:
					return -_orientationHelper.getX();
					break;
				case 0:
					return _orientationHelper.getY();
					break;
				case -90:
					return _orientationHelper.getX();
					break;
				case 180:
					return _orientationHelper.getY();
					break;
			}
		},
		
		/**
		 * @returns {Number} Value of Y in degrees, corrected for device orientation.
		 */
		getYDeg: function() {
			switch (_windowOrientation) {
				case 90:
					return -_orientationHelper.getY();
					break;
				case 0:
					return -_orientationHelper.getX();
					break;
				case -90:
					return _orientationHelper.getY();
					break;
				case 180:
					return _orientationHelper.getX();
					break;
			}
		},
		
		/**
		 * @returns {Number} Value of Z in degrees, corrected for device orientation.
		 */
		getZDeg: function() {
			return _orientationHelper.getOrientZ();
		}
	};
	
	
	
	
	/** 
	 * @private
	 */
	var _animate = function() {
		requestAnimFrame(_animate);
		
		var style = "rotateX(" + _orientationHelper.getXDeg() + "deg) rotateY(" + _orientationHelper.getYDeg() + "deg)";
		if (_rotateZ) {
			style += "rotateZ(" + _orientationHelper.getZDeg() + "deg)";
		}
		
		_element.style.webkitTransform = style;
		_element.style.mozTransform = style;
		_element.style.transform = style;
	};
	
	
	_init();
};