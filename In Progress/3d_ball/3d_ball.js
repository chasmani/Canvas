/* Setup canvas and make it resize on demand */
var canvas = document.getElementById('my-canvas');
var context = canvas.getContext('2d');

canvas.height = canvas.offsetHeight;
canvas.width = canvas.offsetWidth;
/*
Need to properly work out dimension of room at each z level, to make ball bounce properly
*/

var ball_1 = {
	x:100,
	y:100,
	radius:80,
	z:1000,
	v_x:3,
	v_y:-2,
	v_z:10,
}

var zeroDepth = 1000;

console.log(ball_1);

function drawBall(ball){
	
	context.clearRect(0, 0, canvas.width, canvas.height);

	var apparentRadius = ball_1.radius * (zeroDepth/ball_1.z);

	console.log(apparentRadius);

	context.beginPath();
	context.arc(ball_1.x,ball_1.y,apparentRadius,0,2*Math.PI);
	context.stroke();

	drawShadow(ball);


}

function drawShadow(ball) {

	var apparentRadius = ball_1.radius * (zeroDepth/ball_1.z);
	var heightAdjustment = (ball_1.z/3000) * 100;

	console.log(heightAdjustment)

	context.save();
	context.scale(1,0.3);
	context.fillStyle = "#ccc";
	context.beginPath();
	context.arc(ball.x,300 + canvas.height/0.6 - heightAdjustment,apparentRadius,0,2*Math.PI);
	context.fill();
	context.restore();
}


function draw(){

	if ((ball_1.z > 3000) || (ball_1.z<1000)) {
		ball_1.v_z = - ball_1.v_z
	}	
	if ((ball_1.x > canvas.width) || (ball_1.x<0)) {
		ball_1.v_x = - ball_1.v_x
	}
	if ((ball_1.y > canvas.height/2) || (ball_1.y<0)) {
		ball_1.v_y = - ball_1.v_y
	}

	ball_1.x += ball_1.v_x;
	ball_1.y += ball_1.v_y;
	ball_1.z += ball_1.v_z;




	drawBall(ball_1);


	requestAnimationFrame(draw)
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



draw();