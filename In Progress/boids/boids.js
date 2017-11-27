/* Grab canvas and context */
var canvas = document.getElementById('my-canvas');
var context = canvas.getContext('2d');

canvas.height = canvas.offsetHeight;
canvas.width = canvas.offsetWidth;

/* Colour scheme */
canvas.style.backgroundColor = "#44BBFF";
context.fillStyle = "#112233";

/* Parameters */
var boidVisionLength = 50; 



var boids = createBoids()

// Create the initial boids
function createBoids() {
	newBoids = []
	for (i=0; i<10; i++){
		newBoid = new Boid();
		newBoids.push(newBoid);
	}
	return newBoids
}

function Boid() {

	this.x = canvas.width/2;
	this.y = canvas.height/2;

	this.velX = 0.5-Math.random();
	this.velY = 0.5-Math.random();

	this.localBoids = []

	this.move = function() {
		this.reynolds();

		this.x += this.velX;
		this.y += this.velY;
		//console.log(this.x, this.y);
		this.wrapSides();
		this.speedLimit();
	}

	this.wrapSides = function() {
		
		if (this.x<0){
			this.x += canvas.width;
		}
		if (this.y<0){
			this.y += canvas.height;
		}
		if (this.x>(canvas.width+50)){
			this.x -= (canvas.width+50);
			
		}
		if (this.y>(canvas.height+50)){
			this.y -= (canvas.height+50);	
		}
	}

	this.speedLimit = function() {
		if((this.velX*this.velX + this.velY*this.velY)>10){
			this.velX = 0.9*this.velX;
			this.velY = 0.9*this.velY;
			this.speedLimit()
		}
	}



	this.draw = function() {
		context.save();
		context.translate(this.x, this.y);
		context.rotate(Math.atan(this.velY/this.velX));
		context.beginPath();
		context.moveTo(0, 0);
		context.lineTo(-50, 10);
		context.lineTo(-50, -10);
		context.closePath();
		context.fill();
		context.restore();
	}

	this.reynolds = function() {
		
		this.alignmentVector();


	}

	// Get an array of boids within vision range (array of index numbers)
	this.findLocalBoids = function() {

		this.localBoids = [];
		for (var k=0; k<boids.length; k++){
			var distance = Math.sqrt(Math.pow((this.x-boids[k].x), 2) + Math.pow((this.y-boids[k].y), 2))
			if (distance<boidVisionLength){
				this.localBoids.push(k)
			}
		}

	}

	// get the average of local boids velocities
	// Adds to velocity in a cartesian way, rather than rotating. So boids will want to speed up if they are in a flock moving in
	// the same direction
	this.alignmentVector = function() {
		
		averageVelX = 0;
		averageVelY = 0;

		for (var k=0; k<boids.length; k++){
			var distance = Math.sqrt(Math.pow((this.x-boids[k].x), 2) + Math.pow((this.y-boids[k].y), 2))
			if (distance<boidVisionLength){

				averageVelX += boids[k].velX;
				averageVelY += boids[k].velY;
			}
		}

		this.velX += averageVelX/500;
		this.velY += averageVelY/500;



		if (boids.indexOf(this)===0){
			context.beginPath();
			
			context.moveTo(this.x,this.y);
			context.lineTo(this.x+(5*averageVelX),this.y+(5*averageVelY));
			context.strokeStyle = "#ECF0F1";
			context.stroke();	
		}

		
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

