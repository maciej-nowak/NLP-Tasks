var readline = require('readline');
var staff = require('./staff+names.json');
var names = require('./test.json');
var factories = require('./factories.json');
var Fuse = require('fuse.js');
var latinize = require('latinize');
var fuzzysearch = require('fuzzysearch');
var jsdom = require("jsdom");
var https = require("https");
var querySelectorAll = require('query-selector');
var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});
var L = require("levenshtein")

var informators = {}
var storeMonth = 0;
var storeYear = 0;

var recursiveAsyncReadLine = function() {
	var startQuestions = ["Czy masz jakieś pytanie?\n", "Czego chciałbyś się dowiedzieć?\n", "Proszę zadaj pytanie. :)\n"];
	var index = Math.floor((Math.random() * 3) + 1) - 1;

	console.log("")
	rl.question(startQuestions[index], function(question) {

		searchKeywords(question)
		recursiveAsyncReadLine();
	});
};
recursiveAsyncReadLine();

function sortObjectByProperty(object, property) {
	var sortedObject = object.slice(0);
	sortedObject.sort(function(a, b) {
		return a[property] - b[property]
	})
	return sortedObject;
}

function deletePrepositions(question) {

	var prepositions = ['aby', 'aczkolwiek', 'albo', 'albowiem', 'ale', 'ani', 'az', 'azeby', 'bez', 'beze', 'bo', 'bodaj', 'byle', 'choc', 'chociaz', 'czy', 'czyli', 'czyz', 'dla', 'do', 'dokad', 'gdy', 'gdyz', 'gdzie', 'gdziez', 'i', 'ile', 'iz', 'jak', 'jaki', 'jakie', 'jako', 'mimo', 'na', 'na', 'nad', 'nade', 'niech', 'niechaj', 'nuz', 'o', 'oby', 'od', 'po', 'pod', 'poza', 'przed', 'przede', 'przez', 'przeze', 'przy', 'spod', 'spode', 'sprzed', 'sprzede', 'ten', 'to', 'u', 'w', 'we', 'z', 'za', 'za', 'ze',
		'znad'
	];
	for (var i = 0; i < question.length; i++) {
		for (var j = 0; j < prepositions.length; j++) {
			if (latinize(question[i].toLowerCase()) === prepositions[j]) {
				question[i] = ""
			}
		}
	}
	var cleanedQuestion = question.filter(function(n) {
		return n !== ""
	});
	return cleanedQuestion;
}

function searchKeywords(question) {
	var keywords = {
		"biblioteka": ['biblioteka', 'bibliotece', 'biblioteki'],
		"wydzial": ['wydziale', 'wydzial'],
		"dziekan": ['dziekani', 'wladze', 'dziekan'],
		"info": ["info", "informacja", "informacje", "wszystko"],
		"informator": ['informator'],
		"zaklad": ["zaklad", "zaklady", "zakladach", "zakladow", "pracownia", "pracowni", "pracownie", "pracowniach"],
		"pokoj": ["pokoj", "pokoje", "pokoju", "pokoik", "pokoiczek", "pomieszczenie", "izba", "gabinet", "gabinecie", "salka", "miejsce", "miejscu"],
		"tel": ["tel", "telefon", "telefonu", "telefony", "telefonie", "aparat", "komorka", "komorce", "komorkowy", "komorkowego", "aparatu"],
		"mail": ["mailowy", "mail", "email", "e-mail", "maila", "emaila", "e-maila"],
		"www": ["strona", "strony", "stronie", "internetowa", "internetowej", "www", "html", "witryna", "witryny", "portal", "portalu", "wizytowka", "wizytowki", "url"],
		"stopien": ["stopien", "naukowy", "poziom", "poziomie", "stanowisko", "stanowisku", "stanowiskiem", "doktor", "doktorze", "doktora", "profesor", "profesora", "profesorze", "magister", "magistra", "magistrze"]
	}


	var splittedQuestion = deletePrepositions(question.split(" "))
	var foundKeywords = [];
	var numbers = {};

	for (var i = 0; i < splittedQuestion.length; i++) {
		for (key in keywords) {
			for (var j = 0; j < keywords[key].length; j++) {
				if (splittedQuestion[i].length >= 3 && fuzzysearch(latinize(splittedQuestion[i].toLowerCase()), keywords[key][j])) {
					foundKeywords.push(key);
					splittedQuestion[i] = "" //maybe add numer adres to not delete
				}

				if (splittedQuestion[i].length >= 3 && new L(latinize(splittedQuestion[i].toLowerCase()), keywords[key][j]) < 2) {
					foundKeywords.push(key)
					splittedQuestion[i] = ""
				}

				// for informator (identify year and month)
				if (parseInt(splittedQuestion[i]) !== NaN) {
					if (splittedQuestion[i].length <= 2) {
						numbers['month'] = splittedQuestion[i]
					}

					if (splittedQuestion[i].length == 4) {
						numbers['year'] = splittedQuestion[i]
					}
				}
			}
		}
	}

	var cleanedSplittedQuestion = splittedQuestion.filter(function(n) {
		return n !== ""
	});

	if (foundKeywords.length > 0) {
		var keyword = chooseMostCommonKeyword(foundKeywords)
		switch (keyword) {
			case "informator":
				// console.log('informator!')
				if (numbers['month'] !== undefined && numbers['year'] !== undefined) {
					getInformator(numbers['month'], numbers['year'])
				} else {
					console.log('Nie podano numeru miesiąca oraz roku. Np. "informator 7 2014"');
				}
				break;
			case "zaklad":
				getFactory(cleanedSplittedQuestion);
				break;
			case "biblioteka":
				getSimpleInformation('biblioteka')
				break;
			case "wydzial":
				getSimpleInformation('wydzial')
				break;
			case "dziekan":
				getSimpleInformation('dziekan')
				break;
			case "pokoj":
				fuzzySearchName(cleanedSplittedQuestion, keyword)
				break;
			case "tel":
				fuzzySearchName(cleanedSplittedQuestion, keyword)
				break;
			case "mail":
				fuzzySearchName(cleanedSplittedQuestion, keyword)
				break;
			case "www":
				fuzzySearchName(cleanedSplittedQuestion, keyword)
				break;
			case "stopien":
				fuzzySearchName(cleanedSplittedQuestion, keyword)
				break;
			case "info":
				fuzzySearchName(cleanedSplittedQuestion, keyword)
				break;
		}
	} else {
		console.log('Brak słów kluczowych.')
	}
}


function chooseMostCommonKeyword(foundKeywords) {
	var counts = {};
	foundKeywords.forEach(function(x) {
		counts[x] = (counts[x] || 0) + 1;
	});

	var counterKeyword = 0;
	var mostCommonKeyword = Object.keys(counts)[0];

	for (key in counts) {
		if (counterKeyword < counts[key]) {
			counterKeyword = counts[key]
			mostCommonKeyword = key
		}
	}

	// console.log(mostCommonKeyword)
	return mostCommonKeyword;
}

function fuzzySearchName(splittedQuestion, keyword) {
	var lowestScore = 0;
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

	// search name and surname by fuzzy search from database
	var fuse = new Fuse(names, options);
	for (var i = 0; i < splittedQuestion.length; i++) {
		if (splittedQuestion[i + 1] !== undefined && splittedQuestion[i].length >= 4 && splittedQuestion[i + 1].length >= 4 || splittedQuestion.length <= 2) { // >=4 for not checking very short words
			var result = fuse.search(splittedQuestion[i] + " " + splittedQuestion[i + 1])
			lowestScoreInCurrentResult = result[0].score;

			for (var j = 0; j < result.length; j++) {
				if (lowestScoreInCurrentResult == result[j].score) {
					items.push(result[j])
				}
			}

		}
		lowestScoreInCurrentResult = 0;
	}
	var sorted = sortObjectByProperty(items, 'score');

	// search the best probably surnames
	for (var i = 0; i < sorted.length; i++) {
		var name = latinize(sorted[i].item.imie.toLowerCase());
		surname = latinize(sorted[i].item.nazwisko.toLowerCase());
		passedLevenshtein = 0;

		for (var j = 0; j < splittedQuestion.length; j++) {

			if (new L(splittedQuestion[j], name).distance < 4) {
				passedLevenshtein = passedLevenshtein + 1;
			}

			if (new L(splittedQuestion[j], surname).distance < 4) {
				passedLevenshtein = passedLevenshtein + 1;
			}

		}
		sorted[i].success = passedLevenshtein;
	}

	var sortedBySuccess = sortObjectByProperty(sorted, 'success')
	try {
		var maxSuccess = sortedBySuccess.slice(-1)[0].success;
		if (maxSuccess !== 0) {

			// create unique array from set of the best probably surnames
			var set = new Set();
			for (key in sortedBySuccess) {
				if (sortedBySuccess[key]['success'] == maxSuccess) {
					set.add(sortedBySuccess[key]['item'])
				}
			}
			var employees = Array.from(set);
			if (employees.length === 1) {
				// getInformationAboutEmployee(employees[0].id, foundKeywords);
				getInformationAboutEmployee(employees[0].id, keyword);


			} else {
				for (var i = 0; i < employees.length; i++) {
					console.log([i] + ".", employees[i].imie, employees[i].nazwisko);
				}
				rl.question("\nDoprecyzuj o jaką osobę chciałeś zapytać, podaj numer pracownika z listy przedstawionej powyżej.\n", function(anwser) {
					// getInformationAboutEmployee(employees[anwser].id, foundKeywords);
					getInformationAboutEmployee(employees[anwser].id, keyword);

					recursiveAsyncReadLine();
				});
			}
		} else {
			console.log("Sprecyzuj swoje pytanie.")
		}
	} catch (e) {
		console.log("Brak wyników.")
	}
}

function getInformationAboutEmployee(id, keyword) {
	var mostCommonKeyword = keyword;
	var employee = staff[id].imie + " " + staff[id].nazwisko;
	switch (mostCommonKeyword) {
		case 'stopien':
			console.log("Stopień naukowy pracownika: " + employee + ", to " + staff[id].stopien);
			break;
		case 'pokoj':
			console.log(employee + " - pokój: " + staff[id].pokoj)
			break;
		case 'tel':
			console.log(employee + " - telefon: " + staff[id].tel)
			break;
		case 'www':
			if (staff[id].www !== undefined) {
				console.log(employee + " - adres strony internetowej: " + staff[id].www)
			} else {
				console.log('Niestety pracownik ' + employee + " nie posiada strony internetowej.")
			}
			break;
		case 'mail':
			console.log(employee + " - e-mail: " + staff[id].mail)
			break;
		case 'info':
			console.log("Pracownik: " + employee);
			console.log("- stopień naukowy: " + staff[id].stopien)
			console.log("- pokój: " + staff[id].pokoj)
			console.log("- telefon: " + staff[id].tel)
			console.log("- e-mail: " + staff[id].mail)
			if (staff[id].www !== undefined) {
				console.log("- www: " + staff[id].www)
			} else {
				console.log("- www: brak")
			}
			break;
	}
	console.log("______________________");
}


// -------------------------------------------------------------------------------------------------------

function fetchNewsAboutDepartment() {
	console.log("Pobieranie informatora...")
	return new Promise(function(resolve, reject) {

		if (Object.keys(informators).length === 0) {
			var body;
			var data = {}

			https.get("https://info.wmi.amu.edu.pl/", function(res) {
				res.setEncoding('utf8');
				res.on('data', function(chunk) {
					var dom = jsdom.defaultLevel;

					var document = jsdom.jsdom(chunk, {
						features: {
							QuerySelector: true
						}
					});

					var index = 0;

					var a = document.querySelector('#informatorsHome')
					if (a != null) {
						var b = a.querySelectorAll('ul');
						for (var i = 0; i < b.length; i++) {
							for (var j = 0; j < b[i].querySelectorAll('li').length; j++) {
								if (b[i].querySelectorAll('li')[j].textContent[0] === "R") {
									var year = b[i].querySelectorAll('li')[j].textContent;
									index = 0;
								} else {
									var href = b[i].querySelectorAll('li')[j].innerHTML;
									var month = b[i].querySelectorAll('li')[j].textContent;
									index = index + 1;
								}
								if (index == 0) {
									data[year] = {}
								} else {
									var a = href.substr(href.indexOf('="') + 2);
									var preparedHref = 'https://info.wmi.amu.edu.pl' + a.substr(0, a.indexOf(">") - 1)
									data[year][month] = preparedHref;
								}
							}
						}
					}
					resolve(data)
				});
			});
		} else {
			resolve(informators)
		}
	});
}

function chooseInformator(data) {
	informators = data;

	var date = getDate(storeMonth, storeYear)
	for (key in informators) {
		if ("Rok " + date.year == key) {
			if (informators[key][date.month] !== undefined) {
				console.log("Adres informatora (" + date.month + " " + date.year + "): " + informators[key][date.month])
			} else {
				console.log("Brak informatora (" + date.month + " " + date.year + ")")
			}
		}
	}
}

function getInformator(month, year) {


	return fetchNewsAboutDepartment()
		.then(storeDate(month, year))
		.then(chooseInformator)
}

function storeDate(month, year) {
	storeMonth = month;
	storeYear = year;
}

function getDate(month, year) {
	var months = {
		"styczeń": [1],
		"luty": [2],
		"marzec": [3],
		"kwiecień": [4],
		"maj": [5],
		"czerwiec": [6],
		"lipiec": [7],
		"sierpień": [8],
		"wrzesień": [9],
		"październik": [10],
		"listopad": [11],
		"grudzień": [12]
	}

	var date = {};
	date['year'] = year;
	var month = parseInt(month);

	for (key in months) {
		if (months[key] == month) {
			date['month'] = key;
		}
	}
	return date;
}
// -------------------------------------------------------------------------------------------------------

function getFactory(splittedQuestion) {
	if (splittedQuestion.length !== 0) {
		searchFactory(splittedQuestion)
	} else {
		rl.question("\nDoprecyzuj o jaki zakład chodzi.\n", function(anwser) {
			var splittedAnwser = deletePrepositions(anwser.split(" "))
			searchFactory(splittedAnwser)
		})
	}
}


function searchFactory(anwser) {
	var foundFactoriesSet = new Set();
	for (key in factories) {
		for (var i = 0; i < anwser.length; i++) {
			if (fuzzysearch(latinize(anwser[i].substr(0, 6).toLowerCase()), latinize(factories[key]['title'].toLowerCase()))) {
				foundFactoriesSet.add(factories[key])
			}
		};
	}

	var foundFactories = Array.from(foundFactoriesSet);

	if (foundFactories.length === 1) {
		chooseFactoryById(foundFactories, 0)
	}
	if (foundFactories.length === 0) {
		console.log("Brak wyników :(");
		recursiveAsyncReadLine();
	}
	if (foundFactories.length > 1) {
		console.log("Znalezione dopasowania: " + foundFactories.length)
		for (var i = 0; i < foundFactories.length; i++) {
			console.log([i] + ".", foundFactories[i].title);
		}
		rl.question("\nZnaleziono kilka wyników, wybierz numer zakładu\n", function(anwser) {
			chooseFactoryById(foundFactories, anwser)

		})
	}
}

function chooseFactoryById(foundFactories, id) {
	console.log("Adres internetowy dla: " + foundFactories[id].title + " - " + foundFactories[id].url)
	recursiveAsyncReadLine();
}

// -------------------------------------------------------------------------------------------------------

function getSimpleInformation(what) {
	switch (what) {
		case "biblioteka":
			console.log("Kierownikiem biblioteki jest mgr Teresa Nowak.\nBiblioteka jest otwarta w następujących godzinach: \n * Poniedziałek - Piątek: 8:00 - 19:00\n * Sobota: 10:00 - 15:00\n Więcej informacji pod adresem: https: //www.wmi.amu.edu.pl/pl/biblioteka\n");
			break;
		case "wydzial":
			console.log('Wydział Matematyki i Informatyki Uniwersytetu im. Adama Mickiewicza Collegium Mathematicum\nul.Umultowska 87\n 61 - 614 Poznań\n tel.(0 - 61) 829 - 5308\n e - mail: wmiuam@ amu.edu.pl\n Dziekanem wydziału jest prof.dr hab.Jerzy Kaczorowski\n');
			break;
		case "dziekan":
			console.log('Dziekan: prof. dr hab. Jerzy Kaczorowski\nProdziekan ds. studenckich (studia stacjonarne): dr Roman Czarnowski\nProdziekan ds. studenckich (studia niestacjonarne): prof. UAM dr hab. Jerzy Szymański\nProdziekan ds.finansowych i organizacyjnych: prof.UAM dr hab.Marek Wisła\n Prodziekan ds.naukowych: prof.dr hab.Witold Wnuk\n Więcej informacji na temat władz wydziału pod adresem: https: //www.wmi.amu.edu.pl/pl/wladze\n');
			break;
	}
	recursiveAsyncReadLine();

}
