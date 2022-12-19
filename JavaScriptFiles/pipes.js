class Pipe{
    //dont ask why... just deal with it.
    static width = 78;
    static height = 480;
    constructor(game, x, y, isFliped = false){
        this.game = game;
        this.x = x;
        this.y = y;
        this.isFliped = isFliped;
        this.width = Pipe.width;
        this.height = Pipe.height;
        this.moveSpeed = 5;
        this.markedForDeletion = false;
        this.alreadyAddedScore = false;
        this.image = this.game.IMAGES.pipeImages[0];//theres only 1 pipe image ;-;
    }

    render(context){
        if(this.isFliped){
            context.save();
            context.setTransform(-1, 0, 0, -1, this.x + this.width / 2, this.y + this.height / 2); // sets scale and origin
            context.rotate(-25.14);//almost flipped perfectly verticaly
            context.drawImage(this.image, -this.width / 2, -this.height / 2 , this.width, this.height);
            context.restore();
        }
        //draw normal image
        else { context.drawImage( this.image, this.x, this.y, this.width, this.height ); }
    }

    update(deltatime){
        //pipe dosen't move at the same speed as the ground but still needs to be insync with background and stuff.
        this.x -= this.game.gameSpeed * this.moveSpeed; 
        if(this.x + this.width <= 0) this.markedForDeletion = true;
        //have to check for flipped because there are two pipes, top and bottom  
        if(this.x <= this.game.addPointPosition && !this.alreadyAddedScore && this.isFliped){
            this.game.addPoint();
            this.alreadyAddedScore = true;
        }
            //redfine there hieghts so it doesnt look like same pipe
    }
}