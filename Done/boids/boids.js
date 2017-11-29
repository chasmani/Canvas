/* Grab canvas and context */
var canvas = document.getElementById('my-canvas');
var context = canvas.getContext('2d');

canvas.height = canvas.offsetHeight;
canvas.width = canvas.offsetWidth;

/* Colour scheme */
canvas.style.backgroundColor = "#6BB9F0";
var boidColor = "#27AE60";
var boidOutline = "#ECF0F1";
var visionCircleColor = "#C5EFF7";
var alignColor = "#C5EFF7";
var sepColor = "yellow";
var cohColor = "pink";

/* Parameters */
var boidVisionLength = 50; 
var alignmentWeight = 2;
var cohesionWeight = 1;
var seperationWeight = 2;
var maxSepForce  =20;
var maxVelocity = 2;
var maxForce = 0.05;

var showForces = false;

// Create boids
var boidCount = Math.floor(canvas.width/15);
var boids = createBoids()

function createBoids() {
	newBoids = []
	for (i=0; i<boidCount; i++){
		newBoid = new Boid();
		newBoids.push(newBoid);
	}
	return newBoids
}

// This constructor is used to create position and velocity vectors
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

// Get distance from this to another vector
Vector.prototype.getDistance = function(v2) {
	return Math.sqrt(Math.pow((this.x-v2.x), 2) + Math.pow((this.y-v2.y), 2))
};

// Get te inverse square force of two position vectors
Vector.prototype.inverseSquareForce = function(v2){
	dx = this.x-v2.x;
	dy = this.y-v2.y;
	distanceSquared = Math.pow((dx), 2) + Math.pow((dy), 2)
	force = Math.min(1/distanceSquared, 1);
	return new Vector(dx*force, dy*force);
}

function Boid(x,y) {

	// If an x and y position are given, set initial position, otherwise in the middle of the canvas
	if((x)&&(y)){
		this.position = new Vector(x, y)	
	} else {
		this.position = new Vector(canvas.width/2, canvas.height/2)	
	}
	
	this.velocity = new Vector(maxVelocity*(0.5-Math.random()), maxVelocity*(0.5-Math.random()))
	
	// Keep track of the boid's neighbours
	this.localBoids = []

	// Each time step, calcualte the new velocity, change the position and wrap around sides
	this.move = function() {	
		this.calculateVelocity();
		this.position.addTo(this.velocity);
		this.wrapSides();
	}

	// Wrap boids as they go off the screen
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

	// Draw the boid itself
	this.draw = function() {
		context.save();
		context.translate(this.position.x, this.position.y);
		context.rotate(this.velocity.getDirection());
		context.strokeStyle = boidOutline;
		context.fillStyle = boidColor;
		context.beginPath();
		context.moveTo(0, 0);
		context.lineTo(-20, 5);
		context.lineTo(-20, -5);
		context.closePath();
		context.fill();
		context.stroke();
		context.restore();
	}

	// Combine forces acting on boid, apply force to velocity as an acceleration
	this.calculateVelocity = function() {		
		// get a list of indices of neighouring boids (speeds up calculations later)
		this.findLocalBoids();
		// Calculate forece vectors
		var alignment = this.alignmentVector();
		var cohesion = this.cohesionVector();
		var seperation = this.seperationVector();
		// Apply force vectors to velocity as accelerations
		this.velocity.addTo(alignment, alignmentWeight);
		this.velocity.addTo(cohesion, cohesionWeight);
		this.velocity.addTo(seperation, seperationWeight);
		this.velocity.max(maxVelocity);
	}

	// Set an array of boids within vision range (array of index numbers)
	// It doesn't consider boids wrapped on the other side of the screen 
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
	// Equal to the sum of all neighbouring boid's alignment vectors
	this.alignmentVector = function() {
		
		alignV = new Vector(0,0);
		
		// Sum alignments of all local boids
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
			context.strokeStyle = alignColor;
			context.stroke();		
		}

		return alignV;	
	}

	// Cohesion force vector points towards center of mass of neighbouring boids
	this.cohesionVector = function() {

		cohesionV = new Vector(0,0);

		// Sum positions of all local boids
		for (var l=0; l<this.localBoids.length; l++){
			cohesionV.addTo(boids[this.localBoids[l]].position)
		}

		// Get average position - necessary because these are absolute poisiotns at this point
		cohesionV.average(this.localBoids.length)

		// Covert to a relative position
		cohesionV.subtractFrom(this.position);
		
		// Limit the magnitude of the force
		cohesionV.max(maxForce);
		
		if (showForces){
			// Draw alignment vector
			context.beginPath();	
			context.moveTo(this.position.x,this.position.y);
			context.lineTo(this.position.x+((boidVisionLength/maxForce)*cohesionV.x),this.position.y+((boidVisionLength/maxForce)*cohesionV.y));
			context.strokeStyle = cohColor;
			context.stroke();
			}		

		return cohesionV;	
	}

	// Seperation force is repulsive and follows an inverse square law 
	this.seperationVector = function() {

		sepV = new Vector(0,0);

		// Sum repulsive forces of all neighbouring boids
		for (var n=0; n<this.localBoids.length; n++){
			sepV.addTo(this.position.inverseSquareForce(boids[this.localBoids[n]].position))
		}
		
		// Limit size of seperation force
		sepV.max(maxForce);

		if (showForces){
			// Draw seperation vector
			context.beginPath();	
			context.moveTo(this.position.x,this.position.y);
			context.strokeStyle = sepColor;
			context.stroke();		
		}

		return sepV;		
	}
}

// Main draw function called once per frame
function draw() {
	context.clearRect(0,0,canvas.width,canvas.height);
	// Move the boids following rules and then draw
	for (var j=0; j<boids.length; j++){
		boids[j].move();
		boids[j].draw();
	}
	// Keep looping
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

// Add a button to toggle showing forces on the boids
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

// Add new boids if the suer clicks the screen
document.addEventListener("click", function(event){
	var canvasRect = canvas.getBoundingClientRect();    
	cursor_x = event.clientX - canvasRect.left;
	cursor_y = event.clientY - canvasRect.top;
	if ((cursor_x>0)&&(cursor_x<canvas.width)&&(cursor_y>0)&&(cursor_y<canvas.height)){
		newBoid = new Boid(cursor_x, cursor_y);
		boids.push(newBoid);
	}
});

	