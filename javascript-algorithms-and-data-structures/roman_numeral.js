function convertToRoman(num) {
	let numberArray = [ 1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1 ];
	let romanArray = [ 'M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I' ];

	let romanNumeral = '';
	for (let i = 0; i < numberArray.length; i++) {
		while (numberArray[i] <= num) {
			romanNumeral += romanArray[i];
			num -= numberArray[i];
		}
	}

	return romanNumeral;
}
