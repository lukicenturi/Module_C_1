// This is class to control each asteroid in the game
class Asteroid{
    constructor(){
        this.object = $("<div class='asteroid animation' data-bg='" + (Math.floor(Math.random() * 2)) + "'></div>");
        $('.element').prepend(this.object);

        this.w = this.object[0].offsetWidth;
        this.h = this.object[0].offsetHeight;

        this.x = 970;
        this.y = Math.floor(Math.random() * (600 - this.h));
        this.sx = -3;
        this.life = 2;
    }

    // This is rotate and move the position of asteroid
    update(){
        this.x += this.sx;

        this.object.css({
            transform: 'rotate('+this.rotate+'deg)',
            left: this.x + 'px',
            top: this.y + 'px',
        })
    }
}