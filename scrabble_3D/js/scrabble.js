/**
 * File: scrabble.js
 * Author: James T. Kuczynski <James_Kuczynski@student.uml.edu>
 * File Description:
 *
 * Created 11/23/16 by J.K.
 * Last Modified 12/06S/2016 by J.K.
 */

"use strict";

// the JSON data
var data;

//the current "word" the user has entered
var currWord = [];

// the current pieces the user has (on and off the board)
var currHand = [];

// the pieces the user has on the rack.
var remainingInHand = [];

// the user's current score.
var currScore = 0;

// an array representation of the dictionary of words
var dict = [];

//Allows for checking if there is already a tile in a block of the gameboard
var tileExists = [false, false, false, false, false, false, false, false];

/**
 * load the JSON data into a JavaScript object.  After it is loaded, start
 * the other elements of the program (which require this data).
 */
function loadDbFile() {

    $.getJSON('res/tile_distribution.json', function(file_data){
        data = file_data;
        //console.log('done!');
        //printData();
        randSelectPieces(7);
    });
}
loadDbFile();


/**
 * Loads the dictionary file into an array.
 * @param file Path to the dictionary file
 */
function readDict(file) {

    $.get(file, function(data) {
        //split on new lines
        console.log('HERE (0)');
        dict = data.split('\n');
        console.log('first word: ' + dict[2]);
    });

    
    //TODO: slice by \n
    //console.log('first word: ' + dict[2]);
}
readDict('res/american-english');


/**
 * Randomly selects game pieces, checking the JSON structure to make sure
 * that we are not trying to use pieces which have already been used.
 *
 * @param pieces The number of pieces to select
 */
function randSelectPieces(pieces) {

    var randIdx;
    var randIdxArr = [];
    var useOldTile = false;

    for(var i = 0; i < pieces; i++) {

        for(var j = 0; j < remainingInHand.length; j++) {
            if(i === remainingInHand[j].position) {
                useOldTile = true;
            }
        }

        if(useOldTile=== true) {
            randIdx = toIdx(remainingInHand[j].letter);
        } else {
            randIdx = Math.floor(Math.random() * 26); // [0-26], i.e. blank, A-Z
        }

        //console.log('text: ' + data.tiles[randIdx].char);
        //console.log('count: ' + data.tiles[randIdx].count);

        /*
         * If the tile type is available, add it, otherwise roll again.
         */
        if(data.tiles[randIdx].count > 0) {
            randIdxArr.push(randIdx);
            data.tiles[randIdx].count = parseInt(data.tiles[randIdx].count) - 1;
        } else {
            i--;
        }

    }

    loadTiles(randIdxArr);

    $(".board_square").droppable({ drop: tileDropped, out: tileRemoved });
}


/**
 * This function takes the randomly selected numbers, and uses them as indices
 * to extract the paths to the piece icons from the JSON object.
 *
 * @param idxArr The array of numbers corresponding to letters in the JSON array.
 */
function loadTiles(idxArr) {

    var rack = $('#playerRack');
    var x = rack.position.left;
    var y = rack.position.top;
    var id = null;
    var newIdArr = [];

    for(var i = 0; i < idxArr.length; i++) {
        //console.log('adding: ' + '<img src="' + data.tiles[idxArr[i]].image + '" class="tile" id="' + id + '">');
        id = "tile_" + data.tiles[idxArr[i]].char + i;
        newIdArr.push(id);
        currHand.push(data.tiles[idxArr[i]].char);
        rack.append('<img src="' + data.tiles[idxArr[i]].image + '" class="tile" id="' + id + '">');

        $("#" + id).draggable({snap: ".board_square", snapMode: "inner"});
        //updateScore()
    }

    if(idxArr.length === 7) {
        var newPos;
        for(var i = 0; i <= 3; i++) {
            var tile = $('#' + newIdArr[i]);
            //console.log('on FAIL: i=' + i);
            //console.log('position: left=' + tile.position().left + 'top=' + tile.position.top);
            newPos = tile.position().left - ((i+1) * 55);
            tile.css({left: newPos});
        }

        for(var i = 5; i < 7; i++) {
            var tile = $('#' + newIdArr[i]);
            //console.log('position: left=' + tile.position().left + 'top=' + tile.position.top);
            newPos = tile.position().left + ((i-4) * 55);
            tile.css({left: newPos});
        }
    }


}


/**
 *  This function is called when a tile is snapped into position on the board.
 *  It adds the character to the current word.
 *
 * @param event the event
 * @param ui the UI element
 */
function tileDropped(event, ui){

    /*
    console.log("???: " + $(this).attr("title") );
    console.log("^^^: " + $(this).attr("id") );
    console.log('board idx: ' + $(this).attr("id").charAt(13) );
    console.log('cost: ' + $(this).attr("title") );
    console.log('ui: ' + ui.draggable.attr("id") );
    console.log('letter: ' + ui.draggable.attr("id").charAt(5) );
    */

    currWord.push( {'letter': ui.draggable.attr("id").charAt(5), 'cost': $(this).attr("title"), "square_number": parseInt($(this).attr("id"))} );

    //updateScore();
}


/**
 * Function stub.  It is called whenever a tile is removed from the board.
 * @param event
 * @param ui
 */
function tileRemoved(event, ui){

    /*
    console.log('removed tile');

    console.log("???: " + $(this).attr("title") );
    console.log("^^^: " + $(this).attr("id") );
    console.log('board idx: ' + $(this).attr("id").charAt(13) );
    console.log('cost: ' + $(this).attr("title") );
    console.log('ui: ' + ui.draggable.attr("id") );
    console.log('letter: ' + ui.draggable.attr("id").charAt(5) );
    */
    //currWord.push( {'letter': ui.draggable.attr("id").charAt(5), 'cost': $(this).attr("title") } );



    //updateScore();
}


/**
 * Updates the player's total score
 * @see #currScore.
 */
function updateScore() {

    var totalCost = 0;
    var i;
    var scoreElem = document.getElementById('score');

    // calculate the cost of the new word, and add that to the total score.
    for(i = 0; i < currWord.length; i++) {
        totalCost = 0;
        var idx = toIdx(currWord[i].letter);
        console.log('value=' + data.tiles[idx].value + ', cost=' + currWord[i].cost);
        totalCost += data.tiles[idx].value * currWord[i].cost;
        console.log('adding cost: ' + totalCost);
        currScore += totalCost;
    }

    // update the HTML element which displays the score.
    console.log('totalCost: ' + totalCost);
    scoreElem.innerHTML = currScore;
    currWord = [];
}


/**
 * Resets the game back to the start.
 */
function restart() {

    currWord = [];
    currHand = [];
    remainingInHand = [];
    currScore = 0;
    dict = [];

    randSelectPieces(7);

    var tiles = document.getElementsByClassName('tile');
    for(var i = 0; i < tiles.length; i++) {
        tiles[i].remove();
    }

    updateScore();
}


function endTurn() {

    //check if word is in dictionary
    var word = "";
    var isValidWord = false;
    var useRegEx = false;
    for(var i = 0; i < currWord.length; i++) {
        if(currWord[i].letter !== '_') {
            word += currWord[i].letter;
        } else {
            word += '?';
            useRegEx = true;
        }

    }

    //(useRegEx)? console.log('using regex') : console.log('NOT using regex');

    // If a blank is used, then perform a regular expression match, instead
    // of a ===
    for(var i = 0; i < dict.length; i++) {

        if(useRegEx === false) {

            if(word === dict[i].toUpperCase()) {
                isValidWord = true;
                break;
            }
        } else if(dict[i].toUpperCase().match(word) === true) {

            isValidWord = true;
            break;
        }

    }




    /* The word validation is shut off.*/
    /*
    if(isValidWord) {
        updateScore();
        currWord = [];
        randSelectPieces(word.length);

    } else {
        alert('invalid move');
    }
    */

    // calculate how many pieces the player has left after
    // adding the most recent word.
    for(var i = 0; i < currWord.length; i++) {
        for(var j = 0; j < currHand.length; j++) {
            if(currWord[i] === currHand[j]) {
                remainingInHand.push({"char": currHand[j], "position": j});
                currHand.splice(j, 1);
                break;
            }
        }
    }


    updateScore();
    randSelectPieces(word.length);
    updateDataUi();
}


/**
 * Connects the Restart and End Turn buttons to their respective functions.
 */
function initEventHandlers() {
    var restartBtn = document.getElementById('restart');
    var endTurnBtn = document.getElementById('endTurn');

    // check if the user has an old or new web browser.
    if(restartBtn.addEventListener) {
        restartBtn.addEventListener('click', function(event) {
            event.restart();
        });
        endTurnBtn.addEventListener('click', function(event) {
            event.endTurn();
        });
    } else {
        restartBtn.attachEvent('click', function(event) {
            event.preventDefault();
            restart();
        });
        endTurnBtn.attachEvent('click', function(event) {
            event.preventDefault();
            endTurn();
        });
    }
}


/**
 * For debugging; prints the current number of pieces left.
 */
function printData() {
    for(var i = 0; i < data.tiles.length; i++) {
        console.log('count=' + data.tiles[i].count);
    }
}


/**
 * Updates the UI with the current number of un-dealt pieces in each catagory,
 * i.e. 9 A's, 1 B, etc.
 */
function updateDataUi() {

    var hardletters = ['blank', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k',
                   'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
                   'w', 'x', 'y', 'z'];

    // update each element in the table.
    for(var i = 0; i < data.tiles.length; i++) {
        $('#' + hardletters[i] + '_count').text(data.tiles[i].count);
    }

    //console.log("current A id: " + '#' + hardletters[2] + '_count');
    //console.log('current A count: ' + $('#' + hardletters[2] + '_count').text())
}