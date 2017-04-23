var canvas = document.getElementById('canvas_14');
var context = canvas.getContext('2d');

setup();

var rootNode = new Node(10);

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

function Node(key) {

	this.key = key;
	this.left = null;
	this.right = null;

	this.insert = function(value) {
		if (value<this.key) {
			if (this.left == null){
				this.left = new Node(value);
			} else {
				this.left.insert(value);
			}
		}
		else if (value>this.key) {
			if (this.right == null){
				this.right = new Node(value);
			} else {
				this.right.insert(value);
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

// Print tree to console
console.log(rootNode);

// Find a node and print to console
console.log(searchRecursively(7, rootNode));

// Prints nodes in order
printOrdered(rootNode);

function draw() {
	requestAnimationFrame(draw);
}

window.addEventListener('resize', function(event){
	setup();
});

window.addEventListener('click', function(event) {
	console.log("CLICK!");
});

requestAnimationFrame(draw);