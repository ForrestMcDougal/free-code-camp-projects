function palindrome(str) {
	// remove all punctuation and spaces and lower case
	str = str.toLowerCase();
	var regex = /[\s.,\/#!$%\^&\*;:{}=\-_`~()]/g;
	str = str.replace(regex, '');

	// unpack to array and check if palindrome
	let arr = [ ...str ];
	for (let i = 0; i < arr.length; i++) {
		if (arr[i] !== arr[arr.length - i - 1]) {
			return false;
		}
	}
	return true;
}
