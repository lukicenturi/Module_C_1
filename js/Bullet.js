// This is the class handle the bullet by the player or enemy
class Bullet{
    constructor(x,y,sx){
        this.object = $("<div class='bullet " + (sx > 0 ? 'blue' : 'red') + "' ></div>");
        $('.element').prepend(this.object);

        this.w = this.object[0].offsetWidth;
        this.h = this.object[0].offsetHeight;

        this.x = x;
        this.y = y;
        this.sx = sx;
    }

    // This method update the bullet movement
    update(){
        this.x += this.sx;

        this.object.css({
            transform: 'rotate('+this.rotate+'deg)',
            left: this.x + 'px',
            top: this.y + 'px',
        });
    }
}