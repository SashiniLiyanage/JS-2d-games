const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width = window.innerWidth;
const CANVAS_HEIGHT = canvas.height = window.innerHeight;


const collisionCanvas = document.getElementById('collisionCanvas');
const collisionCtx = collisionCanvas.getContext('2d');
const CCANVAS_WIDTH = collisionCanvas.width = window.innerWidth;
const CCANVAS_HEIGHT = collisionCanvas.height = window.innerHeight;

let score = 0;  
let gameOver = false;   
let level = 2;     
let ravens = [];
let ravenInterval = 500;
let lastTime = 0;
let timeToNextRaven = 0;

class Raven {
    constructor(){
        this.spriteWidth = 271;
        this.spriteHeight = 194;
        this.sizeModifier = Math.random()* 0.5 + 0.2;
        this.width = this.spriteWidth * this.sizeModifier;
        this.height = this.spriteHeight * this.sizeModifier;
        this.x = CANVAS_WIDTH;
        this.y = Math.random() * (CANVAS_HEIGHT - this.height);
        this.directionX = Math.random() * 5 + 3;
        this.directionY = Math.random() * 5 - 2.5;
        this.markedForDeletion = false;
        this.image = new Image();
        this.image.src = 'raven.png';
        this.frame = 0;
        this.timeSinceFlap = 0;
        this.flapInterval = Math.random()*50 + 50;
        this.randomColors = [Math.floor(Math.random()*255),Math.floor(Math.random()*255),Math.floor(Math.random()*255)];
        this.color = 'rgb(' + this.randomColors[0] + ', ' + this.randomColors[1] +',' + this.randomColors[2] + ')';
    }
    update(deltatime){
        if(this.y <0 || this.y>CANVAS_HEIGHT- this.height ){
            this.directionY = this.directionY *(-1);
        }

        this.x -= this.directionX; 
        this.y += this.directionY;

        if(this.x <0 - this.width) this.markedForDeletion = true;
        this.timeSinceFlap += deltatime;
        if(this.timeSinceFlap > this.flapInterval){
            if(this.frame > 4) this.frame =0;
            this.frame++;
            this.timeSinceFlap = 0;
        }

        if(this.x < 0 - this.width) {
            level--;
        }

        if(level <0) gameOver = true;

        
        
    }
    draw(){
        collisionCtx.fillStyle = this.color;
        collisionCtx.fillRect(this.x,this.y,this.width ,this.height);
        ctx.drawImage(this.image, this.frame* this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    }
}

let explotions = [];

class Explotion{
    constructor(x,y, size){
        this.image = new Image();
        this.image.src = 'boom.png';
        this.spriteWidth = 200,
        this.spriteHeight = 179;
        this.size = size;
        this.x =x;
        this.y =y;
        this.frame = 0;
        this.sound = new Audio();
        this.sound.src= 'boom.wav';
        this.timeSinceLastFrame = 0;
        this.frameInterval = 200;
        this.markedForDeletion = false;
    }
    update(deltatime){
        if(this.frame === 0) this.sound.play();
        this.timeSinceLastFrame += deltatime
        if(this.timeSinceLastFrame> this.frameInterval){
            this.timeSinceLastFrame = 0;
            this.frame++;
            if(this.frame > 5) this.markedForDeletion = true;
        }

    }
    draw(){
        ctx.drawImage(this.image, this.frame*this.spriteWidth,0,this.spriteWidth,this.spriteHeight,this.x, this.y, this.size,this.size);
    }
}

function drawScore(){
    ctx.font = '40px Impact';
    ctx.fillStyle = 'black';
    ctx.fillText("Score: "+score , 50, 75);
    ctx.fillStyle = 'white';
    ctx.fillText("Score: "+score , 55, 80);
}

function drawGameOver(){
    ctx.textAlign = 'center';
    ctx.fillStyle = 'black';
    ctx.fillText('GAME OVER, your score is: '+score, CANVAS_WIDTH/2, CANVAS_HEIGHT/2 );
    ctx.fillStyle = 'white';
    ctx.fillText('GAME OVER, your score is: '+score, CANVAS_WIDTH/2 + 5, CANVAS_HEIGHT/2 + 5 );
}

window.addEventListener('click', function(e){
    
    const detectPixelColor = collisionCtx.getImageData(e.x,e.y,1,1);
    const pc = detectPixelColor.data;
    ravens.forEach(object =>{
        if(object.randomColors[0]===pc[0] &&
            object.randomColors[1]===pc[1] &&
            object.randomColors[2]===pc[2]
        ){
            //collision detection by color
            object.markedForDeletion = true;
            score++;
            explotions.push(new Explotion(object.x, object.y, object.width))
        }
    })
})


function animate(timestamp){
    ctx.clearRect(0,0, CANVAS_WIDTH, CANVAS_HEIGHT);
    collisionCtx.clearRect(0,0, CANVAS_WIDTH, CANVAS_HEIGHT);

    let deltatime = timestamp - lastTime;
    lastTime = timestamp;
    timeToNextRaven += deltatime;
    if(timeToNextRaven > ravenInterval){
        ravens.push(new Raven());
        timeToNextRaven = 0;
        ravens.sort(function(a,b){
            return a.width - b.width;
        });
    }

    drawScore();

    [...ravens, ...explotions].forEach(object=> object.update(deltatime));
    [...ravens, ...explotions].forEach(object=> object.draw());


    ravens = ravens.filter(object=> !object.markedForDeletion);
    explotions = explotions.filter(object=> !object.markedForDeletion);

    if(!gameOver)  requestAnimationFrame(animate);
    else drawGameOver();
}

animate(0);
