let game;
window.addEventListener('load', function(){
    const CANVAS = this.document.getElementById('GameCanvas');
    const CTX = CANVAS.getContext('2d');
    CANVAS.height = 660;
    CANVAS.width = 575;
    
    class Game{
        //dont ask why... just deal with it.
        static addPipeInterval = 2000;
        static gameSpeed = 1;
        constructor(width, height){
            this.width = width;
            this.height = height;
            
            this.gameSpeed = Game.gameSpeed;
            this.UPDATES_PERSECOND = 120;
            this.FPS = 80;

            this.isGameover =  false;
            this.stopGame = false;
            this.timer = 0;

            this.inBetweenPipeGap = 250;
            this.addPipeInterval = Game.addPipeInterval;
            this.fatsestPipeResponeRate = 150;
            this.pipeResponeRateSubtrackAmount = 50;

            this.score = 0;

            //all images used in game
            this.IMAGES = {
                birdImages: [
                    document.querySelector("#brid_wing_up"),
                    document.querySelector("#brid_wing_middle"),
                    document.querySelector("#brid_wing_down"),
                ],
                pipeImages: [
                    document.querySelector("#pipe")
                ],
                backGroundImages:[
                    document.querySelector("#Base_Floor"),
                    document.querySelector("#Basic_BackGround_scroller"),
                ]
            }

            this.pipes = [];
            this.player = new Bird(this, this.width / 10, this.height / 5);//just 1 player for now though XD.
            this.background = new BackGround(this);
            this.iu = new UI(this);
            this.inputs = new Inputs();

            this.addPointPosition = this.player.x + Bird.width / 2;
        }

        addPipes(){
            let randomPos = Math.random() * ( this.height / 2 ) + this.height / 3;
            const lastAddedBottomPipe = this.pipes[ this.pipes.length - 1 ];
            //we can't have one pipe gap at the top of the screen and next one at the bottom of the screen or player cant get to it. 
            const heightDifference = ( this.width - lastAddedBottomPipe?.x <= 200 )? 50:250;
            if(lastAddedBottomPipe){
                while (Math.abs(lastAddedBottomPipe.y - randomPos ) > heightDifference ) {
                    randomPos = Math.random() * ( this.height / 2 ) + this.height / 3;
                }
            }
            const bottomPipe = new Pipe( this, this.width,  randomPos, false );
            const topPipe = new Pipe( this, this.width,  bottomPipe.y - Pipe.height - this.inBetweenPipeGap, true );
            
            this.pipes.push( topPipe, bottomPipe );
        }

        addPoint(){
            this.score++;
            if(this.addPipeInterval > this.fatsestPipeResponeRate){
                this.addPipeInterval -= this.pipeResponeRateSubtrackAmount;
                this.gameSpeed += 0.015;
            }
        }

        rectangularCollision(rect1, rect2){
            // #Note: make a method to check for: width, height, radius and size. and apply it here. 
            return (
                rect1.x + rect1.width > rect2.x &&
                rect2.x + rect2.width > rect1.x &&
                rect1.y + rect1.height > rect2.y && 
                rect2.y + rect2.height > rect1.y    
            );
        }

        render(context){
            this.background.render(context);
            this.pipes.forEach(pipe => pipe.render(context));
            this.player.render(context);
            this.iu.render(context);
        }

        restartGame(){
            this.addPipeInterval = Game.addPipeInterval;
            this.gameSpeed = Game.gameSpeed;
            this.score = 0;
            this.pipes = [];
            this.isGameover = false;
            this.player.x = this.width / 10;// = [new Bird(this, this.width / 10, this.height / 5)];
            this.player.y  = this.height / 5;
            this.player.jump();
            this.background = new BackGround(this);
        }

        update(deltatime){
            //handle adding pipes to game
            this.timer += deltatime;
            if(this.timer >= this.addPipeInterval){
                this.addPipes();
                this.timer = 0;
            }

            //handle updates
            this.background.update();
            this.pipes.forEach(pipe => pipe.update(deltatime));
            this.player.update(deltatime, this.pipes, this.inputs.keys);

            //filter out offscreen pipes or pipes hit by attack
            this.pipes = this.pipes.filter(pipe => !pipe.markedForDeletion);

            if(this.isGameover){
                this.restartGame();// should probably make a menu or something rather than a instant restartt
            }

            //if( this.score >= 100 ){
            //    //enter stage/level 2 ig or maybe give them an opption to go to  menu too play new level they unlocked.
            //    const answer = prompt("congragulations you have offically level 1, level 2 awaits you!\n\n do you want too go there now?\n\n\t(\"yes\" or \"no\") ")?.toLocaleLowerCase();
            //    if(answer === "yes"){
            //        //return to menu.
            //        this.stopGame = true;
            //    }
            //}
        }
    }

    const pauseGame = resolve => {
        const thisInterval = setInterval(() => {
            if(!game.inputs.gameIsPaused){
                clearInterval(thisInterval);
                resolve();
            }
        }, 100);
    };

    game = new Game(CANVAS.width, CANVAS.height);
    let lastime = 0;
    async function animate(timestamp){//this is the game loop
        const deltatime = timestamp - lastime;
        lastime = timestamp;
        CTX.clearRect(0,0, CANVAS.width, CANVAS.height);
        game.update(deltatime);
        game.render(CTX);
        if(game.inputs.gameIsPaused) await new Promise(pauseGame);
        if(!game.stopGame) { requestAnimationFrame(animate); }
        //else displayGameOverScreen();
    }
    animate(0);
});