/* Grab canvas and context */
var canvas = document.getElementById('my-canvas');
var context = canvas.getContext('2d');

canvas.height = canvas.offsetHeight;
canvas.width = canvas.offsetWidth;

/* Colour scheme */
canvas.style.backgroundColor = "#44BBFF";

/* Parameters */
var boidColor = "#112233";

var boidVisionLength = 50; 
var visionCircleColor = "#fff";


var boids = createBoids()

// Create the initial boids
function createBoids() {
	newBoids = []
	for (i=0; i<20; i++){
		newBoid = new Boid();
		newBoids.push(newBoid);
	}
	return newBoids
}

function Vector(x, y) {
  this.x = x;
  this.y = y;
};

// return the angle of the vector in radians
Vector.prototype.getDirection = function() {
	return Math.atan2(this.y, this.x);
};

// get the magnitude of the vector
Vector.prototype.getMagnitude = function() {
	// use pythagoras theorem to work out the magnitude of the vector
	return Math.sqrt(this.x * this.x + this.y * this.y);
};



// add a vector to this one
Vector.prototype.addTo = function(v2) {
	this.x += v2.x;
  	this.y += v2.y;
};

// Average over a quantity
Vector.prototype.average = function(quantity) {
	this.x /= quantity;
  	this.y /= quantity;
};

// Normalise to desired magnitude
Vector.prototype.normalise = function(desiredMagnitude) {
	normisationFactor = this.getMagnitude()/desiredMagnitude;
	this.x /= normisationFactor;
  	this.y /= normisationFactor;
};




// 1. Alignement
// Add alignment of all nearby boids
// Divide by neighbour count (get vaerage velocity)
// Scaling factor i.e. normalise
// https://gamedevelopment.tutsplus.com/tutorials/3-simple-rules-of-flocking-behaviors-alignment-cohesion-and-separation--gamedev-3444
// EASIER IN CARTESIAN

// 2. Cohesion
// Add position of all nearbby boids 
// Divide by neighbour count (get average position)
// Put it in relation to this boid (x-x0) etc
// Normalise it to 1
// EASIER IN CARTESIAN

// Seperation



function Boid() {

	this.x = canvas.width/2;
	this.y = canvas.height/2;

	this.vel = new Vector(0.5-Math.random(), 0.5-Math.random());

	this.localBoids = []

	this.move = function() {
		this.reynolds();

		this.x += this.vel.x;
		this.y += this.vel.y;
		
		this.wrapSides();
		
	}

	this.wrapSides = function() {
		
		if (this.x<-50){
			this.x += (canvas.width+50);
		}
		if (this.y<-50){
			this.y += (canvas.height+50);
		}
		if (this.x>(canvas.width+50)){
			this.x -= (canvas.width+50);
			
		}
		if (this.y>(canvas.height+50)){
			this.y -= (canvas.height+50);	
		}
	}

	this.speedLimit = function() {
		// add as function in vector
	}



	this.draw = function() {
		context.save();
		context.translate(this.x, this.y);
		
		context.rotate(this.vel.getDirection());
		context.beginPath();
		context.moveTo(0, 0);
		context.lineTo(-50, 10);
		context.lineTo(-50, -10);
		context.closePath();
		context.fill();
		context.restore();
	}

	// Combine forces acting on boid, apply force to velocity as an acceleration
	this.reynolds = function() {
		
		this.findLocalBoids();
		var alignment = this.alignmentVector();

		this.speedLimit();

	}

	// Set an array of boids within vision range (array of index numbers)
	this.findLocalBoids = function() {

		this.localBoids = [];
		for (var k=0; k<boids.length; k++){
			var distance = Math.sqrt(Math.pow((this.x-boids[k].x), 2) + Math.pow((this.y-boids[k].y), 2))
			if (distance<boidVisionLength){
				this.localBoids.push(k)
			}
		}

		context.beginPath();
		context.arc(this.x,this.y,boidVisionLength,0,2*Math.PI);
		context.strokeStyle= visionCircleColor;
		context.stroke();
	}

	// get the average of local boids velocities
	// Adds to velocity in a cartesian way, rather than rotating. So boids will want to speed up if they are in a flock moving in
	// the same direction
	this.alignmentVector = function() {
		
		alignV = new Vector(0,0);
		
		for (var k=0; k<this.localBoids.length; k++){
			alignV.addTo(boids[this.localBoids[k]].vel)
		}

		alignV.average(this.localBoids.length);
		alignV.normalise(1);



		// Draw it
		context.beginPath();	
		context.moveTo(this.x,this.y);
		context.lineTo(this.x+(boidVisionLength*alignV.x),this.y+(boidVisionLength*	alignV.y));
		context.strokeStyle = "yellow";
		context.stroke();	
		
		

		
	}


}


function draw() {
	context.clearRect(0,0,canvas.width,canvas.height);
	for (var j=0; j<boids.length; j++){
		boids[j].move();
		boids[j].draw();
	}
  requestAnimationFrame(draw);
}

draw();

/* Resize canvas function */
function resizeCanvas() {
	canvas.height = canvas.offsetHeight;
	canvas.width = canvas.offsetWidth;
}


var canvasSection = document.getElementById("article-canvas");

/* Full screen buttons */
document.getElementById("fullscreen-button").addEventListener("click", function() {
	canvasSection.className += " full-screen-canvas";
	resizeCanvas();
	document.body.style.overflow="hidden";
});

document.getElementById("leave-fullscreen-button").addEventListener("click", function() {	
	canvasSection.classList.remove("full-screen-canvas");
	resizeCanvas();
	document.body.style.overflow="scroll";
});


window.addEventListener("resize", resizeCanvas);

