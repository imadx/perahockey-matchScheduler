const _ = require('lodash')

let noOfTeams = 30;
let noOfGroups = 3;

let teams = [];
let groups = {};

for (let i = 0; i < noOfTeams; i++) {
	teams.push(i);
}
// for (let i = 0; i < noOfTeams/noOfGroups; i++) {
// 	groups.push([]);
// }

for (let i = 0; i < noOfGroups; i++) {
	groups[i] = _.filter(teams, function(team){
		return (team%4 == i);
	})
}

let group_matches = {};

for (var _index = 0; _index < noOfGroups; _index++) {
	for (let i = 0; i < groups[_index].length; i++) {
		for (let j = i; j < groups[_index].length; j++) {
			if(i==j) continue;
			if(!group_matches[_index]) group_matches[_index] = [];
			group_matches[_index].push([groups[_index][i], groups[_index][j]]);
		}
	}
}

// console.log('teams', teams)
// console.log('groups', groups);
// console.log('group_matches', group_matches);

let _finalGroups = {};
let _assigned = 0;

while(_assigned<noOfGroups-1){
	_assigned = 0;

	for (var i = 0; i < noOfGroups; i++) {
		getGroupMatchList(i, _.cloneDeep(group_matches[i]));
	}
}

console.log('_finalGroups...');
console.log(_finalGroups);

function getGroupMatchList(_group_id, group_matches){

	let group_matches_list = [];

	let _iteration = 0;

	while(true){

		_iteration++;
		if(_iteration > 4000) {
			console.error('[HALTED] !!! timed out, ', _group_id);
			break;
		}

		let  rand_int = Math.floor(Math.random()*(group_matches.length));
		let _match = group_matches[rand_int];

		let _match_team_1 = _match[0];
		let _match_team_2 = _match[1];


		let _last_match_len = group_matches_list.length;

		// console.log('_iteration', _iteration, _match_team_1, _match_team_2)

		if(_iteration < 1000) {
			if(group_matches_list[_last_match_len-1]){
				if((group_matches_list[_last_match_len-1].indexOf(_match_team_2) != -1) || group_matches_list[_last_match_len-1].indexOf(_match_team_1) != -1){

					// console.log('--', group_matches_list[_last_match_len-1].indexOf(_match_team_2))
					// console.log('--', group_matches_list[_last_match_len-1].indexOf(_match_team_1))
					continue;
				}
			}
			if(group_matches_list[_last_match_len-2]){
				if((group_matches_list[_last_match_len-2].indexOf(_match_team_2) != -1) || group_matches_list[_last_match_len-2].indexOf(_match_team_1) != -1){

					// console.log('--', group_matches_list[_last_match_len-2].indexOf(_match_team_2))
					// console.log('--', group_matches_list[_last_match_len-2].indexOf(_match_team_1))
					continue;
				}
			}
			if(group_matches_list[_last_match_len-3]){
				if((group_matches_list[_last_match_len-3].indexOf(_match_team_2) != -1) || group_matches_list[_last_match_len-3].indexOf(_match_team_1) != -1){

					// console.log('--', group_matches_list[_last_match_len-2].indexOf(_match_team_2))
					// console.log('--', group_matches_list[_last_match_len-2].indexOf(_match_team_1))
					continue;
				}
			}
		} else if(_iteration < 1500) {
			if(group_matches_list[_last_match_len-1]){
				if((group_matches_list[_last_match_len-1].indexOf(_match_team_2) != -1) || group_matches_list[_last_match_len-1].indexOf(_match_team_1) != -1){

					// console.log('--', group_matches_list[_last_match_len-1].indexOf(_match_team_2))
					// console.log('--', group_matches_list[_last_match_len-1].indexOf(_match_team_1))
					continue;
				}
			}
			if(group_matches_list[_last_match_len-2]){
				if((group_matches_list[_last_match_len-2].indexOf(_match_team_2) != -1) || group_matches_list[_last_match_len-2].indexOf(_match_team_1) != -1){

					// console.log('--', group_matches_list[_last_match_len-2].indexOf(_match_team_2))
					// console.log('--', group_matches_list[_last_match_len-2].indexOf(_match_team_1))
					continue;
				}
			}
		} else {

			if(group_matches_list[_last_match_len-1]){
				if((group_matches_list[_last_match_len-1].indexOf(_match_team_2) != -1) || group_matches_list[_last_match_len-1].indexOf(_match_team_1) != -1){

					// console.log('--', group_matches_list[_last_match_len-1].indexOf(_match_team_2))
					// console.log('--', group_matches_list[_last_match_len-1].indexOf(_match_team_1))
					continue;
				}
			}
			
		}

		group_matches_list.push([_match_team_1, _match_team_2]);
		group_matches.splice(rand_int, 1)
		if(group_matches.length == 0) {
			_assigned++;
			_finalGroups[_group_id] = group_matches_list;
			break
		};
	}
}
