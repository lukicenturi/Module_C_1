// This is the class to handle the fuel element
class Fuel{
    constructor(){
        this.object = $("<div class='fuel animation'></div>");
        $('.element').prepend(this.object);

        this.w = this.object[0].offsetWidth;
        this.h = this.object[0].offsetHeight;

        this.x = Math.floor(Math.random() * (960 - this.w));
        this.y = -50;
        this.sy = 3;
    }

    // This method update the fuel and rotate the fuel
    update(){
        this.y += this.sy;

        this.object.css({
            transform: 'rotate('+this.rotate+'deg)',
            left: this.x + 'px',
            top: this.y + 'px',
        })
    }
}