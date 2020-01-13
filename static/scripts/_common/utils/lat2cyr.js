'use strict';

var charReplacementMap = {
	A: 'А',
	B: 'В',
	C: 'С',
	E: 'Е',
	H: 'Н',
	K: 'К',
	M: 'М',
	O: 'О',
	P: 'Р',
	T: 'Т',
	Y: 'У',
	X: 'Х',
	a: 'а',
	b: 'в',
	c: 'с',
	e: 'е',
	h: 'н',
	k: 'к',
	m: 'м',
	o: 'о',
	p: 'р',
	t: 'т',
	y: 'у',
	x: 'х'
};

module.exports = {
	transform: function(str) {
		return str.split('').map(function(char) {
			return charReplacementMap[char] || char;
		}).join('');
	}
};
