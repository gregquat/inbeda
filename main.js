var Alien = function(aType,aLine,aCol){
	this.type = aType;
	this.line = aLine;
	this.column = aCol;
	this.alive = true;
	this.height = 20;
	this.width = 28;
	this.positionX = 150+this.width*this.column;
	this.positionY = 10+30*this.line;
	this.direction = 1;
	this.state = 0;

	this.getState = function(){ //change the state (2 different images for each alien)
		if(this.state == 0){
			this.state = 20;
		}else{
			this.state = 0;
		}
		return this.state;
	};

	this.getPositionX = function(){ //return the horizontal position
		return ;

	};

	this.move = function() { //set new position after moving
		if(this.alive){
			this.positionX = this.positionX+ 5*Game.direction;
			this.draw();
		}
	};	

	this.draw = function(){	//draw the alien to his new position
		canvas.drawImage(
			pic,
			this.width*(this.type-1),
			this.getState(),
			this.width,
			this.height,
			this.positionX,
			this.positionY,
			this.width,
			this.height);
	};

	this.kill = function() { //kill the alien
		this.alive = false;
	}
};

Game = {
	types: [1,2,2,3,3], //define kinds of aliens
	aliens: [[11],[11],[11],[11],[11]],
	height: 0,
	width: 0,
	interval: 600,
	direction: 1,

	init: function(aWidth,aHeight) { //initialize default position and behaviour
		for(i=0;i<5;i++){
			for(j=0;j<11;j++){
				this.aliens[i][j] = new Alien(this.types[i],i,j);
				this.aliens[i][j].draw();
			}
		}
		this.width = aWidth;
		this.height = aHeight;
		this.play();
	},

	changeDirection: function(){ //change the direction (left or right)
		if(this.direction == 1){
			this.direction = -1;
		}else{
			this.direction = 1;
		}
	},

	closeToLeft: function(){
		return (this.aliens[0][0].positionX - 10 < 0)?true:false;
	},

	closeToRight: function(){
		return (this.aliens[4][10].positionX + 35 > this.width)?true:false;
	},

	animate: function(){ //move the aliens
		canvas.clearRect(0,0,this.width,this.height);
		for(i=0;i<5;i++){
			for(j=0;j<11;j++){							
				this.aliens[i][j].move();
			}
		}
		if(this.closeToLeft() || this.closeToRight()){
			this.changeDirection();
		}
	},
	play: function(){ //play the game
		setInterval("Game.animate()",this.interval);
	},	
};

//define the global context of the game
var element = document.getElementById('premierCanvas');
if (element.getContext) {
	var canvas = element.getContext('2d');

	var pic = new Image();
	pic.src = 'sprite.png';		

	Game.init(600,700);
}

