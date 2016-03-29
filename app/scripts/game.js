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
        this.floor = new window.Floor(this.el.find('.Floor'), this, 0, this.WORLD_HEIGHT - 3, 3, 4);
        this.pipes = new window.Pipes(this.el.find('.Pipes'), this);
        this.isPlaying = false;
        this.hasStarted = false;
        this.frameCount = 0;
        this.highscore = 0;
        this.score = 0;
        this.mute = false;
        // this.tube = [];
        // this.tube.push(new window.Tube(this.el.find('.Tube1'), this.WORLD_WIDTH + this.tubeDist * 3, 35, 30, this.tubeWidth, this, false));
        // this.tube.push(new window.Tube(this.el.find('.Tube2'), this.WORLD_WIDTH + this.tubeDist * 3, 0, 15, this.tubeWidth, this, true));
        this.isPlaying = false;
        this.hasStarted = false;

        var fontSize = Math.min(
            window.innerWidth / 102.4,
            window.innerHeight / 57.6
        );
        el.css('fontSize', fontSize + 'px');


        // Cache a bound onFrame since we need it each frame.
        this.onFrame = this.onFrame.bind(this);
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
        ++this.frameCount;
        // Calculate how long since last frame in seconds.
        var now = +new Date() / 1000,
            delta = now - this.lastFrame;
        this.lastFrame = now;

        // Update game entities.
        this.player.onFrame(delta);
        this.floor.onFrame(delta);
        if (this.frameCount === 100) {
            this.pipes.addPipe();
            this.frameCount = 0;
        }
        // Request next frame.
        window.requestAnimationFrame(this.onFrame);
    };

    /**
     * Starts a new game.
     */
    Game.prototype.start = function() {
        this.reset();

        // Restart the onFrame loop
        this.lastFrame = +new Date() / 1000;
        window.requestAnimationFrame(this.onFrame);
        this.isPlaying = true;
    };

    /**
     * Resets the state of the game so a new game can be started.
     */
    Game.prototype.reset = function() {
        this.player.reset();
        this.pipes.reset();
        this.frameCount = 0;
        this.isPlaying = true;
        this.score = 0;
    };


    Game.prototype.toggleSound = function() {
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
            document.getElementById('theme_music').play();
        }

    };

    /**
     * Signals that the game is over.
     */
    Game.prototype.gameover = function() {
        this.isPlaying = false;
        this.hasStarted = false;
        if (!this.mute) {
            document.getElementById('sfx_die').play();
        }
        // Should be refactored into a Scoreboard class.
        var that = this;
        var scoreboardEl = this.el.find('.Scoreboard');
        scoreboardEl
            .addClass('is-visible')
            .find('.Scoreboard-restart')
            .one('click', function() {
                scoreboardEl.removeClass('is-visible');
                Controls._didJump = false;
                that.start();
            });
    };

    /**
     * Some shared constants.
     */
    Game.prototype.WORLD_WIDTH = 102.4;
    Game.prototype.WORLD_HEIGHT = 57.6;

    return Game;
})();
