let fs = require('fs');

function part1()
{
    //let data = fs.readFileSync('demo.txt', 'utf8');
    let data = fs.readFileSync('data.txt', 'utf8');
    data = data.split("\n").map( (x) => ( x.split(" ").filter( (x) => ( x.indexOf("=") != -1 ) ).map( (x) => ( parseInt(x.split("=")[1]) ) ) ) );
    data = data.map( (x) => ( {x: x[0], y: x[1], bx: x[2], by: x[3], dist: Math.abs(x[3]-x[1]) + Math.abs(x[2]-x[0]) } ) );

    let maxx=0, minx=0;
    var i;

    for( i=0; i<data.length; i++ ) {
        minx = Math.min(minx, data[i].x - data[i].dist, data[i].bx);
        maxx = Math.max(maxx, data[i].x + data[i].dist, data[i].bx);
    }
    console.log("Data: " + data.length + " minx: " + minx + " maxx: " + maxx);

    let lastsensor = null;

    function minDist(x, y) {
        var i, dist, md = Infinity;

        if( lastsensor != null ) {
            dist = Math.abs( data[lastsensor].y - y ) + Math.abs( data[lastsensor].x - x ) - data[lastsensor].dist;
            if( dist <= 0 ) {
                return 0;
            }
            md = dist;
        }

        for( i=0; i<data.length; i++ ) {
            if( data[i].bx == x && data[i].by == y ) {
                lastsensor = i;
                return 0;
            }
            dist = Math.abs( data[i].y - y ) + Math.abs( data[i].x - x ) - data[i].dist;
            if( dist < md ) {
                md = dist;
                lastsensor = i;
            }
        }

        return md;
    }

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

    for( x=minx-2; x<=maxx; x++ ) {
        dist = minDist(x,y);
        z = (data[lastsensor].dist - Math.abs(data[lastsensor].y - y))*2;
        console.log(x + ": " + dist + " to " + lastsensor + ": skip " + (z+dist));
        if( dist <= 0 ) {
            if( x < data[lastsensor].x ) {
                count += 1+(z+dist);
                x += (z+dist);
            } else {
                count++;
            }
        } else {
            console.log(dist + " distance");
            x += dist-1;
        }
    }

    console.log(count);

}

//part1();


function part2()
{
    //let data = fs.readFileSync('demo.txt', 'utf8');
    let data = fs.readFileSync('data.txt', 'utf8');
    data = data.split("\n").map( (x) => ( x.split(" ").filter( (x) => ( x.indexOf("=") != -1 ) ).map( (x) => ( parseInt(x.split("=")[1]) ) ) ) );

    data = data.map( (x) => ( {x: x[0], y: x[1], bx: x[2], by: x[3], dist: Math.abs(x[3]-x[1]) + Math.abs(x[2]-x[0]) } ) );

    let maxx=4000000, minx=0, maxy=4000000, miny=0;
    //let maxx=20, minx=0, maxy=20, miny=0;
    var i;

    console.log("Data: " + data.length + " minx: " + minx + " maxx: " + maxx + " miny: " + miny + " maxy: " + maxy);

    let lastsensor = null;

    function minDist(x, y) {
        var i, dist, md = Infinity;

        lastsensor = null;
        for( i=0; i<data.length; i++ ) {
            if( data[i].bx == x && data[i].by == y ) {
                lastsensor = i;
                return 0;
            }
            dist = Math.abs( data[i].y - y ) + Math.abs( data[i].x - x ) - data[i].dist;
            if( dist < md ) {
                md = dist;
                lastsensor = i;
            }
        }

        return md;
    }

    var x, y, dist, z;
    var freq;

    for( y=miny; y<=maxy; y++ ) {
        for( x=minx; x<=maxx; x++ ) {
            dist = minDist(x,y);
            if( dist <= 0 ) {
                z = Math.abs(data[lastsensor].y - y);
                x = data[lastsensor].x + ( data[lastsensor].dist - z );
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
part2();
let t2 = new Date();
console.log("Time: " + (t2-t1)/1000 + "s");