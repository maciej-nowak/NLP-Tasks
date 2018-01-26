#!/usr/bin/python
# -*- coding: utf-8 -*-

import sys
import re

#---------------------------------------------------
print "\nngrams"

text = ""

if len(sys.argv) <= 1:
	n = 3
else:
	n = int(sys.argv[1])

for line in sys.stdin:
	text = text + line
text = re.sub('[\.\,\!\?\:\;\'\"]', '', text)
words = text.split()

for x in range(0, len(words)-n+1):
	print words[x:x+n]





