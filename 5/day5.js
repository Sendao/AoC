let fs = require('fs');

function part1()
{
    let data = fs.readFileSync('data.txt', 'utf8').split("\n");
    var cols = [];
    var line;
    var i, j, maxlen=0, afterGraph;

    for( i=0; data[i] != "\r"; i++ ) {
        maxlen = Math.max(maxlen, data[i].length);
    }
    afterGraph = i+1;
    cols = new Array( 9 ).fill('').map( () => [] );
    for( i-=2; i >= 0; i-- ) {
        line = data[i];
        for( j=0; j<9 && j*4+1<data.length; j++ ) {
            if( line[j*4+1] != " " ) {
                cols[j].push( line[j*4+1] );
            }
        }
    }

    for( i=afterGraph; i<data.length; i++ ) {
        line = data[i].split(" ");
        let moveCount = parseInt(line[1]);
        let moveFrom = parseInt(line[3])-1;
        let moveTo = parseInt(line[5])-1;
        if( isNaN(moveCount) ) break;

        let items = cols[moveFrom].splice( cols[moveFrom].length-moveCount, moveCount );
        cols[moveTo] = cols[moveTo].concat(items);

        /* part1:
        while( moveCount > 0 ) {
            let item = cols[moveFrom].pop();
            cols[moveTo].push(item);
            moveCount--;
        }
        */
        
    }

    cols.forEach( (x) => console.log(x.toString()) );

};

part1();