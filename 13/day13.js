let fs = require('fs');

function readSet(line)
{
    var i;
    var items = [];
    var item = null;
    var level = 0, st;

    for( i=0; i<line.length; i++ ) {
        if( line[i] == '[' ) {
            level=1;
            st = i+1;
            while( level > 0 ) {
                i++;
                if( line[i] == '[' ) {
                    level++;
                } else if( line[i] == ']' ) {
                    level--;
                }
            }
            items.push( readSet( line.slice(st,i) ) );
        } else if( line[i] == ',' ) {
            continue;
        } else if( line[i] == ']' ) {
            break;
        } else if( line[i] == "" ) {
            continue;
        } else if( !isNaN(line[i]) ) {
            items.push( parseInt( line[i] ) );
        }
    }

    return items;
}

function checkPair(a,b)
{
    var i, ai, bi;
    var v;
    for( i=0; i<a.length && i<b.length; i++ ) {
        if( typeof a[i] != 'number' ) {
            if( typeof b[i] == 'number' ) {
                v = checkPair(a[i],[b[i]]);
            } else {
                v = checkPair(a[i],b[i]);
            }
            if( v < 0 ) return -1;
            if( v > 0 ) return 1;
        } else if( typeof b[i] != 'number' ) {
            if( typeof a[i] == 'number' ) {
                v = checkPair([a[i]],b[i]);
            } else {
                v = checkPair(a[i],b[i]);
            }
            if( v < 0 ) return -1;
            if( v > 0 ) return 1;
        } else {
            if( a[i] > b[i] ) return -1;
            if( a[i] < b[i] ) return 1;
        }
    }
    if( i >= b.length && i < a.length ) return -1;
    if( i >= a.length && i < b.length ) return 1;
    return 0;
}
function part1()
{
    //let data = fs.readFileSync('demo.txt', 'utf8').split("\n").map( (x) => (readSet(x.trim().split(/([,\[\]])/g))) );
    let data = fs.readFileSync('data.txt', 'utf8').split("\n").map( (x) => (readSet(x.trim().split(/([,\[\]])/g))) );

    var i, indices=0;

    for( i=0; i<data.length; i+= 3 ) {
        console.log(i, data[i].toString(), data[i+1].toString());
        if( checkPair(data[i],data[i+1]) <= 0 ) {
            console.log("Not a set");
        } else {
            console.log("Set found: " + (parseInt(i/3)+1));
            indices += parseInt(i/3)+1;
        }
    }

    console.log(indices);
}

//part1();

function part2()
{
    //let data = fs.readFileSync('demo.txt', 'utf8').split("\n").filter( (x) => ( x.trim() != "" ) ).map( (x) => (readSet(x.trim().split(/([,\[\]])/g))) );
    let data = fs.readFileSync('data.txt', 'utf8').split("\n").filter( (x) => ( x.trim() != "" ) ).map( (x) => (readSet(x.trim().split(/([,\[\]])/g))) );

    data.push([[2]]);
    data.push([[6]]);

    data.sort( (b,a) => (checkPair(a,b)) );
    var i, found1=null, found2=null;

    for( i=0; i<data.length; i++ ) {
        if( typeof data[i][0] != 'number' && data[i][0].length == 1 && typeof data[i][0][0] == 'number' ) {
            if( data[i][0][0] == 2 ) {
                found1 = i+1;
            } else if( data[i][0][0] == 6 ) {
                found2 = i+1;
            }
        }
    }

    console.log(found1,found2,found1*found2);

}

part2();