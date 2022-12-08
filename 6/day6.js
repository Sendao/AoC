let fs = require('fs');

function part1()
{
    let data = fs.readFileSync('data.txt', 'utf8').split("");
    //let data = "mjqjpqmgbljsphdztnvjfqwrcgsmlb";
    var i, e, f, v, m = new Map();
    let allUnique=true;

    let checkUnique = function(map) {
        let test=true;
        var k;

        for( k of map.keys() ) {
            console.log(k, map.get(k));
            if( map.get(k) != 1 ) return false;
        }

        return true;
    }

    for( i=0; i<data.length; i++ ) {
        e = data[i];
        v = (m.get(e) || 0) + 1;
        m.set(e, v);
        if( v != 1 ) allUnique=false;

        if( i >= 14 ) {
            f = data[i-14];
            v = m.get(f) - 1;
            if( v == 0 ) {
                m.delete(f);
            } else {
                m.set(f, v);
            }
            if( checkUnique(m) ) allUnique=true;
        }

        if( i >= 14 && allUnique ) {
            console.log(i+1);
            return;
        }
    }

}

part1();

