// This is class to control each enemy in game
class Enemy{
    constructor(){
        this.object = $("<div class='enemy animation'></div>");
        $('.element').prepend(this.object);

        this.w = this.object[0].offsetWidth;
        this.h = this.object[0].offsetHeight;

        this.x = 970;
        this.y = Math.floor(Math.random() * (600 - this.h));
        this.sx = -3;

        // This method used to fire bullet from enemy every 1s until 2s
        this.interval = setInterval(()=>{
            if(game.isCan()){
                game.object.push(new Bullet(this.x, this.y + this.h / 2, -6));
            }
        }, Math.floor(Math.random() * 1000) + 1000);
    }

    // This method change enemy movement
    update(){
        this.x += this.sx;

        this.object.css({
            transform: 'rotate('+this.rotate+'deg)',
            left: this.x + 'px',
            top: this.y + 'px',
        })
    }
}