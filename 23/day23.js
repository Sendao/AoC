let fs = require('fs');


data = fs.readFileSync('data.txt', 'utf8');
data = data.split("\n").map( (x) => x.trim().split("") );

let elfpos = [];
let elfmove = [];
let n = data.length;
let m = data[0].length;
var i, j;

data.unshift( new Array(m).fill('.') );
data.push( new Array(m).fill('.') );
n += 2;
for( i=0; i<n; i++ ) {
	data[i].unshift('.');
	data[i].push('.');
}
m += 2;


console.log("Initial State");
for( i=0; i<n; i++ ) {
	console.log( data[i].join("") );
}


for( i=0; i<n; i++ ) {
	for( j=0; j<m; j++ ) {
		if( data[i][j] == '#' ) {
			elfpos.push( [j,i] );
			elfmove.push( 'X' );
		}
	}
}

var round, count;
let orth = { N: [0,-1], S: [0,1], E: [1,0], W: [-1,0] };
let diag = { NE: [1,-1], NW: [-1,-1], SE: [1,1], SW: [-1,1] };
let north = [ 'N', 'NE', 'NW' ];
let east = [ 'E', 'NE', 'SE' ];
let west = [ 'W', 'NW', 'SW' ];
let south = [ 'S', 'SE', 'SW' ];
let dirs = [ north, south, west, east ];
var ang, x,y, elf;
var x2, y2, direct, dir;
var startdir = 0;
var posits;

for( round=0; ; round++ ) {
	posits = new Map();
	for( elf=0; elf<elfpos.length; elf++ ) {
		[x,y] = elfpos[elf];

		count=0;
		for( ang in orth ) {
			x2 = x+orth[ang][0];
			y2 = y+orth[ang][1];
			if( y2 < n && x2 < m && y2 >= 0 && x2 >= 0 && data[y2][x2] == '#' ) {
				count++;
			}
		}
		for( ang in diag ) {
			x2 = x+diag[ang][0];
			y2 = y+diag[ang][1];
			if( y2 < n && x2 < m && y2 >= 0 && x2 >= 0 && data[y2][x2] == '#' ) {
				count++;
			}
		}

		elfmove[elf] = 'X';
		if( count == 0 ) {
			continue;
		}

		for( dir=startdir; dir<startdir+4; dir++) {
			direct = dirs[ dir % 4 ];
			count=0;
			x2 = x+orth[direct[0]][0];
			y2 = y+orth[direct[0]][1];
			if( y2 < n && x2 < m && y2 >= 0 && x2 >= 0 && data[y2][x2] == '#' ) {
				count++;
				continue;
			}
			x2 = x+diag[direct[1]][0];
			y2 = y+diag[direct[1]][1];
			if( y2 < n && x2 < m && y2 >= 0 && x2 >= 0 && data[y2][x2] == '#' ) {
				count++;
				continue;
			}
			x2 = x+diag[direct[2]][0];
			y2 = y+diag[direct[2]][1];
			if( y2 < n && x2 < m && y2 >= 0 && x2 >= 0 && data[y2][x2] == '#' ) {
				count++;
				continue;
			}
			if( count == 0 ) {
				elfmove[elf] = direct[0];
				//console.log("Elf " + elf + ": move " + direct[0]);
				x2 = x + orth[direct[0]][0];
				y2 = y + orth[direct[0]][1];
				if( posits.has( x2 + "," + y2 ) ) {
					posits.set( x2 + "," + y2, 2 );
				} else {
					posits.set( x2 + "," + y2, 1 );
				}
				break;
			}
		}
	}

	// look for expansions
	let ex0 = false, ex1 = false, ey0 = false, ey1 = false;
	for( elf=0; elf<elfmove.length; elf++ ) {
		if( elfmove[elf] == 'X' ) continue;
		x = elfpos[elf][0] + orth[elfmove[elf]][0];
		y = elfpos[elf][1] + orth[elfmove[elf]][1];
		if( posits.get( x + "," + y ) == 2 ) continue;

		if( x < 0 ) ex0 = true;
		if( y < 0 ) ey0 = true;
		if( y >= n ) ey1 = true;
		if( x >= m ) ex1 = true;
		
		if( ex0 && ey0 && ey1 && ex1 ) break;
	}

	//console.log("Expand ", ex0, ey0, ex1, ey1);

	if( ex0 || ey0 ) {
		//console.log("Shift ", ex0, ey0);
		for( elf=0; elf<elfmove.length; elf++ ) {
			elfpos[elf][0] += ex0 ? 1 : 0;
			elfpos[elf][1] += ey0 ? 1 : 0;
		}

		let tmp = new Map();
		let ke = posits.keys();
		for( i of ke ) {
			[x,y] = i.split(",");
			x = parseInt(x) + (ex0?1:0);
			y = parseInt(y) + (ey0?1:0);
			tmp.set( x + "," + y, posits.get(i) );
		}
		posits = tmp;
	}

	if( ex0 || ex1 ) { // expand left/right
		for( i=0; i<n; i++ ) {
			if( ex0 ) data[i].unshift('.');
			if( ex1 ) data[i].push('.');
		}
		m += ex0 ? 1 : 0;
		m += ex1 ? 1 : 0;
	}
	if( ey0 ) {
		data.unshift( new Array(m).fill('.') );
		n++;
	}
	if( ey1 ) {
		data.push( new Array(m).fill('.') );
		n++;
	}

	let found=false;
	var minx=Infinity, miny=Infinity, maxx=0, maxy=0;
	for( elf=0; elf<elfmove.length; elf++ ) {
		x = elfpos[elf][0];
		y = elfpos[elf][1];
		if( x < minx ) minx = x;
		if( y < miny ) miny = y;
		if( x > maxx ) maxx = x;
		if( y > maxy ) maxy = y;
		if( elfmove[elf] == 'X' ) continue;
		found = true;
		x2 = x + orth[elfmove[elf]][0];
		y2 = y + orth[elfmove[elf]][1];
		ang = posits.get( x2 + "," + y2 );
		if( ang == 1 ) {
			if( x2 < minx ) minx = x2;
			if( y2 < miny ) miny = y2;
			if( x2 > maxx ) maxx = x2;
			if( y2 > maxy ) maxy = y2;
			//console.log("Move elf " + elf + " from " + x + "," + y + " to " + x2 + "," + y2);
			elfpos[elf] = [x2,y2];
			data[y][x] = '.';
			if( y2 >= data.length || x2 >= data[0].length ) { console.log("******************OVERFLOW*********************"); }
			data[y2][x2] = '#';
		} else {
			//console.log("Cannot move to " + x2 + "," + y2);
		}
	}

	if( !found ) {
		console.log("No movement.");
		break;
	}

	startdir = (startdir+1)%4;

	if( (round%100) == 0 )
		console.log("End of Round " + (round+1));
/*part1:
	for( i=0; i<n; i++ ) {
		console.log( data[i].join("") );
	}
	if( (round%10) == 9 ) {
		let sum = 0;
		for( i=miny; i<=maxy; i++ ) {
			for( j=minx; j<=maxx; j++ ) {
				if( data[i][j] == '.' ) sum++;
			}
		}
		console.log((round+1) + " sum = " + sum);
		console.log(minx, miny, maxx, maxy);
	}

	if( round == 9 )
		break; */
}

console.log("Done at round " + round);
