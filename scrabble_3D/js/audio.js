/* 
 * File: audio.js
 * Author: James Kuczynski
 * File Description: This file plays an audio file in a loop.
 * 
 * Created: 12/01/2016 by J.K.
 * Last Modified: 12/06/2016 by J.K.
 */

"use strict";

function playAudio() {

    var myAudio = new Audio('res/ClairDeLune.wav');
    myAudio.addEventListener('ended', function () {
        this.currentTime = 0;
        this.volume = 1.0; // 1.0 = 100%; the loudest
        this.play();
    }, false);
    myAudio.play();

}
playAudio();
