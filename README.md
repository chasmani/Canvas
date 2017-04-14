# Canvas

A series of animations using javascript to control a HTML5 Canvas element. 

These exercises were done to improve my javascript skills. As such, the earlier exercises are simple, and in some places poorly written, whlie the later exercises are more complex and of a higher standard.  

All animation can be seen at http://www.chasmani.com/canvas


### 1 - [circle in a circle](http://www.chasmani.com/canvas/1)

This is simply a circle rotating around another circle. A little harder to implement than you might imagine as I needed to describe the path of the center of the smaller circle. 

### 2 - [follow the leader](http://www.chasmani.com/canvas/2)

The lines follow the mouse. This was good practice for working with cursor locations.

This one doesn't work so well on mobile/touchscreen.

### 3 - [bounce](http://www.chasmani.com/canvas/3)

Some balls bouncing around the screen. It was an interesting exercise to handle colsiion detection of the balls on the edges of the screen.

### 4 - [bonfire night](http://www.chasmani.com/canvas/4)

A simple firework display. 

### 5 - [chasmani pops](http://www.chasmani.com/canvas/5)

Endless pop-ups. This is the first canvas animation that uses Object Orientated Programming design principles. Once a pop-up has popped up it's image remains on the canvas while the object itself is deleted from memory. In this way this animation can generate infinite pop-ups without slowing down. 

### 6 - [ants](http://www.chasmani.com/canvas/6)

Slightly unsettling. Ants that run around the screen. Each ant goes on a random walk. If an ant goe soff the side of the screen it wraps to the other side, essentially creating a donut shaped space for the ants to walk on.

### 7 - [worker ants](http://www.chasmani.com/canvas/7)

Clicking on the screen will deposit a blob of food. If an ant encounters some food, it will take a piec eof it back to the nest.

### 8 - [fractal tree](http://www.chasmani.com/canvas/8)

A fractal tree is generated using a recursive function. The branching angle of the tree increases with time. 

### 9 - [orchestral manoeuvers](http://www.chasmani.com/canvas/9)

A bold pattern. When the screen is clicked the colour scheme changes in a satisfying way. 

This pattern is fully responsive and resizes to fit nicely on any screen. The color scheme update of the lines travels out in a wave from the location it was clicked, and I threw in a spinning animation for kicks. 

This pattern was inspired by [album artwork by the British graphic designer Peter Saville for the self-titled debut album for Ochestral Manoeuvers in the Dark](https://en.wikipedia.org/wiki/Orchestral_Manoeuvres_in_the_Dark_(album)). Peter Saville worked closely with Factory records.

### 10 - [butterflys](http://www.chasmani.com/canvas/10)

Each butterfly consists of 3 traingles drawn around a center point. The shape of the triangles are generated randomly each animation frame, creating the fluttering effect. They should really be called moths because it is nighttime.

### 11 = [smart rockets](http://www.chasmani.com/canvas/11)

These rockets learn a path to the target through the use of an evolutionary algorithm. The fitness of each rocket is determined by how close it gets to the target, with fitter rockets more likely to pass on thier dna to the next generation. Each rocket has 1 main thruster, 1 thruster to turn left and 1 to turn right. The dna string determines which thruster(s) the rocket fires on each animation frame.  

Inspiired by this [youtube video](https://www.youtube.com/watch?v=bGz7mv2vD6g), which was in turn inspired by this [flash implementation](http://www.blprnt.com/smartrockets/) 