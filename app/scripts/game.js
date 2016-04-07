window.Game = (function() {
    'use strict';
    var Controls = window.Controls;
    /**
     * Main game class.
     * @param {Element} el jQuery element containing the game.
     * @constructor
     */
    var Game = function(el) {
        this.el = el;
        this.player = new window.Player(this.el.find('.Player'), this);
        this.ground = new window.Ground(this.el.find('.Ground'), this, 0, 0, 3, 40);
        this.pipe = new window.Pipe(el, this);
        this.clouds = new window.Clouds(this.el.find('.Clouds'), this, 0, 5, 13.9);
        this.Trees = new window.Trees(this.el.find('.BackgroundTrees'), this, 0, 0, 5.9);
        this.City = new window.City(this.el.find('.BackgroundCity'), this, 0, 0, 35);
        this.bgClouds = new window.bgClouds(this.el.find('.BackgroundClouds'), this, 0, 0, 39.9);
        // this.pipes = new window.Pipes(this.el.find('.Pipes'), this);
        this.isPlaying = false;
        this.score = -1;
        this.highscore = 0;
      /*  this.fontSize = Math.min(
            window.innerWidth / 102.4,
            window.innerHeight / 57.6
        );
        console.log(this.fontSize);*/
        this.mute = false;
        // this.tube = [];
        // this.tube.push(new window.Tube(this.el.find('.Tube1'), this.WORLD_WIDTH + this.tubeDist * 3, 35, 30, this.tubeWidth, this, false));
        // this.tube.push(new window.Tube(this.el.find('.Tube2'), this.WORLD_WIDTH + this.tubeDist * 3, 0, 15, this.tubeWidth, this, true));
        // this.isPlaying = false;
        // this.hasStarted = false;
        //this.toggleSound();
        //this.toggleSound();
        var vid = document.getElementById('theme_music');
        vid.play();
        vid.volume = 0.1;
        this.fitSize();
      //  console.log(this);

        // Cache a bound onFrame since we need it each frame.
        this.onFrame = this.onFrame.bind(this);
        this.toggleSound();
    };

    /**
     * Runs every frame. Calculates a delta and allows each game
     * entity to update itself.
     */
    Game.prototype.onFrame = function() {
        // Check if the game loop should stop.

        if (!this.isPlaying) {
            return;
        }
        // Calculate how long since last frame in seconds.
        var now = +new Date() / 1000,
            delta = now - this.lastFrame;
        this.lastFrame = now;

        // Update game entities.
        this.pipe.onFrame(delta);
        this.player.onFrame(delta);
        this.ground.onFrame(delta);
        this.clouds.onFrame(delta);
        this.Trees.onFrame(delta);
        this.City.onFrame(delta);
        this.bgClouds.onFrame(delta);
        // Request next frame.
        window.requestAnimationFrame(this.onFrame);
    };

    /**
     * Starts a new game.
     */
    Game.prototype.start = function() {
        if (this.score === -1) {
            $(" .Pipedown1, .Pipedown2, .Pipedown3, .Pipeup1, .Pipeup2, .Pipeup3, .Player,.Player--bird,.Player--wing").hide();
            var that = this;
            var StartEl = this.el.find('.Start');
            StartEl
                .addClass('is-visible')
                .find('.Start-restart')
                .one('click', function() {
                    $(".Ground, .Pipedown1, .Pipedown2, .Pipedown3, .Pipeup1, .Pipeup2, .Pipeup3, .Player,.Player--bird,.Player--wing").show();
                    // $('.Ground').css('animation-play-state', 'running', '-webkit-animation-play-state', 'running');
                    StartEl.removeClass('is-visible');
                    //that.start();
                    that.reset();
                    that.lastFrame = +new Date() / 1000;
                    window.requestAnimationFrame(that.onFrame);
                    that.isPlaying = true;
                    that.score = 0;
                    $('.Player').show();
                });

        } else {
            this.reset();
            this.lastFrame = +new Date() / 1000;
            window.requestAnimationFrame(this.onFrame);
            this.isPlaying = true;
            this.score = 0;
        }
    };
    /*
     * Resets the state of the game so a new game can be started.
     */
    Game.prototype.reset = function() {
        this.player.reset();
        this.pipe.reset();
    };


    Game.prototype.toggleSound = function() {
        console.log("Toggle Sound");
        /*
                $(".sound").click(function(e) {
                    e.preventDefault();
                    var song = $('audio')[0];
                    if (song.paused) {
                        song.play();
                        document.getElementById("Sound").src = "images/sound.png";
                        this.mute = true;
                    } else {
                        song.pause();
                        document.getElementById("Sound").src = "images/nosound.png";
                        this.mute = false;
                    }
                });*/
        if (!this.mute) {
            this.mute = true;
            $('.nosound').show();
            $('.sound').hide();
            var sounds = document.getElementsByClassName('sfx');
            for (var i = 0; i < sounds.length; i++) {
                sounds[i].pause();
                sounds[i].currentTime = 0;
            }
        } else {
            this.mute = false;
            $('.nosound').hide();
            $('.sound').show();
            var vid = document.getElementById('theme_music');
            vid.play();
            vid.volume = 0.1;
        }
    };

    /**
     * Signals that the game is over.
     */
    Game.prototype.gameover = function() {
        this.isPlaying = false;
        $('.Ground').css('animation-play-state', 'paused', '-webkit-animation-play-state', 'paused');

        if (this.score > this.highscore) {
            this.highscore = this.score;
        }
        var that = this;
        var scoreboardEl = this.el.find('.Scoreboard');
        $('.Score').html(this.score);
        $('.High-score').html(this.highscore);

        scoreboardEl
            .addClass('is-visible')
            .find('.Start-replay')
            .one('click', function() {
                scoreboardEl.removeClass('is-visible');
                Controls._didJump = false;
                that.start();
            });
    };

    Game.prototype.updateFont = function() {
        var game = $('.GameCanvas');
        game.css('fontSize', this.fontSize + 'px');
    };
    Game.prototype.fitSize = function() {
        this.fontSize = Math.min(
            window.innerWidth / 102.4,
            window.innerHeight / 57.6
        );
        this.updateFont();
    };
    Game.prototype.decSize = function() {
        if (this.fontSize === undefined) {
            this.fitSize();
        }
        this.fontSize -= 1.0;
        console.log(this.fontSize);
        this.updateFont();
    };
    Game.prototype.incSize = function() {
        if (this.fontSize === undefined) {
            this.fitSize();
        }
        this.fontSize += 1.0;
        console.log(this.fontSize);
        this.updateFont();
    };

    /**
     * Some shared constants.
     */
    Game.prototype.WORLD_WIDTH = 102.4;
    Game.prototype.WORLD_HEIGHT = 57.6;

    return Game;
})();
