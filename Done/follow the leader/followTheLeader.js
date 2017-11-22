

var canvas = document.getElementById("my-canvas");

var context = canvas.getContext('2d');


canvas.height = canvas.offsetHeight;
canvas.width = canvas.offsetWidth;
context.lineWidth = 15;
context.lineCap = 'round';
context.strokeStyle = "#FFD34E";
canvas.style.backgroundColor = '#105B63';

var cursor_x = 0;
var cursor_y = 0;

var imageObj = new Image();
      
imageObj.src = 'http://chasmani.com/media/uploads/2017/11/22/medium-arrow-hd.png';


document.onmousemove = function(event) {
	
	var canvasRect = canvas.getBoundingClientRect();
    
	cursor_x = event.clientX - canvasRect.left;
	cursor_y = event.clientY - canvasRect.top;
	

}

function createGrid(){
	
	var gridObjects = new Array(); 

	var gridSize = 120;

	var x_count = parseInt(canvas.width/gridSize)

	var y_count = parseInt(canvas.height/gridSize);

	var gridOffsetY = canvas.height % gridSize;
	var gridOffsetX = canvas.width % gridSize;

	for (i = 0; i < x_count; i++) { 
    	for (j=0;j<y_count;j++){
    		gridObjects.push({x:((i+0.5)*gridSize) + gridOffsetX/2 ,y:((j+0.5)*gridSize) + gridOffsetY/2});
    	}

	}

	return gridObjects;

}



function draw_one_arrow(centerX, centerY, targetX, targetY) {
	
	alpha = Math.atan((targetY-centerY)/(targetX-centerX));
	
	if ((targetX-centerX)<0){
		alpha += Math.PI;
	}

    context.translate(centerX, centerY);
	context.rotate(alpha);
	context.drawImage(imageObj, -32/2, -32/2, 32, 32);
	context.rotate(-alpha);
	context.translate(-centerX, -centerY);
       
}


function draw() {
  

	context.clearRect(0,0,canvas.width,canvas.height);

	grid = createGrid();
	
	for (var i=0; i<grid.length;i++){
			
		var centerX = grid[i].x;
		var centerY = grid[i].y;
		
		draw_one_arrow(centerX, centerY, cursor_x, cursor_y);

	}


  requestAnimationFrame(draw);
}


imageObj.onload = function() {
        draw();        
      };



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


window.addEventListener("resize", setup);
