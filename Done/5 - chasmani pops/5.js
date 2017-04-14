var canvas = document.getElementById("canvas_5");
var context = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.backgroundColor = '#404040';
var pacer = -1;
var bubbleArray = [];

var FONTS = ["Andale Mono", 
	"Arial", 
	"Arial Italic",
	"Arial Black",
	"Courier New",
	"Georgia",
	"Impact",
	"Lucida Console",
	"Lucida Sans Unicode",
	"Marlett",
	"Minion Web",
	"Symbol",
	"Times New Roman",
	"Trebuchet MS",
	"Verdana"
	];

function drawBubble(ctx, x, y, w, h, radius, strokeColor, lineWidth)
{
  var r = x + w;
  var b = y + h;
  ctx.beginPath();
  ctx.strokeStyle=strokeColor;
  ctx.fillStyle = "#fff";
  ctx.lineWidth=lineWidth;
  ctx.moveTo(x+radius, y);
  ctx.lineTo(r-radius, y);
  ctx.quadraticCurveTo(r, y, r, y+radius);
  ctx.lineTo(r, y+h-radius);
  ctx.quadraticCurveTo(r, b, r-radius, b);
  ctx.lineTo(x+radius, b);
  ctx.quadraticCurveTo(x, b, x, b-radius);
  ctx.lineTo(x, y+radius);
  ctx.quadraticCurveTo(x, y, x+radius, y);
  ctx.stroke();
  ctx.fill();
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}



function TextBubble(){
	this.font = FONTS[Math.floor(Math.random()*FONTS.length)];
	this.textSize = Math.floor(Math.random()*80) + 10;
	this.x = Math.floor(Math.random()*canvas.width);
	this.y = Math.floor(Math.random()*canvas.height);
	this.startTime = Date.now();
	this.fontColor = getRandomColor();	

	
	this.fontStyle = String(this.textSize) + "px " + this.font;
	if (Math.random() < 0.5){
		this.fontstyle = "Bold " + this.fontStyle 
	}
	context.font = this.fontStyle;
	this.text = "chasmani"
	// Draw the text outside the window to get the text width and so bubble sizes
	context.fillText(this.text,-1000,-1000)
	var metrics = context.measureText(this.text);
	this.textWidth = metrics.width;
	this.maxBubbleHeight = this.textSize*2;
	this.maxBubbleWidth = this.textWidth*1.5;
	this.maxBubbleRadius = this.textSize;
	this.maxLineWidth = this.textSize;

	this.draw = function() {

		// Have the bubble pop out by drawing it growing to full size
		var now = Date.now();
		var bubbleAge = now - this.startTime;
		var popTime = 250;
		var bubbleHeight = (this.maxBubbleHeight/popTime) * bubbleAge; 
		var bubbleWidth = (this.maxBubbleWidth/popTime) * bubbleAge;
		var bubbleRadius = (this.maxBubbleRadius/popTime) * bubbleAge;

		this.drawBubble(bubbleHeight, bubbleWidth, bubbleRadius);
		
		// Once the bubble is full size, write the text 
		if (bubbleAge > popTime) {
			this.drawText()		
			// Once drawn at max size, remove from array
			bubbleIndex = bubbleArray.indexOf(this);
			bubbleArray.splice(bubbleIndex, 1)
		}
	}

	this.drawBubble = function(bubbleHeight, bubbleWidth, bubbleRadius) {
		var bubbleY = this.y-this.textSize/4-bubbleHeight/2;
		var bubbleX = this.x-bubbleWidth/2 + this.textWidth/2;
		drawBubble(context, bubbleX,bubbleY,bubbleWidth,bubbleHeight,bubbleRadius, this.fontColor, this.maxLineWidth)	
	}

	this.drawText = function() {
		context.fillStyle = this.fontColor;
		context.font = this.fontStyle;
		context.fillText(this.text,this.x,this.y)
		
	}
}

function draw(){
	
	pacer += 1;
	if (pacer %5 == 0){		
		var new_bubble = new TextBubble(); 
		bubbleArray.push(new_bubble);
	}
	for (i=0;i<bubbleArray.length;i++){
		bubbleArray[i].draw();
	}
	requestAnimationFrame(draw);
}

requestAnimationFrame(draw);