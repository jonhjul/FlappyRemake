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

    Player.prototype.onFrame = function() {
        if (this.game.hasStarted) {
            this.pos.y += GRAVITY;
        } else {
            this.el.css('transform', 'translateZ(0) translate(' + this.pos.x + 'em, ' + this.pos.y + 'em)');
        }

        this.jumped = Controls.didJump();
        if (this.jumped) {
            this.game.hasStarted = true;
            SPEED = this.JUMP_SPEED;
            var wing = document.getElementById('sfx_wing');
            wing.volume = 0.1;
            if (!this.mute) {
                wing.pause();
                wing.currentTime = 0;
                wing.play();
            }
        }

        if (this.jumped && !this.isJumping) {
            // console.log('Er að hoppa upp hér!');
            this.game.isPlaying = true;
            this.isJumping = true;
        } else if (this.jumped && this.isJumping) {
            SPEED = (this.JUMP_SPEED);
            return;
        }

        if (this.isJumping) {
            this.pos.y -= SPEED;
            if ((SPEED -= 0.15) < 0) {
                // console.log('Er að detta niður hér!');
                this.isJumping = false;
            }
            // Update UI
            this.el.css('transform', 'translateZ(0) translate(' + this.pos.x + 'em, ' + this.pos.y + 'em)');
        } else {
            if (SPEED < 2) {
                SPEED += 0.5;
            } else {
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
        var playerX = this.pos.x + 23;
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
                    if (!this.mute) {
                        hit.pause();
                        hit.currentTime = 0;
                        hit.play();
                    }
                    return this.game.gameover();
                } else {
                    if (this.scorePipe !== this.game.pipe.pipeArr[i].name) {
                        this.game.score += 1;
                        $('.Game-Score').html(this.game.score);
                        this.scorePipe = this.game.pipe.pipeArr[i].name;
                    }
                }
            }
        }
    };

    Player.prototype.checkCollisionWithBounds = function() {
        if (this.pos.x < 0 ||
            this.pos.x + WIDTH > this.game.WORLD_WIDTH ||
            this.pos.y < 0 ||
            this.pos.y + HEIGHT > this.game.WORLD_HEIGHT - 3) {
            var die = document.getElementById('sfx_die');
            die.volume = 0.5;
            if (!this.mute) {
                die.pause();
                die.currentTime = 0;
                die.play();
            }
            return this.game.gameover();
        }
        // this.game.pipes.checkCollision();
    };

    return Player;

})();
