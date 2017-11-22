/* Grab canvas and context */
var canvas = document.getElementById('my-canvas');
var context = canvas.getContext('2d');
canvas.style.width = "100%";
canvas.style.height = "50vh";
canvas.height = canvas.offsetHeight;
canvas.width = canvas.offsetWidth;

/* Custom canvas variables */
canvas.style.backgroundColor = "#404040"

var triangleMaxSize = 20;

var butterflyCount = canvas.width/100;

var butterflies = []
for (i=0;i<butterflyCount;i++){
	but = new Butterfly(getRandomColor());
	butterflies.push(but);
}

light = new Light();

function buildStars() {

	newStars = []

	for (i=0;i<butterflyCount*5;i++){
		star = new Star(Math.random()*canvas.width,Math.random()*canvas.height);	
		newStars.push(star);
	}

	return newStars;

}

var stars = buildStars(); 


function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function getRandomGrey() {
	var letters = 'ABCDEF';
    var color = '#';
    var letter = letters[Math.floor(Math.random() * letters.length)]
    for (var i = 0; i < 6; i++ ) {
        color += letter;
    }
    return color;	


}

function Butterfly(color) {

	this.x = Math.random() * canvas.width;
	this.y = Math.random() * canvas.height;

	this.velX = 0;
	this.velY = 0;

	this.accX = 0;
	this.accY = 0;

	this.color = color;

	this.move = function() {
		this.x += this.velX;
		this.y += this.velY;
		
		this.velX += Math.random() * 0.2 - 0.1;
		this.velY += Math.random() * 0.2 - 0.1;

		this.wrap();
		this.speedLimit();
	}

	this.wrap = function() {
		if (this.x > canvas.width){
			this.x = 0;
		}
		else if (this.x < 0) {
			this.x = canvas.width;
		}

		if (this.y > canvas.height){
			this.y = 0;
		}
		else if (this.y < 0) {
			this.y = canvas.height;
		}
	}

	this.speedLimit = function() {
		if (this.velX > 2) {
			this.velX = 1.9;
		}
		else if (this.velX < -2) {
			this.velX = -1.9;	
		}

		if (this.velY > 2) {
			this.velY = 1.9;
		}
		else if (this.velY < -2) {
			this.velY = -1.9;
		}
	}

	this.drawWing = function() {
		context.save();
		context.beginPath();
		context.translate(this.x, this.y);
		context.moveTo(0, 0);
		context.lineTo(Math.random() * triangleMaxSize - triangleMaxSize/2, Math.random() * triangleMaxSize - triangleMaxSize/2);
		context.lineTo(Math.random() * triangleMaxSize - triangleMaxSize/2, Math.random() * triangleMaxSize - triangleMaxSize/2);
		context.closePath();
		context.fillStyle = this.color;
		context.fill();
		context.restore();

	}

	this.draw = function() {

		for (i=0;i<4;i++){
			this.drawWing();	
		}
		
		this.move();
	}

}



function Light(x,y) {

	this.draw = function(){

		context.save();
		context.beginPath();
		context.translate(canvas.width/4, canvas.height/2);

		context.beginPath();
		context.arc(0,0,50,0,2*Math.PI);
		context.fillStyle = "#fff";
		context.fill();
		context.restore();

	}

} 


function Star(x,y) {

	this.x = x;
	this.y = y;

	this.color = getRandomGrey();

	this.draw = function(){

		

		context.save();
		context.beginPath();
		context.translate(this.x, this.y);

		context.beginPath();
		context.arc(0,0, 1,0,2*Math.PI);
		context.fillStyle = this.color;
		context.fill();

		context.restore();

	}
}


function draw() {

	context.clearRect(0,0,canvas.width,canvas.height);

	light.draw();

	for (i=0; i<stars.length;i++){
		stars[i].draw();	
	}


	for (j=0; j<butterflies.length;j++){
		butterflies[j].draw();		
	}
	
	requestAnimationFrame(draw);
}



/* Resize canvas function */
function resizeCanvas() {
	canvas.height = canvas.offsetHeight;
	canvas.width = canvas.offsetWidth;
	stars=buildStars();
}

window.addEventListener('resize', function(event){
    resizeCanvas();
});


/* Full screen buttons */
document.getElementById("fullscreen-button").addEventListener("click", function() {
	
	canvas.style.width = "100%";
	canvas.style.height = "100%";
	canvas.style.position = "fixed";
	canvas.style.left=0;
	canvas.style.top=0;

	console.log(window.innerWidth);
	resizeCanvas();
	document.getElementById("fullscreen-button").style.display = "none";
	document.getElementById("leave-fullscreen-button").style.display = "inline";
});

document.getElementById("leave-fullscreen-button").addEventListener("click", function() {
	
	canvas.style.width = "100%";
	canvas.style.height = "50vh";
	canvas.style.position = "relative";
	canvas.style.left="none";	
	canvas.style.top="none";	
	resizeCanvas();
	document.getElementById("fullscreen-button").style.display = "inline";
	document.getElementById("leave-fullscreen-button").style.display = "none";
});




draw();

