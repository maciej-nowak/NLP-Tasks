#!/usr/bin/python
# -*- coding: utf-8 -*-

import sys
import re
import operator

#---------------------------------------------------
print "\nfreq_words"

dictionary = {}
text = ""

for line in sys.stdin:
	text = text + line
text = re.sub('[\.\,\!\?\:\;\'\"]', '', text)
words = text.split()

for word in words:
	if not dictionary.has_key(word.lower()):
		dictionary[word.lower()] = 0
for word in words:
	dictionary[word.lower()] = dictionary[word.lower()] + 1

dictionary = sorted(dictionary.items(), key = operator.itemgetter(1))
dictionary.reverse()

for(word, count) in dictionary:
	print("%d\t%s" % (count, word))