// build lookupfor denominations
var changeDict = [
	{ name: 'ONE HUNDRED', val: 100.0 },
	{ name: 'TWENTY', val: 20.0 },
	{ name: 'TEN', val: 10.0 },
	{ name: 'FIVE', val: 5.0 },
	{ name: 'ONE', val: 1.0 },
	{ name: 'QUARTER', val: 0.25 },
	{ name: 'DIME', val: 0.1 },
	{ name: 'NICKEL', val: 0.05 },
	{ name: 'PENNY', val: 0.01 }
];

function checkCashRegister(price, cash, cid) {
	var output = { status: null, change: [] };
	var diff = cash - price;

	// initialize register object with all available monies
	var register = cid.reduce(
		function(acc, curr) {
			acc.total += curr[1];
			acc[curr[0]] = curr[1];
			return acc;
		},
		{ total: 0 }
	);

	// case: change due is equal to change in register
	if (register.total === diff) {
		output.status = 'CLOSED';
		output.change = cid;
		return output;
	}

	// case: change due is greater than money in register
	if (register.total < diff) {
		output.status = 'INSUFFICIENT_FUNDS';
		return output;
	}

	// find how much money is due and check if you can give exact change
	var change_arr = changeDict.reduce(function(acc, curr) {
		var value = 0;
		while (register[curr.name] > 0 && diff >= curr.val) {
			diff -= curr.val;
			register[curr.name] -= curr.val;
			value += curr.val;

			diff = Math.round(diff * 100) / 100;
		}
		if (value > 0) {
			acc.push([ curr.name, value ]);
		}
		return acc;
	}, []);
	if (change_arr.length < 1 || diff > 0) {
		output.status = 'INSUFFICIENT_FUNDS';
		return output;
	}
	output.status = 'OPEN';
	output.change = change_arr;
	return output;
}
