// This is the class to control player in the game
class Player{
    constructor(){
        this.object = $("#player");
        this.x = this.object[0].offsetLeft;
        this.y = this.object[0].offsetTop;
        this.w = this.object[0].offsetWidth;
        this.h = this.object[0].offsetHeight;

        this.rotate = 0;
        this.sx = 0;
        this.sy = 0;
    }

    // This method run when the player press Space and shoot a bullet
    shoot(){
        game.object.push(new Bullet(this.x + this.w, this.y + this.h / 2, 6));
    }

    // This method change the movement of the player ship
    update(){
        this.x += this.sx;
        this.y += this.sy;

        this.x = Math.max(0, Math.min(this.x, 960 - this.w));
        this.y = Math.max(0, Math.min(this.y, 600 - this.h));

        this.object.css({
            transform: 'rotate('+this.rotate+'deg)',
            left: this.x + 'px',
            top: this.y + 'px',
        })
    }
}