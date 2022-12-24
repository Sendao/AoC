


var i;

for( i=2; i<100; i++ ) {
	let gold = i*10;
	let pirates = (gold-4)/12;

	if( parseInt(pirates) == pirates ) {
		console.log("Found it: " + gold +" gold.");
	}
}
