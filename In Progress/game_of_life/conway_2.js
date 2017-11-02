/* Setup canvas and make it resize on demand */
var canvas = document.getElementById('conway');
var context = canvas.getContext('2d');

var cellCountX = 12;
var cellCountY = 32;

var cellWidth = 0;
var cellHeight = 0;

var borderColor = "#333";

var cells = []
var currentTime = Date.now();
var nextCells = []
var timeSinceLastFrame = 10000;
var neighbourLocations = []


function setup() {	
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	canvas.style.backgroundColor = '#ddd';
	cellWidth = canvas.width/cellCountX;
	
	cellHeight = canvas.height/cellCountY;

	cells = []

	for (i=0;i<cellCountX;i++){
		for(j=0;j<cellCountY;j++){
			var state = Math.round(Math.random());
			cells.push(state);
		}
	}

	neighbourLocations = [
	-1-cellCountX,
	-cellCountX,
	1-cellCountX,
	-1,
	+1,
	-1+cellCountX,
	cellCountX,
	+1+cellCountX
	]

	nextCells = []


}




setup();



function draw(){

	timeSinceLastFrame = Date.now() - currentTime;

	if (timeSinceLastFrame > 100){
		currentTime = Date.now();
		
		for (k=0;k<cells.length;k++){
			
			// Count the neighbours alive
			var neighboursAlive = 0;
			for (l=0;l<neighbourLocations.length;l++){
				var neighbourPos = k + neighbourLocations[l]
				if (neighbourPos>cells.length){
					neighbourPos -= cells.length
				}
				neighboursAlive += cells[neighbourPos];
			}

			

			// Populate nextCells for next frame
			if (neighboursAlive==3) {
				nextCells.push(1)
			}
			else if (cells[k] && neighboursAlive==2){
				nextCells.push(1)
			}
			else{
				nextCells.push(0)
			}
		

			// Draw this frame
			if (cells[k]){
				context.fillStyle = "#d4d";
			}
			else{
				context.fillStyle = "#111";
			}


			var x = k%cellCountX;
			var y = Math.floor(k/cellCountX);
			

			context.fillRect(x*cellWidth, y*cellHeight, cellWidth, cellHeight);
			context.strokeRect(x*cellWidth, y*cellHeight, cellWidth, cellHeight);
			
		}

		

		cells = nextCells;
		nextCells = [];


	}


	requestAnimationFrame(draw)
}



cellsHorizontalInput = document.getElementById("cellsHorizontal");
cellsHorizontalValue = document.getElementById("cellsHorizontal-value");

cellsHorizontalInput.addEventListener("change", function() {
    
	
	cellsHorizontalValue.textContent = cellsHorizontalInput.value;

	cellCountX = parseInt(cellsHorizontalInput.value);
	setup();


    
}, false);



draw();