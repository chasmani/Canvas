/* Setup canvas and make it resize on demand */
var canvas = document.getElementById('conway');
var context = canvas.getContext('2d');


var cellWidth = 0;
var cellHeight = 0;

var borderColor = "#333";

var cells = []
var currentTime = Date.now();
var nextCells = []
var timeSinceLastFrame = 10000;
var neighbourLocations = []


variables = {

	"cellCountX":12,
	"cellCountY":32
}





function setup() {	
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	canvas.style.backgroundColor = '#ddd';
	cellWidth = canvas.width/variables["cellCountX"];
	
	cellHeight = canvas.height/variables["cellCountY"];

	cells = []

	for (i=0;i<variables["cellCountX"];i++){
		for(j=0;j<variables["cellCountY"];j++){
			var state = Math.round(Math.random());
			cells.push(state);
		}
	}

	neighbourLocations = [
	-1-variables["cellCountX"],
	-variables["cellCountX"],
	1-variables["cellCountX"],
	-1,
	+1,
	-1+variables["cellCountX"],
	variables["cellCountX"],
	+1+variables["cellCountX"]
	]

	nextCells = []


}




setup();



function draw(){

	timeSinceLastFrame = Date.now() - currentTime;

	if (timeSinceLastFrame > 100){
		currentTime = Date.now();
		
		for (k=0;k<cells.length;k++){
			
			// Count the neighbours alive
			var neighboursAlive = 0;
			for (l=0;l<neighbourLocations.length;l++){
				var neighbourPos = k + neighbourLocations[l]
				if (neighbourPos>cells.length){
					neighbourPos -= cells.length
				}
				neighboursAlive += cells[neighbourPos];
			}

			

			// Populate nextCells for next frame
			if (neighboursAlive==3) {
				nextCells.push(1)
			}
			else if (cells[k] && neighboursAlive==2){
				nextCells.push(1)
			}
			else{
				nextCells.push(0)
			}
		

			// Draw this frame
			if (cells[k]){
				context.fillStyle = "#d4d";
			}
			else{
				context.fillStyle = "#111";
			}


			var x = k%variables["cellCountX"];
			var y = Math.floor(k/variables["cellCountX"]);
			

			context.fillRect(x*cellWidth, y*cellHeight, cellWidth, cellHeight);
			context.strokeRect(x*cellWidth, y*cellHeight, cellWidth, cellHeight);
			
		}

		

		cells = nextCells;
		nextCells = [];


	}


	requestAnimationFrame(draw)
}



function makeSlider(variable, inputName, range){


	var inputId = inputName
	var inputValueId = inputName + "-value"

	var slider = '<label for="' + inputName + '">' + inputName + ' = <span id="' + inputValueId + '">' + String(variable) + '</span></label><input type="range" min="1" max="' + String(range) + '" id="' + inputName + '">'

	var canvasControls = document.getElementById("canvas-controls");
	canvasControls.innerHTML += slider;


	var sliderInput = document.getElementById(inputId);
	var sliderValue = document.getElementById(inputValueId);

	sliderInput.addEventListener("change", function() {
    
		sliderValue.textContent = sliderInput.value;
		variable = parseInt(sliderInput.value);
		setup();

	}, false);

}


function makeSlider2(variable, inputName, range){


	var inputId = inputName
	var inputValueId = inputName + "-value"

	var slider = '<label for="' + inputName + '">' + inputName + ' = <span id="' + inputValueId + '">' + String(variables[variable]) + '</span></label>' + 
	'<input data-variable-name="' + variable + '" type="range" min="1" max="' + String(range) + '" id="' + inputName + '">'

	var canvasControls = document.getElementById("canvas-controls");
	canvasControls.innerHTML += slider;

	var sliderInput = document.getElementById(inputId);
	var sliderValue = document.getElementById(inputValueId);

	console.log(sliderInput);

	sliderInput.addEventListener("change", function() {
		console.log("Change");
    
		sliderValue.textContent = sliderInput.value;
		variable = parseInt(sliderInput.value);
		setup();

	}, false);

}



makeSlider2("cellCountX", "cellCountX", 32);
makeSlider2("cellCountY", "cellCountY", 32);




draw();