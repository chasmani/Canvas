var width = window.innerWidth;
var height = window.innerHeight; 
	
	
var canvas = document.getElementById('canvas_1'); 
var context = canvas.getContext('2d');
			
canvas.width = width;
canvas.height = height;

var windowCenterX = width/2;
var windowCenterY = height/2;

context.strokeStyle="#404040";
context.lineWidth=50;

var circleRadius = Math.min(canvas.height/4,canvas.width/4);

// Draw a big circle in the middle of the screen
function bigCircle() {

	context.beginPath();
	context.arc(windowCenterX,windowCenterY,circleRadius,0,2*Math.PI);
	context.stroke();
}

// Use this function to be able to describe circle arc in cartesian coordinates
function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;

  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}

// Draw a circle half the size of the big circle, with the sides touching
function littleCircle(degree) {

	var pos = polarToCartesian(windowCenterX, windowCenterY, circleRadius/2, degree);
	
	context.beginPath();
	context.arc(pos.x,pos.y,circleRadius/2,0,2*Math.PI);
	context.stroke();

	console.log(degree);
	console.log("Degree is " + degree);

}

// Initialise the first circle on the lef thandside of the big circle
var degree = -90;

// Draw the little circle spinning around the inside of the big circle once
function drawLogo() {

	if (degree < 270) {
		degree = degree + 1;
	}
	
	context.clearRect(0, 0, canvas.width, canvas.height);
	bigCircle();
	littleCircle(degree);



}


setInterval(drawLogo,5);


