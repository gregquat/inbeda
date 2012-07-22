var Alien = function(aType,aLine,aCol){
	this.type = aType;
	this.line = aLine;
	this.column = aCol;
	this.alive = true;
	this.height = 20;
	this.width = 28;
	this.positionX = 100+this.width*this.column;
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

	this.down = function(){ //down the alien after changing direction
		this.positionY = this.positionY + 10;

	};

	this.move = function() { //set new position after moving and draw the alien		
		if(this.alive){			
			this.positionX = this.positionX+ 5*Game.direction;
			this.draw();
		}
		canvas2.clearRect(0,0,Game.width,Game.height);
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
		canvas.clearRect(this.positionX,this.positionY,this.width,this.height);
		canvas.drawImage(
			pic,
			85,
			20,
			28,
			20,
			this.positionX,
			this.positionY,
			this.width,
			this.height);
		canvas2.clearRect(0,0,Game.width,Game.height);
	}

	this.checkCollision = function(){
		if(Gun.gunray != null && this.alive == true){
			if((Gun.gunray.positionX >= this.positionX && Gun.gunray.positionX <= (this.positionX + this.width)) 
			&& (Gun.gunray.positionY >= this.positionY && Gun.gunray.positionY <= (this.positionY + this.height))){
				this.kill();
				Gun.gunray.destroy();
			}
		}
	}
};

var Gunray = function(aPos){
  this.positionX = aPos;
  this.positionY = 444;
  this.length = 15;

  this.draw = function(){	//draw the alien to his new position

  	for(i=0;i<5;i++){
			for(j=0;j<11;j++){							
				Game.aliens[i][j].checkCollision();
			}
		}

  	canvas2.clearRect(0,0,Game.width,Game.height);
		canvas2.beginPath();
		canvas2.lineWidth=2;
		canvas2.strokeStyle='white';
		canvas2.moveTo(this.positionX,this.positionY);
		canvas2.lineTo(this.positionX,this.positionY+this.length);
		canvas2.closePath();
		canvas2.stroke();
		this.positionY -= 10;

		if(this.positionY<=0){
			this.destroy();
		}
	}

	this.destroy = function(){ //Destroy the gunray
		clearInterval(Gun.gunrayAnimation);		
		Gun.gunray = null;
		canvas2.clearRect(0,0,Game.width,Game.height);
	}
};

Gun = {
	position: 220,
	gunrayAnimation: null,

	init: function(){
		this.draw();
		this.toright();
	},

	draw: function() {
		canvas.drawImage(pic,85,0,28,20,this.position,470,28,20);
	},

	fire: function() {
		if(this.gunray ==null){
			this.gunray = new Gunray(this.position);
			this.gunrayAnimation = setInterval("Gun.gunray.draw()",30);
		}
	},

	toleft: function(){
		if(this.position-5>0){
			canvas.clearRect(0,472,Game.width,28);
			this.position -= 5;
			this.draw();
		}
	},

	toright: function(){
		if(this.position+30<Game.width){
			canvas.clearRect(0,472,Game.width,28);
			this.position += 5;
			this.draw();
		}
	},

};

Game = {
	types: [1,2,2,3,3], //define kinds of aliens
	aliens: [[11],[11],[11],[11],[11]],
	height: 0,
	width: 0,
	interval: 600,
	direction: 1,
	animation: null,
	alives:0,

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

		Gun.init();

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
		canvas.clearRect(0,0,this.width,this.height-28);
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
	increaseSpeed: function(){ //play the game
		clearInterval(this.animation);
		this.interval = this.interval-10;
		this.animation = setInterval("Game.animate()",this.interval);
	},	

	onkeydown: function(ev){
        if(ev.keyCode == 37) Gun.toleft();
        else if(ev.keyCode == 39) Gun.toright();
        else if(ev.keyCode == 32) Gun.fire();
        else return;
    },
};

//define the global context of the game
var element = document.getElementById('aliensCanvas');
if (element.getContext) {
	var canvas = element.getContext('2d');

	var pic = new Image();
	pic.src = 'sprite.png';

	Game.init(530,500);

	document.body.onkeydown = function(ev) { Game.onkeydown(ev); };

	
}

var element2 = document.getElementById('gunraysCanvas');
if (element2.getContext) {
	var canvas2 = element2.getContext('2d');
}

