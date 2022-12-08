let fs = require('fs');

let a = 'a'.charCodeAt(0), A = 'A'.charCodeAt(0);
function toPriority(c) {
    if( c.charCodeAt(0) >= A && c.charCodeAt(0) <= A+26 )
        return 27 + (c.charCodeAt(0) - A);
    return 1 + (c.charCodeAt(0) - a);
}

function part1()
{
    let data = fs.readFileSync('data.txt', 'utf8').split("\n");
    /*let data = ["vJrwpWtwJgWrhcsFMMfFFhFp",
        "jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL",
        "PmmdzqPrVvPwwTWBwg",
        "wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn",
        "ttgJtRGJQctTZtZT",
        "CrZsJsPPZsGzwwsLwLmpwMDw"];*/
    var i, j;
    var comp2;

    let sum = 0;

    for( i=0; i<data.length; i++ ) {
        console.log(data[i].length);
        comp2 = parseInt(data[i].length/2);
        if( comp2 <= 0 ) continue;
        let contents = new Set();
        var p;
        for( j=0; j<comp2; j++ ) {
            contents.add( toPriority(data[i][j]) );
        }
        console.log(comp2);
        for( j=comp2; j<data[i].length; j++ ) {
            console.log(data[i][j]);
            if( contents.has( p=toPriority(data[i][j]) ) ) {
                console.log(p);
                sum += p;
                break;
            }
        }
    }

    console.log(sum);
}
function part2()
{
    let data = fs.readFileSync('data.txt', 'utf8').split("\n");
    /*let data = ["vJrwpWtwJgWrhcsFMMfFFhFp",
    "jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL",
    "PmmdzqPrVvPwwTWBwg",
    "wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn",
    "ttgJtRGJQctTZtZT",
    "CrZsJsPPZsGzwwsLwLmpwMDw" ];*/

    var i, k, j, set1, set2;
    var sum = 0;

    for( i=0; i<data.length; i+=3 ) {
        set1 = new Set();
        set2 = new Set();

        for( j=0; j<data[i+0].length; j++ ) {
            set1.add( data[i+0][j] );
        }
        for( j=0; j<data[i+1].length; j++ ) {
            if( set1.has( data[i+1][j] ) )
                set2.add( data[i+1][j] );
        }
        for( j=0; j<data[i+2].length; j++ ) {
            if( set2.has( data[i+2][j] ) ) {
                sum += toPriority( data[i+2][j] );
                break;
            }
        }
    }

    console.log(sum);
}
//part1();
part2();
