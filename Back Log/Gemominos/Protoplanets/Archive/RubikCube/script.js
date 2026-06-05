$(document).ready(function(){
	search();
});

 // Returns a random number between min (inclusive) and max (inclusive)
function getRandom(min, max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}

var die = [];

function rotate(){
	var twist = getRandom(1,4); // 1=up, 2=down, 3=left, 4=right
	if(twist < 3){
		if(twist == 1){
			die = [die[2],die[1],die[4],die[3],die[5],die[0]];
			var result = '[U';
		} else {
			die = [die[5],die[1],die[0],die[3],die[2],die[4]];
			var result = '[D';
		}
		twist = getRandom(3,4);
		if(twist == 3){
			die = [die[3],die[0],die[2],die[4],die[1],die[5]];
			result += ',L]';
		} else {
			die = [die[1],die[4],die[2],die[0],die[3],die[5]];
			result += ',R]';
		}
	} else {
		if(twist == 3){
			die = [die[3],die[0],die[2],die[4],die[1],die[5]];
			var result = '[L';
		} else {
			die = [die[1],die[4],die[2],die[0],die[3],die[5]];
			var result = '[R';
		}
		twist = getRandom(1,2);
		if(twist == 1){
			die = [die[2],die[1],die[4],die[3],die[5],die[0]];
			result += ',U]';
		} else {
			die = [die[5],die[1],die[0],die[3],die[2],die[4]];
			result += ',D]';
		}
	}
	return result;
}

function rotate3(){
	var twist = getRandom(1,4); // 1=up, 2=down, 3=left, 4=right
	if(twist < 3){
		var twist1 = 'v';
		if(twist == 1){
			die = [die[2],die[1],die[4],die[3],die[5],die[0]];
			var result = '[U';
			y++;
			if(y > ymax) ymax++;
		} else {
			die = [die[5],die[1],die[0],die[3],die[2],die[4]];
			var result = '[D';
			y--;
			if(y < ymin) ymin--;
		}
	} else {
		var twist1 = 'h';
		if(twist == 3){
			die = [die[3],die[0],die[2],die[4],die[1],die[5]];
			var result = '[L';
			x--;
			if(x < xmin) xmin--;
		} else {
			die = [die[1],die[4],die[2],die[0],die[3],die[5]];
			var result = '[R';
			x++;
			if(x > xmax) xmax++;
		}
	}
	if(spath.includes(x+','+y)){
		score += 1;
	}
	if(sstop.includes(x+','+y)){
		score += 10;
	}
	spath.push(x+','+y);
	var temp = twist;
	var twist = getRandom(1,4); // 1=up, 2=down, 3=left, 4=right
	if(twist < 3){
		var twist2 = 'v';
		if(temp+twist == 3) twist = Math.abs(twist-3);
		if(twist == 1){
			die = [die[2],die[1],die[4],die[3],die[5],die[0]];
			result += ',U';
			y++;
			if(y > ymax) ymax++;
		} else {
			die = [die[5],die[1],die[0],die[3],die[2],die[4]];
			result += ',D';
			y--;
			if(y < ymin) ymin--;
		}
	} else {
		var twist2 = 'h';
		if(temp+twist == 7) twist = Math.abs(twist-7);
		if(twist == 3){
			die = [die[3],die[0],die[2],die[4],die[1],die[5]];
			result += ',L';
			x--;
			if(x < xmin) xmin--;
		} else {
			die = [die[1],die[4],die[2],die[0],die[3],die[5]];
			result += ',R';
			x++;
			if(x > xmax) xmax++;
		}
	}
	if(spath.includes(x+','+y)){
		score += 1;
	}
	if(sstop.includes(x+','+y)){
		score += 10;
	}
	spath.push(x+','+y);
	var temp = twist;
	var twist = getRandom(1,4); // 1=up, 2=down, 3=left, 4=right
	if(twist1 == 'v' && twist2 == 'v') twist = getRandom(3,4);
	if(twist1 == 'h' && twist2 == 'h') twist = getRandom(1,2);
	if(twist < 3){
		if(temp+twist == 3) twist = Math.abs(twist-3);
		if(twist == 1){
			die = [die[2],die[1],die[4],die[3],die[5],die[0]];
			result += ',U]';
			y++;
			if(y > ymax) ymax++;
		} else {
			die = [die[5],die[1],die[0],die[3],die[2],die[4]];
			result += ',D]';
			y--;
			if(y < ymin) ymin--;
		}
	} else {
		if(temp+twist == 7) twist = Math.abs(twist-7);
		if(twist == 3){
			die = [die[3],die[0],die[2],die[4],die[1],die[5]];
			result += ',L]';
			x--;
			if(x < xmin) xmin--;
		} else {
			die = [die[1],die[4],die[2],die[0],die[3],die[5]];
			result += ',R]';
			x++;
			if(x > xmax) xmax++;
		}
	}
	if(spath.includes(x+','+y)){
		score += 10;
	}
	if(sstop.includes(x+','+y)){
		score += 100;
	}
	sstop.push(x+','+y);
	return result;
}

var best = 0;

var successes = [];

var x = 20;
var y = 20;
var xmin = 20;
var xmax = 20;
var ymin = 20;
var ymax = 20;
var smallest = 16;
var score = 0;
var spath = [];
var sstop = [];
var bestscore = 1000;

function search(){
	die = [1,3,2,4,6,5];
	var result = {
		zero: [],
		one: [],
		two: [],
		three: [],
		four: [],
		five: []
	};
	var path = '';
	x = 20;
	y = 20;
	xmin = 20;
	xmax = 20;
	ymin = 20;
	ymax = 20;
	score = 0;
	spath = [];
	sstop = ['20,20'];
	
	var flag = 1;
	while(flag > 0){
		var error = false;
		if(result.zero.includes(die[0])){
			error = true;
		}
		if(result.one.includes(die[1])){
			error = true;
		}
		if(result.two.includes(die[2])){
			error = true;
		}
		if(result.three.includes(die[3])){
			error = true;
		}
		if(result.four.includes(die[4])){
			error = true;
		}
		if(result.five.includes(die[5])){
			error = true;
		}
		if(error){
			$('#failure').html(flag+': '+path+'<br />');
			if(flag > best){
				best = flag;
				$('#best').html(flag+': '+path+'<br />');
			}
			flag = 0;
		} else {
			if(flag == 6){
				var text = flag+': '+path+'<br />';
				if(successes.includes(text)){
					$('#best').html('Duplicate = '+text);
				} else {
					$('#success').html(text);
					successes.push(text);
					var xdif = xmax-xmin+1;
					var ydif = ymax-ymin+1;
					if(xdif*ydif <= smallest){
						$('#smallest').html(score+'pts '+xdif+'x'+ydif+': '+path+'<br />');
						//smallest = xdif*ydif;
						if(score < bestscore){
							$('#score').prepend(score+'pts '+xdif+'x'+ydif+': '+path+'<br />');
							bestscore = score;
							document.title = score+' Points';
						}
						if(score == 0){
							$('#score').prepend(score+'pts '+xdif+'x'+ydif+': '+path+'<br />');
						}
					}
				}
				flag = 0;
			} else {
				flag++;
				result.zero.push(die[0]);
				result.one.push(die[1]);
				result.two.push(die[2]);
				result.three.push(die[3]);
				result.four.push(die[4]);
				result.five.push(die[5]);
				path += rotate3();
			}
		}
	}
	setTimeout('search()',1);
}