#!/usr/bin/python
# -*- coding: utf-8 -*-

import sys
import re

#---------------------------------------------------
print "\nconcordance"

text = ""

word = sys.argv[1]
if len(sys.argv) <= 2:
	n = 15
else:
	n = int(sys.argv[2])

for line in sys.stdin:
	text = text + line
words = text.split()

for i in range(0, len(words)):
	if words[i] == word:
		print words[i]