#!/usr/bin/python3
import re
import json
import sys
surname = input('Podaj nazwisko\n')

#getting surnames' ends
with open(sys.argv[1]) as data_file:   
    ends = json.load(data_file)

#getting surnames' classes and codes
with open(sys.argv[2]) as data_file:
	asset = json.load(data_file)

#setting data
classes = asset[0]
codes = asset[1][0]
cases = ['mianownik', 'dopelniacz', 'celownik', 'biernik', 'nadrzednik', 'miejscownik', 'wolacz']

#return answer, if true then return dictionary {match[classes, input], class_number}
def getClassOfName(surname):

	#iterate by elements in classes to find proper 'ends'
	for line in range(0,len(classes)):
		table_of_ends = classes[line] #from current class		
		for element in range(0,len(table_of_ends)):

			#check the surname is right
			regex = re.escape(table_of_ends[element]) + r'$'
			check_name = re.search(regex, surname)

			#if the surname match to 'ends' return proper dictionary
			#e.g. {"match" : ["ski", "Szymański"], "class_number" : 0}
			if(check_name != None):
				properties = {
					"match": [check_name.group(), surname],
					"class_number": line
				}
				return properties
			pass
		pass
	pass

#display data
def showVariants(surname_from_user):

	#getting answer from function, if positive set data
	record = getClassOfName(surname_from_user)
	if(record != None):
		class_number = ends[record["class_number"]]
		surname = record["match"][1]

		#iterating by case like mianownik, dopelniacz...
		for i in range(0,len(cases)):

			#get ends from case e.g. ["ki", "cy", "ka"]
			CASE = class_number[cases[i]]			
			#getting end of surname e.g. "ski"
			end = record["match"][0]
			#getting theme depends on end e.g. "s"
			theme = codes[end]
			#setting core of surname e.g. "Szymań" + "s"
			core_surname = surname[0:surname.rfind(end)] + theme

			#display data
			print('**********************')
			print(cases[i])
			for j in range(0,len(CASE)):
				#setting final surname in one case 
				#e.g. "Szymańs" + ki, "Szymańs" + cy, "Szymańs" +ka
				print("--", core_surname + CASE[j])
				pass
		pass
	else:
		print("Nie znaleziono nazwiska w bazie")
	pass

showVariants(surname);