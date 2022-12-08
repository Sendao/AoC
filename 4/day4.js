let fs = require('fs');

function part1()
{
    let data = fs.readFileSync('data.txt', 'utf8').split("\n");
    /*let data = [
        "2-4,6-8",
    "2-3,4-5",
    "5-7,7-9",
    "2-8,3-7",
    "6-6,4-6",
    "2-6,4-8" ];*/

    var i, r1, r2;
    let count=0;
    for( i=0; i<data.length; i++ ) {
        [r1,r2] = data[i].split(",").map( (x) => (x.split("-").map( (y) => (parseInt(y)) ) ) );
        
        if( r2[0] <= r1[0] && r2[1] >= r1[0] ) {
            count++;
        } else if( r2[0] <= r1[1] && r2[1] >= r1[1] ) {
            count++;
        } else if( r1[0] <= r2[0] && r1[1] >= r2[0] ) {
            count++;
        } else if( r1[0] <= r2[1] && r1[1] >= r2[1] ) {
            count++;
        }
    }

    console.log(count);
}

part1();
