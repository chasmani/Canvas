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

/* Alignment */
var alignmentWeight = 0.02;
var cohesionWeight = 0.02;



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

Vector.prototype.toArray = function() {
  return [this.x, this.y];
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
Vector.prototype.addTo = function(v2, weight) {
	if (weight){
		this.x += v2.x * weight;
	  	this.y += v2.y * weight;
	} else {
		this.x += v2.x;
	  	this.y += v2.y;
	  }
};

// subtract a vector from this one
Vector.prototype.subtractFrom = function(v2) {
	this.x -= v2.x;
  	this.y -= v2.y;
};

// Average over a quantity
Vector.prototype.average = function(quantity) {
	this.x /= quantity;
  	this.y /= quantity;
};

// Normalise to desired magnitude
Vector.prototype.normalise = function(desiredMagnitude) {
	if (this.getMagnitude() !=0){
		normisationFactor = this.getMagnitude()/desiredMagnitude;
		this.x /= normisationFactor;
	  	this.y /= normisationFactor;
	  }
};

// Get distance from this to another vector
Vector.prototype.getDistance = function(v2) {
	return Math.sqrt(Math.pow((this.x-v2.x), 2) + Math.pow((this.y-v2.y), 2))
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

	this.position = new Vector(canvas.width/2, canvas.height/2)
	
	this.velocity = new Vector(0.5-Math.random(), 0.5-Math.random())
	

	this.localBoids = []

	this.move = function() {
		
		this.reynolds();
		
		
		this.position.addTo(this.velocity);
		
		this.wrapSides();
	
	}

	this.wrapSides = function() {
		
		if (this.position.x<-50){
			this.position.x += (canvas.width+50);
		}
		if (this.position.y<-50){
			this.position.y += (canvas.height+50);
		}
		if (this.position.x>(canvas.width+50)){
			this.position.x -= (canvas.width+50);
			
		}
		if (this.position.y>(canvas.height+50)){
			this.position.y -= (canvas.height+50);	
		}
	}

	this.speedLimit = function() {
		// add as function in vector
	}



	this.draw = function() {
		
		context.save();
		
		context.translate(this.position.x, this.position.y);
		
		context.rotate(this.velocity.getDirection());
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
		var cohesion = this.cohesionVector();

		this.velocity.addTo(alignment, alignmentWeight);
		this.velocity.addTo(cohesion, cohesionWeight);
		this.velocity.normalise(1);

	}

	// Set an array of boids within vision range (array of index numbers)
	// To do - add wrapping (maybe)
	this.findLocalBoids = function() {

		this.localBoids = [];
		for (var k=0; k<boids.length; k++){
			var distance = this.position.getDistance(boids[k].position);
			if (distance<boidVisionLength){
				this.localBoids.push(k)
			}
		}

		context.beginPath();
		
		context.arc(this.position.x,this.position.y,boidVisionLength,0,2*Math.PI);
		context.strokeStyle= visionCircleColor;
		context.stroke();
	}

	// Get the alignment force vector
	this.alignmentVector = function() {
		
		alignV = new Vector(0,0);
		
		// Sum alginments of all local boids
		for (var m=0; m<this.localBoids.length; m++){
			alignV.addTo(boids[this.localBoids[m]].velocity)
		}

		// Average alignment
		alignV.average(this.localBoids.length);
		
		// Normalise alignment vector to magnitude 1
		alignV.normalise(1);

		// Draw alignment vector
		context.beginPath();	
		context.moveTo(this.position.x,this.position.y);
		context.lineTo(this.position.x+(boidVisionLength*alignV.x),this.position.y+(boidVisionLength*alignV.y));
		context.strokeStyle = "yellow";
		context.stroke();		

		return alignV;	
	}

	this.cohesionVector = function() {

		cohesionV = new Vector(0,0);

		// Sum positions of all local boids
		for (var l=0; l<this.localBoids.length; l++){
			cohesionV.addTo(boids[this.localBoids[l]].position)
		}

		// Average positions
		cohesionV.average(this.localBoids.length);
				
		// Get relative position
		cohesionV.subtractFrom(this.position);
		
		// Normalise alignment vector to magnitude 1
		cohesionV.normalise(1);
		
		// Draw alignment vector
		context.beginPath();	
		context.moveTo(this.position.x,this.position.y);
		context.lineTo(this.position.x+(boidVisionLength*cohesionV.x),this.position.y+(boidVisionLength*cohesionV.y));
		context.strokeStyle = "green";
		context.stroke();		

		return cohesionV;	

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

