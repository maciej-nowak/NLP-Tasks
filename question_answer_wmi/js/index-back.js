var readline = require('readline');
var staff = require('./staff+names.json');
var names = require('./test.json');
var Fuse = require('fuse.js');
var fuzzysearch = require('fuzzysearch');
var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});
var startQuestions = ["Czy masz jakieś pytanie?\n", "Co chciałbyś się dowiedzieć?\n", "Proszę zadaj pytanie. :)\n"];
var index = Math.floor((Math.random() * 3) + 1) - 1;

var recursiveAsyncReadLine = function() {
	rl.question(startQuestions[index], function(question) {
		fuzzySearchInformation(question)
		recursiveAsyncReadLine();
	});
};
recursiveAsyncReadLine();


function fuzzySearchInformation(question) {
	var lowestScore = 0;
		secondScore = 0;
		addSecondScore = false;
		result = [];
		items = [];

	var options = {
		caseSensitive: false,
		includeScore: false,
		shouldSort: true,
		threshold: 1.0,
		location: 0,
		distance: 100,
		maxPatternLength: 140,
		keys: ['imie', 'nazwisko'],
		include: ['score']
	};
	// var fuse = new Fuse(staff, options);
	// var splittedQuestion = question.split(" ");
	// for (var i = 0; i < splittedQuestion.length; i++) {
	// 	var result = fuse.search(splittedQuestion[i])
	// 	console.log(splittedQuestion[i], result[0]);
	// }

	var fuse = new Fuse(names, options);
	var splittedQuestion = question.split(" ");
	for (var i = 0; i < splittedQuestion.length; i++) {
		if (splittedQuestion[i+1] !== undefined) {
			var result = fuse.search(splittedQuestion[i]+" "+splittedQuestion[i+1])
			console.log(splittedQuestion[i]+" "+splittedQuestion[i+1], result[0]);
			console.log(splittedQuestion[i]+" "+splittedQuestion[i+1], result[1]);
			console.log(splittedQuestion[i]+" "+splittedQuestion[i+1], result[2]);
		}
	}


	// if (question === "1") result = fuse.search("Podaj mi numer pokoju Pana Rafała Jaworskiego")
	// else result = fuse.search(question)
	// lowestScore = result[0].score;
	// items.push(result[0])

	// for (var i = 1; i < result.length; i++) {
	// 	if (lowestScore == result[i].score) {
	// 		items.push(result[i])
	// 	} else {
	// 		secondScore = result[i].score;
	// 		if (secondScore == result[i].score) {
	// 			items.push(result[i])
	// 		}
	// 	}
			
	// }
	// var splittedQuestion = question.split(" ");
	// var searchCount = [];

	// if (items.length === 1) {
	// 	console.log('jeden element')
	// 	console.log(items[0])
	// } else {
	// 	for (var i = 0; i < items.length; i++) {
	// 		searchCount[i] = 0;
	// 		for (var j = 0; j < splittedQuestion.length; j++) {
	// 			if (JSON.stringify(items[i]).search(splittedQuestion[j].substr(0, 5)) !== -1) {
	// 				searchCount[i] = searchCount[i] + 1;
	// 			}
	// 		}
	// 	}
	// 	var largestValue = Math.max.apply(Math.max, searchCount);
	// 	var index = searchCount.indexOf(largestValue);
	// 	console.log('searchCount', searchCount)
	// 	console.log(items[index])
	// }
}





function searchInformationByKey() {
	for (key in staff) {
		if (staff.hasOwnProperty(key)) {
			if (staff[key]['pracownik'] === "Rafał Jaworski") {
				console.log(staff[key]['www'])
			}
		}
	}
}

function split(name) {
	return
}


	// for (var key = 0; key < items.length; key++) {
	// 	if (items[key].score === lowestScore) {
	// 		readyItems.push(items[key])
	// 	} else {
	// 		if (stairs < 10) {
	// 			lowestScore = items[key].score;
	// 			console.log('iteracja', key)
	// 			console.log('lowestScore', lowestScore)

	// 			readyItems.push(items[key]);
	// 		}
	// 		stairs = stairs + 1;
	// 	}
	// }