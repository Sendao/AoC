let fs = require('fs');


data = fs.readFileSync('data.txt', 'utf8');
data = data.split("\n").map( (x, i) => x.split(":").map( (y) => (y).trim() ) );

var i;
var G = {};

for( i=0; i<data.length; i++ ) {
	if( !isNaN(data[i][1]) ) {
		G[data[i][0]] = parseInt(data[i][1]);
	} else {
		let cmd = data[i][1].split(" ");
		G[data[i][0]] = [ cmd[0], cmd[1], cmd[2] ];
	}
}

let evaluate = function(name) {
	if( isNaN(G[name]) ) {
		switch( G[name][1] ) {
			case '*':
				return evaluate(G[name][0]) * evaluate(G[name][2]);
			case '+':
				return evaluate(G[name][0]) + evaluate(G[name][2]);
			case '-':
				return evaluate(G[name][0]) - evaluate(G[name][2]);
			case '/':
				return evaluate(G[name][0]) / evaluate(G[name][2]);
		}
	}
	return G[name];
}

let evaluateVar = function(name) {
	let data = [];
	var a,b,i,j,tgt;

	if( !isNaN(name) ) return [parseInt(name)];
	
	if( name in G && isNaN(G[name]) ) {
		switch( G[name][1] ) {
			case '*':
				a = evaluateVar(G[name][0]);
				b = evaluateVar(G[name][2]);

				data = new Array( a[0].length + b[0].length ).fill(0);
				data2 = new Array( a[1].length + b[1].length ).fill(0);

				for( i=0; i<a[0].length; i++ ) {
					for( j=0; j<b[0].length; j++ ) {
						data[i+j] += a[0][i] * b[0][j];
					}
					for( j=0; j<b[1].length; j++ ) {
						tgt = i - (j+1);
						if( tgt < 0 ) {
							data2[-(tgt+1)] += a[0][i] * b[1][j];
						} else {
							data[tgt] += a[0][i] * b[1][j];
						}
					}
				}

				for( i=0; i<a[1].length; i++ ) {
					for( j=0; j<b[1].length; j++ ) {
						throw "illegal op lol";
					}
				}


				console.log( name, G[name], data, data2 );
				return [data,data2];
			case '+':
				a = evaluateVar(G[name][0]);
				b = evaluateVar(G[name][2]);

				data = new Array( Math.max(a[0].length,b[0].length) ).fill(0);
				data2 = new Array( Math.max(a[1].length, b[1].length) ).fill(0);

				for( i=0; i<a[0].length; i++ ) {
					if( i < b[0].length )
						data[i] += a[0][i] + b[0][i];
					else
						data[i] += a[0][i];
				}
				for( ; i<b[0].length; i++ ) {
					data[i] += b[0][i];
				}
				for( i=0; i<a[1].length; i++ ) {
					if( i < b[1].length )
						data2[i] += a[1][i] + b[1][i];
					else
						data2[i] += a[1][i];
				}
				for( ; i<b[1].length; i++ ) {
					data2[i] += b[1][i];
				}

				console.log( name, G[name], data, data2 );
				return [data,data2];
			case '-':
				a = evaluateVar(G[name][0]);
				b = evaluateVar(G[name][2]);

				data = new Array( Math.max(a[0].length,b[0].length) ).fill(0);
				data2 = new Array( Math.max(a[1].length, b[1].length) ).fill(0);

				for( i=0; i<a[0].length; i++ ) {
					if( i < b[0].length )
						data[i] += a[0][i] - b[0][i];
					else
						data[i] += a[0][i];
				}
				for( ; i<b[0].length; i++ ) {
					data[i] += -b[0][i];
				}
				for( i=0; i<a[1].length; i++ ) {
					if( i < b[1].length )
						data2[i] += a[1][i] - b[1][i];
					else
						data2[i] += a[1][i];
				}
				for( ; i<b[1].length; i++ ) {
					data2[i] += -b[1][i];
				}

				console.log( name, G[name], data, data2 );
				return [data,data2];
			case '/':
				a = evaluateVar(G[name][0]);
				b = evaluateVar(G[name][2]);

				data = new Array( Math.max(a[0].length,b[0].length) ).fill(0);
				data2 = new Array( Math.max(a[1].length, b[1].length) ).fill(0);

				var tgt;

				for( i=0; i<a[0].length; i++ ) {
					if( a[0][i] == 0 ) continue;
					for( j=0; j<b[0].length; j++ ) {
						if( b[0][j] == 0 ) continue;
						tgt = i-j;
						if( tgt < 0 ) {
							data2[-(tgt+1)] += a[0][i] / b[0][j];
						} else {
							data[tgt] += a[0][i] / b[0][j];
						}
					}
				}
				for( i=0; i<a[1].length; i++ ) {
					if( a[1][i] == 0 ) continue;
					for( j=0; j<b[0].length; j++ ) {
						tgt = (-1-i)-j;
						if( tgt < 0 ) {
							data2[-(tgt+1)] += a[1][i] / b[0][j];
						} else {
							data[tgt] += a[1][i] / b[0][j];
						}
					}
				}

				for( i=0; i<a[0].length; i++ ) {
					if( a[0][i] == 0 ) continue;
					for( j=0; j<b[1].length; j++ ) {
						if( b[1][j] == 0 ) continue;
						throw "Not good.";
						tgt = i-(j+1);
						if( tgt < 0 ) {
							data2[-(tgt+1)] += a[0][i] / b[1][j];
						} else {
							data[tgt] += a[0][i] / b[1][j];
						}
					}
				}
				for( i=0; i<a[1].length; i++ ) {
					if( a[1][i] == 0 ) continue;
					for( j=0; j<b[1].length; j++ ) {
						if( b[1][j] == 0 ) continue;
						throw "Not good";
						tgt = -(i+1)-(j+1);
						if( tgt < 0 ) {
							data2[-(tgt+1)] += a[1][i] / b[1][j];
						} else {
							data[tgt] += a[1][i] / b[1][j];
						}
					}
				}

				console.log( name, G[name], data, data2 );
				return [data,data2];
		}
	}
	if( name == "humn" ) return [[0,1],[]];
	if( !(name in G) ) console.log("Missing: " + name);
	console.log(name, G[name]);
	return [[G[name]],[]];
}

let topop = 1;

function solvefor(a, b)
{
	let name = "ax" + topop;
	var humns = 0; var digits = 0;
	topop++;

	let data1, data2;
	var solver1, solver2;

	data1 = evaluateVar(a);
	data2 = evaluateVar(b);
	solver1 = new Array(Math.max(data1[0].length, data2[0].length)).fill(0);
	solver2 = new Array(Math.max(data1[1].length, data2[1].length)).fill(0);

	console.log("Data1: " + data1[0].join(",") + "^" + data1[1].join(","));
	console.log("Data2: " + data2[0].join(",") + "^" + data2[1].join(","));

	var i;

	for( i=0; i<data2[0].length; i++ ) {
		if( i < data1[0].length )
			solver1[i] += data1[0][i] - data2[0][i];
		else
			solver1[i] -= data2[0][i];
	}
	for( ; i<data1[0].length; i++ ) {
		solver1[i] += data1[0][i];
	}
	for( i=0; i<data2[1].length; i++ ) {
		if( i < data1[1].length )
			solver2[i] += data1[1][i] - data2[1][i];
		else
			solver2[i] -= data2[1][i];
	}
	for( ; i<data1[1].length; i++ ) {
		solver2[i] += data1[1][i];
	}
	var solution;

	console.log("Solver: " + solver1.join(",") + "^" + solver2.join(","));
	let constant = solver1.shift();
	let n = 0;

	if( solver1.length > 0 ) {
		n = solver1.shift();
		if( n == 0 ) {
			console.log("Any number will do.");
			return;
		}
		constant /= n;
	}

	while( solver1.length > 0 ) {
		n = solver1.shift();
		if( n != 0 ) {
			console.log("This is not right.");
			constant /= solver1.shift();
			constant = Math.sqrt(constant);
		}
	}

	console.log("Constant: " + constant);
}


// root = a + b
// a = 52
// b = humn + 3
// 52 = humn + 3
/*
G["testa"] = 52;
G["testb"] = ["humn", "+", 3];
console.log(evaluateVar("testb"));
solvefor("testa", "testb");


// 49 = humn

// root = a + b
// a = humn + 3
// b = humn * 2
// humn + 3 = humn * 2
// 3 = humn * 2 - humn
// 3 = humn * 1
G["testc"] = ["humn", "+", 3];
G["testd"] = ["humn", "*", 2];
solvefor("testc", "testd");
*/
// root = a + b
// a = c + d
// b = e + f
// c = humn * 2
// d = humn + 3
// e = humn * 2
// d = humn + 3
// c + d = e + f
// humn * 2 + humn + 3 = humn * 2 + humn + 3
// 3 = humn * 2 + humn + 3 - humn * 2 - humn
// 3 = humn * 3 + 3 - humn * 3;
// 3 = 3


solvefor(G["root"][0], G["root"][2]);

