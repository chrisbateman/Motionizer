#Motionizer

Motionizer moves rotates an element in 3d space (using CSS3 transforms), based on device motion. As far as I know, right now this only works on iOS 4.2+.

## Usage

Include the script on your page and simply call the Motionizer function, passing in the element to apply the effect to. An optional second parameter (a boolean) controls whether the element should rotate around the z-axis.

	Motionizer("elementId");
	// or
	Motionizer("elementId", false);
	// or
	Motionizer(document.getElementById("elementId"));

Remember that if you want a perspective effect to be applied to the element, you need to add a [perspective style](https://developer.mozilla.org/en/CSS/perspective) to a parent element. You can see a simple demo [here](http://cbateman.com/demos/accelerometer/motionizer.htm).
