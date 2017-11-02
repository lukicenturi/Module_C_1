//This is the main game class
class Game{
    constructor() {
        //This is for state that happened during games.
        this.started = false;
        this.over = false;
        this.paused = false;
        this.muted = false;
        this.onShoot = false;
        this.onPause = false;

        // This is the state in number in the game
        this.fontSize = 1;
        this.score = 0;
        this.timer = 0;
        this.fuel = 15;
        this.miliseconds = 0;

        // This is the object that presented in the game
        this.player = {};
        this.object = [];

        // This is the array to contain which element to remove in the game
        this.temp = [];

        // This is thie list of audio in this game
        this.audio = {
            bg: new Audio('sound/background.mp3'),
            destroy: new Audio('sound/destroyed.mp3'),
            shoot: new Audio('sound/shoot.mp3')
        };

        //This is set the background to play over and over (loop)
        this.audio.bg.loop = true;


        // This is the first method to run in this game
        this.listener();
    }

    // This is the method that run when the start button clicked
    start(){
        this.started = true;
        $("#ready").removeClass('active');
        $(".animation").css('animation-play-state','running');
        this.audio.bg.play();
        this.generate();
        this.update();
    }

    // This is the method that check whether the game is in playable state or not
    isCan(){
        return this.started && !this.paused && !this.over;
    }

    // This is the listener of the button, window, and other event
    listener(){
        $(window).on('keydown', (e)=>{
            let a = e.keyCode;
            if(a > 36 && a < 41){
                e.preventDefault();
                if(this.isCan()) this.move(a);
            }
            else if(a == 32 && !this.onShoot && !this.over){
                e.preventDefault();
                if(this.isCan()){
                    this.shootSound();
                    this.player.shoot();
                    this.onShoot = true;
                }
            }else if(a == 80 && !this.onPause && !this.over){
                e.preventDefault();
                this.bindPause(this.paused);
                this.onPause = true;
            }
        });

        $(window).on('keyup', (e)=>{
            let a = e.keyCode;
            if(a > 36 && a < 41){
                e.preventDefault();
                this.release();
            }
            else if(a == 32){
                if(this.isCan()) this.onShoot = false;
            }
            else if(a == 80){
                this.onPause = false;
            }
        });

        $('.arrow').on('mouseenter', (e)=>{
            let a = e.target.dataset.to;
            if(this.isCan()) this.move(a);
        });

        $('.arrow').on('mouseleave', (e)=>{
            this.release();
        });

        $(window).on('visibilitychange',(e)=>{
            if(document.visibilityState !== 'visible'){
                this.bindPause(false);
            }
        });

        $("#font-min").on('click',()=>{
            this.fontSize -= .1;
            this.updateFont();
        });

        $("#font-plus").on('click',()=>{
            this.fontSize += .1;
            this.updateFont();
        });

        $("#sound").on('click', ()=>{
            this.bindMuted(this.muted, this.paused);
        });

        $("#pause").on('click', ()=>{
            this.bindPause(this.paused);
        });

        $("#start").on('click',()=>{
            this.start();
        });

        $("#restart").on('click', ()=>{
            location.reload();
        });

        $("#name").on('input', ()=>{
            if($("#name").val() == ''){
                $("#submit").prop('disabled', true);
            }else{
                $("#submit").prop('disabled', false);
            }
        });

        $("#submit").on('click', ()=>{
            this.submit();
        });

        $("#name").on('keypress',(e)=>{
            let a = e.keyCode;
            if(a == 13){
                if($("#name").val() !== '') $("#submit").click();
            }
        })
    }

    // This is the event that submit the name of the player and show the ranking table to the player
    submit() {
        let url = "php/register.php";
        let data = new FormData();
        data.append('name', $("#name").val());
        data.append('score', this.score);
        data.append('time', Math.floor(this.miliseconds / 60));

        fetch(url, {
            method: 'post',
            body:data
        }).then(data => data.json())
            .then(data => {

                data = data.sort((a, b)=>{
                    if(+a.score !== +b.score){
                        return +b.score - +a.score;
                    }
                    return +b.time - +a.time;
                });

                console.log(data);

                let html = '';
                let position = 1;

                data.forEach((row, i)=>{
                    if(i > 7) return;
                    html += '<tr>'

                    html += '<td>' + position + '</td>';
                    html += '<td>' + row.name + '</td>';
                    html += '<td>' + row.score + '</td>';
                    html += '<td>' + row.time + '</td>';

                    html += '</tr>'

                    if(i < data.length - 1 && (data[i].score !== data[i+1].score || data[i].time !== data[i + 1].time)) position++;
                });

                $("table tbody").html(html);

                $("#modal").removeClass('active');
                $("#over").addClass('active');
            });
    }

    // This is method to bind the pause in the game
    bindPause(paused) {
        if(paused){
            this.paused = false;
            this.audio.bg.play();
        }else{
            this.paused = true;
            this.audio.bg.pause();
        }

        $("#pause").attr('data-pause', this.paused ? '0' : '1');
        this.bindMuted(!this.muted, this.paused, true);
    }

    // This is method to bind muted in the game, and checked whether the game is in paused state or not
    bindMuted(muted, paused, isChange = false){
        if(muted && !paused){
            this.audio.bg.volume = 1;
            this.audio.destroy.volume = 1;
            this.audio.shoot.volume = 1;
        }else{
            this.audio.bg.volume = 0;
            this.audio.destroy.volume = 0;
            this.audio.shoot.volume = 0;
        }

        if(!isChange){
            this.muted = !this.muted;
            $("#sound").attr('data-muted', this.muted ? '0' : '1');
        }
    }

    // This method play sound which player shoot the bullet
    shootSound(){
        this.audio.shoot.currentTime = 0;
        this.audio.shoot.play();
    }

    // This method play sound which there are element destroyed or crashed in the game
    destroySound(){
        this.audio.destroy.currentTime = 0;
        this.audio.destroy.play();
    }

    // This method generate the element needed in the game
    generate(){
        this.createPlayer();
        this.createFriend();
        //
        setTimeout(()=>{
            this.createEnemy();
            this.createFuel();
            this.createAsteroid();
        }, 1500);
    }

    // This method generate Player Ship
    createPlayer(){
        this.player = new Player();
    }

    // This method generate Friend Ship
    createFriend(){
        if(this.started && !this.paused && !this.over){
            this.object.push(new Friend());

        }
        setTimeout(()=>{
            this.createFriend();
        }, 3000);
    }

    // This method generate Asteroid
    createAsteroid(){
        if(this.started && !this.paused && !this.over){
            this.object.push(new Asteroid());

        }
        setTimeout(()=>{
            this.createAsteroid();
        }, 3500);
    }

    // This method generate Enemy
    createEnemy(){
        if(this.started && !this.paused && !this.over){
            this.object.push(new Enemy());

        }
        setTimeout(()=>{
            this.createEnemy();
        }, 3000);
    }

    // This method generate Fuel
    createFuel(){
        if(this.started && !this.paused && !this.over){
            this.object.push(new Fuel());

        }
        setTimeout(()=>{
            this.createFuel();
        }, 6000);
    }

    // This is method to determine where the Player Ship go
    move(a){
        if(a == 37){
            this.player.sx = -5;
            this.player.rotate = -10;
        } else if(a == 38){
            this.player.sy = -5;
            this.player.rotate = 10;
        } else if(a == 39){
            this.player.sx = 5;
            this.player.rotate = 10;
        } else if(a == 40){
            this.player.sy = 5;
            this.player.rotate = -10;
        }
    }

    // This is release the movement of the Player Ship
    release(){
        this.player.sx = 0;
        this.player.sy = 0;
        this.player.rotate = 0;
    }

    // This method update the font size of the score and timer
    updateFont(){
        $(".font-control").css({
            'font-size': this.fontSize + "em"
        })
    }

    // This method determine which object to remove, when the object out of the game layer
    clearObject(){
        this.object.forEach((object, index)=>{
            if(object.x < -100 || object.x + object.w > 1360 || object.y < -200 || object.y + object.h > 800){
                this.temp.push(index);
            }
        });
    }

    // This method detect collision between a element and other
    detectCollision(){
        let object = [...this.object, this.player];
        let detected;

        object.forEach((first, i)=>{
            detected = false;
            object.forEach((second, j)=>{
                if(first.x < second.x + second.w && first.x + first.w > second.x
                && first.y < second.y + second.h && first.y + first.h > second.y){
                    let firstName = first.constructor.name;
                    let secondName = second.constructor.name;

                    if(firstName === 'Bullet' && first.sx > 0 && !detected){
                        if(secondName === 'Enemy'){
                            this.destroySound();
                            this.score += 5;
                            this.temp.push(i,j);
                            this.explode(second.x + second.w / 2 - 50, second.y + second.h / 2 - 50);
                            detected = true;
                        }else if(secondName === 'Friend'){
                            this.destroySound();
                            this.score -= 10;
                            this.temp.push(i,j);
                            this.explode(second.x + second.w / 2 - 50, second.y + second.h / 2 - 50);
                            detected = true;
                        }else if(secondName === 'Asteroid'){
                            this.object[j].life--;
                            this.temp.push(i);
                            if(second.life == 0){
                                this.destroySound();
                                this.score += 10;
                                this.temp.push(j);
                                this.explode(second.x + second.w / 2 - 50, second.y + second.h / 2 - 50);
                            }
                            detected = true;
                        }

                    }
                    
                    if(firstName === 'Player'){
                        if(secondName === 'Enemy' || secondName === 'Friend' || (secondName === 'Bullet' && second.sx < 0) || secondName === 'Asteroid'){
                            this.destroySound();
                            this.fuel -= 15;
                            this.temp.push(j);
                            if(secondName !== 'Bullet') this.explode(second.x + second.w / 2 - 50, second.y + second.h / 2 - 50);
                            detected = true;
                        }
                        else if(secondName === 'Fuel'){
                            this.fuel += 15;
                            this.temp.push(j);
                            detected = true;
                        }
                    }
                }
            })
        })
    }

    explode(x,y){
        let div = $("<div class='explosion' style='top:"+ y + "px;left:"+ x +"px;'></div>");
        $(".element").prepend(div);
        setTimeout(()=>{
            div.remove();
        },2000);

    }

    // This method remove selected element
    removeElement(){
        for(let i = this.object.length ; i >= 0 ; i--){
            if(this.temp.indexOf(i) !== -1){
                this.object[i].object.remove();
                if(this.object[i].interval) clearInterval(this.object[i].interval);
                this.object.splice(i,1);
            }
        }
    }

    // This method check whether the fuel already zero and game over
    cekLose(){
        if(this.fuel == 0){
            this.over = true;
            setTimeout(()=>{
                this.showModal();
            },500);
        }
    }

    // This method show modal to input the name of the player
    showModal(){
        this.audio.bg.volume = 0;
        this.audio.destroy.volume = 0;
        this.audio.shoot.volume = 0;

        $("#modal").addClass('active');
        $("#name").focus();
    }

    // This method update every change and movement in the game
    update(){
        this.temp = [];
        if(this.started && !this.paused && !this.over){
            this.miliseconds ++;
            this.clearObject();
            this.detectCollision();
            this.player.update();
            this.object.forEach((object)=>{
                object.update();
            });

            this.fuel = Math.max(0, Math.min(this.fuel, 30));
            this.cekLose();
            this.removeElement();
            this.drawScore();
            this.drawTimer();
            this.drawFuel();
            $(".animation").css('animation-play-state','running');
        }else{
            $(".animation").css('animation-play-state','paused');
        }
        requestAnimationFrame(this.update.bind(this));
    }

    // This method change the score counter
    drawScore(){
        $("#score").html(this.score);
    }

    // This method change the timer counter
    drawTimer(){
        $("#timer").html(Math.floor(this.miliseconds / 60) + "s");
    }

    // This method change the fuel counter
    drawFuel(){
        if(this.miliseconds % 60 == 0) this.fuel--;
        $("#fuel").html(this.fuel);
        $(".fill").css({
            width: (this.fuel / 30 * 100) + "%"
        });
    }
}