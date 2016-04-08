window.Player = (function() {
    'use strict';

    var Controls = window.Controls;

    // All these constants are in em's, multiply by 10 pixels
    // for 1024x576px canvas.
    var SPEED = 5; // * 10 pixels per second
    var WIDTH = 5;
    var HEIGHT = 5;
    var INITIAL_POSITION_X = 30;
    var INITIAL_POSITION_Y = 25;
    var GRAVITY = 0.5;

    var Player = function(el, game) {
        this.el = el;
        this.game = game;
        // this.isJumping = false;
        this.JUMP_SPEED = SPEED - 3;
        this.WIDTH = document.getElementsByClassName('Player').offsetWidth;
        this.HEIGHT = document.getElementsByClassName('Player').offsetHeight;
        // this.jumped = false;
        this.pos = {
            x: 0,
            y: 0
        };
        this.scorePipe = '';
        this.velocity = 0;
        this.degs = 0;
    };

    /**
     * Resets the state of the player for a new game.
     */
    Player.prototype.reset = function() {
        this.pos.x = INITIAL_POSITION_X;
        this.pos.y = INITIAL_POSITION_Y;
        SPEED = 0;
        // this.isJumping = false;
        this.game.score = 0;
        this.scorePipe = '';
        this.velocity = 0;
        $('.Game-Score').show();
        $('.Game-Score').html('0');
    };

    Player.prototype.onFrame = function(delta) {
        if (this.game.hasStarted) {
            this.pos.y += GRAVITY;
        } else {
            this.el.css('transform', 'translateZ(0) translate(' + this.pos.x + 'em, ' + this.pos.y + 'em)');
        }
        var playerWings = this.el.find('.Player--wings');

        this.jumped = Controls.didJump();
        if (this.jumped) {
            //  Inntak controlsins að hoppa! Hvort það sé að þú sért að hoppa upp einusinni eða oftar
            // console.log('Hoppar einusinni eða hoppar oft!');

            playerWings.addClass('Player--flap');

            this.game.hasStarted = true;
            SPEED = this.JUMP_SPEED;
            var wing = document.getElementById('sfx_wing');
            wing.volume = 0.1;
            if (!this.game.mute) {
                wing.pause();
                wing.currentTime = 0;
                wing.play();
            }
        }

        if (this.jumped && !this.isJumping) {
            // Fyrsta stökk upp
            // console.log('Er að hoppa upp hér!');
            // For bird
            playerWings.addClass('Player--flap');
            if (this.pos.y < -1 && this.isPlaying) {} else {
                this.pos.y -= delta * SPEED + 0.6;
                this.velocity = 0;
                $('.Player--bird').css('transform', 'translateZ(0) rotate(-45deg)');
                this.degs = 65;
            }
            // For wings
            /*
            if (this.pos.x < -1) {} else {
                this.pos.x -= delta * SPEED + 0.6;
                this.velocity = 0;
                $('.Player--wings').css('transform', 'translateZ(0) rotate(35deg)');
                this.degs = -65;
            }
            */
            this.game.isPlaying = true;
            this.isJumping = true;
        } else if (this.jumped && this.isJumping) {
            playerWings.addClass('Player--flap');
            // Ef þú ýtir á takkann oft, þá ertu hérna
            // console.log('Hoppa oft!');
            SPEED = (this.JUMP_SPEED);
            return;
        }

        if (this.isJumping) {
            this.pos.y -= SPEED;
            if ((SPEED -= 0.15) < 0) {
                // Sá tímapunktur sem ég fer frá því að fara upp og byrja beinast niður
                // console.log('Er að detta niður hér!');
                // For bird
                this.pos.y += delta * SPEED + this.velocity;
                this.velocity += SPEED * 0.0005;
                $('.Player--bird').css('transform', 'translateZ(0) rotate(0)');
                $('.Player--wing').css('transform', 'translateZ(0) rotate(0)');
                if (Math.floor(this.degs) < 70) {
                  //  this.degs += delta * SPEED * 8;
                } else {
                    this.degs = 70;
                }
                /*
                // For wings
                this.pos.x+= delta * SPEED + this.velocity;
                this.velocity += SPEED * 0.0005;
                $('flap').css('transform', 'translateZ(0) rotateX(0)');
                if (Math.floor(this.degs) < 70) {
                    this.degs += delta * SPEED * 8;
                } else {
                    this.degs = 70;
                }
                */
                this.isJumping = false;
            }
            // Update UI
            this.el.css('transform', 'translateZ(0) translate(' + this.pos.x + 'em, ' + this.pos.y + 'em)');
        } else {
            if (SPEED < 2) {
                playerWings.removeClass('Player--flap');
                // Hérna byrja ég að snúast niður
                SPEED += 0.5;
            } else {
                // Hérna byrja ég að fara niður með nefið beint í jörðina
                // console.log('ELSE SPEED         ' + SPEED);
                $('.Player--bird').css('transform', 'translateZ(0) rotate(45deg)');
                if (Math.floor(this.degs) < 70) {
              //      this.degs += delta * SPEED * 0.4;
                } else {
                //    this.degs = 10;
                    // console.log(this.degs);
                }
                SPEED = (this.JUMP_SPEED);
            }
            if (this.game.hasStarted) {
                this.el.css('transform', 'translateZ(0) translate(' + this.pos.x + 'em, ' + this.pos.y + 'em)');
            }
        }

        this.checkCollisionWithBounds();
        this.checkCollisionWithPipes();
        // Update UI
        this.el.css('transform', 'translateZ(0) translate(' + this.pos.x + 'em, ' + this.pos.y + 'em)');
    };

    Player.prototype.checkCollisionWithPipes = function() {
      /*  var playerX = this.pos.x + 23;
        var playerY = Math.floor(this.pos.y);
        var hit = document.getElementById('sfx_hit');
        hit.volume = 0.5;
        for (var i = 0; i < this.game.pipe.pipeArr.length; i++) {
            var pipePosX = Math.floor(this.game.pipe.pipeArr[i].bottom.pos.x);
            var lowerPipePosY = this.game.pipe.pipeArr[i].bottom.pipe[0].style.height;
            var topPipePosY = this.game.pipe.pipeArr[i].top.pipe[0].style.height;
            lowerPipePosY = Math.floor(this.game.WORLD_HEIGHT - lowerPipePosY.substring(0, lowerPipePosY.length - 2));
            topPipePosY = Math.floor(topPipePosY.substring(0, topPipePosY.length - 2));
            if (-pipePosX >= playerX + WIDTH && (-pipePosX - WIDTH * 2) <= playerX + WIDTH) {
                if (lowerPipePosY < playerY + HEIGHT || topPipePosY > playerY) {
                    $('.Game-Score').hide();
                    if (!this.game.mute) {
                        hit.pause();
                        hit.currentTime = 0;
                        hit.play();
                    }
                    return this.game.gameover();
                } else {
                    if (this.scorePipe !== this.game.pipe.pipeArr[i].name) {
                        this.game.score += 1;
                        $('.Game-Score').html(this.game.score);
                        var point = document.getElementById('sfx_point');
                        point.volume = 0.1;
                        if (!this.game.mute) {
                            point.pause();
                            point.currentTime = 0;
                            point.play();
                        }
                        // $('.Game-Score').css("background-image", "url(images/font_big_0.png)");
                        this.scorePipe = this.game.pipe.pipeArr[i].name;
                    }
                }
            }
        }*/
    };

    Player.prototype.checkCollisionWithBounds = function() {

        if (this.pos.x < 0 ||
            this.pos.x + WIDTH > this.game.WORLD_WIDTH ||
            this.pos.y < 0 ||
            this.pos.y + HEIGHT > this.game.WORLD_HEIGHT -6.9) {
            var die = document.getElementById('sfx_die');
            die.volume = 0.5;
            if (!this.game.mute) {
                die.pause();
                die.currentTime = 0;
                die.play();
            }
            $('.Game-Score').hide();
            return this.game.gameover();
        }
        // this.game.pipes.checkCollision();
    };

    return Player;

})();
