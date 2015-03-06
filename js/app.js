//variables used throughout the code
var plyStartX = 200;	//starting Player position.
var plyStartY = 405;	//starting Player position.
var i;   				
var iPts = 0;
//array of GEM images
var arrGems = ['Gem Blue.png', 'Gem Green.png', 'Gem Orange.png', 'Heart.png', 'Key.png', 'Rock.png'];
var rndY, rndX;			//for storing random X, Y coordinates


//all about the ENEMY
//Enemy Object
var Enemy = function() {
    this.sprite = 'images/enemy-bug.png';
}

//Enemy Update called by the engine to move the enemy.
//developed a process to randomize the speed of the enemies.
Enemy.prototype.update = function(dt) {
    var arrRow = [62, 145, 228]; 	 	//enemy line of rows
	var arrSpd = [100, 200, 400, 1200];	//variable speed multiplier to generate random speed.
	
	if (this.x <= ctx.canvas.width) {
		//randomly pick variable speed multiplier
		this.x = this.x + (arrSpd[Math.floor(Math.random() * 4)] * dt); 
		} 
	else {
		//pick random enemy starting coordinates
		rndX = Math.floor((Math.random() * 5)) - 5; //produces a negative number for entry beyond the canvas
		rndY = Math.floor(Math.random() * 3); //pick a random row to start the enemy.
	    
		this.x = rndX * 100; 	//random column beyond the canvas	    
		this.y = arrRow[rndY];	//random row from the array
		}
}

//Enemy Render called by the engine to draw the enemy
//a good way to verify if there is a collision with the player
Enemy.prototype.render = function(enemy) {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    checkCollision(this.x, this.y);
}

//all about the PLAYER
//Player Object
var Player = function() {
    this.sprite = 'images/char-boy.png';
    
	//player home base
    this.x = plyStartX;
	this.y = plyStartY;
}

//Player upate called by the engine to move the player
//set boundaries so the player stays in the canvas
//accumulate regular points and gem points
Player.prototype.update = function() {
	var min_hori = 0; 		// left boundary
	var max_hori = 400; 	// right boundary
	var max_vert = 0; 		// top boundary
	var min_vert = 405; 	// bottom boundary
	var hop_hori = 101; 	// horizontal movement
	var hop_vert = 83;  	// vertical movement

	//translate key press to move the player
    switch (this.navKeys) {
		case 'up':
			if (this.y > max_vert){
				this.y = this.y - hop_vert;		//move the player
				iPts = iPts + 10;       		//regular points for moving up, no points for other movements.
				checkGems(this.x, this.y);		//check for gem points
				if (this.y <= max_vert) {
				    iPts = iPts + 50;			//extra points for reaching the water
				    checkGems(this.x, this.y); 	//check for gem points
					}
			}
			break;
		case 'down':
			if (this.y < min_vert){
				this.y = this.y + hop_vert;		//move the player
				//iPts = iPts + 10; 			//no points
				checkGems(this.x, this.y);		//check for gem points
			}
			break;
		case 'left':
			if(this.x > min_hori) {
				this.x = this.x - hop_hori;		//move the player
				//iPts = iPts + 10;				//no points
				checkGems(this.x, this.y);		//check for gem points
			}
			break;
		case 'right':
			if(this.x < max_hori) {
				this.x = this.x + hop_hori;		//move the player
				//iPts = iPts + 10;				//no points
				checkGems(this.x, this.y);		//check for gem points
			}
			break;
		}

	//stop key press.
    this.navKeys = '';
}

//Player Render called by the engine to draw the player
//render the score box as well
Player.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
	scoreBox();
}

//Capture the key press
Player.prototype.handleInput = function(keys) {
    this.navKeys = keys;
}  

//all about the GEMS
//GEM Object
var Gems = function() {
    this.sprite = 'images/' + arrGems[Math.floor(Math.random() * 5)];

    //initial coordinates
	this.x = 99;
	this.y = 73;
}

//GEM render called by the engine
Gems.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}


//various functions
//Check if the enemy intersects with the player and tae appropriate action
var checkCollision = function(posX, posY) {
	//coordinates of the enemy may be sporadic and can be hard to exactly pinpoint
	//for a high percentage of collision detection, do the checking in a loop
    for (var i=0; i <= 50; i++) {
	    if ((Math.floor(posX) === (player.x + i)) && (Math.floor(posY) + 11 === player.y)){
		    iPts = iPts - 100;
		    player.x = plyStartX;
			player.y = plyStartY;
			
			randomizeGems();
			break;
		}
    }
}

//pick a random gem and give it random coordinates
var randomizeGems = function() {
	gems.sprite = 'images/' + arrGems[Math.floor(Math.random() * 5)];
	var arrCol = [-500, -2, 99, 200, 301, 402]; 	 	
	var arrRow = [-500, 73, 156, 239];
		
	rndX = Math.floor(Math.random() * 6);
	rndY = Math.floor(Math.random() * 4);
		    
	gems.x = arrCol[rndX]; 	    
	gems.y = arrRow[rndY];	
}

//verify if the player catches up with a gem and give appropriate points
var checkGems = function(plyX, plyY) {
	if ((plyX === gems.x) && (plyY === gems.y)){
		switch (gems.sprite) {
			case 'images/'+arrGems[0]:
				iPts = iPts + 100;
				break;
			case 'images/'+arrGems[1]:
				iPts = iPts + 150;
				break;
			case 'images/'+arrGems[2]:
				iPts = iPts + 175;
				break;
			case 'images/'+arrGems[3]:
				iPts = iPts + 200;
				break;
			case 'images/'+arrGems[4]:
				iPts = iPts + 200;
				break;
			case 'images/'+arrGems[5]:	//having some fun, subtract points for catching a rock
				iPts = iPts - 10;
				break;
		}

		//hide the gems
		gems.x = -100;
		gems.y = -100;
	}
}

//Display and keep tab of the points
var scoreBox = function() {
	var gradient=ctx.createLinearGradient(0,0,300,0);
 	gradient.addColorStop("0","purple");
 	gradient.addColorStop("0.5","red");
 	gradient.addColorStop("1.0","blue");
 	// Fill with gradient
 	ctx.strokeStyle=gradient;
	ctx.font = "35px Verdana";
	ctx.textAlign = 'center';	
	
	ctx.rect(1,586,502,35);
	ctx.fillStyle = 'white';
	ctx.fill();
	ctx.lineWidth = 3;
	ctx.stroke();
	
	//Score
	ctx.strokeText('Points: ', 70, 616);
	// Points
	ctx.strokeText(iPts, 200, 616);
}



// Now instantiate your objects.
var allEnemies = [];
var nEnemies = 3;
var player = new Player();

//push all enemies into array
for (var i=1; i <= nEnemies; i++) {
	allEnemies.push(new Enemy);
	}

var gems = new Gems();

//capture the key press
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        //37: 'left',
        //38: 'up',
        //39: 'right',
        //40: 'down',
		65: 'left',  //two of my arrow keys are broken, use these instead
		87: 'up',
		68: 'right',
		83: 'down',
    };

    player.handleInput(allowedKeys[e.keyCode]);
});