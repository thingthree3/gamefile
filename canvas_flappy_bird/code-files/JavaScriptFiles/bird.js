class Bird{
    //dont ask why... just deal with it.
    static width = 68;
    static height = 48;
    constructor(game, x, y){
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = Bird.width;
        this.height = Bird.height;

        this.jumpCoolDownTimer = 0;
        this.jumpCoolDownInterval = 150;

        this.maxJumpHeight = -14;
        this.maxFallingSpeed = 16;
        this.velocityY = 0;
        this.gravity = 0.8;
        this.gravityToRotateRatio =  0.1125;
        this.images = this.game.IMAGES.birdImages;
        
        this.maxRotation = 16.75;//face down
        this.leastRotation = 15;//face up
        this.rotation = this.leastRotation;//start facing up.
        
        this.currentFrame = this.images.length - 1;
        this.fps = 12;
        this.frameInterval = 1000 / this.fps;
        this.frameTimer = 0;
    }

    render(context){
        context.save();
        context.setTransform(-1, 0, 0, -1, this.x + this.width / 2, this.y + this.height / 2); // sets scale and origin
        context.rotate(this.rotation);
        context.drawImage(this.images[this.currentFrame], -this.width / 2, -this.height / 2 , this.width, this.height);
        context.restore();
        context.strokeRect(this.x + this.width * 0.25, this.y + this.height * 0.25, this.width *  0.50, this.height *  0.50)
    }

    isCollidingWith(rect){
        return (
            //apply weird math to shrink the hit box. this makes the game more forgiving 
            this.x + this.width *  0.75 > rect.x &&
            rect.x + rect.width > this.x + this.width * 0.25 &&
            this.y + this.height *  0.75 > rect.y &&
            rect.y + rect.height > this.y + this.height * 0.25
        );
    }

    update(deltatime, pipes, keyBoardInputs){

        //handle keyboard inputs
        if(keyBoardInputs.jump && this.jumpCoolDownTimer >= this.jumpCoolDownInterval){
            this.jump();
        }

        //handle deltatime.
        this.animate(deltatime);
        this.jumpCoolDownTimer += deltatime;

        //handle gravity
        if(this.velocityY < this.maxFallingSpeed) {
            this.velocityY += this.gravity * this.game.gameSpeed;
        }

        //handle pipe and ground collisions
        if(
            !pipes.every(pipe => !this.isCollidingWith(pipe))||
            this.y > this.game.background.groundPosition - this.height||
            this.y <= 0
        ){
            this.game.isGameover = true;
        }

        //apply the changes.
        this.y += this.velocityY;
        if(this.velocityY > 0 && this.rotation < this.maxRotation)this.rotation += this.gravity * this.gravityToRotateRatio;
    }

    jump(){
        this.velocityY = this.maxJumpHeight;
        this.jumpCoolDownTimer = 0;
        this.rotation = this.leastRotation;//title bird upwords. 
    }

    animate(deltatime){
        this.frameInterval = (this.velocityY < 0)? 1000 / (this.fps * 5) : 1000 / this.fps;//flapp faster when going up. ("1000" is one second)

        //we use different images rather than a sprite sheet.
        if(this.frameTimer >= this.frameInterval){
            this.frameTimer = 0;
            if(this.currentFrame > 0 ) { this.currentFrame--; }
            else { this.currentFrame = this.images.length - 1; }
        }else{ this.frameTimer += deltatime; }
    }
}
