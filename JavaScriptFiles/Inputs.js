class Inputs{
    constructor(){
        this.vailkdKeys = {"Space": "jump"};
        this.keys = {"jump": false};
        this.gameIsPaused = false;

        window.addEventListener("keydown", ( { code } ) => {
            if(this.vailkdKeys.hasOwnProperty(code)) { this.keys[this.vailkdKeys[code]] = true; }
            else if(code === "KeyR") { location.reload(); }
            else if(code === "KeyP") { this.gameIsPaused = !this.gameIsPaused; }
        });

        window.addEventListener("keyup", ( { code } ) => {
            if(this.vailkdKeys.hasOwnProperty(code)){ this.keys[this.vailkdKeys[code]] = false; }
        });
    }
}