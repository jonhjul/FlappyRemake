var mute = false;

function toggleSound() {
	'use strict';
	if(!mute) {
		mute = true;
		$('.nosound').show();
		$('.sound').hide();
		var sounds = document.getElementsByClassName('sfx');
		for (var i = 0; i < sounds.length; i++) {
			sounds[i].pause();
			sounds[i].currentTime = 0;
		}
	} else {
		mute = false;
		$('.nosound').hide();
		$('.sound').show();
		document.getElementById('theme_music').play();
	}
}
