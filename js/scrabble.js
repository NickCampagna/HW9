/*Page by Nicholas Campagna
nicholas_campagna@student.uml.edu
I am a student at UMass Lowell, in COMP4610 (or 91.61) GUI Programming 1
File Created December 19th, 2019
This is a js file that basically runs everything to do with the scrabble program.*/

// Slightly edited from the JSON provided in HW9_2019.pdf
// also added "max" for ease of resetting
var pieces = [
	{"letter":"A", "value":1,  "amount":9, "max":9},
	{"letter":"B", "value":3,  "amount":2, "max":2},
	{"letter":"C", "value":3,  "amount":2, "max":2},
	{"letter":"D", "value":2,  "amount":4, "max":4},
	{"letter":"E", "value":1,  "amount":12, "max":12},
	{"letter":"F", "value":4,  "amount":2, "max":2},
	{"letter":"G", "value":2,  "amount":3, "max":3},
	{"letter":"H", "value":4,  "amount":2, "max":2},
	{"letter":"I", "value":1,  "amount":9, "max":9},
	{"letter":"J", "value":8,  "amount":1, "max":1},
	{"letter":"K", "value":5,  "amount":1, "max":1},
	{"letter":"L", "value":1,  "amount":4, "max":4},
	{"letter":"M", "value":3,  "amount":2, "max":2},
	{"letter":"N", "value":1,  "amount":6, "max":6},
	{"letter":"O", "value":1,  "amount":8, "max":8},
	{"letter":"P", "value":3,  "amount":2, "max":2},
	{"letter":"Q", "value":10, "amount":1, "max":1},
	{"letter":"R", "value":1,  "amount":6, "max":6},
	{"letter":"S", "value":1,  "amount":4, "max":4},
	{"letter":"T", "value":1,  "amount":6, "max":6},
	{"letter":"U", "value":1,  "amount":4, "max":4},
	{"letter":"V", "value":4,  "amount":2, "max":2},
	{"letter":"W", "value":4,  "amount":2, "max":2},
	{"letter":"X", "value":8,  "amount":1, "max":1},
	{"letter":"Y", "value":4,  "amount":2, "max":2},
	{"letter":"Z", "value":10, "amount":1, "max":1},
	{"letter":"_", "value":0,  "amount":2, "max":2}
]
// "creator":"Ramon Meza"
var totalTiles = 100;
var tilesInHand = 0;
var score = 0;

$(document).ready(function () {

	$("#rackzone").droppable({accept: '.tiles', drop: returnTile}); //, out: removeTile
	drawTiles();

	// APPLIES BOARD SLOTS TO THE BOARD
	for (var i = 0; i < 7; i++) { // appends all the board slots onto the page as well
		  var slotClass = "slot_" + i;
			if (i == 1 || i == 5) {
				  $("#board").append(" <img id=\"\" class=\"" + slotClass + " slots\" src=\"images/board/boardDouble.jpg\">");
			} else {
				  $("#board").append(" <img id=\"\" class=\"" + slotClass + " slots\" src=\"images/board/board.jpg\">");
			}
  }
	$(".slots").css("height", "100px");
	$(".slots").droppable({accept: '.tiles', drop: slotTile});

	// FUNCTIONS BELOW:
	// returnTile - when a tile is moved from slot to rack
	function returnTile(event, ui) { // returnTile is called when a tile is placed into the rack
		  if (ui.draggable.hasClass("slotted")) {
				  ui.draggable.removeClass("slotted");
				  ui.draggable.addClass("racked");
				  tilesInHand += 1;

					// CLEAR PREVIOUS SLOT_X CLASS AND REMOVE THE PREVIOUS SLOT'S ID VALUE
					var classes = ui.draggable.attr("class").split(/\s+/); // obtain list of ALL classes of the tile
					var className;
					for (var i = 0; i < classes.length; i++) { // find the class starting with "slot_" to determine slot value
							if (classes[i].startsWith("slot_")) {
									className = classes[i];
									//console.log(classes[i]);
							}
					}
					ui.draggable.removeClass(className); // REMOVE SLOT_X FROM TILE
					$("." + className).attr("id", ""); // REMOVE TILE VALUE FROM PREVIOUS SLOT
			}
			//console.log("tiles in rack: " + tilesInHand);
	}

	// slotTile THIS LOOKS SUPER MESSY SO LEMME EXPLAIN:
	// IF the tile came from the rack (hasClass("racked") then the "racked" class is removed, and replaced with "slotted")
	// "slotted" means the tile has been placed in a slot, which is now it's most recent droppable zone which it'll revert to
	// IF the tile came from a different slot, it'll still have "slotted", but now we have to find out WHICH slot it came from,
	// each slot has a "slot_x" class identifying it from all the others. this allows us to specify slots when our only variables
	// in this function are the dragged tile and the droppable slot. this is all required for proper data management.
	// clear the previous slot's ID (where the index value of the tile is held) and add the NEW slot's "slot_x" class
	function slotTile(event, ui) { // slotTile is called when a tile is dropped into a slot
		  if (ui.draggable.hasClass("racked")) {
				  ui.draggable.removeClass("racked");
				  ui.draggable.addClass("slotted");
				  tilesInHand -= 1;
					$(this).attr("id", ui.draggable.attr("id")); // assigns tile ID to slot

					var classes = $(this).attr("class").split(/\s+/); // obtain list of ALL classes
					var className;
					for (var i = 0; i < classes.length; i++) { // find the class starting with "slot_" to determine slot value
						  if (classes[i].startsWith("slot_")) {
								  className = classes[i];
								  //console.log(classes[i]);
							}
					}
					ui.draggable.addClass(className); // add slot_x to tile to mark which slot it was placed in
					//console.log(className);
			}
			else if (ui.draggable.hasClass("slotted")) { // Check if tile was moved to another slot
				var classes = ui.draggable.attr("class").split(/\s+/); // obtain list of ALL classes (this time of the tile)
				var className;
				for (var i = 0; i < classes.length; i++) { // find the class starting with "slot_" to determine slot value
						if (classes[i].startsWith("slot_")) {
								className = classes[i];
								//console.log(classes[i]);
						}
				}
				// IF THE NEW SLOT DOESN'T HAVE SLOT_X, REMOVE IT FROM TILE AND CLEAR SLOT_X's ID, THEN GIVE NEW SLOT_X
				if (!$(this).hasClass(className)) {
					  ui.draggable.removeClass(className);
						$(this).attr("id", ui.draggable.attr("id")); // assigns tile ID to slot
						$("." + className).attr("id", "");
						var classes = $(this).attr("class").split(/\s+/); // obtain list of ALL classes
						var className;
						for (var i = 0; i < classes.length; i++) { // find the class starting with "slot_" to determine slot value
							  if (classes[i].startsWith("slot_")) {
									  className = classes[i];
									  //console.log(classes[i]);
								}
						}
						ui.draggable.addClass(className); // add slot_x to tile to mark which slot it was placed in
						//console.log(className);
				}
			}
			//console.log("tiles in rack: " + tilesInHand);
  }

	// Learned of "for all/each" loop thanks to https://api.jquery.com/each/
	/*var ind
	$( ".slots" ).each(function( ind ) {
		  console.log( ind + ": " + $( this ).attr("id") );
	});*/

	// cashIn, iterates through all slots and adds their tile's value (if any) to the roundScore,
	// which is then doubled for each doubleWord tile covered
	$("#cashIn").click(function(){ // Button function, both on jquery website and https://beginnersbook.com/2019/04/jquery-click-event/
    console.log("Hi.");
		var ind;
		var id;
		var doubles = 0;
		var roundScore = 0;
		$( ".slots" ).each(function( ind ) {
			  console.log( ind + ": " + $( this ).attr("id") );
				id = $(this).attr("id");
				if (id != "") {
					  if (ind == 1 || ind == 5) {
							  doubles += 1;
						}
					  roundScore += pieces[id].value;
						$(this).attr("id", "");
				}
		});
		$(".slotted").remove();
		drawTiles();
		//console.log("Score: " + score);
		if (doubles > 0) {
			  roundScore = roundScore * 2 * doubles;
		}
		score += roundScore;
		$("#displayScore").text("Score: " + score);
  });

	// RESTART GAME, sets score and total tiles to 0, removes ALL tiles (so hand is refreshed)
	// and sets all tile distribution values above to their original amounts before drawing new tiles
	$("#restart").click(function(){
		score = 0;
		totalTiles = 100;
		$(".tiles").remove();
		tilesInHand = 0;
		for (var i = 0; i < 27; i++) {
			pieces[i].amount = pieces[i].max;
		}
		drawTiles();
		$("#displayScore").text("Score: " + score);
		$("#displayTileCount").text("Tiles Left: " + totalTiles);
  });

	// drawTiles(); Draws enough tiles to fill the rack out. Made its own function because
	// it'll be called at the start AND at each round
	function drawTiles() {
		var letter;
	  var index;
	  var tilesToDraw = 7 - tilesInHand;

		// DRAW TILE PIECES FROM PIECES[] UNTIL RACK IS FULL
		// .append solution based on the Tabs solution I used in HW8, thanks to https://jqueryui.com/tabs/#manipulation
	  for (var i = 0; i < tilesToDraw; i++) {
	      if (totalTiles > 0) {
					index = Math.floor((Math.random() * 27)); // randomly pick a number between 0-26 for an index used in the pieces data structure
					while (pieces[index].amount < 1){ // while loop prevents taking a tile if its amount = 0
						  index = Math.floor((Math.random() * 27));
					}
					tilesInHand = 7;

					letter = pieces[index].letter;
					pieces[index].amount -= 1;
		      $("#rackzone").append(" <img id=\"" + index + "\" class=\"tiles racked\" src=\"images/tiles/Scrabble_Tile_" + letter + ".jpg\">");
					totalTiles -= 1;
				}
	  }
		$(".tiles").css("height", "100px");	// Auto-resizes the tiles because I could NOT be bothered to resize each manually
		$(".tiles").draggable({snap: ".slots", snapMode: "inner", revert: 'invalid'});
		$("#displayTileCount").text("Tiles Left: " + totalTiles);
	}
});
