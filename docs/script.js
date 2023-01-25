window.addEventListener('load', function() {
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 720;
    let enemies = [];
    let score = 0;
    let gameOver = false;
    const fullScreenButton = document.getElementById('fullScreenButton');


    class InputHandler{
        constructor(){
            this.keys = [];
            this.touchY = '';
            this.touchX = '';
            this.touchThreshold = 30;

            window.addEventListener('keydown', (e)=>{
                if((    e.key === 'ArrowDown' ||
                        e.key === 'ArrowUp' || 
                        e.key === 'ArrowLeft' || 
                        e.key === 'ArrowRight' || 
                        e.key === ' ')
                        && this.keys.indexOf(e.key) === -1
                ){
                    this.keys.push(e.key)
                }else if(e.key === 'Enter' && gameOver) {
                    restartGame();
                }
            })
            window.addEventListener('keyup', (e)=>{
                if(     e.key === 'ArrowDown' ||
                        e.key === 'ArrowUp' || 
                        e.key === 'ArrowRight' || 
                        e.key === 'ArrowLeft' || 
                        e.key === ' '
                ){
                    this.keys.splice(this.keys.indexOf(e.key),1);
                }
            });

            window.addEventListener('touchstart', e=>{
                this.touchY = e.changedTouches[0].pageY;
                this.touchX = e.changedTouches[0].pageX;
            });

            window.addEventListener('touchmove', e=>{
                const swipeDistanceY = e.changedTouches[0].pageY - this.touchY;
                const swipeDistanceX = e.changedTouches[0].pageX - this.touchX;

                if(swipeDistanceY < -this.touchThreshold && this.keys.indexOf('swipe up')=== -1) {
                    this.keys.push('swipe up');
                }else if (swipeDistanceY > this.touchThreshold && this.keys.indexOf('swipe down')=== -1) {
                    this.keys.push('swipe down');
                    if(gameOver) restartGame();
                }

                if(swipeDistanceX < -this.touchThreshold && this.keys.indexOf('swipe left')=== -1) {
                    this.keys.push('swipe left');
                }else if (swipeDistanceX > this.touchThreshold && this.keys.indexOf('swipe right')=== -1) {
                    this.keys.push('swipe right');
                }
            });

            window.addEventListener('touchend', e=>{
                this.keys.splice(this.keys.indexOf('swipe up'),1);
                this.keys.splice(this.keys.indexOf('swipe down'),1);
                this.keys.splice(this.keys.indexOf('swipe right'),1);
                this.keys.splice(this.keys.indexOf('swipe left'),1);
            });
        }
    }

    class Player{
        constructor(gameWidth, gameHeight){
            this.gameHeight = gameHeight;
            this.gameWidth = gameWidth;
            this.width = 200;
            this.height = 200;
            this.x = 0;
            this.y = this.gameHeight - this.height;
            this.image = playerImage;
            this.frameX = 0;
            this.frameY = 0;
            this.maxFrame = 8;
            this.fps = 20;
            this.frameTimer = 0;
            this.frameInterval = 1000/this.fps;
            this.speed = 1;
            this.vy = 0;
            this.weight = 1;
        }
        restart(){
            this.x = 0;
            this.y = this.gameHeight - this.height;
        }
        draw(ctx){
            ctx.drawImage(this.image, this.frameX * this.width,this.frameY * this.height, this.width, this.height, this.x,this.y, this.width, this.height);
            // ctx.strokeStyle = 'white';
            // ctx.beginPath();
            // ctx.arc(this.x + this.width/2, this.y + this.height/2 + 20, this.width/3, 0, Math.PI * 2);
            // ctx.stroke();
            
        }
        update(input, deltaTime, enemies){
            
            // collision detection
            enemies.forEach(enemy => {
                const dx = enemy.x + enemy.width/2 - 10 - this.x - this.width/2;
                const dy = enemy.y + enemy.height/2 - this.y - this.height/2 - 20;
                const distance = Math.sqrt(dx*dx+dy*dy);
                if(distance < enemy.width/3 + this.width/3){
                    gameOver = true;
                }
            });

            //sprite aniations
            if(this.frameTimer>this.frameInterval){            
                if(this.frameX >= this.maxFrame) this.frameX = 0;
                else this.frameX ++;  
                this.frameTimer = 0;
            }else{
                this.frameTimer += deltaTime;
            }

            // controls
            if((input.keys.indexOf(' ')>-1 || input.keys.indexOf('swipe up')>-1) && this.onGround()){
                this.vy -= 20;
            }else{
                this.speed = 0;
            }

            if(input.keys.indexOf('ArrowRight')>-1 || input.keys.indexOf('swipe right')>-1){
                this.speed = 5;
            }else if(input.keys.indexOf('ArrowLeft')>-1 || input.keys.indexOf('swipe left')>-1){
                this.speed = -5;
            }
            
           

            //horizontal movements
            this.x+= this.speed;
            if(this.x < 0) this.x = 0;
            else if (this.x > this.gameWidth - this.width) this.x = this.gameWidth - this.width;
            //vertical movements
            this.y += this.vy;
            if(!this.onGround()){
                this.vy += this.weight;
                this.frameY = 1;
                this.maxFrame = 6;
            }else{
                this.vy = 0;
                this.frameY = 0;
                this.maxFrame = 8;
            }

            if(this.y > this.gameHeight - this.height) this.y = this.gameHeight - this.height;
        } 
        onGround(){
            return this.y >= this.gameHeight - this.height;
        }
    }

    class Enemy{
        constructor(gameWidth, gameHeight){
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.spriteWidth = 160;
            this.spriteHeight = 119;
            this.width = this.spriteWidth/2;
            this.height = this.spriteHeight/2;
            this.image = enemyImage;
            this.x = this.gameWidth;
            this.y = this.gameHeight - this.height;
            this.frameX = 0;
            this.fps = 20;
            this.frameTimer = 0;
            this.frameInterval = 1000/this.fps;
            this.maxFrame = 5;
            this.speed = 4;
            this.markedForDeletion = false;
        }
        draw(ctx){
            ctx.drawImage(this.image, this.frameX * this.spriteWidth,0, this.spriteWidth, this.spriteHeight,  this.x, this.y, this.width, this.height)
            // ctx.strokeStyle = 'white';
            // ctx.beginPath();
            // ctx.arc(this.x + this.width/2 - 10, this.y + this.height/2, this.width/3,0, Math.PI * 2);
            // ctx.stroke();
            
        }
        update(deltaTime){
            if(this.frameTimer>this.frameInterval){            
                if(this.frameX >= this.maxFrame) this.frameX = 0;
                else this.frameX ++;  
                this.frameTimer = 0;
            }else{
                this.frameTimer += deltaTime;
            }

            this.x -= this.speed;
            
            if(this.x < 0 - this.width) {
                this.markedForDeletion = true;
                score++;
            }
        }
    }

    class Background{
        constructor(gameWidth, gameheight){
            this.gameWidth = gameWidth;
            this.gameHeight = gameheight;
            this.image = backgroundImage;
            this.x=0;
            this.y=0;
            this.width = 2400;
            this.height = gameheight;
            this.speed = 1;
        }
        restart(){
            this.x = 0;
        }
        draw(ctx){
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            ctx.drawImage(this.image, this.x + this.width - this.speed, this.y, this.width, this.height);
        }
        update(){
            this.x -= this.speed;
            if(this.x < 0 - this.width) this.x = 0;
        }
    }


    function handleEnemies(deltaTime) {
        if(enemyTimer > enemyInterval + randomEnemyInterval){
            enemies.push(new Enemy(canvas.width, canvas.height));
            enemyTimer = 0; 
        }else{
            enemyTimer += deltaTime;
        }
        enemies.forEach(enemy =>{
            enemy.draw(ctx);
            enemy.update(deltaTime);
        })

        enemies = enemies.filter(enemy => !enemy.markedForDeletion)

    }

    function displayStatusText(ctx){
        ctx.textAlign = 'left';
        ctx.font = '20px Helvetica';
        ctx.fillStyle = 'black';
        ctx.fillText('Score: '+ score, 10, 30);
        ctx.fillStyle = 'white';
        ctx.fillText('Score: '+ score, 11, 31);
        if(gameOver){
            ctx.font = '30px Helvetica';
            ctx.textAlign = 'center';
            ctx.fillStyle = 'red';
            ctx.fillText("Game Over! press Enter or swipe down to restart", canvas.width/2, canvas.height/4);
            ctx.fillStyle = 'white';
            ctx.fillText("Game Over! press Enter or swipe down to restart", canvas.width/2 + 2, canvas.height/4 + 2);
        }
    }

    function restartGame(){
        player.restart();
        background.restart();
        enemies = [];
        score = 0;
        gameOver = false;
        animate(0);
    }

    function toggleFullscreen(){
        if(!document.fullscreenElement){
            canvas.requestFullscreen().catch(err=>{
                alert(`Error, can't enable fullscreen: ${err}`);
            });
        }else{
            document.exitFullscreen();
        }
    }

    fullScreenButton.addEventListener('click', toggleFullscreen);

    const input = new InputHandler();
    const player = new Player(canvas.width, canvas.height);
    const background = new Background(canvas.width, canvas.height);
    const enemy1 = new Enemy(canvas.width, canvas.height);

    let lastTime = 0;
    let enemyTimer = 0;
    let enemyInterval = 1000;
    let randomEnemyInterval = Math.random() * 1000 + 500;

    function animate(timeStamp) {
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        console.log("gg")
        background.update();
        background.draw(ctx);
        player.update(input, deltaTime, enemies);
        player.draw(ctx);
        handleEnemies(deltaTime);
        displayStatusText(ctx);
        if(!gameOver) requestAnimationFrame(animate);
    }

    animate(0);
})