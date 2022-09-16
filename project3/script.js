const canvas1 = document.getElementById("canvas1");
const ctx1 = canvas1.getContext("2d");
const canvas2 = document.getElementById("canvas2");
const ctx2 = canvas2.getContext("2d");
const canvas3 = document.getElementById("canvas3");
const ctx3 = canvas3.getContext("2d");
const canvas4 = document.getElementById("canvas4");
const ctx4 = canvas4.getContext("2d");
CANVAS_WIDTH = canvas1.width = canvas2.width = canvas3.width= canvas4.width= 320;
CANVAS_HEIGHT = canvas1.height = canvas2.height = canvas3.height =canvas4.height = 630;

const numberOfEnemies = 10;
const enemyArray1 = [];
const enemyArray2 = [];
const enemyArray3 = [];
const enemyArray4 = [];

let gameFrame1 = 0;
let gameFrame2 = 0;
let gameFrame3 = 0;
let gameFrame4 = 0;

// ENEMY1===================================================

class Enemy1{
    constructor(){
        this.image = new Image();
        this.image.src = 'enemy1.png';
        this.spriteWidth = 293;
        this.spriteHeight = 155;
        this.width= this.spriteWidth/2.5 ;
        this.height= this.spriteHeight/2.5;
        this.x= Math.random() * (CANVAS_WIDTH - this.width);
        this.y = Math.random() * (CANVAS_HEIGHT - this.height);
        this.frame = 0; 
        this.flapSpeed = Math.floor(Math.random() * 3 +   1);

    }

    update(){
        this.x += Math.random()*5 - 2.5;
        this.y += Math.random()*5 - 2.5;
        if(gameFrame1 % this.flapSpeed === 0){
            this.frame > 4? this.frame = 0 : this.frame++;
        }
    }
    draw(){
        ctx1.drawImage(this.image, this.frame * this.spriteWidth  ,0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    }
}

for(let i=0; i< numberOfEnemies; i++){
    enemyArray1.push(new Enemy1());
}

function animate1() {
    ctx1.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    enemyArray1.forEach(enemy=>{
        enemy.update();
        enemy.draw();
    });
    gameFrame1 ++;
    requestAnimationFrame(animate1);
}

animate1();


// ENEMY2===================================================

class Enemy2{
    constructor(){
        this.image = new Image();
        this.image.src = 'enemy2.png';
        this.speed = Math.random() * 4 +1;
        this.spriteWidth = 266;
        this.spriteHeight = 188;
        this.width= this.spriteWidth/2.5 ;
        this.height= this.spriteHeight/2.5;
        this.x= Math.random() * (CANVAS_WIDTH - this.width);
        this.y = Math.random() * (CANVAS_HEIGHT - this.height);
        this.frame = 0; 
        this.flapSpeed = Math.floor(Math.random() * 3 +   1);
        this.angle = Math.random()* 2  ;
        this.angleSpeed = Math.random()* 0.2 ;
        this.curve = Math.random() * 7;

    }

    update(){
        this.x -= this.speed;
        this.y += this.curve* Math.sin(this.angle);
        this.angle += this.angleSpeed;

        if(this.x + this.width<0) this.x = CANVAS_WIDTH;
        if(gameFrame2 % this.flapSpeed === 0){
            this.frame > 4? this.frame = 0 : this.frame++;
        }
    }
    draw(){
        ctx2.drawImage(this.image, this.frame * this.spriteWidth  ,0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    }
}

for(let i=0; i< numberOfEnemies; i++){
    enemyArray2.push(new Enemy2());
}

function animate2() {
    ctx2.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    enemyArray2.forEach(enemy=>{
        enemy.update();
        enemy.draw();
    });
    gameFrame2 ++;
    requestAnimationFrame(animate2);
}

animate2();

// ENEMY3===================================================

class Enemy3{
    constructor(){
        this.image = new Image();
        this.image.src = 'enemy3.png';
        this.speed = Math.random() * 4 +1;
        this.spriteWidth = 218;
        this.spriteHeight = 177;
        this.width= this.spriteWidth/2.5 ;
        this.height= this.spriteHeight/2.5;
        this.x= Math.random() * (CANVAS_WIDTH - this.width);
        this.y = Math.random() * (CANVAS_HEIGHT - this.height);
        this.frame = 0; 
        this.flapSpeed = Math.floor(Math.random() * 3 +   1);
        this.angle = 0  ;
        this.angleSpeed = Math.random()* 2 + 0.5;

    }

    update(){
        this.x = CANVAS_WIDTH/2 * Math.sin(this.angle * Math.PI /90) + CANVAS_WIDTH/2 - this.width/2;
        this.y = CANVAS_HEIGHT/2 * Math.cos(this.angle * Math.PI /270) + CANVAS_HEIGHT/2 - this.height/2;
        
        this.angle += this.angleSpeed;

        if(this.x + this.width<0) this.x = CANVAS_WIDTH;
        if(gameFrame3 % this.flapSpeed === 0){
            this.frame > 4? this.frame = 0 : this.frame++;
        }
    }
    draw(){
        ctx3.drawImage(this.image, this.frame * this.spriteWidth  ,0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    }
}

for(let i=0; i< numberOfEnemies; i++){
    enemyArray3.push(new Enemy3());
}

function animate3() {
    ctx3.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    enemyArray3.forEach(enemy=>{
        enemy.update();
        enemy.draw();
    });
    gameFrame3 ++;
    requestAnimationFrame(animate3);
}

animate3();


// ENEMY4===================================================

class Enemy4{
    constructor(){
        this.image = new Image();
        this.image.src = 'enemy4.png';
        this.speed = Math.random() * 4 +1;
        this.spriteWidth = 213;
        this.spriteHeight = 213;
        this.width= this.spriteWidth/2.5 ;
        this.height= this.spriteHeight/2.5;
        this.x= Math.random() * (CANVAS_WIDTH - this.width);
        this.y = Math.random() * (CANVAS_HEIGHT - this.height);
        this.newX= Math.random() * (CANVAS_WIDTH - this.width);
        this.newY = Math.random() * (CANVAS_HEIGHT - this.height);
        this.frame = 0; 
        this.flapSpeed = Math.floor(Math.random() * 25 +   1);
        this.interval = Math.floor(Math.random() * 200) + 50;
    }

    update(){
        if(gameFrame4  % this.interval === 0){
            this.newX= Math.random() * (CANVAS_WIDTH - this.width);
            this.newY = Math.random() * (CANVAS_HEIGHT - this.height); 
        }

        let dx = this.x - this.newX;
        let dy = this.y - this.newY;
        this.x -= dx/20;
        this.y -= dy/20;

        if(this.x + this.width<0) this.x = CANVAS_WIDTH;
        if(gameFrame4 % this.flapSpeed === 0){
            this.frame > 4? this.frame = 0 : this.frame++;
        }
    }
    draw(){
        ctx4.drawImage(this.image, this.frame * this.spriteWidth  ,0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    }
}

for(let i=0; i< numberOfEnemies; i++){
    enemyArray4.push(new Enemy4());
}

function animate4() {
    ctx4.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    enemyArray4.forEach(enemy=>{
        enemy.update();
        enemy.draw();
    });
    gameFrame4 ++;
    requestAnimationFrame(animate4);
}

animate4();