let fs = require('fs');

var data;
let t1 = new Date();
data = fs.readFileSync('data.txt', 'utf8');
data = data.split("\n").map( (x) => (x.trim().split(" ").filter( (x,i) => (i == 1 || i == 4 || i > 8 ) )) );

function makeGraph()
{
    let G = {};
    var i, j, k, label, rate, gates, gate;

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

    // Floyd Warshall, precalculate all distances:
    for( i in G ) {
        G[i].dists = {};
        G[i].dists[i] = 0;
        for( j in G ) {
            if( i == j ) continue;
            if( G[i].gates.indexOf(j) != -1 )
                G[i].dists[j] = 1;
            else
                G[i].dists[j] = Infinity;
        }
    }
    for( k in G ) {
        for( i in G ) {
            for( j in G ) {
                if( i == j ) continue;
                if( G[i].dists[j] > G[i].dists[k] + G[k].dists[j] ) {
                    G[i].dists[j] = G[i].dists[k] + G[k].dists[j];
                }
            }
        }
    }

    return G;
}

function distance(G, from, to) // a normal distance function that operates about as fast as FW for this small dataset
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

function part2()
{
    let G = makeGraph();
    
    function search4(graph, from, starttime)
    {
        var to, score;
        var total, timeleft, elephant, eleleft;
        let vista = new Set();
        var dist, eledist;
        var obj, maxposs;
        var master = new Map();
        var key, nv, newstr;
        var vstr = "";
        let gateid = {};
        let min=0, loops=0;

        for( to in graph ) {
            if( graph[to].rate == 0 ) {
                vista.add(to);
                if( to != from )
                    delete graph[to];
                else {
                    vstr += "1";
                    gateid[to] = vstr.length-1;
                }
            } else {
                vstr += "0";
                gateid[to] = vstr.length-1;
            }
        }
        let Q = [[from, starttime, vista, 0, from, starttime, vstr]]; // here we retrieve a new item from the pool
        let skip=0;

        console.log(vstr);

        while( Q.length > 0 ) {
            [from,timeleft,vista,total,elephant,eleleft,vstr] = Q.pop();

            min = Math.max(min, total);
            if( timeleft < 2 && eleleft < 2 )
                continue;

            // We can memoize pretty egregiously:
            if( master.has(vstr) && master.get(vstr) >= total ) {
                skip++;
                continue;
            }
            master.set(vstr, total);
            
            // This reduces the search time by 1/3rd:
            maxposs = 0;
            for( to in graph ) {
                if( vista.has(to) ) continue;
                maxposs += graph[to].rate;
            }
            if( maxposs * (Math.max(eleleft,timeleft)-2) + total <= min ) {
                skip++;
                continue;
            }

            loops++;
            if( (loops%10000) == 0 ) {
                console.log("Loop " + loops + " score: " + total + " max: " + min + ", skip: " + skip);
            }
            
            for( to in graph ) {
                if( vista.has(to) ) continue;
                
                if( eleleft >= 2 ) {
                    eledist = eleleft - (graph[elephant].dists[ to ] + 1); // eledist is now the time left for the elephant
                    score = graph[to].rate * eledist;    
                    if( score > 0 ) {
                        newstr = vstr.substring(0, gateid[to]) + '1' + vstr.substring(gateid[to]+1);
                        nv = new Set(vista);
                        nv.add( to );
                        Q.push( [ from, timeleft, nv, total+score, to, eledist, newstr ] );
                    }
                }
                if( timeleft >= 2 ) {
                    dist = timeleft - (graph[from].dists[ to ] + 1); // dist is now time left for player
                    score = graph[to].rate * dist;
                    if( score > 0 ) {
                        newstr = vstr.substring(0, gateid[to]) + '1' + vstr.substring(gateid[to]+1);
                        nv = new Set(vista);
                        nv.add( to );
                        Q.push( [ to, dist, nv, total+score, elephant, eleleft, newstr ] );
                    }
                }
            }
        }

        return min;
    }
        
    console.log("Max flow " + search4(G, 'AA', 26));
}

part2();
let t2 = new Date();
console.log("Time: " + (t2-t1)/1000 + "s");
