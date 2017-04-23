
var canvas = document.getElementById('canvas_13');
var context = canvas.getContext('2d');

unitSize = Math.min(window.innerHeight, window.innerWidth)/15;
heightVector = null;
rightVector = null;
leftVector = null;
angle = Math.PI/4;
center = null
state = new State();

setup();


function setVectors(angle) {
	heightVector = {
		x:0,
		y:unitSize
	}		
	rightVector = {
		x:unitSize*Math.cos(angle),
		y:-unitSize*Math.sin(angle)*0.5
	}	
	leftVector = {
		x:-unitSize*Math.cos(Math.PI/2 - angle),
		y:-unitSize*Math.sin(Math.PI/2 - angle)*0.5
	}
}


function setup() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	unitSize = Math.min(window.innerHeight, window.innerWidth)/15;
	center = {
		x:window.innerWidth/2,
		y:8*window.innerHeight/16
	}
	context.lineWidth = 10;
	context.lineCap = 'round';
	canvas.style.backgroundColor = '#262626';
	setVectors(angle);
}


function State(){
	// Determines the current and desired sate of the layout of boxes
	// Will always move towards desired state
	// Desired state is changed by this.transition()

	// Statestring determines the progression of states
	this.stateString = [0.95,0.95,0.95,1.9,1.9,1.9]

	this.desiredLeft = this.stateString[0];
	this.desiredRight = this.stateString[1];
	this.desiredHeight = this.stateString[2];

	this.intervalLeft = this.stateString[0];
	this.intervalRight = this.stateString[1];
	this.intervalHeight = this.stateString[2];

	this.getNewInterval = function(interval, desired){
		// Helper function to determine new value of actual interval
		if(Math.abs(interval-desired)<0.02){
			return desired
		}
		else if (interval<desired){
			return interval + (0.02*(desired/interval));
		}
		else if (interval>desired){
			return interval - (0.02*(interval/desired));
		}
	}

	this.animate = function(){
		// Moves the actual interval towards the desired interval
		// Moves one dimension at a time
		if (this.intervalLeft!=this.desiredLeft){
			this.intervalLeft = this.getNewInterval(this.intervalLeft, this.desiredLeft);
		}
		else if (this.intervalRight!=this.desiredRight){
			this.intervalRight = this.getNewInterval(this.intervalRight, this.desiredRight);
		}
		else if (this.intervalHeight!=this.desiredHeight){
			this.intervalHeight = this.getNewInterval(this.intervalHeight, this.desiredHeight);
		}
	}

	this.transition = function() {
		// Desired states set by first 3 elements of statestring
		// This method moves statestring along one
		temp = this.stateString.pop();
		this.stateString.unshift(temp);	
		this.desiredLeft = this.stateString[0];
		this.desiredRight = this.stateString[1];
		this.desiredHeight = this.stateString[2];
	}
}


function Box(x,y) {
	
	this.x = x;
	this.y = y;

	this.drawRightSide = function() {
		context.fillStyle = '#e79c10';
		context.beginPath();
		context.moveTo(this.x, this.y);
		context.lineTo(this.x + heightVector.x, this.y + heightVector.y);
		context.lineTo(this.x + heightVector.x + rightVector.x, this.y + heightVector.y + rightVector.y);
		context.lineTo(this.x + rightVector.x, this.y + rightVector.y);
		context.closePath();
		context.fill();
	}

	this.drawLeftSide = function() {
		context.fillStyle = '#d53a33';
		context.beginPath();
		context.moveTo(this.x, this.y);
		context.lineTo(this.x + heightVector.x, this.y + heightVector.y);
		context.lineTo(this.x + heightVector.x + leftVector.x, this.y + heightVector.y + leftVector.y);
		context.lineTo(this.x + leftVector.x, this.y + leftVector.y);
		context.closePath();
		context.fill();
	}

	this.drawTopSide = function() {
		context.fillStyle = '#1d9099';
		context.beginPath();
		context.moveTo(this.x, this.y);
		context.lineTo(this.x + rightVector.x, this.y + rightVector.y);
		context.lineTo(this.x + rightVector.x + leftVector.x, this.y + rightVector.y + leftVector.y);
		context.lineTo(this.x + leftVector.x, this.y + leftVector.y);
		context.closePath();
		context.fill();
	}

	this.drawBox = function() {
		this.drawRightSide();
		this.drawLeftSide();
		this.drawTopSide();		
	}
}


function buildBoxes(intervalLeft, intervalRight, intervalHeight) {
	// Builds a grid of 3x3x3 boxes
	boxes = []
	for(layer=2;layer>=0;layer--){
		for(row=2;row>=0;row--){
			for (col=2;col>=0;col--){
				box = new Box(
					center.x + row*rightVector.x*intervalRight + col*leftVector.x*intervalLeft +layer*heightVector.x*intervalHeight, 
					center.y + row*rightVector.y*intervalRight + col*leftVector.y*intervalLeft + layer*heightVector.y*intervalHeight
					);
				boxes.push(box)
			}
		}
	}
	return boxes
}


function draw() {

	context.clearRect(0,0,canvas.width,canvas.height);	
	boxes = buildBoxes(state.intervalLeft, state.intervalRight, state.intervalHeight);

	for(i=0;i<boxes.length;i++){
		boxes[i].drawBox();
	}

	state.animate();
	requestAnimationFrame(draw);
}


window.addEventListener('resize', function(event){
	setup();
});


window.addEventListener('click', function(event) {
	console.log("CLICK!");
	state.transition();
});


window.addEventListener('mousemove', function(event){
	xPosProportional = event.pageX/window.innerWidth;
	angle = (3 - 2*xPosProportional)*Math.PI/8;
	setVectors(angle);
})


requestAnimationFrame(draw);

// TO DO - Turn off angle on mouse for touchscreens
// Make nicer colours
// Publish it