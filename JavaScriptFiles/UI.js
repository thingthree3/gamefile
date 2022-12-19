class UI{
    constructor(game){
        this.game = game;
        this.fontFamily = "Helvetica";
    }

    render(context){
        context.font = 40 + 'px ' + this.fontFamily;
        context.textAlign = 'left';
        context.fillStyle = "yellow";
        context.fillText("Score: " + this.game.score, 20, 50);
    }
}