window.Ground = (function() {
    'use strict';

    // All these constants are in em's, multiply by 10 pixels
    // for 1024x576px canvas.
    var SPEED = 30; // * 10 pixels per second

    var Ground = function(el, game, initX, initY, height, width) {
        this.el = el;
        this.game = game;
        this.pos = {
            x: initX,
            y: initY
        };
        this.height = height;
        this.width = width;
    };

    Ground.prototype.onFrame = function(delta) {
        if (this.game.hasStarted) {
            this.pos.x -= delta * SPEED;
            if (this.pos.x < 0 - this.width + 0.1) {
                this.pos.x = 0;
            }

        }
        // Update UI
        this.el.css('transform', 'translateZ(0) translate(' + this.pos.x + 'em, ' + this.pos.y + 'em)');
    };

    return Ground;

})();
