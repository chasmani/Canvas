
// Canvas setup
var canvas = document.getElementById('my-canvas');
var context = canvas.getContext('2d');

canvas.height = canvas.offsetHeight;
canvas.width = canvas.offsetWidth;

context.lineWidth = 10;
context.lineCap = 'round';
canvas.style.backgroundColor = '#1E8BC3';


// Rockets and physics
var gravityStrength = 0.15;
var mainThrusterPower = 0.31;
var rocketLength = 30;
var rockets = []
var rocketCount = 20;
var dnaLength = 250;
var currentFrame = 0;
var matingPool = [];
var currentGeneration = 0;
var lastGenerationFitness = 0;
var mutationProbability = 0.005;
var maxDistanceFitness = 50;
var fitnessDistanceDecayConstant = 0.001;

var rocketImage = new Image;
rocketImage.src = "http://chasmani.com/media/uploads/2017/11/22/004-rocket-launch-1.png";

// Local image for development offline
//rocketImage.src = "004-rocket-launch-1.png";

// Target
var targetX = canvas.width - canvas.width/6;
var targetY = 60;
var target = new Target(targetX, targetY);
target.draw();



function populateRockets() {
    rockets = [];
		
	for(i=0;i<rocketCount;i++){

		if (currentGeneration == 0) {
			newDna = buildRandomDna();
		}
		else{
			try{
				newDna = crossoverDna();
			}
			catch(e){
				console.log("Error caught");
			}
		}		

		rocket = new Rocket(newDna);
		rockets.push(rocket);
	}	
	
}


function Target(x,y) {

    this.x = x;
    this.y = y;

    this.draw = function (){
	context.fillStyle = "#c0392b";

	context.beginPath();
	context.arc(this.x,this.y,50,0,2*Math.PI);
	context.fill();
	}
}


function Rocket(dna) {

	this.x = canvas.width/2;
	this.y = canvas.height- rocketLength;
	this.angle = 0;
	this.velX = 0;
	this.velY = 0;
        this.dna = dna;
        this.crashed = false;
    this.success = false;
    this.closestDistance = canvas.height;

	this.draw = function(frame) {

	    if(!this.crashed){
	    this.move(frame);

		context.save();
		
		context.translate(this.x, this.y);
		context.rotate(this.angle);

		//context.drawImage(rocketImage, -rocketImage.width/16,-rocketImage.height/16, rocketImage.width/8,rocketImage.height/8);
		context.drawImage(rocketImage, -10,-10, rocketImage.width/2,rocketImage.height/2);

		context.restore();
	    }
	}

	this.gravity = function() {
		this.velY += gravityStrength;
	}

	this.mainThruster = function(frame) {
		// mainThruster creates a force in the direction the rocket is pointing
		// 
		if (this.dna[frame] > 3) {
			this.velX += mainThrusterPower*Math.sin(this.angle)
			this.velY -= mainThrusterPower*Math.cos(this.angle)
		}

	
	}

	this.leftThruster = function(frame) {

		if ((this.dna[frame]%4 == 2)||(this.dna[frame]%4 == 3)){
			this.angle -= 0.1;
		}

	}

	this.rightThruster = function(frame) {

		if (this.dna[frame]%2 == 1){
			this.angle += 0.1;
		}

	}


    this.move = function(frame) {

	if (!this.success){
	    
	        this.gravity();
		this.mainThruster(frame);
		this.leftThruster(frame);
		this.rightThruster(frame);
		this.x += this.velX;
	    this.y += this.velY;
	    this.collisionDetection();
	}
    }

    this.calculateFitness = function() {

	
	fitness = Math.floor(10*canvas.height/this.closestDistance)-9;
	//expDistanceFitness = maxDistanceFitness * Math.exp(-1*fitnessDistanceDecayConstant*this.closestDistance);
	//console.log(expDistanceFitness);
	//fitness = Math.floor(maxDistanceFitness * Math.exp(-1*fitnessDistanceDecayConstant*this.closestDistance))+1;

	
	if(this.success){
	    fitness += 50;
	    console.log(fitness);
	}
 

	
	return fitness
	
    }

    this.collisionDetection = function() {

	this.targetCollisionDetection();
	
	this.wallCollisionDetection();
	
    }

    this.targetCollisionDetection = function() {
	distanceToTarget = Math.sqrt((this.x-target.x)*(this.x-target.x) + (this.y-target.y)*(this.y-target.y));
	if(distanceToTarget < 50){
	    this.success = true;
	}

	if(distanceToTarget<this.closestDistance){
	    this.closestDistance = distanceToTarget;
	}
	
    }

    this.wallCollisionDetection = function() {
	if ((this.x <0)||(this.y<0)||(this.x>canvas.width)||(this.y>canvas.height)){
	    this.crashed = true;
	}
    }
    

}

function draw() {

	if(currentFrame<dnaLength){
		
		context.clearRect(0,0,canvas.width,canvas.height);
	    target.draw();
	    writeFitness();

		for(i=0;i<rockets.length;i++){
			
			rockets[i].draw(currentFrame);
			
		}

	currentFrame += 1;
	requestAnimationFrame(draw);
	}

	else {
		newGeneration()
		}
	
}

function writeFitness() {

    context.fillStyle = "#ccc";
    if(canvas.width>600){
    
	context.font = "32px Arial";
    }
    else{
	context.font = "12px Arial";
    }

    
    context.textAlign = "center";
    fitnessString = "".concat("Generation ", currentGeneration, " - ", "Fitness ", lastGenerationFitness);
    context.fillText(fitnessString, canvas.width/2, canvas.height/2.5);


}



function newGeneration() {

	currentGeneration += 1;
	currentFrame = 0;
    buildMatingPool();

	populateRockets();

	draw();
}


function buildMatingPool() {

	// Reset mating pool
	matingPool = [];

	totalGenerationFitness = 0;

	for(i=0;i<rockets.length;i++){
		fitness = rockets[i].calculateFitness();
		totalGenerationFitness += fitness;
		for(j=0;j<fitness;j++){
			matingPool.push(rockets[i].dna)
		}
	}

    lastGenerationFitness = totalGenerationFitness;


    
	console.log("Generation ", currentGeneration, ". Total Fitness ", totalGenerationFitness);

}


function buildRandomDna() {
	dna = [];
	for(j=0;j<dnaLength;j++){
		dna.push(Math.floor(Math.random()*8));
	}
	return dna;	
}

function crossoverDna() {

	
	dnaParent1 = matingPool[Math.floor(Math.random()*matingPool.length)];
	dnaParent2 = matingPool[Math.floor(Math.random()*matingPool.length)];
	dna = []

	for(j=0;j<dnaLength;j++){

		if (Math.random() < mutationProbability) {
			var gene = Math.floor(Math.random()*8)
		}
		else {
			var gene = Math.random() < 0.5 ? dnaParent1[j] : dnaParent2[j];	
		}
		dna.push(gene);
	}
	return dna;

}

populateRockets();


rocketImage.onload = function() {
        draw();        
      };


/* Reset the canvas function */
function resetCanvas() {	
	currentGeneration = 0;
	populateRockets();
}

/* Resize canvas function */
function resizeCanvas() {
	canvas.height = canvas.offsetHeight;
	canvas.width = canvas.offsetWidth;
}

window.addEventListener('resize', function(event){
  
    resizeCanvas();

});


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


var resetButton = document.createElement("button");
resetButton.innerHTML = "Reset";
resetButton.className += "btn btn-default"

var buttonContainer = document.getElementById("canvas-buttons");
buttonContainer.appendChild(resetButton);

resetButton.addEventListener ("click", function() {
	resetCanvas();
});