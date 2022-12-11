let fs = require('fs');

function part1()
{
    //let data = fs.readFileSync('demo.txt', 'utf8').split("\n").map( (x) => (x.trim().split(" ")) );
    let data = fs.readFileSync('data.txt', 'utf8').split("\n").map( (x) => (x.trim().split(" ")) );
    let hx = 0, hy = 0, tx = 0, ty = 0;
    let offx = 0, offy = 0;
    var xdist, ydist;
    var i, count, moves;
    let posns = new Set();

    posns.add( "0,0" );

    for( i=0; i<data.length; i++ ) {
        offx=offy=0;
        switch( data[i][0] ) {
            case 'R':
                moves = offx = parseInt(data[i][1]);
                break;
            case 'L':
                moves = offx = -parseInt(data[i][1]);
                break;
            case 'U':
                moves = offy = parseInt(data[i][1]);
                break;
            case 'D':
                moves = offy = -parseInt(data[i][1]);
                break;
        }
        
        for( count=0; count<moves; count++ ) {
            hx += offx > 0 ? 1 : (offx < 0 ? -1 : 0);
            hy += offy > 0 ? 1 : (offy < 0 ? -1 : 0);

            // determine tail movement
            xdist = hx - tx;
            ydist = hy - ty;

            if( Math.abs(xdist) < 2 && Math.abs(ydist) < 2 ) {
                continue;
            }

            if( hx != tx && hy != ty ) {
                tx += ( tx < hx ) ? 1 : -1;
                ty += ( ty < hy ) ? 1 : -1;
            } else {
                if( hx != tx ) {
                    tx += ( tx < hx ) ? 1 : -1;
                } else if( hy != ty ) {
                    ty += ( ty < hy ) ? 1 : -1;
                }
            }
            
            posns.add( tx + "," + ty );
        }
    }

    console.log(posns.size);
}

//part1();

function part2()
{
    //let data = fs.readFileSync('demo2.txt', 'utf8').split("\n").map( (x) => (x.trim().split(" ")) );
    let data = fs.readFileSync('data.txt', 'utf8').split("\n").map( (x) => (x.trim().split(" ")) );
    var knotx = new Array(10).fill(0), knoty = new Array(10).fill(0);
    var minx=0, miny=0, maxx=0, maxy=0;

    function moveHead(dir) {
        switch( dir ) {
            case 'R':
                knotx[0]++;
                break;
            case 'L':
                knotx[0]--;
                break;
            case 'U':
                knoty[0]++;
                break;
            case 'D':
                knoty[0]--;
                break;
        }
    }

    function moveTail(n) {
        var xdist, ydist;

        xdist = knotx[n-1] - knotx[n];
        ydist = knoty[n-1] - knoty[n];

        if( Math.abs(xdist) < 2 && Math.abs(ydist) < 2 )
            return;

        if( xdist != 0 )
            knotx[n] += xdist > 0 ? 1 : -1;
        if( ydist != 0 )
            knoty[n] += ydist > 0 ? 1 : -1;
    }

    
    var i, count, moves;
    var n;
    let posns = new Set();

    // solve:
    posns.add( "0,0" );
    for( i=0; i<data.length; i++ ) {
        offx=offy=0;
        moves = parseInt(data[i][1]);
        for( count=0; count<moves; count++ ) {
            moveHead( data[i][0] );

            for( n=1; n<10; n++ ) {
                moveTail(n);
            }
            posns.add( knotx[9] + "," + knoty[9] );
            minx = Math.min(minx, knotx[9]);
            miny = Math.min(miny, knoty[9]);
            maxx = Math.max(maxx, knotx[9]);
            maxy = Math.max(maxy, knoty[9]);
        }
    }

    // render:
    var mat = new Array( (maxy-miny) + 10 ).fill(0).map( () => new Array( (maxx-minx) + 10 ).fill(" ") );
    for( var k of posns.keys() ) {
        var [x,y] = k.split(",").map( (x) => (parseInt(x)) );
        x -= minx;
        y -= miny;
        mat[y][x] = "#";
    }

    // draw:
    for( i=mat.length-1; i>=0; i-- ) {
        console.log(mat[i].join(""));
    }

    // solution:
    console.log(posns.size);
}


part2();