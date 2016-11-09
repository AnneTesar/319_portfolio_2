var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope) {
	canvas = document.getElementById("musicDisplay");
	ctx = canvas.getContext("2d");
	context = ctx;
	image = new Image();
	$scope.score = "";
	$scope.countdown = 0;
	var square = {
	        'x': 10,
	        'y': 10,
	        'width': 5,
	        'height': 100,
	        'fill': '#000000'
	    };  

	$scope.updateTempo = function() {
		$scope.song.duration = (60000 / $scope.song.tempo) * $scope.song.numNotes;
	}

	
	/*
	 * The General Idea:
	 * Every x milliseconds, advance the bar and get rid of the old one
	 * how do we pick those milliseconds? 
	 * how do we measure them? 
	 * move the bar y amount each x milliseconds (& erase old bar)
	 * 
	 * If the bar advances from one note to the next, tell the pitch detect to look for the next note instead
	 * it can calculate % closeness or something?
	 * 
	 * 
	 * used:
	 * https://github.com/cwilso/PitchDetect
	 * http://codular.com/animation-with-html5-canvas
	 * 
	 */
	
	/*
	 * A 81
	 * B 83
	 * C 84
	 * D 86
	 * E 88
	 * F 89
	 * G 79
	 */
	
	bells = [88, 84, 86, 79, 79, 86, 88, 84, 88, 84, 86, 79, 79, 86, 88, 84]; //assume each note is a quarter note
	accuracyArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	total = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	song_campanille = {name:"Campanille", notes:bells, accuracy:accuracyArray, totalChecks:total, startPos:65, endPos:680, tempo:50, duration:19200, numNotes:16, image:"campanille.PNG"};
	
	bells = [89, 89, 89, 89, 89, 89, 89, 89];
	accuracyArray = [0, 0, 0, 0, 0, 0, 0, 0];
	total = [0, 0, 0, 0, 0, 0, 0, 0];
	song_monotone = {name:"Monotone", notes:bells, accuracy:accuracyArray, totalChecks:total, startPos:105, endPos:670, tempo:50, duration:9600, numNotes:8, image:"notes1.PNG"};

	notes = [83, 81, 79, 79, 83, 81, 79, 79, 79, 79, 81, 81, 83, 81, 79, 79];
	accuracyArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	total = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	song_hotcrossbuns = {name:"Hot Cross Buns", notes:notes, accuracy:accuracyArray, totalChecks:total, startPos:60, endPos:680, tempo:50, duration:19200, numNotes:16, image:"hotcrossbuns.PNG"};
	
	notes = [84, 84, 84, 79, 81, 81, 79, 0, 88, 88, 86, 86, 84];
	accuracyArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	total = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	song_oldmcdonald = {name:"Old McDonald", notes:notes, accuracy:accuracyArray, totalChecks:total, startPos:65, endPos:585, tempo:90, duration:8667, numNotes:13, image:"oldmcdonald.PNG"};

	$scope.songChoices = [song_campanille, song_monotone, song_hotcrossbuns, song_oldmcdonald];
	
	
	var render = function() {
        // Clear the canvas
        context.clearRect(0, 0, canvas.width, canvas.height);
        //Re-add picture
		context.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height);

        // Draw the square
        context.beginPath();
        context.rect(square.x, square.y, square.width, square.height);
        context.fillStyle = square.fill;
        context.fill();
        
        // Redraw
        requestAnimationFrame(render);
    };
    
    var animate = function(prop, val, duration) {
        // The calculations required for the step function
        var start = new Date().getTime();
        var end = start + duration;
        var current = square[prop];
        var distance = val - current;
          
        var step = function() {
          // Get our current progres
          var timestamp = new Date().getTime();
          var progress = Math.min((duration - (end - timestamp)) / duration, 1);
            
          // Update the square's property
          square[prop] = current + (distance * progress);
          
          // If the animation hasn't finished, repeat the step.
          if (progress < 1) requestAnimationFrame(step);
        };
        
        // Start the animation
        return step();
      };
     
	
	$scope.playSong = function() {

		$scope.score = "";
		$scope.accuracyForNote = "";
		
		image.src = $scope.song.image;
		square.x = $scope.song.startPos;
		square.y = 10;
		$scope.noteIndex = 0;
		$scope.currentNote = noteStrings[$scope.song.notes[$scope.noteIndex]%12];
		render();
		
		$('#countdownDisplay').addClass('animated zoomIn');
		console.log("3");
		$scope.countdown = 3;
		
		setTimeout(function() {
			console.log("2");
			$scope.countdown = 2;
			$scope.$apply();
			$('#countdownNumber').addClass('animated zoomIn');
		}, 1000);
		setTimeout(function() {
			$('#countdownNumber').removeClass('animated zoomIn');
			console.log("1");
			$scope.countdown = 1;
			$scope.$apply();
			$('#countdownNumber').addClass('animated zoomIn');
		}, 2000);

		
		setTimeout(function() {
				console.log("go!");
				$('#countdownNumber').removeClass('animated zoomIn');
				$('#countdownDisplay').removeClass('animated zoomIn');
				$('#countdownDisplay').addClass('animated zoomOut');
				$('#countdownDisplay').removeClass('animated zoomOut');
				$scope.countdown = 0;
				
				turnOnLiveInput();
				$scope.currentNote = noteStrings[$scope.song.notes[$scope.noteIndex]%12];
				$scope.$apply();
				animate('x', $scope.song.endPos, $scope.song.duration);
				
				var intervalLength = ($scope.song.duration / $scope.song.numNotes);
				var interval = setInterval(processSong, intervalLength);
				
				function processSong() {
					//advance noteIndex
					if ($scope.noteIndex >= $scope.song.numNotes - 1) {
						clearInterval(interval);
						console.log("final:");
						console.log($scope.song.accuracy);
						console.log($scope.song.totalChecks);
						$scope.accuracyForNote = "";
						evaluate();
					}
					/*
					nextEnd = $scope.song.startPos + (($scope.noteIndex + 1) * (($scope.song.endPos - $scope.song.startPos) / $scope.song.numNotes));
					animationLength = $scope.song.duration / $scope.song.numNotes;
					animate('x', nextEnd, animationLength);
					*/
					displayAccuracy();
					$scope.noteIndex++;
					
					if ($scope.song.notes[$scope.noteIndex] == 0) {
						$scope.currentNote = "-";
					}
					else {
						$scope.currentNote = noteStrings[$scope.song.notes[$scope.noteIndex]%12];
					}
					console.log("noteIndex: "+ $scope.noteIndex);
					console.log("currentNote: "+ $scope.currentNote);
					$scope.$apply();
				}
		
		}, 3000);

	}
	
	displayAccuracy = function() {
		console.log("accuracy called");
		var percentage = ($scope.song.accuracy[$scope.noteIndex] / $scope.song.totalChecks[$scope.noteIndex]) * 100;
		if (percentage > 80) {
			$scope.accuracyForNote = "Perfect!";
			$("#accuracyDisplay").css("color", "orange");
		}
		else if (percentage > 50) {
			$scope.accuracyForNote = "Good!";
			$("#accuracyDisplay").css("color", "green");
		}
		else {
			$scope.accuracyForNote = "Miss!";
			$("#accuracyDisplay").css("color", "red");
		}
		$scope.$apply();
	}
	
	evaluate = function() {
		var sum = 0;
		for (i = 0; i < $scope.song.accuracy.length; i++) {
			sum += ($scope.song.accuracy[i] / $scope.song.totalChecks[i]) * 100;
		}
		$scope.score = Math.round(sum / $scope.song.accuracy.length);
		if (isNaN($scope.score)) {
			$scope.score = 0;
		}
		$scope.$apply();
	}

	checkNote = function( note, detune ) {
		
		$scope.noteDisplayMe = noteStrings[note%12];
		
		if ($scope.noteIndex < $scope.song.numNotes) {

			//console.log(detune);
			//console.log("note: " + note);
			//console.log("noteIndex: " + $scope.noteIndex);
			//console.log("song.notes[$scope.noteIndex]: " + $scope.song.notes[$scope.noteIndex]);
			tolerance = 1;
			$scope.song.totalChecks[$scope.noteIndex]++;
			//console.log("note % 12: " + note % 12);
			//console.log("$scope.song.notes[$scope.noteIndex]%12: " + $scope.song.notes[$scope.noteIndex]%12);
			if (( note % 12 > ($scope.song.notes[$scope.noteIndex] % 12) - tolerance ) && ( note % 12 < ($scope.song.notes[$scope.noteIndex] % 12) + tolerance )) {
				//mod 12s here so we can do multiple octaves
				//console.log("matching");
				
				$scope.song.accuracy[$scope.noteIndex]++;//detune;
				
			}
			else {
				//console.log("didn't match");
			}
			
		}
		$scope.$apply();
	}

	
});