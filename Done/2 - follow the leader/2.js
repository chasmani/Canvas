

var canvas = document.getElementById("canvas_2");

var context = canvas.getContext('2d');


canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
context.lineWidth = 25;
context.lineCap = 'round';
context.strokeStyle = "#FFD34E";
canvas.style.backgroundColor = '#105B63';



var cursor_x = 0;
var cursor_y = 0;

document.onmousemove = function(event) {
	cursor_x = event.clientX;
	cursor_y = event.clientY;
	
}

function createGrid(){
	
	var gridObjects = new Array(); 

	var gridSize = 250;

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



function draw_one_line(centerX, centerY, targetX, targetY, length) {

	alpha = Math.atan((targetY - centerY)/(targetX - centerX));
	

	offsetX = (length/2) * Math.cos(alpha)
	offsetY = (length/2) * Math.sin(alpha)
	

	context.beginPath();
    context.moveTo(centerX - offsetX, centerY - offsetY);
    context.lineTo(centerX + offsetX, centerY + offsetY);
    context.stroke();

}



function draw() {
  

	context.clearRect(0,0,canvas.width,canvas.height);



	grid = createGrid();
	

	for (var i=0; i<grid.length;i++){
		
		console.log(grid[i]);
		var centerX = grid[i].x;
		var centerY = grid[i].y;
		console.log(centerY, centerX);
		draw_one_line(centerX, centerY, cursor_x, cursor_y,100);
	
		
	}


	


    


  requestAnimationFrame(draw);
}
requestAnimationFrame(draw);


