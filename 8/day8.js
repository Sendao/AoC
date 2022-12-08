let fs = require('fs');

function part1()
{
    //let data = fs.readFileSync('demo.txt', 'utf8').split("\n").map( (x) => (x.trim().split("")) );
    let data = fs.readFileSync('data.txt', 'utf8').split("\n").map( (x) => (x.trim().split("")) );
    var row, col, dist;
    var hgt = data.length, wid = data[0].length;

    let hgt2 = parseInt(hgt/2), wid2 = parseInt(wid/2);
    let hiddata = new Array( hgt ).fill(0).map( () => new Array(wid).fill(1) );

    var maxleft, maxright, maxtop, maxbottom;
    var drow, hrow;

    //console.log(data);

    for( row = 0; row < hgt; row++ ) {
        drow = data[row];
        hrow = hiddata[row];
        maxleft = -1; maxright = -1;
        for( dist=0; dist<wid; dist++ ) {

            if( drow[dist] > maxleft ) {
                maxleft = drow[dist];
                hrow[dist] = 0;
            }

            if( drow[(wid-1)-dist] > maxright ) {
                maxright = drow[(wid-1)-dist];
                hrow[(wid-1)-dist] = 0;
            }

        }
    }

    for( col = 0; col < wid; col++ ) {
        maxtop = -1; maxbottom = -1;
        for( dist=0; dist<hgt; dist++ ) {

            if( data[dist][col] > maxtop ) {
                maxtop = data[dist][col];
                hiddata[dist][col] = 0;
            }

            if( data[hgt-1-dist][col] > maxbottom ) {
                maxbottom = data[hgt-1-dist][col];
                hiddata[hgt-1-dist][col] = 0;
            }

        }
    }

    //console.log(hiddata);
    let counter=0;
    for( row=0; row<hgt; row++ ) {
        for( col=0; col<wid; col++ ) {
            if( hiddata[row][col] == 1 ) {
                counter++;
            }
        }
    }
    console.log(row*col - counter);
};


function part2()
{
    //let data = fs.readFileSync('demo.txt', 'utf8').split("\n").map( (x) => (x.trim().split("")) );
    let data = fs.readFileSync('data.txt', 'utf8').split("\n").map( (x) => (x.trim().split("")) );
    var row, col, score;
    let ms = 0;
    let hgt = data.length;
    let wid = data[0].length;

    function scoreLeft(row, col)
    {
        var score=0;
        var i;

        for( i=1; i<=col; i++ ) {
            score++;
            if( data[row][col-i] >= data[row][col] )
                break;
        }

        return score;
    }

    function scoreRight(row, col)
    {
        var score=0;
        var i;

        for( i=1; col+i<wid; i++ ) {
            score++;
            if( data[row][col+i] >= data[row][col] )
                break;
        }

        return score;
    }

    function scoreTop(row, col)
    {
        var score=0;
        var i;

        for( i=1; i<=row; i++ ) {
            score++;
            if( data[row-i][col] >= data[row][col] )
                break;
        }

        return score;
    }

    function scoreBottom(row, col)
    {
        var score=0;
        var i;

        for( i=1; row+i<hgt; i++ ) {
            score++;
            if( data[row+i][col] >= data[row][col] )
                break;
        }

        return score;
    }


    for( row = 1; row < hgt-1; row++ ) {
        for( col = 1; col< wid-1; col++ ) {
            score = scoreLeft(row,col) * scoreRight(row,col) * scoreTop(row,col) * scoreBottom(row,col);
            if( score > ms ) {
                ms = score;
                //console.log("Found max " + score + " at " + row + ", " + col);
            }
        }
    }

    console.log(ms);
}

part2();
