document.addEventListener('DOMContentLoaded',function(){
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 500;
    canvas.height = 600;

    class Game{
        constructor(ctx, width, height) {
            this.ctx = ctx;
            this.width = width;
            this.height = height;
            this.enemies = [];
            this.enemyInterval = 500;
            this.enemyTimer = 0;
            this.enemyTypes = ['worm', 'ghost', 'spider'];

        }
        update(deltaTime){
            this.enemies = this.enemies.filter(object => !object.markedForDeletion);
            
            if(this.enemyTimer> this.enemyInterval){
                this.#addNewEntry();
                this.enemyTimer = 0;
            }else{
                this.enemyTimer += deltaTime;
            }

            this.enemies.forEach(object=> object.update(deltaTime));
        }
        draw(){
            this.enemies.forEach(object=> object.draw(this.ctx));
        }
        #addNewEntry(){
            const randomEnemy = this.enemyTypes[Math.floor(Math.random() * this.enemyTypes.length)]
            if(randomEnemy === 'worm') this.enemies.push(new Worm(this));
            else if(randomEnemy === 'ghost') this.enemies.push(new Ghost(this));
            else if(randomEnemy === 'spider') this.enemies.push(new Spider(this));
            
            // this.enemies.sort(function(a,b){
            //     return a.y - b.y;
            // })
        }
    }

    class Enemy{
        constructor(game){
            this.game = game;
            this.markedForDeletion = false;
            this.frameX = 0;
            this.maxFrame = 5;
            this.frameInterval = 100;
            this.frameTimer = 0;
        }
        update(deltaTime){
            this.x-= this.vx * deltaTime;
            if(this.x < 0 - this.width || this.y < 0 - this.height){
                this.markedForDeletion = true;
            }
            if(this.frameTimer > this.frameInterval){
                if(this.frameX < this.maxFrame){
                    this.frameX ++;
                }else{
                    this.frameX = 0;
                }
                this.frameTimer = 0;
            }else{
                this.frameTimer += deltaTime;
            }
        }
        draw(){
            ctx.drawImage(this.image, this.frameX * this.spriteWidth,0, this.spriteWidth, this.spriteHeight,  this.x, this.y, this.width, this.height)
        }
    }

    class Worm extends Enemy{
        constructor(game){
            super(game);
            this.image = worm;
            this.spriteWidth = 229;
            this.spriteHeight = 171;
            this.width = this.spriteWidth/4;
            this.height = this.spriteHeight/4;
            this.x = this.game.width;
            this.y = this.game.height - this.height;
            this.vx = Math.random() * 0.1 + 0.1;

        }
    }

    class Spider extends Enemy{
        constructor(game){
            super(game);
            this.spriteWidth = 310;
            this.spriteHeight = 175;
            this.width = this.spriteWidth/4;
            this.height = this.spriteHeight/4;
            this.image = spider;
            this.x = Math.random() * this.game.width;
            this.y = 0 - this.height;
            this.vx = 0;
            this.vy = Math.random() * 0.1 + 0.1;
            this.maxLength = Math.random() * this.game.height;

        }
        update(deltaTime){
            super.update(deltaTime);
            this.y += this.vy * deltaTime;
            if(this.y> 200) this.vy *= (-1)
        }
        draw(ctx){
            ctx.beginPath();
            ctx.moveTo(this.x + this.width/2 ,0);
            ctx.lineTo(this.x + this.width/2, this.y);
            ctx.stroke();
            super.draw(ctx);

        }

    }

    class Ghost extends Enemy{
        constructor(game){
            super(game);
            this.image = ghost;
            this.spriteWidth = 261;
            this.spriteHeight = 209;
            this.x = this.game.width;
            this.y = Math.random() * this.game.height * 0.5;
            this.width = this.spriteWidth/4;
            this.height = this.spriteHeight/4;
            this.vx = Math.random() * 0.2 + 0.1;
            this.angle = 0;
            this.curve = Math.random() * 3;
        }
        update(deltaTime){
            super.update(deltaTime);
            this.y += Math.sin(this.angle) * this.curve;
            this.angle += 0.04;
        }
        draw(ctx){
            ctx.save();
            ctx.globalAlpha = 0.5;
            super.draw(ctx);
            ctx.restore();

        }
    }

    const game = new Game(ctx, canvas.width, canvas.height);
    let lastTime = 1;
    function animate(timeStamp){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        game.update(deltaTime);
        game.draw();
        requestAnimationFrame(animate);
    }
    animate(0);
});