/* Setup canvas and make it resize on demand */
var canvas = document.getElementById('canvas_8');
var context = canvas.getContext('2d');


setup();

context.strokeStyle = "#FFD34E";


context.translate(canvas.width/2,canvas.height);

var trunkThickness = 3;

var angle = 0.2;

var branchLength = Math.min(canvas.height/3.3, canvas.width/4); 
var branchShortening = 0;


function setup() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	canvas.style.backgroundColor = '#105B63';

}

function branch(length, angle, thickness) {

	if (thickness > 0){
		context.lineWidth = thickness;
	}	

	context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(0, -length);
    context.stroke();

    context.save();

    if (length > branchLength/50){
    	context.translate(0,-length);	
    	context.rotate(angle);
    	branch(length*branchShortening, angle, thickness-0.5);

    	context.rotate(-2*angle);
    	branch(length*branchShortening, angle,thickness-0.5);
    }
    context.restore();
}

function draw(){

	angle = angle + 0.01;

	if (branchShortening < 0.618) {
		branchShortening  = branchShortening + 0.003;	
	}
	
	context.clearRect(-canvas.width/2,-canvas.height,canvas.width,canvas.height);
	branch(branchLength, angle, trunkThickness);
	requestAnimationFrame(draw);
}


draw();
