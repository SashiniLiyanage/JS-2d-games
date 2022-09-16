const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width = 500;
const CANVAS_HEIGHT = canvas.height = 630;
 
const explotions = [];
let canvasPosition = canvas.getBoundingClientRect();

class Explotion{
    constructor(x,y){
        this.spriteWidth = 200;
        this.spriteHeight = 179;
        this.width = this.spriteWidth/2;
        this.height = this.spriteHeight/2;
        this.x = x ;
        this.y = y
        this.image = new Image();
        this.image.src = 'boom.png';
        this.sound = new Audio();
        this.sound.src = 'boom.wav';
        this.frame =0;
        this.timer=0;
        this.angle = Math.random() * 6.2;
    }
    update(){
        if(this.frame ===0) this.sound.play();
        this.timer++;
        if(this.timer%10 ===0){
            this.frame++;
        }
    }
    draw(){
        ctx.save();
        ctx.translate(this.x,this.y);
        ctx.rotate(this.angle)
        ctx.drawImage(this.image, this.spriteWidth * this.frame, 0, this.spriteWidth, this.spriteHeight, 0- this.width/2,0 - this.height/2, this.width, this.height );
        ctx.restore();
    }
}


window.addEventListener('click', function(e){
    createAnimation(e);
})

function createAnimation(e){
    let positionX = e.x- canvasPosition.left;
    let positionY = e.y- canvasPosition.top;
    explotions.push(new Explotion(positionX, positionY));
}

function animate(){
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    for(let i = 0; i < explotions.length; i++){
        explotions[i].update();
        explotions[i].draw();
        if(explotions[i].frame> 5){
            explotions.splice(i,1);
        }
    }

    requestAnimationFrame(animate);
}

animate();