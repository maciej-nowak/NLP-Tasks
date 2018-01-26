var readline = require('readline');
var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});
var args = process.argv.slice(2);
var dict = require('./' + args[0]);

rl.question("Podaj nazwisko, które chcesz przetworzyć\n", function(surname) {
	surname = surname.toLowerCase();
	surname = surname.charAt(0).toUpperCase() + surname.substr(1);
	Module.generateVariantsPerCases(surname);

});

process.on('uncaughtException', function(err) {
	console.log("Podane nazwisko nie posiada odpowiedniej klasy")
	process.exit()
});

var cases = [
	'Mianownik  (Kto, co?)		→',
	'Dopełniacz (Kogo, czego?)	→',
	'Celownik (Komu, czemu?)		→',
	'Biernik (Kogo, co?)		→',
	'Narzędnik (Z kim?, Z czym?)	→',
	'Miejscownik (O kim?, O czym?)	→',
	'Wołacz (Hej!) 			→'
];

var classes = dict[0];
var ends = dict[1];

var Module = new function() {
	this.cases = cases;
	this.ends = ends;
	this.classes = classes;
	this.checkSurname = function(last_characters, surname) {
		var pattern = new RegExp(last_characters + "$");
		return surname.match(pattern);
	}
	this.classifySurname = function(surname) {
		var self = this;
		for (var number in self.classes) {
			if (classes.hasOwnProperty(number)) {
				var table_of_ends = self.classes[number]; //from current class

				for (var i = 0; i < table_of_ends.length; i++) {
					var test = self.checkSurname(table_of_ends[i], surname);
					if (test !== null) {
						return {
							match: test,
							class_number: number
						}
					}
				}
			}
		}
	}
	this.generateVariantsPerCases = function(surname_from_user) {
		var record = this.classifySurname(surname_from_user);
		var surname_class = ends[record.class_number]
		console.log('class →', record);

		if (record.class_number !== undefined) {
			var surname = record.match.input;
			for (var prop in surname_class) {
				var current_case = surname_class[prop];

				var cutted_surname;
				if (prop === "0" && current_case[0] !== "") {
					var index_of_end = surname.lastIndexOf(current_case[0]);
					cutted_surname = surname.substring(0, index_of_end);
				}
				if (cutted_surname === undefined) cutted_surname = surname;

				var answer = "	"
				for (var i = 0; i < current_case.length; i++) {
					answer += cutted_surname + current_case[i] + " ";
				}
				if (answer !== undefined) console.log(cases[prop] + answer);

			}
		}
	}
};
