let fs = require('fs');

let data = fs.readFileSync('data.txt', 'utf8').split("\n");
var i, max = -Infinity, max2 = -Infinity, max3 = -Infinity, count = 0;
var n;

for( i=0; i<data.length; i++ ) {
    n = parseInt(data[i]);
    if( isNaN(n) ) {
        if( count > max ) {
            max3 = max2;
            max2 = max;
            max = count;
        } else if( count > max2 ) {
            max3 = max2;
            max2 = count;
        } else if( count > max3 ) {
            max3 = count;
        }
        count = 0;
    } else {
        count += parseInt(data[i]);
    }
}

console.log("Max:",max);
console.log("Total:",max+max2+max3);
