#!/usr/bin/python
# -*- coding: utf-8 -*-
import sys
import re

#---------------------------------------------------
print "\nUnikat"
def uniq_elements(sequence):
	print len(set(sequence))

#test
uniq_elements('tescikkk')
uniq_elements(['a', 'b', 'a', 'd', 'c'])
uniq_elements((1,2,3,4,5,1,2,3,6))
uniq_elements(set([1,2,4,3,2,1,3,2]))

#---------------------------------------------------
print "\nMini slowniczek"
def freq_dic(sequence):
	dictionary = {}
	for i in sequence:
		dictionary[i] = 0
	for i in sequence:
		dictionary[i] = dictionary[i] + 1
	print dictionary

#test
freq_dic("abracadabra")
freq_dic("tescikkk")

#---------------------------------------------------
print "\nSufiksy"
def suffixes(string):
	suffixes_list = []
	for i in range(0, len(string)):
		word = ""
		for j in range(i, len(string)):
			word = word + string[j]
		suffixes_list.append(word)
	print suffixes_list

#test
suffixes("banana")
suffixes("tescikkk")

#---------------------------------------------------
print "\nBi"
def bigram(string):
	bigrams_list = []
	for i in range(0, len(string) - 1):
		word = string[i] + string[i+1]
 		bigrams_list.append(word)
 	return bigrams_list

def bigrams(sequence):
	bigrams_list = []
	if isinstance(sequence, basestring):
		print bigram(sequence)
	else:
		for element in sequence:
			print bigram(element)

#test
bigrams("banana")
bigrams(("abcdef","ghijk", "lmnopr"))
bigrams(["abcdef","ghijk","lmnopr"])
bigrams(set(["abcdef","ghijk","lmnopr"]))

#---------------------------------------------------
print "\nEnigma"
def enigma():
	dictionary = {}
	i = 0
	text = sys.stdin.readline()
	text = text.strip()
	text = re.sub('[ ]{2,}', ' ', text)
	text = text.split(" ")
	print text
	for word in text:
		if not word in dictionary:
			dictionary[word] = i
			i = i + 1
		print dictionary[word]

#test		
enigma()


