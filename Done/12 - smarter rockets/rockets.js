
// Canvas setup
var canvas = document.getElementById('canvas_12');
var context = canvas.getContext('2d');

context.lineWidth = 10;
context.lineCap = 'round';
canvas.style.backgroundColor = '#1E8BC3';
setupCanvas();

wall1x = 0;
wall2x = canvas.width/2;
var wall = new Wall(wall1x, wall2x, canvas.height/3, 20);
wall.draw();
var walls = [];
walls.push(wall)

var wall2 = new Wall(canvas.width/2, canvas.width, 2*canvas.height/3,20);
walls.push(wall2) 

var oneWall = new Wall(canvas.width/4, 3*canvas.width/4,canvas.height/2,20);
walls = [oneWall];

// Rockets and physics
var gravityStrength = 0.15;
var mainThrusterPower = 0.31;
var rocketLength = 30;
var rockets = []
var rocketCount = 20;
var dnaLength = 400;
var currentFrame = 0;
var matingPool = [];
var currentGeneration = 0;
var lastGenerationFitness = 0;
var mutationProbability = 0.005;
var maxDistanceFitness = 50;
var fitnessDistanceDecayConstant = 0.001;
var rocketImage = new Image;
var crashImage = new Image;
var targetImage = new Image;

rocketImage.src = "http://www.chasmani.com/media/uploads/2017/03/23/004-rocket-launch-1.png";
crashImage.src = "001-explosion-red.png";
targetImage.src = "001-asteroid.png";

// Use local image in local env, so can develop when offline
if(window.location.protocol == "file:"){
	rocketImage.src = "004-rocket-launch-1.png";
	crashImage.src = "001-explosion-red.png";
	targetImage.src = "001-asteroid.png";
} else {
	rocketImage.src = "http://www.chasmani.com/media/uploads/2017/03/23/004-rocket-launch-1.png";
	crashImage.src = "http://www.chasmani.com/media/uploads/2017/04/14/001-explosion-red.png";
	targetImage.src = "http://www.chasmani.com/media/uploads/2017/04/14/001-asteroid.png";
}

// Target
var targetX = 100 + canvas.width/4;
var targetY = 160;
var target = new Target(targetX, targetY);
target.draw();

var survivingRockets = true;


function setupCanvas() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}


function populateRockets() {
	rockets = [];

	for(i=0;i<rocketCount;i++){

		if (currentGeneration == 0) {
			newDna = buildRandomDna();
		}
		else{
			newDna = crossoverDna();
		}		

		rocket = new Rocket(newDna);
		rockets.push(rocket);
	}	
}


function Wall(x1, x2, height, thickness) {

	this.x1 = x1;
	this.x2 = x2;
	this.y1 = height;
	this.y2 = height + thickness;

	this.draw = function() {
		context.fillStyle = "#22313F";
		context.fillRect(this.x1, this.y1, this.x2 - this.x1, this.y2-this.y1);
		//context.fillRect(this.gapx2, canvas.height/2, canvas.width-this.gapx2, 20);
	}
}


function Target(x,y) {

	this.x = x;
	this.y = y;
	this.imageWidth = 0; 

	this.draw = function (){
		context.fillStyle = "#c0392b";
		context.drawImage(targetImage, this.x-this.imageWidth/2,this.y-this.imageWidth/2, this.imageWidth,this.imageWidth);
		this.imageWidth = 7* targetImage.width/16;
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
	this.stateImage = rocketImage; 

	this.draw = function(frame) {

		this.move(frame);
		context.save();
		context.translate(this.x, this.y);
		context.rotate(this.angle);
		context.drawImage(this.stateImage, -10,-10, this.stateImage.width/2,this.stateImage.height/2);
		context.restore();
	}

	this.gravity = function() {
		this.velY += gravityStrength;
	}

	this.mainThruster = function(frame) {
		// mainThruster creates a force in the direction the rocket is pointing
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

		if ((!this.success)&&(!this.crashed)){
			survivingRockets = true;
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
		if(this.success){
			fitness += 50;
			console.log(fitness);
		}
		if(this.crashed){
			fitness = Math.floor(fitness/2);
			console.log(fitness);
		}
		return fitness
	}

	this.collisionDetection = function() {
		this.targetCollisionDetection();
		this.edgeCollisionDetection();
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

	this.edgeCollisionDetection = function() {
		if ((this.x <0)||(this.y<0)||(this.x>canvas.width)||(this.y>canvas.height)){
			this.crashed = true;
			this.stateImage = crashImage;
		}
	}

	this.wallCollisionDetection = function() {

		for(k=0;k<walls.length;k++){
			if((this.y<walls[k].y2)&&(this.y>walls[k].y1)&&(this.x>walls[k].x1)&&(this.x<walls[k].x2)){
				this.crashed = true;
				this.stateImage = crashImage;		
			}
		}		
	}
}


function draw() {

	if((currentFrame<dnaLength)&&(survivingRockets)){		
		survivingRockets = false;
		context.clearRect(0,0,canvas.width,canvas.height);
		target.draw();
		for(k=0;k<walls.length;k++){
			walls[k].draw();
		}

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
	survivingRockets = true;
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

window.addEventListener('resize', function(event){
	setupCanvas();
});

populateRockets();
draw();