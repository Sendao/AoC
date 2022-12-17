let fs = require('fs');

var data;
let t1 = new Date();
data = fs.readFileSync('demo.txt', 'utf8');
data = data.trim().split("");

let shapes = [

    [ [1,1,1,1] ],

    [ [0,1,0], [1,1,1], [0,1,0] ],

    [ [0,0,1], [0,0,1], [1,1,1] ],

    [ [1], [1], [1], [1] ],

    [ [1,1], [1,1] ]

];

var i, is=0, il=0;
var len = data.length;
var highest_rock = -1;
var graph = [];
var rocky, rockx, rockwid;
var h, found;
let steps=0;

let testRock = function(rocky, rockx) {
    var x,y;

    for( y = 0; y < shapes[is].length; y++ ) {
        if( rocky+y >= graph.length || rocky+y < 0 ) continue;
        for( x = 0; x < rockwid; x++ ) {
            if( shapes[is][ shapes[is].length  -(1+y)    ][x] == 1 && graph[rocky+y][rockx+x] == "#" ) { // hit a surface
                return true;
            }
        }
    }
    return false;
}

let getKey = function() {
    var key = "";
    var x,y;
    for( x=0; x<7; x++ ) {
        for( y=0; y<graph.length; y++ ) {
            if( graph[graph.length-(y+1)][x] == "#" ) {
                key += y + ",";
                break;
            }
        }
        if( y >= graph.length ) key += y + ",";
    }
    return key;// + ":" + is + "," + il;
}

var overflow = 0;
var cache = {};
var key;
let very_high = 1000000000000;
let playback = [];
let lasth = -1;

function drop() {

    rockwid = shapes[is][0].length;
    rockx = 2;

    h = highest_rock + 4;
    while( h+3 >= graph.length ) graph.push([" ", " ", " ", " ", " ", " ", " "]);

    var xmove;
    
    for( rocky = h; rocky >= 0; rocky-- ) {

        xmove=0;
        if( data[il] == '>' ) {
            if( rockx+rockwid+1 <= 7 ) {
                xmove = 1;
            }
        } else if( data[il] == '<' ) {
            if( rockx > 0 ) {
                xmove = -1;
            }
        }

        if( xmove != 0 && !testRock(rocky, rockx+xmove) ) {
            rockx += xmove;
        }

        il = (il+1);
        if( il >= len ) il = 0;
        steps++;

        if( testRock(rocky-1, rockx) ) {
            break;
        }
    }

    if( rocky < 0 ) rocky = 0;

    for( y = 0; y < shapes[is].length; y++ ) {
        highest_rock = Math.max(highest_rock, rocky+y);
        for( x = 0; x < rockwid; x++ ) {
            if( shapes[is][ shapes[is].length - (1+y)][x] == 1 ) {
                graph[rocky+y][rockx+x] = "#";
            }
        }
    }
}


for( i=0; i<very_high; i++ ) {


    drop();

    playback.push( highest_rock-lasth );
    lasth = highest_rock;

    is = (is+1)%5;
    key = getKey();
    if( (i%100000) == 0 ) console.log(i+ ": " + key);
    if( key in cache ) {
        var oldidx, oldheight, z, found;

        found=false;
        if( cache[key].length > 0 ) {
            for( z=0; z<cache[key].length; z++ ) {
                [oldidx,oldheight] = cache[key][z];
                idxspeed = i - oldidx;
                if( oldidx < idxspeed ) continue;
                heightspeed = highest_rock - oldheight;
                //console.log(i + "->" + oldidx + ": " + idxspeed);
                if( idxspeed < 30 ) continue;

                //console.log("Test loop @ " + i + " (" + oldidx + "): " + idxspeed + " " + heightspeed + ": key " + key);

                let comparePlayback = function() {
                    for( let j=0; j<idxspeed; j++ ) {
                        if( playback[j+oldidx-idxspeed] != playback[j+oldidx] ) {
                            //console.log("got to " + j);
                            return false;
                        }
                    }
                    console.log("playback is looping speed " + idxspeed);
                    return true;
                }

                if( !comparePlayback() ) continue;
                
                console.log("Cycle found at " + i + ": len " + idxspeed + ", height " + heightspeed + "=" + highest_rock + "-" + oldheight + ": " + key + "(" + z + "/" + cache[key].length + " pointers)");
                
                playback.splice(0, oldidx+1);
                //playback.splice(idxspeed);
                if( playback.length != idxspeed ) {
                    throw "wrong playback length " + playback.length + " vs " + idxspeed;
                }
                found=true;
                break;
            }
        }
        if( found ) break;
    } else {
        cache[key] = [];
    }
    cache[key].push([i, highest_rock]);

}

let sum = playback.reduce((a,b) => a+b, 0);
let repeats = Math.floor( (very_high-i) / idxspeed );
console.log((sum*repeats) + ": We need " + repeats + " repeats from height " + highest_rock + ": " + (sum/idxspeed) + " per step");

highest_rock += repeats * sum;//heightspeed;
i += repeats * idxspeed;

console.log( i + ": " + (very_high-i) + " left, height so far " + highest_rock);
let n = 0;
while( i < very_high ) {
    highest_rock += playback[n];

    n++;
    i++;
}
//5179282866268: too high
//5179282866268: too high.
//5179282866197: incorrect!
//5179282866268: too high.

console.log("Height: " + highest_rock + ", Steps: " + steps);

