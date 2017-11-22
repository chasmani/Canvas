var canvas = document.getElementById('canvas_7');
var context = canvas.getContext('2d');


canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var img = new Image;
var img = document.getElementById("myImg");

var centreX = canvas.width/2;
var centreY = canvas.height/2;


var antCount = Math.floor(canvas.width/100);
var ants = [];
var foods = [];

var food1 = new Food(100, 100);
foods = [food1]
var nest1;
var nests; 

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

	nest1 = new Nest();
	nests = [nest1]


}

function Ant() {
	this.x = Math.floor(Math.random()*canvas.width);
	this.y = Math.floor(Math.random()*canvas.height);
	this.direction = (Math.random()*2*Math.PI);
	this.carryingFood = false;


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

		if (this.carryingFood == true) {

			var deltaY = this.y - nest1.y;
			var deltaX = this.x - nest1.x;
			console.log(deltaX, deltaY);
			this.direction = Math.atan(deltaY/deltaX) - Math.PI/2;

			if (this.x<nest1.x){
				this.direction = this.direction - Math.PI;
			}

		} else {

			if (Math.random() > 0.6){
				this.direction += Math.random()*0.5-0.25;
			}
		}
	}


}


function Food(xPos, yPos) {
	this.x = xPos;
	this.y = yPos;
	this.size = 50;


	this.drawFood = function() {

		if (this.size > 5) {

			context.beginPath();
	      	context.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
	      	context.fillStyle = '#34495e';
	      	context.fill();
	    } else {
	    	foodIndex = foods.indexOf(this);
			foods.splice(foodIndex, 1)
	    }
	}

	this.eaten = function() {
		this.size -= 5;
	}


}

function Nest() {
	this.x = canvas.width/2;
	this.y = canvas.height/2;
	this.size = 50;


	this.drawNest = function() {
		context.beginPath();
      	context.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
      	context.fillStyle = '#eee';
      	context.fill();
	}

}




function eat() {


	for(i=0;i<ants.length;i++){
		
		for(j=0;j<foods.length;j++){		
			if ((Math.abs(ants[i].x - foods[j].x)<foods[j].size) && (Math.abs(ants[i].y - foods[j].y)<foods[j].size)) {
				if (ants[i].carryingFood == false){
					ants[i].carryingFood = true;
					foods[j].eaten()	
					console.log("Eat");
				}// endif
			}// end if

		}// end foods

		if ((Math.abs(ants[i].x - nest1.x)<nest1.size) && (Math.abs(ants[i].y - nest1.y)<nest1.size)){
			ants[i].carryingFood = false;
		}



	}// end ants
	
}// end eat






function draw() {


	context.clearRect(0, 0, canvas.width, canvas.height);	


	for(k=0;k<nests.length;k++){
		nests[k].drawNest()
	}


	for(j=0;j<foods.length;j++){
		foods[j].drawFood()
	}

	
	for(i=0;i<ants.length;i++){
		ants[i].drawAnt()	
	}

	eat()
	
	requestAnimationFrame(draw);
}

window.onload = function(){



	
	requestAnimationFrame(draw);

}

function resize() {
	console.log("Resize");

	setup();

}


window.onclick = function(event) {
	cursorX = event.clientX;
	cursorY = event.clientY;
	console.log(cursorX, cursorY)
	var foodTemp = new Food(cursorX, cursorY);
	foods.push(foodTemp);
}



setup()


window.addEventListener("resize", resize);
