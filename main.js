var Alien = function(aType,aLine,aCol){
	this.type = aType;
	this.points = 40-10*aType;
	this.line = aLine;
	this.column = aCol;
	this.alive = true;
	this.height = 20;
	this.width = 28;
	this.positionX = 100+this.width*this.column;
	this.positionY = 100+30*this.line;
	this.direction = 1;
	this.state = 0;

	this.changeState = function(){ //change the state (2 different images for each alien)
		if(this.state == 0){
			this.state = 20;
		}else{
			this.state = 0;
		}
	};

	this.down = function(){ //down the alien after changing direction
		this.positionY = this.positionY + 10;

	};

	this.move = function() { //set new position after moving and draw the alien
		this.positionX = this.positionX+ 5*Game.direction;
		this.changeState();
		if(this.alive){
			this.draw();
		}
	};	

	this.checkCollision = function(){
		
		if(Gun.ray.positionY <= this.positionY &&
		  (Gun.ray.positionX >= this.positionX &&
		   Gun.ray.positionX <= this.positionX+28)){
		  	this.kill();
		  	Gun.ray.destroy();
		  }
	};

	this.draw = function(){	//draw the alien to his new position
		if(this.alive){
			this.checkCollision();
			canvas.drawImage(
				pic,
				this.width*(this.type-1),
				this.state,
				this.width,
				this.height,
				this.positionX,
				this.positionY,
				this.width,
				this.height);
		}
	};

	this.kill = function() { //kill the alien
		this.alive = false;
		Game.refreshScore(this.points);
	}
};

Gun = {
	position: 120,	
	toleft:false,
	toright:false,

	init: function(){
		this.draw();
		this.toLeft();
		this.toRight();
		setInterval("Gun.toLeft()",30);
		setInterval("Gun.toRight()",30);
	},

	draw: function() {
		canvas.drawImage(pic,85,0,28,20,this.position,470,28,20);
	},

	fire: function() {
		this.ray.create();
	},

	toLeft: function(){
		if(this.toleft){
			if(this.position-5>0){
				canvas.clearRect(0,472,Game.width,28);
				this.position -= 5;
				this.draw();
			}
		}
	},

	toRight: function(){
		if(this.toright){
			if(this.position+30<Game.width){
				canvas.clearRect(0,472,Game.width,28);
				this.position += 5;
				this.draw();
			}
		}
	},

	ray:{
		positionX: 0,
		positionY: 465,
		length: 10,
		animation: null,
		active: false,
		create: function(){
			if(!this.active){
				this.positionX = Gun.position+14;
				this.active = true;
				this.animation = setInterval("Gun.ray.animate()",40);
			}

		},
		animate: function(){
			this.positionY -= 10;
			if(this.positionY<=5) this.destroy();
			else{
				Game.drawAliens();				
				this.draw();
			}			
		},
		draw: function(){
			if(this.active){
				canvas.beginPath();
				canvas.strokeStyle='white';
				canvas.moveTo(this.positionX,this.positionY);
				canvas.lineTo(this.positionX,this.positionY+this.length);
				canvas.stroke();
			}
		},
		destroy: function(){
			this.positionY = 465;
			this.active = false;
			clearInterval(this.animation);			
			this.animation = null;
			Game.drawAliens();
		},
	}

};


Game = {
	types: [1,2,2,3,3], //define kinds of aliens
	aliens: [[11],[11],[11],[11],[11]],
	height: 0,
	width: 0,
	interval: 1000,
	direction: 1,
	animation: null,
	alives:0,
	score:0,

	init: function(aWidth,aHeight) { //initialize default position and behaviour
		for(i=0;i<5;i++){
			for(j=0;j<11;j++){
				this.aliens[i][j] = new Alien(this.types[i],i,j);
				this.alives++;
				this.aliens[i][j].draw();
			}
		}
		this.width = aWidth;
		this.height = aHeight;
		this.play();
		Gun.init();
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
	drawAliens: function(){
		//this.checkAliens();
		canvas.clearRect(0,0,this.width,this.height-28);				 	
		for(i=0;i<5;i++){
			for(j=0;j<11;j++){							
				this.aliens[i][j].draw();
			}
		}
	},
	animate: function(){ //move the aliens		
		canvas.clearRect(0,0,this.width,this.height-28);
		Gun.ray.draw();
		//this.checkAliens();
		for(i=0;i<5;i++){
			for(j=0;j<11;j++){							
				this.aliens[i][j].move();
			}
		}
		if(this.closeToLeft() || this.closeToRight()){
			this.changeDirection();
			for(i=0;i<5;i++){
				for(j=0;j<11;j++){							
					this.aliens[i][j].down();
				}
			}
			this.increaseSpeed();
		}
	},
	play: function(){ //play the game
		this.animation = setInterval("Game.animate()",this.interval);
	},	
	increaseSpeed: function(newInterval){ //play the game
		clearInterval(this.animation);
		if(newInterval===undefined) this.interval = this.interval-10;
		else this.interval = newInterval;
		this.animation = setInterval("Game.animate()",this.interval);
	},	
	onkeydown: function(ev){
    if(ev.keyCode == 37) Gun.toleft = true; 
    else if(ev.keyCode == 39) Gun.toright = true;
    else if(ev.keyCode == 32) Gun.fire();
    else return;
  },
  onkeyup: function(ev){
    if(ev.keyCode == 37) Gun.toleft=false;
    else if(ev.keyCode == 39) Gun.toright=false;
    else return;
	},
  checkAliens: function(){
  	if(this.alives==1) this.increaseSpeed(150);
  	else if(this.alives<=10) this.increaseSpeed(200);
  	else if(this.alives<=10) this.increaseSpeed(300);
  	else if(this.alives<=25) this.increaseSpeed(500);
  },
  refreshScore: function(points){
  	this.alives--;
  	this.score += points;
  	document.getElementById('score').innerHTML = this.score;
  	document.getElementById('alives').innerHTML = this.alives;
  },
};

//define the global context of the game
var element = document.getElementById('premierCanvas');
if (element.getContext) {
	var canvas = element.getContext('2d');

	var pic = new Image();
	pic.src = 'sprite.png';		

	document.body.onkeydown = function(ev) { Game.onkeydown(ev); };
	document.body.onkeyup = function(ev) { Game.onkeyup(ev); };

	Game.init(530,500);
}
