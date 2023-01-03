#!/usr/bin/python

import json
import serial
import re
from pathlib import Path

home = str(Path.home())

f = open(home+"/.ninjakb/conf.json")
conf = json.load(f)
f2 = open("../frontend/public/scancodes.json")
scancodes = json.load(f2)

ser = serial.Serial()
ser.baudrate = 115200
ser.port=conf['device']

def sendKeys(keys, layer, side):
	for i, key in enumerate(keys):		
		print("key: "+key)
		t='c';
		k=None;
		if key in scancodes["modifiers"]:
			t='m'
			k=key
		else:
			if re.match('^M[ULDRB]/',key):
				t='p'
				k=key
			else:
				if key in scancodes["codes"]:
					k=scancodes["codes"][key]
		if k:
			cmd = "%s%d%02d%s%s" % (side[0],layer,i,t,k)
			print(cmd)
			ser.write(cmd.encode())

ser.open()
if ser.is_open:
	for l, layer in enumerate(conf['layers']):
		#print(layer)
		sendKeys(layer['left'],l,'l')
		sendKeys(layer['right'],l,'r')

	ser.write(b'save')
	ser.write(b'dump0')
	ser.write(b'dump1')	

f.close