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

var alignmentWeight = 2;
var cohesionWeight = 1;
var seperationWeight = 2;
var maxSepForce  =20;

var maxVelocity = 2;
var maxForce = 0.05;

var showForces = true;

var boids = createBoids()

// Create the initial boids
function createBoids() {
	newBoids = []
	for (i=0; i<100; i++){
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


// Set maximum value
Vector.prototype.max = function(maxMagnitude) {
	currentMagnitude = this.getMagnitude(); 
	if (currentMagnitude > maxMagnitude) {
		this.x /= (currentMagnitude/maxMagnitude);
		this.y /= (currentMagnitude/maxMagnitude);
	}
}


// get opposite vector
Vector.prototype.invert = function() {
	
	if (this.x!=0){
		this.x = -1/this.x;	
	}
	if (this.y!=0){
		this.y = -1/this.y;	
	}
	
	
};

// Get distance from this to another vector
Vector.prototype.getDistance = function(v2) {
	return Math.sqrt(Math.pow((this.x-v2.x), 2) + Math.pow((this.y-v2.y), 2))
};

Vector.prototype.inverseSquareForce = function(v2){

	dx = this.x-v2.x;
	dy = this.y-v2.y;

	distanceSquared = Math.pow((dx), 2) + Math.pow((dy), 2)
	force = Math.min(1/distanceSquared, 1);
	return new Vector(dx*force, dy*force);


}



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
	
	this.velocity = new Vector(maxVelocity*(0.5-Math.random()), maxVelocity*(0.5-Math.random()))
	

	this.localBoids = []

	this.move = function() {
		
		this.calculateVelocity();
		
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
		context.lineTo(-20, 5);
		context.lineTo(-20, -5);
		context.closePath();
		context.fill();
		context.restore();
	}

	// Combine forces acting on boid, apply force to velocity as an acceleration
	this.calculateVelocity = function() {
		
		this.findLocalBoids();
		var alignment = this.alignmentVector();
		var cohesion = this.cohesionVector();
		var seperation = this.seperationVector();

		this.velocity.addTo(alignment, alignmentWeight);
		this.velocity.addTo(cohesion, cohesionWeight);
		this.velocity.addTo(seperation, seperationWeight);
		this.velocity.max(maxVelocity);
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

		if (showForces){
			context.beginPath();
			context.arc(this.position.x,this.position.y,boidVisionLength,0,2*Math.PI);
			context.strokeStyle= visionCircleColor;
			context.stroke();
		}
	}

	// Get the alignment force vector
	this.alignmentVector = function() {
		
		alignV = new Vector(0,0);
		
		// Sum alginments of all local boids
		for (var m=0; m<this.localBoids.length; m++){
			alignV.addTo(boids[this.localBoids[m]].velocity)
		}

		// Limit alignment force
		alignV.max(maxForce);

		if (showForces){
			// Draw alignment vector
			context.beginPath();	
			context.moveTo(this.position.x,this.position.y);
			context.lineTo(this.position.x+((boidVisionLength/maxForce)*alignV.x),this.position.y+((boidVisionLength/maxForce)*alignV.y));
			context.strokeStyle = "yellow";
			context.stroke();		
		}

		return alignV;	
	}

	// Move towards center of mass
	this.cohesionVector = function() {

		cohesionV = new Vector(0,0);

		// Sum positions of all local boids
		for (var l=0; l<this.localBoids.length; l++){
			cohesionV.addTo(boids[this.localBoids[l]].position)
		}

		// Get average position
		cohesionV.average(this.localBoids.length)

		// Get relative position
		cohesionV.subtractFrom(this.position);
		
		// Normalise alignment vector to magnitude 1
		cohesionV.max(maxForce);
		
		if (showForces){
			// Draw alignment vector
			context.beginPath();	
			context.moveTo(this.position.x,this.position.y);
			context.lineTo(this.position.x+((boidVisionLength/maxForce)*cohesionV.x),this.position.y+((boidVisionLength/maxForce)*cohesionV.y));
			context.strokeStyle = "green";
			context.stroke();
			}		

		return cohesionV;	

	}


	// Need to replace this iwth an inverse square type law
	this.seperationVector = function() {

		sepV = new Vector(0,0);

		// Sum distance from current boid of all local neighbours
		for (var n=0; n<this.localBoids.length; n++){

			sepV.addTo(this.position.inverseSquareForce(boids[this.localBoids[n]].position))
		}
		
		sepV.max(maxForce);

		if (showForces){
			// Draw seperation vector
			context.beginPath();	
			context.moveTo(this.position.x,this.position.y);
			//context.lineTo(this.position.x+((boidVisionLength/maxForce)*cohesionV.x),this.position.y+((boidVisionLength/maxForce)*cohesionV.y));
			context.strokeStyle = "red";
			context.stroke();		
		}

		return sepV;		

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


var toggleShowForcesButton = document.createElement("button");
toggleShowForcesButton.innerHTML = "Toggle Show Forces";
toggleShowForcesButton.className += "btn btn-default"

var buttonContainer = document.getElementById("canvas-buttons");
buttonContainer.appendChild(toggleShowForcesButton);

toggleShowForcesButton.addEventListener ("click", function() {
	if(showForces){
		showForces = false;
	} else {
		showForces = true;
	}
});
