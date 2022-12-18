let fs = require('fs');

var data;
let t1 = new Date();
data = fs.readFileSync('data.txt', 'utf8');
data = data.split("\n").map( (x) => x.trim().split(",") );

var m,n,o;

function draw() {
	var x,y,maxx=0,maxy=0,maxz=0;
	var i;

	for( i=0;i<data.length; i++ ) {
		maxx = Math.max(maxx, data[i][0]);
		maxy = Math.max(maxy, data[i][1]);
		maxz = Math.max(maxz, data[i][2]);
	}

	m=maxz+2;
	n=maxy+2;
	o=maxx+2;

	let img = new Array(m);
	for( z=0; z<m; z++ ) {
		img[z] = new Array(n);
		for( y=0; y<n; y++ ) {
			img[z][y] = new Array(o).fill(' ');
		}
	}

	for( i=0; i<data.length; i++ ) {
		img[data[i][2]][data[i][1]][data[i][0]] = "#";
	}

	return img;
}

function fillfrom(x,y,z) {
	var kx,ky,kz;

	if( x<0 || y<0 || z<0 || x>=o || y>=n || z>=m ) return;
	if( img[z][y][x] != ' ' ) return;
	img[z][y][x] = '.';

	fillfrom(x,y,z-1);
	fillfrom(x,y,z+1);
	fillfrom(x,y-1,z);
	fillfrom(x,y+1,z);
	fillfrom(x-1,y,z);
	fillfrom(x+1,y,z);
}

let img = draw();
fillfrom(0,0,0);
fillfrom(m-1,n-1,o-1);
img.forEach( (z) => {
	z.forEach( (y) => {
		console.log(y.join(""));
	});
	console.log("");
});

function scan() {
	var x,y,z;
	var adjacent;
	var surface = 0;

	function countAdjacent(x,y,z) {
		var count = 0;
		var edge = [[-1,0,0],[1,0,0],[0,-1,0],[0,1,0],[0,0,-1],[0,0,1]];
		var i, kx, ky, kz;

		for( i=0; i<6; i++ ) {
			kx = x+edge[i][0];
			ky = y+edge[i][1];
			kz = z+edge[i][2];
			if( kx < 0 || ky < 0 || kz < 0 || kx >= o || ky >= n || kz >= m ) {
				count++;
				continue;
			}
			if( img[kz][ky][kx] == '.' ) count++;
		}
		return count;
	}

	for( z=0; z<m; z++ ) {
		for( y=0; y<n; y++ ) {
			for( x=0; x<o; x++ ) {
				if( img[z][y][x] == '#' ) {
					//console.log("Count location " + x + "," + y + "," + z);
					adjacent = countAdjacent(x,y,z);
					surface += adjacent;
				}
			}
		}
	}

	return surface;
}

console.log("Part 2: " + scan());

