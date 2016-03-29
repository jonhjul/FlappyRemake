window.Pipes = (function() {
    'use strict';

    var gapHeight = 20;

    var Pipes = function(el, game) {
        this.el = el;
        this.game = game;
        this.pipeID = 0;
        this.myID = 1;
        this.worldHeight = this.game.WORLD_HEIGHT * 4.4;
        console.log('Here is world height at ' + this.worldHeight);
    };
    Pipes.prototype.reset = function() {
        for (var i = 0; i <= this.pipeID; i++) {
            this.removePipe(i);
        }
        this.pipeID = 0;
        this.myID = 1;
    };

    Pipes.prototype.addPipe = function() {

        ++this.pipeID;
        var removeID = this.pipeID;
        var pipeUpperHeight = 40;// Math.random() * (57 - 27) + 27;
        var pipeLowerHeight = this.game.WORLD_HEIGHT - (pipeUpperHeight - gapHeight);
        // console.log("pipeLowerHeight: " + pipeLowerHeight);
        // console.log("pipeUpperHeight: " + pipeUpperHeight);
        // console.log(pipeUpperHeight - pipeLowerHeight)
        var pipe = '<div class="PipePair" id="pip' +
            this.pipeID +
            '"><div class="PipeUpper" id="upper' +
            this.pipeID +
            '" style="bottom: ' +
            pipeUpperHeight +
            'em;"></div><div class="PipeLower" id="lower' +
            this.pipeID +
            '" style="top: ' +
            pipeLowerHeight +
            'em;"></div></div>';
        console.log('Hérna er pipe að koma út ' + pipe);
        this.el.append(pipe);

        var that = this;
        $(document.getElementById('upper' + this.pipeID)).bind('webkitAnimationEnd', function() {
            // Kalla í remove
            that.removePipe(removeID);
        });
    };

    Pipes.prototype.removePipe = function(pipID) {
        // Removes 1 pipe after it's off screen
        $('#pip' + pipID).remove();
        // console.log(pipID);
    };

    Pipes.prototype.checkCollision = function() {
        var currentPipe = $('#upper' + this.myID);
        var currentPipeLower = currentPipe.next();
        var player = $('.Player');
        var floor = $('.Floor');
        if (currentPipe.length > 0) {
            console.log('%%%%%player offset pos       ' + player.offset().top);
            // console.log('worldHeight  ' + this.worldHeight);
            console.log('      currPipe offset top    ' + Math.abs(currentPipe.offset().top));
            console.log('######World + cPipe          ' + (Math.abs(this.worldHeight) + Math.abs(currentPipe.offset().top)));
            console.log('$$$$$$Hér er currPipeLower:  ' + currentPipeLower.offset().top);
            console.log(' ');
            // console.log((player.offset().top));
            // console.log((this.worldHeight + currentPipe.offset().top));
            if (((player.offset().top) <= (Math.abs(this.worldHeight) + Math.abs(currentPipe.offset().top))) &&
                ((player.offset().left + player.width()) >= currentPipe.offset().left) &&
                (player.offset().left <= (currentPipe.offset().left + currentPipe.width()))) {
                console.log('Klesstir á efri gaurinn');
                return this.game.gameover();
            }
            if ((player.offset().top + (player.height())) >= (currentPipeLower.offset().top) &&
                (player.offset().left + player.width() >= currentPipeLower.offset().left) &&
                (player.offset().left <= (currentPipeLower.offset().left + currentPipeLower.width()))) {
                console.log('Klesstir á neðri gaurinn');
                return this.game.gameover();
            }
            if (player.offset().left >= (currentPipe.offset().left + currentPipe.width())) {
                ++this.game.score;
                /* $('#currentscore').text(this.game.score);
                $('#Scoreboard-score').text(this.game.score); */
                ++this.myID;
            }
        }
    };

    return Pipes;

})();
