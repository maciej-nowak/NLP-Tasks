#!/usr/bin/python
# -*- coding: utf-8 -*-
import sys
import re

dictionary = open(sys.argv[1]).read()
dictionary = dictionary.replace("\n", " ")
dictionary = re.sub('[ ]{2,}', ' ', dictionary)
dictionary = dictionary.split(" ")
text = sys.argv[2]

for i in range(0, len(dictionary) - 1, 2):
	text = re.sub(dictionary[i], dictionary[i+1], text)
print text