var canvas = document.getElementById('canvas_14');
var context = canvas.getContext('2d');

setup();

var rootNode = new Node(10, canvas.width/2,100,1);
rootNode.draw();

numbers = [1,4,21,8,4,7,2,9,16]

for(i=0;i<numbers.length;i++){
	rootNode.insert(numbers[i])
}

function setup() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	context.lineWidth = 10;
	context.lineCap = 'round';
	canvas.style.backgroundColor = '#262626';
}

function Node(key, x, y, level) {

	this.key = key;
	this.left = null;
	this.right = null;
	this.x = x;
	this.y = y;
	this.level = level;

	this.nodeGap = canvas.width/(Math.pow(2, this.level+1))

	this.radius = 0;

	this.insert = function(value) {
		if (value<this.key) {
			if (this.left == null){
				this.left = new Node(value, this.x - this.nodeGap, this.y+150, this.level+1);
				this.drawLine(this.left);
				this.left.draw();
			} else {
				this.left.insert(value);
			}
		}
		else if (value>this.key) {
			if (this.right == null){
				this.right = new Node(value, this.x + this.nodeGap, this.y+150, this.level+1);
				this.drawLine(this.right);
				this.right.draw();
			} else {
				this.right.insert(value);
			}
		}
	}


	this.draw = function() {
		
		if(this.radius<30){
			this.radius += 1;
			}

		context.beginPath();
		context.arc(this.x,this.y,this.radius,0,2*Math.PI);
		context.stroke();	


		if(this.radius==30){		
			context.textAlign="center";
			context.textBaseline="middle"; 
			context.font="30px Arial";
			context.fillText(this.key,this.x,this.y);	
			
			if(this.left){
				this.left.draw();
			}
			if(this.right){
				this.right.draw();
			}
			
		}
	}
}

function searchRecursively(value, node) {
	if ((node == null)||(node.key==value)){
		return node
	}
	else if (value<node.key){
		return searchRecursively(value, node.left)
	}
	else if (value>node.key){
		return searchRecursively(value, node.right)
	}
}

function printOrdered(node) {
	if (node.left){
		printOrdered(node.left)
	}
	console.log(node.key);
	if (node.right){
		printOrdered(node.right)
	}
}



function drawTree(node) {
	context.clearRect(0,0,canvas.width,canvas.height);
	rootNode.draw();
}


// Print tree to console
console.log(rootNode);

// Find a node and print to console
console.log(searchRecursively(7, rootNode));

// Prints nodes in order
printOrdered(rootNode);

function draw() {
	drawTree();
	requestAnimationFrame(draw);
}

window.addEventListener('resize', function(event){
	setup();
});

window.addEventListener('click', function(event) {
	console.log("CLICK!");
});

requestAnimationFrame(draw);