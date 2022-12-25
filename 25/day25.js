let fs = require('fs');


let rsnafu = function(data) {
	let len = data.length;
	let y = 1;
	let x = 0;
	for( var j=len-1; j>=0; j-- ) {
		switch( data[j] ) {
			case '1': n = 1; break;
			case '2': n = 2; break;
			case '-': n = -1; break;
			case '=': n = -2; break;
			case '0': n = 0; break;
		}
		x += y*n;
		y *= 5;
	}

	return x;
}
let snafu = function(n) {
	let s = "";
	var v, t, prev=0, next=0;

	while( n > 0 ) {
		v = (n%5) + next;

		if( v > 4 ) {
			next = 1;
			v -= 5;
		} else {
			next = 0;
		}

		if( v > 2 ) {
			next ++ ;
			v -= 5;
		}
		if( v == -1 ) t = '-';
		else if( v == -2 ) t = '=';
		else t = "" + v;

		s = t + s;
		n = Math.floor(n/5);
	}
	if( next == 1 )
		s = "1" + s;
	return s;
}


let data = fs.readFileSync('data.txt', 'utf8');
data = data.split("\n").map( (x) => x.trim().split("") );

var i, x, sum=0;
for( i=0; i<data.length; i++ ) {
	x = rsnafu(data[i]);
	console.log(data[i].join(""), x, snafu(x));
	sum += x;
}

console.log("Sum: " + sum);
console.log("Snafu: " + snafu(sum));
console.log("Check: " + rsnafu(snafu(sum)));
// not  2-----1-2=-=22=2-011 (33411698619881)