/* BASIC ON THE CANVAS                   */
/* The Graphic Library on JavaScript     */
/* Extension of Sound Control            */
/* Version 0.100 / Revised 2025.02.25    */
/* Author : K-ARAI                       */
/* https://www.tinystarviewer.com/basic/ */
/* All rights are reserved ... But...    */
/* It will be free for Educational use ! */

/* SOUND CONTROL */

var gplib_sound_name = "sound-extension";
var gplib_sound_max     = 1000;
var gplib_sound_count   = 0;
var gplib_sound_counter = 1000;
var gplib_sounds;

/***************************************************/

function gplib_sound_init() {

    var num,array;

    array = document.getElementsByName(gplib_sound_name);

    gplib_sound_count = array.length;
    if(gplib_sound_count>gplib_sound_max) gplib_sound_count = gplib_sound_max;

    gplib_sounds = new Array(gplib_sound_count);

    gplib_sound_counter = gplib_sound_count;

    for(i=0;i<gplib_sound_count;i++) {
        gplib_sounds[i] = new Audio(array[i].value);
        gplib_sounds[i].oncanplaythrough = gplib_sound_ready;
　　}
    return gplib_sound_count;

}

/***************************************************/

function gplib_sound_init2(part,key,tone) {

    gplib_sound_count = 0;

    gplib_sounds = new Array(part*key);

    gplib_sound_counter = part*key;

    for(p=0;p<part;p++) {
        for(k=0;k<key;k++) {
            gplib_sounds[gplib_sound_count] = new Audio(tone[p][k]);
            gplib_sounds[gplib_sound_count].oncanplaythrough = gplib_sound_ready;
            if(++gplib_sound_count>=gplib_sound_max) break;
        }
    }

    return gplib_sound_count;

}

function gplib_sound_ready(event) {
    --gplib_sound_counter;
}

function gplib_sound_wait() {
    return gplib_sound_counter;
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

function SOUND_INIT2(part,key,tone) {

    return gplib_sound_init2(part,key,tone);

}

function SOUND_WAIT() {

    return gplib_sound_wait();

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

function SOUND_MUTE() {

    for(n=1;n<=gplib_sound_count;n++) SOUND_STOP(n);

}
