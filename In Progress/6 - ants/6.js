var canvas = document.getElementById('canvas_6');
var context = canvas.getContext('2d');

var img = new Image;
img.src = "http://www.chasmani.com/media/uploads/2016/12/02/ant.png";

var centreX = canvas.width/2;
var centreY = canvas.height/2;


var antCount = Math.floor(canvas.width/100);
console.log(antCount);
var ants = [];


function setup() {

	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	canvas.style.backgroundColor = "#27ae60";
	antCount = Math.floor(canvas.width/100);
	ants = [];
	for(i=0;i<antCount;i++){
		var ant = new Ant();
		ants.push(ant)
	}
}

function Ant() {
	this.x = Math.floor(Math.random()*canvas.width);
	this.y = Math.floor(Math.random()*canvas.height);
	this.direction = (Math.random()*2*Math.PI);


	this.drawAnt = function() {
		context.translate(this.x, this.y);
		context.rotate(this.direction);
		context.drawImage(img,- img.width/8,-img.height/8, img.width/4,img.height/4);
		context.rotate(-this.direction);
		context.translate(-this.x, -this.y);

		this.moveAnt();
		this.wrapAnt();
		this.changeDirection();

	}

	this.moveAnt = function() {
		var distance = 5;
		var distanceX = distance* Math.sin(this.direction)
		var distanceY = distance* Math.cos(this.direction)
		this.x += distanceX;
		this.y -= distanceY;
		
	}

	this.wrapAnt = function() {

		if (this.x > canvas.width) {
			this.x = 0
		} 

		if (this.x < 0) {
			this.x = canvas.width
		}

		if (this.y > canvas.height) {
			this.y = 0
		} 

		if (this.y < 0) {
			this.y = canvas.height
		}

	}


	this.changeDirection = function() {

		if (Math.random() > 0.6){
			this.direction += Math.random()*0.5-0.25;
		}
	}


}



function draw() {


	context.clearRect(0, 0, canvas.width, canvas.height);	
	
	for(i=0;i<ants.length;i++){
		ants[i].drawAnt()	
	}

	
	requestAnimationFrame(draw);
}

window.onload = function(){
	
	requestAnimationFrame(draw);

}

function resize() {
	console.log("Resize");

	setup();

}



setup()


window.addEventListener("resize", resize);

