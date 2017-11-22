/* Setup canvas and make it resize on demand */
var canvas = document.getElementById('my-canvas');
var context = canvas.getContext('2d');

canvas.height = canvas.offsetHeight;
canvas.width = canvas.offsetWidth;

var grid = [];
var length = 35;

var colorSchemes = [
	{background:'#04b7df', lineColor:"#fe9d2a"},
	{background:'#000', lineColor:"#f06b70"},
	{background:'#fff', lineColor:"#000"},
]

var currentScheme = 0;


canvas.style.backgroundColor = colorSchemes[currentScheme].background;

context.lineCap = 'round';
var gridLength = 12;
	

var grid = createGrid();

function createGrid() {
	gridGap = 7*Math.min(canvas.height, canvas.width)/108;
	context.lineWidth = gridGap/3;
	context.lineCap = 'round';
	length = gridGap/2.26;
	newGrid = [];
	for(i=0;i<gridLength;i++){
		for(j=0;j<gridLength;j++){
			var line = new Line(i,j);
			newGrid.push(line);	
		}
	}
	return newGrid

}



function Line(i,j) {

	centerX = canvas.width/2;
	centerY = canvas.height/2;

	this.x = centerX + (i-gridLength/2 + 0.5)*gridGap;
	this.y = centerY + (j-gridLength/2 + 0.5)*gridGap;
	this.angle = 3 * Math.PI/4;
	this.color = colorSchemes[currentScheme].lineColor;

	this.spinning = false;

	this.drawLine = function() {
		context.save();
	
		context.strokeStyle = this.color;
	
		context.translate(this.x, this.y);
		context.rotate(this.angle)

		context.beginPath();
		context.moveTo(0,-length/2);
		context.lineTo(0,length);
		context.stroke();
		context.restore();

		if (this.spinning == true) {
			this.spin();
			this.color = colorSchemes[currentScheme].lineColor;

			if (this.angle > Math.PI && this.angle < 9*Math.PI/4){
				return true;	
			}	
		}
	}

	this.spin = function() {
		this.angle += 0.2;
		if (this.angle > 11 * Math.PI/4){
			this.angle = 3 * Math.PI/4;
			this.spinning = false;
		}
	}

}

function draw() {

	context.clearRect(0,0,canvas.width,canvas.height);
	for(i=0;i<grid.length;i++){
		var spinning = grid[i].drawLine();
		if (spinning == true){

			if (i % gridLength == 0){
				var nextSpins = [i+gridLength, i-gridLength, i+1];
			}
			else if ((i+1) % gridLength == 0){
				var nextSpins = [i+gridLength, i-gridLength, i-1];	
			}
			else{
				var nextSpins = [i+1, i-1, i+gridLength, i-gridLength]	;
			}

			for(j=0;j<4;j++){
				nextSpin = nextSpins[j];	

				if (nextSpin < grid.length && nextSpin > -1) {
					grid[nextSpin].spinning = true;
				}
				}			
		}
	}
	requestAnimationFrame(draw);
}

draw();

function getClosest(point, coordArray) {

	var nearestIndex = 0;
	var nearestDistance = 1000;
	for(i=0;i<coordArray.length;i++){
		
		var distanceX = coordArray[i].x - point.x;
		var distanceY = coordArray[i].y - point.y;
		var totalDistance = Math.sqrt(distanceX*distanceX + distanceY*distanceY);
		//console.log(i, coordArray[i].x, point.x, coordArray[i].y, point.y, totalDistance);
		if (totalDistance < nearestDistance) {
			nearestIndex = i;
			nearestDistance = totalDistance;
		}
	}

	return nearestIndex;

}


document.onclick = function(event) {
	
	var point = {x:event.clientX, y:event.clientY};
	console.log(point);	


	if (currentScheme == 0){
		currentScheme = 1;
	}
	else if (currentScheme == 1){
		currentScheme = 2;
	}
	else if (currentScheme == 2){
		currentScheme = 0;
	}

	closestIndex = getClosest(point, grid);
	grid[closestIndex].spinning = true;

	canvas.style.backgroundColor = colorSchemes[currentScheme].background;


}


/* Resize canvas function */

function resizeCanvas() {
	
	canvas.height = canvas.offsetHeight;
	canvas.width = canvas.offsetWidth;
	grid = createGrid();
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


window.addEventListener("resize", setup);