let fs = require('fs');


data = fs.readFileSync('data.txt', 'utf8');
data = data.split("\n").map( (x) => x.trim().split("") );

let blizzards = [], bsets = new Set();
var i,j;

for( i=0; i<data.length; i++ ) {
	for( j=0; j<data[0].length; j++ ) {
		if( data[i][j] == '>' || data[i][j] == '<' || data[i][j] == '^' || data[i][j] == 'v' ) {
			blizzards.push( [i,j,data[i][j]] );
			bsets.add( i + "," + j );
			data[i][j] = '.';
		}
	}
}

var startx, starty=0;
for( j=0; j<data[0].length; j++ ) {
	if( data[0][j] == '.' ) {
		startx = j;
		break;
	}
}

let n = data.length-1;
let m = data[0].length-1;

var endx, ex, ey = n, endy = n;
for( j=0; j<data[0].length; j++ ) {
	if( data[n][j] == '.' ) {
		ex = endx = j;
		break;
	}
}

console.log("Start: " + starty + "," + startx + " End: " + endy + "," + endx + " Blizzards: " + blizzards.length);

let steps = new Map();
let getNextStep = function(blizzards) {
	var i, blizz, bset=new Set();
	blizz = [];
	for( i=0; i<blizzards.length; i++ ) {
		switch( blizzards[i][2] ) {
			case '>': blizz.push( [blizzards[i][0], blizzards[i][1]+1 == m ? 1 : blizzards[i][1]+1, blizzards[i][2]] ); break;
			case '<': blizz.push( [blizzards[i][0], blizzards[i][1]-1 == 0 ? m-1 : blizzards[i][1]-1, blizzards[i][2]] ); break;
			case '^':
				blizz.push( [blizzards[i][0]-1 == 0 ? n-1 : blizzards[i][0]-1, blizzards[i][1], blizzards[i][2]] );
				break;
			case 'v': 
				blizz.push( [blizzards[i][0]+1 == n ? 1 : blizzards[i][0]+1, blizzards[i][1], blizzards[i][2]] );
				break;
		}
		bset.add( blizz[i][0] + "," + blizz[i][1] );
	}
	return [blizz,bset];
}

let render = function(hood, bset) {
	var i,j, buf;

	for( i=0; i<data.length; i++ ) {
		buf="";
		for( j=0; j<data[0].length; j++ ) {
			if( hood.has(i + "," + j) ) {
				if( bset.has(i + "," + j) ) {
					console.log("***********CONFLICT***********");
					throw "Error.";
				}
				buf += "E";
			} else if( bset.has(i + "," + j) ) {
				buf += "@";
		 	} else if( data[i][j] == '.' ) {
				buf += ".";
			} else {
				buf += "#";
			}
		}
		console.log(buf);
	}
	console.log("");
}


let bfs2 = function(blizzard, bset, row, col) {

	var r,c;
	let laststep = 0;
	var hood, nexthood;

	hood = new Set();
	hood.add( row + "," + col );

	for( laststep=0; laststep<20000; laststep++ ) {

		//render(hood, bset);
		//console.log("Step " + laststep + ": " + hood.size + " nodes");

		[blizzard,bset] = getNextStep(blizzard);
		nexthood = new Set();
		for( i of hood.keys() ){
			[r,c] = i.split(",");
			r = parseInt(r); c = parseInt(c);

			if( r == endy && c == endx ) {
				console.log("Solution at step " + laststep);
				return laststep;
			}

			if( r+1 <= n && data[r+1][c] == '.' && !bset.has((r+1) + "," + c) ) nexthood.add( (r+1) + "," + c );
			if( c+1 <= m && data[r][c+1] == '.' && !bset.has(r + "," + (c+1))  ) nexthood.add( r + "," + (c+1) );
			if( r-1 >= 0 && data[r-1][c] == '.' && !bset.has((r-1) + "," + c)  ) nexthood.add( (r-1) + "," + c );
			if( c-1 >= 0 && data[r][c-1] == '.' && !bset.has(r + "," + (c-1))  ) nexthood.add( r + "," + (c-1) );
			if( !bset.has(r + "," + c)  ) nexthood.add( r + "," + c );
		}
		hood = nexthood;
		blizzards = blizzard;
		bsets = bset;
	}

	console.log("Not found");
}

let count = bfs2(blizzards, bsets, starty, startx);
endx = startx;
endy = starty;
count += bfs2(blizzards, bsets, ey, ex);
endx = ex;
endy = ey;
count += bfs2(blizzards, bsets, starty, startx);
console.log("Total steps: " + count);

