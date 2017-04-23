/* Setup canvas and make it resize on demand */

var canvas = document.getElementById('canvas_8');
var context = canvas.getContext('2d');

var backupCanvas = document.getElementById('canvas_backup');
var backupContext = backupCanvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

backupCanvas.width = window.innerWidth;
backupCanvas.height = window.innerHeight;


var land_1 = {x:22,y:26};

/* Build land reference pixel */
context.fillStyle = "#0f0";
context.fillRect(land_1.x,land_1.y,1,1);

/* Build sea reference pixel */
context.fillStyle = "#00f";
context.fillRect(0,9,1,1);

var land = context.getImageData(land_1.x,land_1.y,1,1);
var sea = context.getImageData(0,9,1,1);

var active_coords = [[land_1.x, land_1.y]];
var active_coords_new = []

function fillStep() {
	
	backupContext.drawImage(canvas,0,0);
	
	console.log(active_coords.length);
	console.log(active_coords_new.length);

	for (c=0; c<active_coords.length;c++){

		x = active_coords[c][0];
		y = active_coords[c][1];

		if (Math.random()<0.2){
			
			var env = getEnv(x, y);

			if (env === "land"){
				context.putImageData(land, x, y);			
			}
			else if (env === "sea") {
				context.putImageData(sea, x, y);
			}

			for (i=-1; i<2;i++){
				for (j=-1;j<2;j++){
					if (i!=0 || j!=0){
						if (getPixel(x+i, y+j) == 0){
							active_coords_new.push([x+i, y+j])
						}
					}

				}
			}
		}
		else {
			active_coords_new.push([x,y]);
		}
	}

	active_coords = active_coords_new;
	active_coords_new = []


	for (x=0; x<50; x++){
		for (y=0; y<50; y++){
			
			if (Math.random()<0.2){

				var env = getEnv(x,y);
				if (env === "land"){
					context.putImageData(land, x, y);			
				}
				else if (env === "sea") {
					context.putImageData(sea, x, y);
				}

			}	
		}
	}



	requestAnimationFrame(fillStep);
}

function getEnv(x,y) {
	var env = backupContext.getImageData(x-1,y-1,3,3);

	landCount = 0;
	seaCount = 0;

	for (i=0;i<9;i++){

		landCount += (env.data[4*i+1]);
		seaCount += (env.data[4*i+2]);
	}
	
	if (landCount>seaCount) {
		return "land";
	}
	else if (seaCount > landCount){
		return "sea";
	}
	else {
		return 0;
	}

}

function getPixel(x,y) {
	var pixel = backupContext.getImageData(x,y,1,1);

	if ((pixel.data[1]>0)||(pixel.data[2]>0)){
		return "full";
	}
	else {
		return 0;
	}

}



fillStep();



context.putImageData(sea, 200,100);
var pixel = context.getImageData(200,100,1,1);
console.log(pixel.data);

console.log(getEnv(1,1));


/*
Initial Thoughts
Grow the map. 
Choose a numer of random initial points, that are either land or sea. 
Expand those areas out with a degreee of randomness until they hit a side of the canvas

1. Set initial pixels randomly green and brown
2. Iterate through all pixels. If you find a green or blue one, give a chance for adjabcent pixels to be the same color or stay black.
3. Keep iterating until there are no balck pixels left.
*/