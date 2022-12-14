let fs = require('fs');

function part1()
{
    //let data = fs.readFileSync('demo.txt', 'utf8').split("\n").map( (x) => (x.trim().split("").map( (x) => ( ( x == 'S' || x == 'E' ) ? x : x.charCodeAt(0) - 'a'.charCodeAt(0) ))) );
    let data = fs.readFileSync('data.txt', 'utf8').split("\n").map( (x) => (x.trim().split("").map( (x) => ( ( x == 'S' || x == 'E' ) ? x : x.charCodeAt(0) - 'a'.charCodeAt(0) ))) );
    var stx, sty, ex, ey;

    var Q = [];
    let steps = Infinity;
    var x,y,step;
    let visitted = new Set();

    for( y=0; y<data.length; y++ ) {
        for( x=0; x<data[0].length; x++ ) {
            if( data[y][x] == 'S' ) {
                stx = x;
                sty = y;
            } else if( data[y][x] == 'E' ) {
                ex = x;
                ey = y;
                data[y][x] = 26;
            }
        }
    }
    Q.push([stx,sty,0]);

    while( Q.length > 0 ) {
        [x,y,step] = Q.shift();
        if( visitted.has( x + "," + y ) ) continue;
        visitted.add(x + "," + y);
        if( x == ex && y == ey ) {
            steps=step;
            break;
        }
        if( data[y][x] == 'S' ) {
            maxheight = 1;
        } else {
            maxheight = data[y][x] + 1;
        }
        console.log(x,y,maxheight);
        if( x-1 >= 0 && data[y][x-1] <= maxheight ) {
            Q.push([x-1,y,step+1]);
        }
        if( y-1 >= 0 && data[y-1][x] <= maxheight ) {
            Q.push([x,y-1,step+1]);
        }
        if( x+1 < data[0].length && data[y][x+1] <= maxheight ) {
            Q.push([x+1,y,step+1]);
        }
        if( y+1 < data.length && data[y+1][x] <= maxheight ) {
            Q.push([x,y+1,step+1]);
        }
    }

    console.log(steps);
}

//part1();


function part2()
{
    //let data = fs.readFileSync('demo.txt', 'utf8').split("\n").map( (x) => (x.trim().split("").map( (x) => ( ( x == 'S' || x == 'E' ) ? x : x.charCodeAt(0) - 'a'.charCodeAt(0) ))) );
    let data = fs.readFileSync('data.txt', 'utf8').split("\n").map( (x) => (x.trim().split("").map( (x) => ( ( x == 'S' || x == 'E' ) ? x : x.charCodeAt(0) - 'a'.charCodeAt(0) ))) );
    var ex, ey;
    let steps = Infinity, step;
    let starts = [];

    for( y=0; y<data.length; y++ ) {
        for( x=0; x<data[0].length; x++ ) {
            if( data[y][x] == 'S' || data[y][x] == 0 ) {
                data[y][x] = 0;
                starts.push([x,y]);
            } else if( data[y][x] == 'E' ) {
                ex = x;
                ey = y;
                data[y][x] = 26;
            }
        }
    }

    let search = function(x,y) {
        let Q = [[x,y,0]];
        let visitted = new Set();
        var x,y,step;
        let steps = Infinity;

        while( Q.length > 0 ) {
            [x,y,step] = Q.shift();
            if( visitted.has( x + "," + y ) ) continue;
            visitted.add(x + "," + y);
            if( x == ex && y == ey ) {
                steps=step;
                break;
            }
            if( data[y][x] == 'S' ) {
                maxheight = 1;
            } else {
                maxheight = data[y][x] + 1;
            }
            //console.log(x,y,maxheight);
            if( x-1 >= 0 && data[y][x-1] <= maxheight ) {
                Q.push([x-1,y,step+1]);
            }
            if( y-1 >= 0 && data[y-1][x] <= maxheight ) {
                Q.push([x,y-1,step+1]);
            }
            if( x+1 < data[0].length && data[y][x+1] <= maxheight ) {
                Q.push([x+1,y,step+1]);
            }
            if( y+1 < data.length && data[y+1][x] <= maxheight ) {
                Q.push([x,y+1,step+1]);
            }
        }

        return steps;
    }
    for( var i=0; i<starts.length; i++ ) {
        steps = Math.min(steps, search(starts[i][0],starts[i][1]));
    }

    console.log(steps);
}

part2();
