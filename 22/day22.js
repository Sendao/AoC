let fs = require('fs');


data = fs.readFileSync('data.txt', 'utf8');
data = data.split("\n");
let width = 50;
var i;

var line, lines = [];
var maxx = 0;

for( i=0; i<data.length-2; i++ ) {
	line = data[i].split("");
	maxx = Math.max(maxx, line.length);
	lines.push(line);
}

let movesfrom = data[data.length-1].split("");
let moves = [];
let lastpos = 0;
for( i=0; i<movesfrom.length; i++ ) {
	if( isNaN(movesfrom[i]) ) {
		moves.push( parseInt(movesfrom.slice(lastpos, i).join("")) );
		moves.push(movesfrom[i]);
		lastpos = i+1;
	}
}
if( lastpos < i )
	moves.push( parseInt(movesfrom.slice(lastpos, i).join("")) );


var x,y,dir;
let dirs=[[1,0],[0,1],[-1,0],[0,-1]];
let dir2=["10","01","-10","0-1"];
let dirnames = [ "right", "down", "left", "up" ];

for( x=0; x<lines[0].length; x++ ) {
	if( lines[0][x] == '.' ) {
		break;
	}
}
y = 0;
dir = 0;

function part1() {

	let sten = new Array(lines.length);
	var j, minpos, maxpos;
	for( i=0; i<lines.length; i++ ) {
		minpos = false; maxpos = false;
		for( j=0; j<lines[i].length; j++ ) {
			if( minpos === false ) {
				if( lines[i][j] == '#' ) {
					minpos = -1;
				} else if( lines[i][j] == '.' ) {
					minpos = j;
				}
			}
			if( lines[i][j] == '.' ) {
				maxpos = j;
			}
		}
		if( maxpos+1 < lines[i].length && lines[i][maxpos+1] == '#' ) {
			maxpos = -1;
		}
		sten[i] = [minpos, maxpos];
	}

	var ysten = new Array(maxx);
	for( i=0; i<maxx; i++ ) {
		minpos = false; maxpos = false;
		for( j=0; j<lines.length; j++ ) {
			if( minpos === false ) {
				if( lines[j][i] == '#' ) {
					minpos = -1;
				} else if( lines[j][i] == '.' ) {
					minpos = j;
				}
			}
			if( lines[j][i] == '.' ) {
				maxpos = j;
			}
		}
		if( maxpos+1 < lines.length && lines[maxpos+1][i] == '#' ) {
			maxpos = -1;
		}
		ysten[i] = [minpos, maxpos];
	}


	console.log(moves.length/2 + " steps");
	console.log("Start at " + (x+1) + "," + (y+1));

	var step;
	for( i=0; i<moves.length; i+=2 ) {
		for( step=1; step<=moves[i]; step++ ) {
			x += dirs[dir][0];
			y += dirs[dir][1];

			if( y < lines.length && x >= 0 && y >= 0 ) {
				if( x < lines[y].length ) {

					if( lines[y][x] == "#" ) {
						//console.log("ended at ",x,y,dir);
						x -= dirs[dir][0];
						y -= dirs[dir][1];
						break;
					}

					if( lines[y][x] == "." ) continue;
				}
			}

			if( dirs[dir][0] > 0 ) {
				if( sten[y][0] == -1 )
					x--;
				else
					x = sten[y][0];
			} else if( dirs[dir][0] < 0 ) {
				if( sten[y][1] == -1 )
					x++;
				else
					x = sten[y][1];
			} else if( dirs[dir][1] > 0 ) {
				if( ysten[x][0] == -1 )
					y--;
				else
					y = ysten[x][0];
			} else if( dirs[dir][1] < 0 ) {
				if( ysten[x][1] == -1 )
					y++;
				else
					y = ysten[x][1];
			}
		}
		if( moves[i+1] == 'R' ) {
			dir = (dir+1)%4;
			//console.log("right to ",x,y,dir);
		} else if( moves[i+1] == 'L' ) {
			dir = (dir+3)%4;
			//console.log("left to ",x,y,dir);
		} else if( i == moves.length-1 ) {
			break;
		} else {
			throw "Bad Direction!";
		}
		
	}
}

function part2()
{
	let map = { back: [1,0], right: [2,0], bottom: [1,1], front: [1,2], left: [0,2], top: [0,3] };
	//let map = { back: [2,0], top: [0,1], left: [1,1], bottom: [2,1], front: [2,2], right: [3,2] };
	let rot = {
		back: { "10": [ 'right', 0 ], "-10": [ 'left', 180 ], "01": [ 'bottom', 0 ], "0-1": [ 'top', 90 ] },
		right: { "10": [ 'front', 180 ], "-10": [ 'back', 0 ], "01": [ 'bottom', 90 ], "0-1": [ "top", 0 ] },
		bottom: { "10": [ 'right', -90 ], "-10": [ 'left', -90 ], "01": [ 'front', 0 ], "0-1": [ 'back', 0 ] },
		
		front: { "10": [ 'right', 180 ], "-10": [ 'left', 0 ], "01": [ 'top', 90 ], "0-1": [ 'bottom', 0 ] },
		left: { "10": [ 'front', 0 ], "-10": [ 'back', 180 ], "01": [ 'top', 0 ], "0-1": [ 'bottom', 90 ] },
		top: { "10": [ 'front', -90 ], "-10": [ 'back', -90 ], "01": [ 'right', 0 ], "0-1": [ 'left', 0 ] }
	};
	let faces = { 'back': [], 'right': [], 'bottom': [], 'front': [], 'left': [], 'top': [] };
	let stens = { 'back': [], 'right': [], 'bottom': [], 'front': [], 'left': [], 'top': [] };
	let ystens = { 'back': [], 'right': [], 'bottom': [], 'front': [], 'left': [], 'top': [] };
	var i, j, step, face, minpos, maxpos;
	var ei, ej;
	var x, y;

	for( face in map ) {
		i = map[face][1]*width;
		j = map[face][0]*width;
		ei = i + width;
		ej = j + width;
		for( ; i < ei; i++ ) {
			faces[face][i-map[face][1]*width] = [];
			for( j=map[face][0]*width; j < ej; j++ ) {
				faces[face][i-map[face][1]*width].push( lines[i][j] );
			}
		}
		//console.log(face, faces[face]);

		var j, minpos, maxpos;
		stens[face] = new Array( faces[face].length );
		for( i=0; i<faces[face].length; i++ ) {
			minpos = false; maxpos = false;
			for( j=0; j<faces[face][i].length; j++ ) {
				if( minpos === false ) {
					if( faces[face][i][j] == '#' ) {
						minpos = -1;
					} else if( faces[face][i][j] == '.' ) {
						minpos = j;
					}
				}
				if( faces[face][i][j] == '.' ) {
					maxpos = j;
				}
			}
			if( maxpos === false || ( maxpos+1 < faces[face][i].length && faces[face][i][maxpos+1] == '#' ) ) {
				maxpos = -1;
			}
			stens[face][i] = [minpos===false?-1:minpos, maxpos];
		}
		
		ystens[face] = new Array( width );
		for( i=0; i<width; i++ ) {
			minpos = false; maxpos = false;
			for( j=0; j<width; j++ ) {
				if( minpos === false ) {
					if( faces[face][j][i] == '#' ) {
						minpos = -1;
					} else if( faces[face][j][i] == '.' ) {
						minpos = j;
					}
				}
				if( faces[face][j][i] == '.' ) {
					maxpos = j;
				}
			}
			if( maxpos === false || ( maxpos+1 < faces[face].length && faces[face][maxpos+1][i] == '#' ) ) {
				maxpos = -1;
			}
			ystens[face][i] = [minpos===false?-1:minpos, maxpos];
		}
	}

	y = 0;
	face = 'back';
	for( x = 0; x < width; x++ ) {
		if( faces[face][y][x] == '.' ) break;
	}

	for( i=0; i<moves.length; i+=2 ) {

		// move forward
		for( step=0; step<moves[i]; step++ ) {
			x += dirs[dir][0];
			y += dirs[dir][1];

			if( y < faces[face].length && x >= 0 && y >= 0 ) {
				if( x < faces[face][y].length ) {

					if( faces[face][y][x] == "#" ) {
						console.log("ended going " + dirnames[dir] + " to ",x,y);
						x -= dirs[dir][0];
						y -= dirs[dir][1];
						break;
					}

					if( faces[face][y][x] == "." ) continue;
				}
			}

			var tgtf, rotate;

			tgtf = rot[face][dir2[dir]][0];
			rotate = rot[face][dir2[dir]][1];

			var newdir, xy, newx, newy;

			console.log("Rotate by " + rotate + ": dir " + dirnames[dir] + " at " + x + "," + y);
			if( rotate == 180 ) {
				newdir = (dir+2)%4;
				if( newdir == 1 || newdir == 3 ) {
					newx = width-1-(x-dirs[dir][0]);
				} else {
					newy = width-1-(y-dirs[dir][1]);
				}
			} else if( rotate == 90 ) {
				newdir = (dir+1)%4;
				if( newdir == 0 ) { // up->right
					newy = x-dirs[dir][0];
				} else if( newdir == 1 ) { // right->down
					newx = width-1-(y-dirs[dir][1]);
				} else if( newdir == 2 ) { // down->left
					newy = x-dirs[dir][0];
				} else if( newdir == 3 ) { // left->up
					newx = width-1-(y-dirs[dir][1]);
				}
			} else if( rotate == -90 ) {
				newdir = (dir+3)%4;

				if( newdir == 0 ) { // down->right
					newy = width-1-(x-dirs[dir][0]);
				} else if( newdir == 1 ) { // left->down
					newx = y-dirs[dir][1];
				} else if( newdir == 2 ) { // up->left
					newy = width-1-(x-dirs[dir][0]);
				} else if( newdir == 3 ) { // right->up
					newx = y-dirs[dir][1];
				}
			} else {
				newdir = dir;
				newx = x;
				newy = y;
			}

			switch( newdir ) {
				case 0: // right
					newx = 0;
					break;
				case 1: // down
					newy = 0;
					break;
				case 2: // left
					newx = width-1;
					break;
				case 3: // up
					newy = width-1;
					break;
			}
			if( newx > width-1 ) newx = width-1;
			else if( newx < 0 ) newx = 0;
			if( newy > width-1 ) newy = width-1;
			else if( newy < 0 ) newy = 0;
			console.log("New x,y: " + newx + "," + newy);

			let found=false;
			if( dirs[newdir][0] > 0 ) {
				if( stens[tgtf][newy][0] != -1 ) {
					newx = stens[tgtf][newy][0];
					found=true;
				}
			} else if( dirs[newdir][0] < 0 ) {
				if( stens[tgtf][newy][1] != -1 ) {
					newx = stens[tgtf][newy][1];
					found=true;
				}
			} else if( dirs[newdir][1] > 0 ) {
				if( ystens[tgtf][newx][0] != -1 ) {				
					newy = ystens[tgtf][newx][0];
					found=true;
				}
			} else if( dirs[newdir][1] < 0 ) {
				if( ystens[tgtf][newx][1] != -1 ) {
					newy = ystens[tgtf][newx][1];
					found=true;
				}
			}

			if( !found ) {
				// reverse the move
				x -= dirs[dir][0];
				y -= dirs[dir][1];
				// keep the old facing
				break;
			}

			console.log("to " + tgtf + ", moving " + dirnames[newdir] + ": " + newx + "," + newy);
			face = tgtf;
			dir = newdir;
			x = newx;
			y = newy;
		}

		if( moves[i+1] == 'R' ) {
			dir = (dir+1)%4;
			console.log("turn right at ",x,y,dirnames[dir]);
		} else if( moves[i+1] == 'L' ) {
			dir = (dir+3)%4;
			console.log("turn left at ",x,y,dirnames[dir]);
		} else if( i == moves.length-1 ) {
			console.log("done");
			break;
		} else {
			throw "Bad Direction!";
		}
	}
	//let map = { back: [1,0], right: [2,0], bottom: [1,1], front: [1,2], left: [0,2], top: [0,3] };
	x += map[face][0]*width;
	y += map[face][1]*width;

	console.log((x+1),(y+1),dir);
	console.log("Solution: " + ( 1000*(y+1) + 4*(x+1) + dir ) );
	
}
part2();

// 77230 too low
// 97373 is too low
// 43386 would be: too low.
// could be 108311
// it's not 110109
// not 140119
// 27350 too low
// not 155137
// not 128102
// not 146247
