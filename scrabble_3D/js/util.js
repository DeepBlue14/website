/* 
 * File: util.js
 * Author: James Kuczynski
 * File Description: This file contains helper functions utalized by the
 *                   scrabble file.
 * 
 * Created: 11/03/2016 by J.K.
 * Last Modified: 12/06/2016 by J.K.
 */

"use strict";

/**
 * Maps a letter to the index where that letter can be found in the
 * JSON object, and returns the index.
 */
function toIdx(letter) {

    //for debugging
    //console.log('passed: ' + letter);

    var idx = 0;

    if(letter === '_') {
        idx = 0;
    } else if(letter === 'A') {
        idx = 1;
    } else if(letter === 'B') {
        idx = 2;
    } else if(letter === 'C') {
        idx = 3;
    } else if(letter === 'D') {
        idx = 4;
    } else if(letter === 'E') {
        idx = 5;
    } else if(letter === 'F') {
        idx = 6;
    } else if(letter === 'G') {
        idx = 7;
    } else if(letter === 'H') {
        idx = 8;
    } else if(letter === 'I') {
        idx = 9;
    } else if(letter === 'J') {
        idx = 10;
    } else if(letter === 'K') {
        idx = 11;
    } else if(letter === 'L') {
        idx = 12;
    } else if(letter === 'M') {
        idx = 13;
    } else if(letter === 'N') {
        idx = 14;
    } else if(letter === 'O') {
        idx = 15;
    } else if(letter === 'P') {
        idx = 16;
    } else if(letter === 'Q') {
        idx = 17;
    } else if(letter === 'R') {
        idx = 18;
    } else if(letter === 'S') {
        idx = 19;
    } else if(letter === 'T') {
        idx = 20;
    } else if(letter === 'U') {
        idx = 21;
    } else if(letter === 'V') {
        idx = 22;
    } else if(letter === 'W') {
        idx = 23;
    } else if(letter === 'X') {
        idx = 24;
    } else if(letter === 'Y') {
        idx = 25;
    } else if(letter === 'Z') {
        idx = 26;
    }

    console.log('returning: ' + idx);

    return idx;
}


/**
 * Takes an index and returns the letter which corresponds to that location,
 * andn returns the letter.
 */
function fromIdx(idx) {

    var letter = null;

    if(idx === 0) {
        letter = 'blank';
    } else if(idx === 1) {
        letter = 'A';
    } else if(idx === 2) {
        letter = 'B';
    } else if(idx === 3) {
        letter = 'C';
    } else if(idx === 4) {
        letter = 'D';
    } else if(idx === 5) {
        letter = 'E';
    } else if(idx === 6) {
        letter = 'F';
    } else if(idx === 7) {
        letter = 'G';
    } else if(idx === 8) {
        letter = 'H';
    } else if(idx === 9) {
        letter = 'I';
    } else if(idx === 10) {
        letter = 'J';
    } else if(idx === 11) {
        letter = 'K';
    } else if(idx === 12) {
        letter = 'L';
    } else if(idx === 13) {
        letter = 'M';
    } else if(idx === 14) {
        letter = 'N';
    } else if(idx === 15) {
        letter = 'O';
    } else if(idx === 16) {
        letter = 'P';
    } else if(idx === 17) {
        letter = 'Q';
    } else if(idx === 18) {
        letter = 'R';
    } else if(idx === 19) {
        letter = 'S';
    } else if(idx === 20) {
        letter = 'T';
    } else if(idx === 21) {
        letter = 'U';
    } else if(idx === 22) {
        letter = 'V';
    } else if(idx === 23) {
        letter = 'W';
    } else if(idx === 24) {
        letter = 'X';
    } else if(idx === 25) {
        letter = 'Y';
    } else if(idx === 26) {
        letter = 'Z';
    }

    return letter;
}