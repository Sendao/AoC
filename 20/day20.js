let fs = require('fs');


data = fs.readFileSync('data.txt', 'utf8');
let key = 811589153;
data = data.split("\n").map( (x, i) => [ 0, parseInt(x)*key, i ] );

function moveCycle( arr, oldpos, val, newrun ) {
	let newpos = oldpos+val;
	let oldspot = arr[oldpos][2];
	if( val == 0 ) {
		arr[oldpos][0] = newrun;
		return;
	}
	arr.splice(oldpos, 1);
	
	if( newpos < 0 )
		newpos = (newpos%arr.length) + arr.length;
	else
		newpos = (newpos%(arr.length));

	arr.splice(newpos, 0, [newrun,val,oldspot]);
//	console.log("Shift " + val + " to " + newpos + ": " + arr.map((x)=>x[1]).join(","));
}

var i, j, run;
//console.log(data.map( (x) => x[1] ).join(","));

for( run=0; run<10; run++ ) {
	console.log(run);
	for( i=0; i<data.length; i++ ) {
		for( j=0; j<data.length; j++ ) {
			if( data[j][0] == run && data[j][2] == i ) {
				moveCycle(data, j, data[j][1], run+1);
				break;
			}
		}
	}
	//console.log(data.map( (x) => x[1] ).join(","));
}

data = data.map( (x) => x[1] );
//console.log(data);

for( i=0; i<data.length; i++ ) {
	if( data[i] == 0 )
		break;
}
let n=0, sum=0;

sum += data[ (i + 1000)%data.length ];
sum += data[ (i + 2000)%data.length ];
sum += data[ (i + 3000)%data.length ];

console.log(i, data.length, sum, data[(i+1000)%data.length], data[(i+2000)%data.length], data[(i+3000)%data.length]);

