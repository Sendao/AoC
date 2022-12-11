let fs = require('fs');

function part1()
{
    //let data = fs.readFileSync('demo.txt', 'utf8').split("\n").map( (x) => (x.trim().split(" ")) );
    let data = fs.readFileSync('data.txt', 'utf8').split("\n").map( (x) => (x.trim().split(" ")) );
    let x = 1, i = 0, cycle = 1, add1 = 0, sum = 0;

    while( i < data.length ) {
        if( cycle == 20 || ( (cycle-20)%40 == 0 ) ) {
            console.log( cycle + ": " + x*cycle);
            sum += x*cycle;
        }

        x += add1;
        if( add1 != 0 ) {
            add1=0;
            cycle++;
            continue;
        }

        if( data[i][0] == 'noop' ) {
            add1 = 0;
        } else {
            add1 = parseInt(data[i][1]);
        }

        cycle++;
        i++;
    }

    console.log( "Cycle sum: ", sum );
}

function part2()
{
    //let data = fs.readFileSync('demo.txt', 'utf8').split("\n").map( (x) => (x.trim().split(" ")) );
    let data = fs.readFileSync('data.txt', 'utf8').split("\n").map( (x) => (x.trim().split(" ")) );

    let x = 1, i = 0, cycle = 0, add1 = 0;
    let img = new Array(6).fill(0).map( () => new Array(40).fill(".") );
    var y;

    while( i < data.length ) {

        y = Math.floor( (cycle)/40 );
        cx = (cycle)%40;
        if( Math.abs(cx-x) < 2 ) {
            img[y][cx] = "#";
        }

        x += add1;
        if( add1 != 0 ) {
            add1=0;
            cycle++;
            continue;
        }

        if( data[i][0] == 'noop' ) {
            add1 = 0;
        } else {
            add1 = parseInt(data[i][1]);
        }

        cycle++;
        i++;
    }

    for( let i=0; i<img.length; i++ ) {
        console.log( img[i].join("") );
    }
}

part2();