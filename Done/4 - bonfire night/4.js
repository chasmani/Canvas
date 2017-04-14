var canvas = document.getElementById("canvas_4");
var context = canvas.getContext("2d");

canvas.width = Math.max(window.innerWidth,1000);
canvas.height = window.innerHeight;

canvas.style.backgroundColor = '#404040';

var lastTime = Date.now();
var bangRadius0 = 3;


function firework(position, timeDelta) {

	if (timeDelta > position.startDelay){
		smallBang(position, timeDelta-position.startDelay);
		trails(position, timeDelta-position.startDelay);
	}

}

function smallBang(position, timeDelta) {

	var bangRadius = bangRadius0 - (timeDelta/100);

	if (bangRadius > 0){
		drawCircle(position.x, position.y, bangRadius, "#eee")
	}

}

function drawCircle(x,y,radius, color) {

	context.beginPath();
	context.arc(x,y,radius,0,Math.PI*2);
	context.fillStyle=color;
	context.fill();
}


function trails(position, timeDelta){
	
		for (var i=0;i<position.trailCount;i++) {

			var trailDegree = (Math.PI*2)*(i/position.trailCount)
			oneTrail(position, timeDelta, trailDegree);
		}
}


function oneTrail(position, timeDelta, degree) {


	var startDeltaX = 20 * Math.cos(degree)
	var startDeltaY = 20 * Math.sin(degree)

	var deltaX = (timeDelta * Math.cos(degree));
	var deltaY = (timeDelta * Math.sin(degree));	

	if (timeDelta > position.trailDuration) {
		var deltaX = (position.trailDuration * Math.cos(degree));
		var deltaY = (position.trailDuration * Math.sin(degree))
	}


	trailPosition = {
		x:position.x + deltaX, 
		y:position.y + deltaY
	}

	if (timeDelta < position.trailDuration + 300) {

		context.lineWidth = (position.trailDuration - timeDelta + 300)/100;
		context.lineCap = 'round';
		context.strokeStyle = "#505050";

		context.beginPath();
	    context.moveTo(position.x + startDeltaX, position.y + startDeltaY);
	    context.lineTo(trailPosition.x, trailPosition.y);
	    context.stroke();

	}

	if (timeDelta < position.trailDuration) {	

    	drawCircle(trailPosition.x, trailPosition.y, 2, position.color)

	}	    

}


function draw() {

	
	var currentTime = Date.now();
	var timeDelta = (currentTime - lastTime)/10;
	
	context.clearRect(0,0,canvas.width,canvas.height);


	var position1 = {
		x: 200,
		y: 200,
		color: "#33bb11",
		trailCount:15,
		trailDuration:200,
		startDelay:0,
	};

	var position2 = {
		x:330,
		y:100,
		color: "#5544aa",
		trailCount:11,
		trailDuration:300,
		startDelay:40
	};

	var position3 = {
		x:440,
		y:200,
		color: "#d25",
		trailCount:11,
		trailDuration:400,
		startDelay:100,
	};


	var position4 = {
		x:50,
		y:120,
		color: "#33e",
		trailCount:11,
		trailDuration:100,
		startDelay:200
	};


	var position5 = {
		x:500,
		y:200,
		color: "#bb66aa",
		trailCount:11,
		trailDuration:50,
		startDelay:2500,
	};

	var colors = ["#bb66aa", "#33e", "#d25", "#33bb11", "#5544aa"];
	var gap = [390, 1590, 3167, 210, 876]

	fireworks = []

	var fireworkCount = 20;

	var currentX = 100;
	var currentY = 100;
	var currentStartDelay = 0;
	var currentTrailDuration = 150;

	for (var i = 0; i<fireworkCount;i++) {
		
		selector = i%5;


		currentX = (currentX + gap[selector]) % canvas.width;
		currentY = ((currentY + gap[selector]) % (window.innerHeight/2)) + 100;
		currentStartDelay = (currentStartDelay + gap[selector]) % 300;
		currentTrailDuration = ((currentTrailDuration + gap[selector]) % 200) + 100;

		var position = {
			x:currentX,
			y:currentY,
			color:colors[selector],
			trailCount:selector*3 + 11,
			trailDuration:currentTrailDuration,
			startDelay:currentStartDelay,
		}
		fireworks.push(position);

	}

	for (var j=0;j<fireworks.length;j++){
		firework(fireworks[j], timeDelta);	
	}
	
	requestAnimationFrame(draw);
}

requestAnimationFrame(draw);