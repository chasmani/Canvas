/* Setup canvas and make it resize on demand */

var canvas = document.getElementById('canvas_10');
var context = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

context.lineWidth = 2;
context.lineCap = 'round';
canvas.style.backgroundColor = 'black';

context.translate(0.5, 0.5)

var gridWidth = 40;

var currentMidpoint = canvas.height/2;


function drawLine(x, direction) {

	var offset = Math.random() * 100 + 20;
	
	if (direction == 1){
		currentMidpoint -= offset;

			context.strokeStyle = "black";
			context.lineWidth = 40;

			context.beginPath();
		    context.moveTo(x*gridWidth, 0);
		    context.lineTo(x*gridWidth, canvas.height);
		    context.stroke();

		    context.strokeStyle = "white";
		    context.lineWidth = 41;

			context.beginPath();
		    context.moveTo(x*gridWidth, canvas.height);
		    context.lineTo(x*gridWidth, currentMidpoint);
		    context.stroke();
	} 
	else if (direction == 0) {
		currentMidpoint += offset;
		    context.strokeStyle = "white";
		    context.lineWidth = 40;
			context.beginPath();
		    context.moveTo(x*gridWidth, canvas.height);
		    context.lineTo(x*gridWidth, 0);
		    context.stroke();


			    
		    context.strokeStyle = "black";
		    context.lineWidth = 41;
			context.beginPath();
		    context.moveTo(x*gridWidth, 0);
		    context.lineTo(x*gridWidth, currentMidpoint);
		    context.stroke();
	}
}



for (i=0;i<80;i++){

	drawLine(i, i%2);

}


// Build line objects to keep some memory of heights so you can move it up and down. 
// Currently only works with 


