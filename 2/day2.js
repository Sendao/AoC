let fs = require('fs');

let data = fs.readFileSync('data.txt', 'utf8').split("\n").map( (x) => x.split(" ") );
//let data = [['A', 'Y'], ['B', 'X'], ['C', 'Z']];
var i, score=0;
// Rock Paper Scissors
// 0 3 6
let scores = { X: 1, Y: 2, Z: 3 };
let soln = { A: { X: 'Z', Y: 'X', Z: 'Y' },
             B: { X: 'X', Y: 'Y', Z: 'Z' },
             C: { X: 'Y', Y: 'Z', Z: 'X' } };
let win = { X: 0, Y: 3, Z: 6 };
let map = { X: { A: 3, B: 0, C: 6 }, Y: { A: 6, B: 3, C: 0 }, Z: { A: 0, B: 6, C: 3 } };
var pick;

for( i=0; i<data.length; i++ ) {
    if( data[i].length != 2 ) continue;
    pick = soln[ data[i][0] ][ data[i][1] ];
    score += scores[pick] + win[data[i][1]];
//    console.log("Score ", score, pick, scores[pick], data[i][1], win[data[i][1]]);
}

console.log("Score was " +score);
