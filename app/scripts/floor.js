
window.Floor = (function() {
	'use strict';

	// All these constants are in em's, multiply by 10 pixels
	// for 1024x576px canvas.
	var SPEED = 10; // * 10 pixels per second

	var Floor = function(el, initX, initY, height, width, game) {
		this.el = el;
		this.game = game;
		this.pos = { x: initX, y: initY };
		this.height = height;
		this.width = width;
	};
	/**
	 * Resets the state of the player for a new game.
	 */
	Floor.prototype.reset = function() {
		this.pos.x = this.initPos.x;
		this.pos.y = this.initPos.y;
		this.hasCounted = false;
	};

	Floor.prototype.onFrame = function(delta) {


		if (this.game.hasStarted) {

			this.pos.x -= delta * SPEED;
			if (this.pos.x < 0-this.width+0.0755) {
				this.pos.x = 0;
			}

		}
		// Update UI
		this.el.css('transform', 'translateZ(0) translate(' + this.pos.x + 'em, ' + this.pos.y + 'em)');
	};

	return Floor;

})();
