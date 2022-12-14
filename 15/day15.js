let fs = require('fs');

var data;
//data = fs.readFileSync('demo.txt', 'utf8');

function minDist(x, y) {
    var i, dist, md = Infinity;

    for( i=0; i<data.length; i++ ) {
        if( data[i].bx == x && data[i].by == y )
            return i;
        dist = data[i].dist - Math.abs( data[i].y - y );
        if( dist < 0 ) continue;
        if( dist < Math.abs( data[i].x - x ) ) continue;
        return i;
    }

    return -1;
}

function part1()
{
    let maxx=0, minx=0;
    var i;

    for( i=0; i<data.length; i++ ) {
        minx = Math.min(minx, data[i].x - data[i].dist, data[i].bx);
        maxx = Math.max(maxx, data[i].x + data[i].dist, data[i].bx);
    }
    console.log("Data: " + data.length + " minx: " + minx + " maxx: " + maxx);

    let y = 2000000;//10 for demo
    var x, dist, z;
    var count = 0;
    let bspots = new Set();

    for( i=0; i<data.length; i++ ) {
        if( data[i].by == y ) {
            if( bspots.has(data[i].bx) ) continue;
            bspots.add(data[i].bx);
            count--;
        }
    }
    console.log("Found " + (-count) + " beacons in the way");

    for( x=minx; x<=maxx; x++ ) {
        dist = minDist(x,y);
        if( dist >= 0 ) {
            z = Math.abs(data[dist].y - y);
            let newx = data[dist].x + ( data[dist].dist - z );
            count += (newx - x) + 1;
            x = newx;
        }
    }
    console.log(count + " spots in range");

}


function part2()
{
    let maxx=4000000, minx=0, maxy=4000000, miny=0;
    //demo: let maxx=20, minx=0, maxy=20, miny=0;
    var i;
    var x, y, dist, z;
    var freq;

    let fulldata = data;

    for( y=miny; y<=maxy; y++ ) {
        if( (y%50) == 0 ) {
            data = [];
            for( i=0; i<fulldata.length; i++ ) {
                if( Math.abs(fulldata[i].y - y) <= (fulldata[i].dist+50) ) {
                    data.push(fulldata[i]);
                }
            }
        }
    
        for( x=minx; x<=maxx; x++ ) {
            dist = minDist(x,y);
            if( dist >= 0 ) {
                z = Math.abs(data[dist].y - y);
                x = data[dist].x + ( data[dist].dist - z );
            } else {
                freq = maxy*x + y;
                console.log("Frequency " + freq + " at " + x + ", " + y);
                return;
            }
        }        

    }

    console.log("Freq not found");

}

let t1 = new Date();
data = fs.readFileSync('data.txt', 'utf8');
data = data.split("\n").map( (x) => ( x.split(" ").filter( (x) => ( x.indexOf("=") != -1 ) ).map( (x) => ( parseInt(x.split("=")[1]) ) ) ) );
data = data.map( (x) => ( {x: x[0], y: x[1], bx: x[2], by: x[3], dist: Math.abs(x[3]-x[1]) + Math.abs(x[2]-x[0]) } ) );
//part1();
part2();
let t2 = new Date();
console.log("Time: " + (t2-t1)/1000 + "s");
