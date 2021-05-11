/* BASIC OF THE CANVAS                      */
/* The Graphic Library on JavaScript        */
/* Extension of Sound Control               */
/* Version 0.002 / Revised 2021.02.18       */
/* Original Author : K-ARAI                 */
/* It will be free for Educational use !    */

/* SOUND CONTROL */

var gplib_sound_name = "sound-extension";
var gplib_sound_max = 1000;
var gplib_sound_count = 0;
var gplib_sounds;

/***************************************************/

function gplib_sound_init() {

    var num,array;

    array = document.getElementsByName(gplib_sound_name);

    gplib_sound_count = array.length;
    if(gplib_sound_count>gplib_sound_max) gplib_sound_count = gplib_sound_max;

    gplib_sounds = new Array(gplib_sound_count);

    for(i=0;i<gplib_sound_count;i++) gplib_sounds[i] = new Audio(array[i].value);

    return gplib_sound_count;

}

/***************************************************/

function gplib_sound_play(n) {

    var s = Math.floor(n);

    if(0<=s && s < gplib_sound_count ) {
        gplib_sounds[s].currentTime = 0;
        gplib_sounds[s].play();
        return true;
    }

    return false;

}

/***************************************************/

function gplib_sound_stop(n) {

    var s = Math.floor(n);

    if(0<=s && s < gplib_sound_count ) {
        gplib_sounds[s].pause();
        return true;
    }

    return false;

}

/***************************************************/

function gplib_sound_loop(n,b) {

    var s = Math.floor(n);

    if(0<=s && s < gplib_sound_count ) {
        gplib_sounds[s].loop = b;
        return true;
    }

    return false;

}

/***************************************************/

function gplib_sound_state(n) {

    var s = Math.floor(n);

    if(0<=s && s < gplib_sound_count ) {
        if(gplib_sounds[s].paused) return -1;
        if(gplib_sounds[s].currentTime >= gplib_sounds[s].duration) return -1;
    }

    return gplib_sounds[s].currentTime;

}

/***************************************************/

function SOUND_INIT() {

    return gplib_sound_init();

}

function SOUND_PLAY(n) {

    return gplib_sound_play(n-1);

}

function SOUND_STOP(n) {

    return gplib_sound_stop(n-1);

}

function SOUND_STATE(n) {

    return gplib_sound_state(n-1);

}

function SOUND_LOOP(n,b) {

    var loop = false;
    if(b!=0) loop = true;

    return gplib_sound_loop(n-1,loop);

}
