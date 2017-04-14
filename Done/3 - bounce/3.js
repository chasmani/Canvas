

var canvas = document.getElementById("canvas_3");
var context = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

canvas.style.backgroundColor = '#FFFAD5';


var lastTime = Date.now();

var circle_1 = {
	x:200,
	y:200,
	radius:100,
	velocity_x:0.2,
	velocity_y:0,
	acceleration_x:0,
	acceleration_y:0.0002,
	color:"#105B63",
}

var circle_2 = {
	x:100,
	y:320,
	radius:70,
	velocity_x:-0.4,
	velocity_y:-0.2,
	acceleration_x:0,
	acceleration_y:0.0002,
	color:"#BD4932",
}

var circle_3 = {
	x:400,
	y:10,
	radius:20,
	velocity_x:-0.05,
	velocity_y:0,
	acceleration_x:0,
	acceleration_y:0.0002,
	color:"#FFD34E",
}

var circles = [circle_1, circle_2, circle_3];

function draw_ball(circle) {

	context.beginPath();
	context.arc(circle.x,circle.y,circle.radius,0,Math.PI*2);
	context.fillStyle=circle.color;
	context.fill();

}

function move_circle(circle, timeDelta) {

	// Apply physics to a circle to update it's position and velocity
	circle.velocity_x = circle.velocity_x + circle.acceleration_x*timeDelta;
	circle.velocity_y = circle.velocity_y + circle.acceleration_y*timeDelta;	

	circle.x = circle.x + circle.velocity_x*timeDelta;
	circle.y = circle.y + circle.velocity_y*timeDelta;

	// Bounce off the floor
	if (((circle.y + circle.radius)>canvas.height)&&(circle.velocity_y>0)){
		circle.velocity_y = -circle.velocity_y*0.8;
		circle.velocity_x = circle.velocity_x*0.8;
	}

	// Bounce off the walls
	if ((((circle.x - circle.radius)<0)&&(circle.velocity_x<0)) || (((circle.x + circle.radius)>canvas.width))&&(circle.velocity_x>0)) {
		circle.velocity_x = -circle.velocity_x;
	}

	return circle;
}


function draw() {

	// Work out the time since the last frame
	var currentTime = Date.now();
	var timeDelta = currentTime - lastTime;

	context.clearRect(0,0,canvas.width,canvas.height);

	// Move and then draw all circles
	for (var i=0; i<circles.length;i++){
		circles[i] = move_circle(circles[i], timeDelta);
		draw_ball(circles[i]);
	}

	lastTime = currentTime;

	requestAnimationFrame(draw);
}

requestAnimationFrame(draw);