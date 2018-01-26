#!/usr/bin/python
# -*- coding: utf-8 -*-

import sys
import re
import operator

#---------------------------------------------------
print "\nfreq_letters"

dictionary = {}
text = ""

for line in sys.stdin:
	text = text + line
text = re.sub('[\W\d]', '', text)
words = text.split()

for word in words:
	for letter in word:
		if not (letter in dictionary):
			dictionary[letter] = 1
		else:
			dictionary[letter] = dictionary[letter] + 1

dictionary = sorted(dictionary.items(), key = operator.itemgetter(0))

for(letter, count) in dictionary:
	print("%s\t%d" % (letter, count))
