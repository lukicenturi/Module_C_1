// This is the class to handle friend class
class Friend{
    constructor(){
        this.object = $("<div class='friend animation'></div>");
        $('.element').prepend(this.object);

        this.w = this.object[0].offsetWidth;
        this.h = this.object[0].offsetHeight;

        this.x = 970;
        this.y = Math.floor(Math.random() * (600 - this.h));
        this.sx = -3;
    }

    // This method change friend ship movement
    update(){
        this.x += this.sx;

        this.object.css({
            transform: 'rotate('+this.rotate+'deg)',
            left: this.x + 'px',
            top: this.y + 'px',
        })
    }
}