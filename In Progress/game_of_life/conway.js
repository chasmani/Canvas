/* Setup canvas and make it resize on demand */
var canvas = document.getElementById('conway');
var context = canvas.getContext('2d');

var cellCountX = 32;
var cellCountY = 32;

var cellWidth = 0;
var cellHeight = 0;

var borderColor = "#333";


var neighbourLocations = [
	-1-cellCountY,
	-cellCountY,
	1-cellCountY,
	-1,
	+1,
	-1+cellCountY,
	cellCountY,
	+1+cellCountY
]




function setup() {	
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	canvas.style.backgroundColor = '#ddd';
	cellWidth = canvas.width/cellCountX;
	cellHeight = canvas.height/cellCountY;
}

function Cell(x, y){
	this.x = x;
	this.y = y;
	
	this.alive = Math.random()>=0.5;
	console.log(this.alive);

	
	this.neighbourAliveCount = 0;


	this.reportState = function() {
		
		if (this.alive){
			console.log("It lives!");
			return 1;
		}
		else{
			console.log("It does not live!");	
			return 0;
		}
	}

	this.getAliveCount = function() {

		this.neighbourAliveCount = 0;
		console.log("Counting neighbours");

		for (m=0;m<neighbourLocations.length;m++){
			
			var neighbourPos = (allCells.indexOf(this) + neighbourLocations[m]);
			if (neighbourPos >= allCells.length){
				neighbourPos -= allCells.length;
			}
			if (neighbourPos<0){
				neighbourPos += allCells.length;
			}

			
			this.neighbourAliveCount += allCells[neighbourPos].reportState();
			

		}
	}



	this.draw  =function() {

		console.log(this.neighbourAliveCount);

		if (this.neighbourAliveCount==3) {
			this.alive=true;
		}
		else if (this.alive && this.neighbourAliveCount==2){
			this.alive=true;
		}
		else{
			this.alive=false
		}


		if (this.alive){
			context.fillStyle = "#ddd";
		}
		else{
			context.fillStyle = "red";
		}
		
		context.fillRect(this.x*cellWidth, this.y*cellHeight, (this.x+1)*cellWidth, (this.y+1)*cellHeight);
		context.strokeRect(this.x*cellWidth, this.y*cellHeight, (this.x+1)*cellWidth, (this.y+1)*cellHeight);

	}

}

allCells = []











setup();

window.addEventListener("resize", setup);

var frameCount = 0;

function draw(){

	frameCount += 1;
	// Calculate which cells die or live in next frame
	console.log("Drawing", frameCount);

	for (k=0;k<allCells.length;k++){
		allCells[k].getAliveCount();
	}

	// Draw next frame
	for (l=0;l<allCells.length;l++){
		allCells[l].draw();
	}


	requestAnimationFrame(draw)
}



draw();