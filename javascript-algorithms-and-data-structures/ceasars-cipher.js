function rot13(str) {
	str = str.toUpperCase();
	let regex = /\s/;
	let arr = [ ...str ];
	for (let i = 0; i < arr.length; i++) {
		let charCode = arr[i].charCodeAt(0);
		if (charCode < 65 || charCode > 90) {
			arr[i] = arr[i];
		} else if (charCode < 78) {
			arr[i] = String.fromCharCode(charCode + 13);
		} else {
			arr[i] = String.fromCharCode(charCode - 13);
		}
	}
	return arr.join('');
}
