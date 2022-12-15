let fs = require('fs');

let minx = Infinity, miny = Infinity, maxx = -Infinity, maxy = -Infinity;
var n, m;

function readSet(line)
{
    let data = [];
    var i, x, y;

    for( i=0; i<line.length; i++ ) {
        [x,y] = line[i].split(",");
        x = parseInt(x);
        y = parseInt(y);
        maxx = Math.max(maxx,x);
        maxy = Math.max(maxy,y);
        minx = Math.min(minx,x);
        miny = Math.min(miny,y);
        data.push( {x: x, y: y} );
    }
    return data;
}
function drawLines(data, grid)
{
    var x,y, xinc, yinc, finx, finy;
    var i, j;

    for( i=0; i<data.length; i++ ) {
        for( j=0; j+1<data[i].length; j++ ) {
            x = data[i][j].x - minx;
            y = data[i][j].y;
            finx = data[i][j+1].x - minx;
            finy = data[i][j+1].y;
            if( finx != x ) {
                xinc = finx>x?1:-1;
                yinc = 0;
            } else {
                yinc = finy>y?1:-1;
                xinc = 0;
            }
            //console.log(x,y,finx,finy,xinc,yinc);
            while( x != finx || y != finy ) {
                grid[y][x] = '#';
                x += xinc;
                y += yinc;
            }
            grid[finy][finx] = '#';
        }
    }
}
function dropFrom(grid, x, y)
{
    var i, j;

    for( i=y+1; i<n; i++ ) {
        if( grid[i][x] != ' ' ) {
            //console.log("ground: " + i);
            if( x <= 0 || i == 0 ) return false;
            if( grid[i][x-1] == ' ' ) {
                return dropFrom(grid, x-1, i);
            }
            //console.log("end: " + m);
            if( x+1 >= m ) return false;
            if( grid[i][x+1] == ' ' ) {
                return dropFrom(grid, x+1, i);
            }
            grid[i-1][x] = 'o';
            return true;
        }
    }
    return false;
}
function part1()
{
    //let data = fs.readFileSync('demo.txt', 'utf8').split("\n").map( (x) => (readSet(x.trim().split(' -> '))) );
    let data = fs.readFileSync('data.txt', 'utf8').split("\n").map( (x) => (readSet(x.trim().split(' -> '))) );
    n = (maxy)+1;
    m = (maxx-minx)+1;
    let grid = new Array( n ).fill(0).map( () => new Array(m).fill(' ') );
    var i;

    drawLines(data, grid);

    let inx = 500-minx;
    let count=0;

    //console.log(inx);
    
    while( dropFrom(grid, inx, -1) ) {
        count++;
    }
    //console.log(grid);
    console.log(count);
}

function part2()
{
    //let data = fs.readFileSync('demo.txt', 'utf8').split("\n").map( (x) => (readSet(x.trim().split(' -> '))) );
    let data = fs.readFileSync('data.txt', 'utf8').split("\n").map( (x) => (readSet(x.trim().split(' -> '))) );

    n = (maxy)+3;
    minx -= n;
    maxx += n;
    m = (maxx-minx)+1;
    
    let grid = new Array( n ).fill(0).map( () => new Array(m).fill(' ') );
    var i;

    data.push( [{x:minx,y:maxy+2},{x:maxx,y:maxy+2}] );

    drawLines(data, grid);

    let inx = 500-minx;
    let count=0;
    
    while( dropFrom(grid, inx, -1) ) {
        count++;
    }
    for( i=0; i<grid.length; i++ ) {
        console.log( grid[i].join("") );
    }
    console.log(count);

}

part2();
