let fs = require('fs');

let dirs = {};
var mydir, currentDir="";

function cd(to)
{
    if( to == "/" ) {
        currentDir = "";
        navto();
        return;
    }
    if( to == ".." ) {
        currentDir = currentDir.split("/").slice(0, -1).join("/");
        navto();
        return;
    }
    currentDir = currentDir + "/" + to;
    navto();
}
function navto()
{
    if( currentDir == "" ) {
        if( !("" in dirs) ) dirs[""] = {};
        mydir = dirs[""];
        return;
    }

    let path = currentDir.split("/");
    let dir = dirs[""];
    for( let i=1; i<path.length; i++ ) {
        if( path[i] == "" ) continue;
        if( !(path[i] in dir) ) dir[path[i]] = {};
        dir = dir[path[i]];
    }
    mydir = dir;
}

function runtime()
{
    let data = fs.readFileSync('data.txt', 'utf8').split("\r\n");

    var i, cmd, listing=false;

    for( i = 0; i < data.length; i++ ) {
        if( data[i][0] == "$" ) {
            cmd = data[i].split(" ");
            if( cmd[1] == "ls" ) {
                listing=true;
                continue;
            }
            listing=false;
            if( cmd[1] == "cd" ) {
                cd( cmd[2] );
                continue;
            }
        } else if( listing ) {
            cmd = data[i].split(" ");
            if( cmd[0] == "dir" ) {
                continue;
            }
            mydir[cmd[1]] = parseInt(cmd[0]);
        }
    }

    // to solve mydirs
    let summarize = function(tree) {
        let sum = 0;
        
        for( let k in tree ) {
            if( k == "sum" ) return tree[k];

            if( typeof tree[k] == "number" ) {
                sum += tree[k];
            } else {
                sum += summarize(tree[k]);
            }
        }

        tree['sum'] = sum;
        return sum;
    }

    summarize(dirs);

    let reduction = function(tree) {
        let sum = 0;

        if( tree.sum <= 100000 )
            sum += tree.sum;

        for( let k in tree ) {
            if( k == "sum" ) continue;

            if( typeof tree[k] == "number" ) continue;

            sum += reduction(tree[k]);
        }

        return sum;
    }
    //part1:
    //let total = reduction(dirs);
    //console.log(total)

    let used = 40000000;
    let minfile = dirs[""].sum - used;
    console.log("Find dirs >= " + minfile);

    let minsum = Infinity;
    let search = function(tree) {
        if( typeof tree == "number" ) return;
        if( tree.sum >= minfile ) {
            minsum = Math.min(minsum, tree.sum);
        }
        for( var k in tree ) {
            search(tree[k]);
        }
    };

    //part2:
    search(dirs);
    console.log(minsum);
}
runtime();
