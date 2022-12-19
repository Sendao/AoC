let fs = require('fs');

var data;
let t1 = new Date();
var i, bp, type, andtype;
var blueprints = [];
let totaltime=32;

/*
data = fs.readFileSync('demo.txt', 'utf8');
data = data.split("\n").map( (x) => x.trim().split(" ") );
for( i=0; i<data.length; i++ ) {
	if( data[i][0] == 'Blueprint' ) {
		bp = { 'id': parseInt(data[i][1]), ore: {}, clay: {}, obsidian: {}, geode: {} };
		blueprints.push(bp);
		continue;
	}
	switch( data[i][1] ) {
		case 'ore':
			bp.ore.ore = parseInt(data[i][4]);
			continue;
		case 'clay':
			bp.clay.ore = parseInt(data[i][4]);
			continue;
		case 'obsidian':
			type = data[i][5];
			andtype = data[i][8];
			if( andtype[andtype.length-1] == '.' ) andtype = andtype.substring(0, andtype.length-1);

			bp.obsidian[type] = parseInt(data[i][4]);
			bp.obsidian[andtype] = parseInt(data[i][7]);
			continue;
		case 'geode':
			type = data[i][5];
			andtype = data[i][8];
			if( andtype[andtype.length-1] == '.' ) andtype = andtype.substring(0, andtype.length-1);

			bp.geode[type] = parseInt(data[i][4]);
			bp.geode[andtype] = parseInt(data[i][7]);
			continue;
	}
}
*/
data = fs.readFileSync('data.txt', 'utf8');
data = data.split("\n").map( (x) => x.trim().split(" ") );

for( i=0; i<data.length; i++ ) {
	bp = { 'id': parseInt(data[i][1]), ore: {}, clay: {}, obsidian: {}, geode: {} };
	bp.ore.ore = parseInt(data[i][6]);
	bp.clay.ore = parseInt(data[i][12]);
	bp.obsidian.ore = parseInt(data[i][18]);
	bp.obsidian.clay = parseInt(data[i][21]);
	bp.geode.ore = parseInt(data[i][27]);
	bp.geode.obsidian = parseInt(data[i][30]);
	blueprints.push(bp);
}

function sumoflesser(n) {
	var i, sum=0;
	for( i=1; i<=n; i++ ) {
		sum += i;
	}
	return sum;
}

function resolve(bp, intime) {
	let robots = { ore: 1, clay: 0, obsidian: 0, geode: 0 };
	let mats = { ore: 0, clay: 0, obsidian: 0, geode: 0 };
	let mostgeodes = 0, skip = 0, memory = 0;
	let firstgeode = Infinity;

	console.log("Blueprint: ", bp);

	let search = function(robots, mats, min, mem={}, path="", hasGeode=false) {
		if( min >= intime ) {
			if( mats.geode > mostgeodes ) {
				mostgeodes = mats.geode;
				console.log("Found " + mats.geode + " geodes via " + path);
			}
			return;
		}
		if( min > firstgeode && !hasGeode ) return;

		let minsleft = intime-min;
		let obsids = mats.obsidian + minsleft * robots.obsidian + sumoflesser(minsleft);
		let newrobots = obsids / bp.geode.obsidian;
		newrobots = Math.min(newrobots, minsleft);
		let geodes = mats.geode + minsleft * robots.geode + sumoflesser(newrobots);
		if( geodes <= mostgeodes ) {
			skip++;
			return;
		}

		let key = mats.ore + "," + mats.clay + "," + mats.obsidian + "," + mats.geode + "," + robots.ore + "," + robots.clay + "," + robots.obsidian + "," + robots.geode + "," + min;
		if( key in mem ) {
//			console.log("Found " + key);
			memory++;
			var mmats, mrobots;
			[mmats, mrobots] = mem[key];
			mats.ore = mmats.ore;
			mats.clay = mmats.clay;
			mats.obsidian = mmats.obsidian;
			mats.geode = mmats.geode;
			robots.ore = mrobots.ore;
			robots.clay = mrobots.clay;
			robots.obsidian = mrobots.obsidian;
			robots.geode = mrobots.geode;
			return;
		}

		let turns_per_obsidian = bp.geode.obsidian / robots.obsidian; // some heuristics.
		if( isNaN(turns_per_obsidian) || robots.obsidian == 0 ) turns_per_obsidian = bp.geode.obsidian;
		let turns_per_obsore = bp.geode.ore / robots.ore;
		if( isNaN(turns_per_obsore) || robots.ore == 0 ) turns_per_obsore = bp.geode.ore;
		let turns_per_ore = bp.obsidian.ore / robots.ore;
		let turns_per_clay = bp.obsidian.clay / robots.clay;
		if( isNaN(turns_per_ore) || robots.ore == 0 ) turns_per_ore = bp.obsidian.ore;
		if( isNaN(turns_per_clay) || robots.clay == 0 ) turns_per_clay = bp.obsidian.clay;

		var pmats, probots;
		var sample, samples=[];
		let spent = false;

		if( mats.ore >= bp.geode.ore && mats.obsidian >= bp.geode.obsidian ) {
			mats.ore -= bp.geode.ore;
			mats.obsidian -= bp.geode.obsidian;
			robots.geode++;
			mats.geode -= 1;

			firstgeode = min;

			mats.geode += robots.geode;
			mats.obsidian += robots.obsidian;
			mats.clay += robots.clay;
			mats.ore += robots.ore;

			pmats = { ... mats };
			probots = { ... robots };
			search(robots, mats, min+1, mem, path + ",g", true);
			sample = [{...mats}, {...robots}];
			samples.push(sample);

			mats.ore = pmats.ore;
			mats.clay = pmats.clay;
			mats.obsidian = pmats.obsidian;
			mats.geode = pmats.geode;

			robots.ore = probots.ore;
			robots.clay = probots.clay;
			robots.obsidian = probots.obsidian;
			robots.geode = probots.geode;


			mats.geode -= robots.geode;
			mats.obsidian -= robots.obsidian;
			mats.clay -= robots.clay;
			mats.ore -= robots.ore;
			robots.geode--;
			mats.geode += 1;
			mats.obsidian += bp.geode.obsidian;
			mats.ore += bp.geode.ore;
			spent = true;
		}
		if( mats.ore >= bp.obsidian.ore && mats.clay >= bp.obsidian.clay ) {
			mats.ore -= bp.obsidian.ore;
			mats.clay -= bp.obsidian.clay;
			robots.obsidian++;
			mats.obsidian -= 1;

			mats.geode += robots.geode;
			mats.obsidian += robots.obsidian;
			mats.clay += robots.clay;
			mats.ore += robots.ore;

			pmats = { ... mats };
			probots = { ... robots };
			search(robots, mats, min+1, mem, path + ",o", hasGeode);
			sample = [{...mats}, {...robots}];
			samples.push(sample);

			mats.ore = pmats.ore;
			mats.clay = pmats.clay;
			mats.obsidian = pmats.obsidian;
			mats.geode = pmats.geode;

			robots.ore = probots.ore;
			robots.clay = probots.clay;
			robots.obsidian = probots.obsidian;
			robots.geode = probots.geode;
			
			mats.geode -= robots.geode;
			mats.obsidian -= robots.obsidian;
			mats.clay -= robots.clay;
			mats.ore -= robots.ore;
			robots.obsidian--;
			mats.obsidian += 1;
			mats.ore += bp.obsidian.ore;
			mats.clay += bp.obsidian.clay;

			/*
			if( turns_per_obsidian >= turns_per_obsore ) {
				spent = true;
			}
			*/
		}
		if( !spent && mats.ore >= bp.clay.ore && min < totaltime*2/3  ) {
			mats.ore -= bp.clay.ore;
			robots.clay++;
			mats.clay -= 1;

			mats.geode += robots.geode;
			mats.obsidian += robots.obsidian;
			mats.clay += robots.clay;
			mats.ore += robots.ore;

			pmats = { ... mats };
			probots = { ... robots };
			search(robots, mats, min+1, mem, path + ",c", hasGeode);
			sample = [{...mats}, {...robots}];
			samples.push(sample);

			mats.ore = pmats.ore;
			mats.clay = pmats.clay;
			mats.obsidian = pmats.obsidian;
			mats.geode = pmats.geode;

			robots.ore = probots.ore;
			robots.clay = probots.clay;
			robots.obsidian = probots.obsidian;
			robots.geode = probots.geode;
			

			mats.geode -= robots.geode;
			mats.obsidian -= robots.obsidian;
			mats.clay -= robots.clay;
			mats.ore -= robots.ore;
			robots.clay--;
			mats.clay += 1;
			mats.ore += bp.clay.ore;

			/*
			if( turns_per_clay > turns_per_ore+turns_per_obsore )
				spent = true;
			*/
		}
		if( !spent && mats.ore >= bp.ore.ore && min < totaltime/2 ) {
			mats.ore -= bp.ore.ore;
			robots.ore++;
			mats.ore -= 1;

			mats.geode += robots.geode;
			mats.obsidian += robots.obsidian;
			mats.clay += robots.clay;
			mats.ore += robots.ore;

			pmats = { ... mats };
			probots = { ... robots };
			search(robots, mats, min+1, mem, path + ",ore", hasGeode);
			sample = [{...mats}, {...robots}];
			samples.push(sample);

			mats.ore = pmats.ore;
			mats.clay = pmats.clay;
			mats.obsidian = pmats.obsidian;
			mats.geode = pmats.geode;

			robots.ore = probots.ore;
			robots.clay = probots.clay;
			robots.obsidian = probots.obsidian;
			robots.geode = probots.geode;
			

			mats.geode -= robots.geode;
			mats.obsidian -= robots.obsidian;
			mats.clay -= robots.clay;
			mats.ore -= robots.ore;
			robots.ore--;
			mats.ore += 1;
			mats.ore += bp.ore.ore;
		}

		if( !spent ) {
			mats.geode += robots.geode;
			mats.obsidian += robots.obsidian;
			mats.clay += robots.clay;
			mats.ore += robots.ore;

			search(robots, mats, min+1, mem, path + ",w", hasGeode);
			sample = [{...mats}, {...robots}];
			samples.push(sample);
		}

		var i, maxg = samples[0][0].geode, n = 0;

		for( i=1; i<samples.length; i++ ) {
			if( samples[i][0].geode > maxg ) {
				maxg = samples[i][0].geode;
				n = i;
			}
		}

		mats.ore = samples[n][0].ore;
		mats.clay = samples[n][0].clay;
		mats.obsidian = samples[n][0].obsidian;
		mats.geode = samples[n][0].geode;

		robots.ore = samples[n][1].ore;
		robots.clay = samples[n][1].clay;
		robots.obsidian = samples[n][1].obsidian;
		robots.geode = samples[n][1].geode;

		mem[key] = samples[n];
	}

	search(robots, mats, 0, {}, "");

	console.log("Robots: ", robots);
	console.log("Mats: ", mats);
	console.log("Skip: ", skip, "Memory: ", memory);

	return mats.geode;
}

var i;
let sum=0;
var a,b,c;


for( i=0; i<blueprints.length  && i<3; i++ ) {
	let geodes = resolve(blueprints[i], totaltime);
	if( i==0 ) a = geodes;
	else if( i==1 ) b = geodes;
	else c = geodes;
	sum += blueprints[i].id * geodes;
}

console.log("Sum: " + sum);
console.log("Product: " + (a*b*c));

//1124: too low.
//try:1427.