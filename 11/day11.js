let fs = require('fs');

function part2()
{
    //let data = fs.readFileSync('demo.txt', 'utf8').split("\n").map( (x) => (x.trim().split(" ")) );
    let data = fs.readFileSync('data.txt', 'utf8').split("\n").map( (x) => (x.trim().split(" ")) );
    var i, j;
    var monks = {};
    var monkid, maxid = 0;
    var items, item;
    var divby, db=[];

    for( i=0; i<data.length; i++ ) {
        if( data[i][0] == 'Monkey' ) {
            monkid = parseInt(data[i][1]);
            maxid = Math.max(maxid, monkid);
            monks[monkid] = {inspections: 0, items: []};
            continue;
        }
        switch( data[i][0] ) {
            case 'Starting':
                monks[monkid].items = [];
                for( j = 2; j < data[i].length; j++ ) {
                    item = parseInt(data[i][j]);
                    monks[monkid].items.push(item);
                }
                continue;
            case 'Operation:':
                monks[monkid].lvalue = data[i][3];
                monks[monkid].op = data[i][4];
                monks[monkid].rvalue = data[i][5];
                continue;
            case 'Test:':
                divby = parseInt(data[i][3]);
                monks[monkid].divby = divby;
                db.push(divby);
                continue;
        }
        if( data[i][1] == 'true:' ) {
            monks[monkid].throwtrue = parseInt(data[i][5]);
        } else if( data[i][1] == 'false:' ) {
            monks[monkid].throwfalse = parseInt(data[i][5]);
        }
    }

    j=1;
    let hcf=null, lcm;
    do {
        let found=false;
        for( i=0; i<db.length; i++ ) {
            if( j > db[i] ) {
                found=true;
                break;
            }
        }
        if( found ) break;

        for( i=0; i<db.length; i++ ) {
            if( db[i] % j != 0 ) {
                found=true;
                break;
            }
        }
        if( !found ) {
            hcf = j;
        }
        j++;
    } while( true );
    lcm = 1;
    for( i=0; i<db.length; i++ ) {
        lcm *= db[i];
    }
    lcm /= hcf;
    console.log(db, hcf, lcm);

    let evalParm = function(parm) {
        if( parm == 'old' )
            return item;
        else
            return parseInt(parm);
    }

    console.log(monks);
    for( var loop=0; loop<10000; loop++ ){
        if( loop % 1000 == 0 ) {
            console.log("Loop " + loop);
            for( i=0; i<=maxid; i++ ) {
                console.log("Monkey " + i + ": " + monks[i].inspections + " inspections.");
            }

        }
        for( i=0; i<=maxid; i++ ) {
            while( monks[i].items.length > 0 ) {
                item = monks[i].items.shift();
                //do operation
                monks[i].inspections++;
                switch( monks[i].op ) {
                    case '+':
                        value = evalParm(monks[i].lvalue) + evalParm(monks[i].rvalue);
                        break;
                    case '*':
                        value = evalParm(monks[i].lvalue) * evalParm(monks[i].rvalue);
                        break;
                    case '-':
                        value = evalParm(monks[i].lvalue) - evalParm(monks[i].rvalue);
                        break;
                    case '/':
                        value = evalParm(monks[i].lvalue) / evalParm(monks[i].rvalue);
                        break;
                }
                // operation part 2
                if( value >= lcm ) value = value % lcm;
                //value = Math.floor( value/3 );
                // test and throw
                if( (value % monks[i].divby) == 0 ) {
                    monks[monks[i].throwtrue].items.push(value);
                } else {
                    monks[monks[i].throwfalse].items.push(value);
                }
            }
        }
    }

    var mosti = 0, mosti2 = 0;
    for( i=0; i<=maxid; i++ ) {
        if( monks[i].inspections >= mosti ) {
            mosti2 = mosti;
            mosti = monks[i].inspections;
        } else if( monks[i].inspections > mosti2 ) {
            mosti2 = monks[i].inspections;
        }
        console.log("Monkey " + i + ": " + monks[i].inspections + " inspections.");
    }
    console.log("Monkey business: " + (mosti*mosti2));
}
part2();