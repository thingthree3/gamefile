class Layer{
    constructor(scrollSpeed, image, width,  height, x, y, gameWidth){
        this.image = image;
        this.scrollSpeed = scrollSpeed;
        this.width = width * 2;
        this.height = height * 1.3;
        this.x = x;
        this.y = y;// "y" is unchanging... for now
        this.gameWidth = gameWidth - 1;
    }

    render(context){
        context.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    update(gameSpeed){
        this.x += this.scrollSpeed * -gameSpeed;
        if(this.x + this.width <= 0){
            this.x = this.gameWidth;
        }
    }
}


class BackGround {
    constructor(game){
        this.game = game;

        //bad code ik, not sure how to refactor it so its ur problem now >:3
        this.floorImage = this.game.IMAGES.backGroundImages[0];
        this.floorWidth = 336;
        this.floorHeight = 112;

        this.backgroundScrollerImage = this.game.IMAGES.backGroundImages[1];
        this.backgroundScrollerWidth = 288;
        this.backgroundScrollerHeight = 512;

        this.groundPosition = this.game.height - this.floorHeight;

        this.layers = [
            //needs two of each "Layer" for parallax background scrolling 
            new Layer( 0.2, this.backgroundScrollerImage, this.backgroundScrollerWidth, this.backgroundScrollerHeight, 0, 0, this.game.width ),
            new Layer( 0.2, this.backgroundScrollerImage, this.backgroundScrollerWidth, this.backgroundScrollerHeight, - this.game.width - this.backgroundScrollerHeight, 0, this.game.width ),
            new Layer( 3, this.floorImage, this.floorWidth, this.floorHeight, 0, this.groundPosition, this.game.width ),
            new Layer( 3, this.floorImage, this.floorWidth, this.floorHeight, - this.game.width - this.floorWidth, this.groundPosition, this.game.width )
        ];
    }

    render(context){
        this.layers.forEach(layer => layer.render(context));
    }
    
    update(){
        this.layers.forEach(layer => layer.update(this.game.gameSpeed));
    }
}