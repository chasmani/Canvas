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


		    context.strokeStyle = "white";
		    context.lineWidth = 60;

			context.beginPath();
		    context.moveTo(x*gridWidth, canvas.height);
		    context.lineTo(x*gridWidth, currentMidpoint);
		    context.stroke();

		    if (Math.random() > 0.8) {

		    	extraBitLength = Math.random() * 100;


		    	context.beginPath();
				context.moveTo(x*gridWidth, currentMidpoint - 100);
				context.lineTo(x*gridWidth, currentMidpoint - 100 - extraBitLength);
				context.stroke();
		    }


	} 
	else if (direction == 0) {
		currentMidpoint += offset;
	}
}



for (i=0;i<80;i++){

	drawLine(i, i%2);

}


// Build line objects to keep some memory of heights so you can move it up and down. 
// More liek a graphics eq shape


