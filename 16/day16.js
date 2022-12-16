let fs = require('fs');

var data;
let t1 = new Date();
data = fs.readFileSync('data.txt', 'utf8');
data = data.split("\n").map( (x) => (x.trim().split(" ").filter( (x,i) => (i == 1 || i == 4 || i > 8 ) )) );

function makeGraph()
{
    let G = {};
    var i, j, label, rate, gates, gate;

    for( i=0; i<data.length; i++ ) {
        label = data[i][0];
        rate = parseInt(data[i][1].split("=")[1]);

        G[label] = { rate: rate, gates: [] };
        for( j=2; j<data[i].length; j++ ) {
            if( j+1 < data[i].length ) {
                gate = data[i][j].split(",")[0];
            } else {
                gate = data[i][j];
            }
            G[label].gates.push(gate);
        }
    }

    for( label in G ) {
        G[label].dists = {};
        for( i in G ) {
            if( i == label ) continue;
            G[label].dists[i] = distance(G, label, i);
        }
    }

    return G;
}

function distance(G, from, to)
{
    let Q = [[from,0]];
    var i, dist, vis = new Set();
    vis.add(from);

    while( Q.length > 0 ) {
        [from,dist] = Q.shift();
        if( from == to ) {
            return dist;
        }

        for( i=0; i<G[from].gates.length; i++ ) {
            if( vis.has( G[from].gates[i] ) ) continue;
            Q.push( [ G[from].gates[i], dist+1 ] );
            vis.add( G[from].gates[i] );
        }
    }

    throw "Impossible gates";
}


function part1()
{
    let G = makeGraph();
    console.log(G);

    let used = new Set();
    used.add('AA');

        
    function search4(graph, from, timeleft, used)
    {
        var i, to, score;
        var min=0, take, leave;

        if( timeleft < 2 ) return 0;
        var nv, total;
        let vista = new Set();
        let Q = [[from, timeleft, vista, 0]];
        let loops=0;

        while( Q.length > 0 ) {
            [from, timeleft, vista, total] = Q.pop();
            min = Math.max(min, total);
            if( timeleft < 2 ) continue;
            vista.add(from);
            loops++;
            if( (loops%10000) == 0 ) {
                console.log("Loop " + loops + " score: " + total + " max: " + min);
            }

            for( to in graph ) {
                if( vista.has(to) ) continue;
                
                dist = graph[from].dists[ to ];
                score = graph[to].rate * ( timeleft - (1 + dist) );

                if( score > 0 )
                    Q.push( [ to, timeleft-(1+dist), new Set(vista), total+score ] );
            }

        }

        return min;
    }


    console.log("Max flow " + search4(G, 'AA', 30, used));
}

//part1();


class ArrPool {
    constructor( ) {
        this.freed = [];
        this.maxfreed = 0;
    };

    release(ptr) {
        this.freed.push(ptr);
        if( this.freed.length > this.maxfreed ) this.maxfreed = this.freed.length;
    }

    releaseAll(arr) {
        this.freed.concat(arr);
        if( this.freed.length > this.maxfreed ) this.maxfreed = this.freed.length;
    }

    get(params) {
        var v, i;
        if( this.freed.length > 0 ) {
            v = this.freed.shift();
            if( typeof params != 'undefined' ) {
                for( i=0; i<params.length; i++ ) {
                    v[i] = params[i];
                }
            }
            return v;
        }

        v = [];
        if( typeof params != 'undefined' ) {
            for( i=0; i<params.length; i++ ) {
                v[i] = params[i];
            }
        }
        return v;
    };
}
class SetPool {
    constructor( ) {
        this.freed = [];
        this.maxfreed = 0;
    };

    release(ptr) {
        ptr.clear();
        this.freed.push(ptr);
        if( this.freed.length > this.maxfreed ) this.maxfreed = this.freed.length;
    }

    get(params) {
        var v, i, en;
        if( this.freed.length > 0 ) {
            v = this.freed.shift();

            if( typeof params != 'undefined' ) {
                en = params.entries();
                for( i of en ) {
                    v.add(i[0]);
                }
            }
            return v;
        }

        if( typeof params != 'undefined' )
            v = new Set(params);
        else
            v = new Set();
        return v;
    };
}

function part2()
{
    let G = makeGraph();
    let SP = new SetPool();
    let AP = new ArrPool();
    
    function printVista(vista)
    {
        let str = "", buf = [];
        var en = vista.entries();
        var i;
        for( i of en ) {
            buf.push(i[0]);
        }
        buf.sort();
        for( i=0; i<buf.length; i++ ) {
            str += buf[i] + ",";
        }
        return str;
    }
    function search4(graph, from, starttime)
    {
        var i, to, score;
        var min=0;
        var timeleft = starttime;
        var total, elephant, eleleft;
        let vista = SP.get();
        let loops=0, moveElephant, movePlayer;
        var dist;
        var obj, maxposs;
        var master = new Map();
        var key, nv;
        var vstr = from;

        for( to in graph ) {
            if( graph[to].rate == 0 ) {
                vista.add(to);
                if( to != from )
                    delete graph[to];
            }
        }
        let Q = [AP.get([from, timeleft, vista, 0, from, timeleft, vstr])];
        let skip=0;

        while( Q.length > 0 ) {
            obj = Q.pop();
            from = obj[0]; timeleft = obj[1]; vista = obj[2]; total = obj[3]; elephant = obj[4]; eleleft = obj[5]; vstr = obj[6];
            AP.release(obj);
            min = Math.max(min, total);
            if( timeleft < 2 && eleleft < 2 ) {
                SP.release(vista);
                continue;
            }
            key = vstr;
            if( master.has(key) ) {
                if( master.get(key) >= total ) {
                    skip++;
                    SP.release(vista);
                    continue;
                }
            }
            master.set(key, total);

            loops++;
            if( (loops%100000) == 0 ) {
                console.log("Loop " + loops + " score: " + total + " max: " + min + ", skip: " + skip);
            }


            maxposs = 0;
            for( to in graph ) {
                if( vista.has(to) ) continue;
                maxposs += graph[to].rate;
            }
            if( maxposs * (Math.max(eleleft,timeleft)-1) + total <= min ) {
                SP.release(vista);
                continue;
            }
            
            if( eleleft >= 2 ) {
                for( to in graph ) {
                    if( vista.has(to) ) continue;
                    
                    dist = graph[elephant].dists[ to ];
                    score = graph[to].rate * ( eleleft - (1 + dist) );
    
                    if( score > 0 ) {
                        nv = SP.get(vista);
                        nv.add( to );
                        Q.push( AP.get([ from, timeleft, nv, total+score, to, eleleft-(1+dist), printVista(nv) ]) );
                    }
                }
            }

            if( timeleft >= 2 ) {
                for( to in graph ) {
                    if( vista.has(to) ) continue;
                    
                    dist = graph[from].dists[ to ];
                    score = graph[to].rate * ( timeleft - (1 + dist) );
    
                    if( score > 0 ) {
                        nv = SP.get(vista);
                        nv.add( to );
                        Q.push( AP.get([ to, timeleft-(1+dist), nv, total+score, elephant, eleleft, printVista(nv) ]) );
                    }
                }
            }

            SP.release(vista);
        }

        return min;
    }
        
    console.log("Max flow " + search4(G, 'AA', 26));
    console.log("SP MF: " + SP.maxfreed);
    console.log("AP MF: " + AP.maxfreed);
}

part2();
let t2 = new Date();
console.log("Time: " + (t2-t1)/1000 + "s");
