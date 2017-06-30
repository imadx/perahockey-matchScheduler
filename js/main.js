var app = new Vue({
	el: '#app',
	data: {
		teams: [],
		new_teamName: '',
		new_numberOfTeams: 36,
		new_numberOfGroups: 6,
		new_numberOfCourts: 3,

		scheduled_groups: {},
		scheduled_courts: {},
		_assigned: 0,
		_finalGroups: 0,
		view_teams_all: false,
		things_changed: false,

		generatingSchedule: false,
		may_contain_invalid_cases: false,
		manualCheckIsRunning: false,

		selectedGroups: [],

		time_startTime: '09:00',
		time_lunchStart: '12:00',
		time_matchDuration: 10,
		time_matchInterval: 5,
		time_lunchDuration: 30,
	},
	methods: {
		toggleSelectedGroup: function(team){
			let _selected_groups = this.selectedGroups;

			let _selected_index = _selected_groups.indexOf(team);

			if(_selected_index<0){
				_selected_groups.push(team);
			} else {
				this.selectedGroups.splice(_selected_index, 1);
			}
		},
		reorderScheduledCourtsUp: function(_idx){

			let vm = this;
			let _scheduled_courts =vm.scheduled_courts;


			if(_idx==0) return;

			_.forEach(_scheduled_courts, function(_court, i){
				if(_.isUndefined(_court)){
					return;
				} else {

					// console.log(_court[_idx], _court[_idx-1]);
					let _x = _court[_idx];
					_x.group = _court[_idx].group;

					let _y = _court[_idx-1];
					_x.group = _court[_idx-1].group;

					_court[_idx] = _y;
					_court[_idx-1] = _x;
					// console.log(_court[_idx], _court[_idx-1]);

					Vue.set(vm.scheduled_courts[i], _idx, _court[_idx])
					Vue.set(vm.scheduled_courts[i], _idx-1, _court[_idx-1])
				}
			})


		},
		reorderScheduledCourtsDown: function(_idx){

			let vm = this;
			let _scheduled_courts =vm.scheduled_courts;

			let _last = _.size(_scheduled_courts);

			if(_idx==_last-1) return;

			_.forEach(_scheduled_courts, function(_court, i){
				if(_.isUndefined(_court)){
					return;
				}
				if(_.isUndefined(_court[_idx+1])){
					return;
				} else {

					// console.log(_court[_idx], _court[_idx+1]);
					let _x = _court[_idx];
					_x.group = _court[_idx].group;

					let _y = _court[_idx+1];
					_x.group = _court[_idx+1].group;

					_court[_idx] = _y;
					_court[_idx+1] = _x;
					// console.log(_court[_idx], _court[_idx+1]);

					Vue.set(vm.scheduled_courts[i], _idx, _court[_idx])
					Vue.set(vm.scheduled_courts[i], _idx+1, _court[_idx+1])
				}
			})
		},
		manualCheck: function(){
			this.manualCheckIsRunning = !this.manualCheckIsRunning;

			let vm = this;
			let _final_id = _.size(vm.teams)-1;

			_.forEach(vm.teams, function(_team, i){
				_.delay(function(_da_team, last) {
					console.log('_da_team',_da_team)
					if(vm.manualCheckIsRunning){
						vm.selectedGroups = [_da_team];
					} else {
						return false;
					}
					if(last){
						vm.manualCheckIsRunning = false;
					}
				}, 300*i, i,(_final_id == i));
			})
		},
		isInSelectedGroup: function(team){
			return (this.selectedGroups.indexOf(team)>=0);
		},
		addNewTeam: function(){
			if(this.new_teamName){
				this.teams.push(this.new_teamName);
			}
		},
		getIdleTeams: function(court){

			let _count = 0;
			let teams = this.teams;

			_.forEach(court, function(_match){
				if ((teams[_match[0]] == '--') || (teams[_match[1]] == '--')){
					_count++;
				}
			})

			return _count;
		},
		checkIfIdle: function(_match){
			let vm = this;
			let teams = vm.teams;

			if(teams[_match[0]] == '--' || teams[_match[1]] == '--' ){
				return true;
			} else {
				return false;
			}
		},
		getMatchesCount: function(court){
			return _.size(court)
		},
		initTeams: function(count){

			let _teams = [];
			for (var i = 0; i < count; i++) {
				_teams.push('Team ' + i);
			}
			// _teams = ['PERA (MAROON)', 'RAJ B', 'COL', 'KEL A', 'MORA B', 'PERA (GOLD)', 'SAB A', 'RUH B', 'WAY A', 'KEL B', 'SJP A', 'SAB B', 'WAY B', 'UWA A', 'MORA A', 'PERA (BLUE)', 'RAJ A', 'SJP B', 'RUH A', 'UWA B', 'PERA A (GIRLS)', 'SAB A (GIRLS)', 'WAY B (GIRLS)', 'MORA B (GIRLS)', '--', 'SAB B (GIRLS)', 'KEL (GIRLS)', 'RAJ A (GIRLS)', '--', '--', 'SJP A (GIRLS)', 'WAY A (GIRLS)', 'RAJ B (GIRLS)', 'UWA (GIRLS)', '--', 'PERA B (GIRLS)', 'MORA A (GIRLS)', 'SJP B (GIRLS)', 'RUH (GIRLS)', '--']
			_teams = ['MEN-A1', 'MEN-A2', 'MEN-A3', 'MEN-A4', 'MEN-A5', 'MEN-A6', 'MEN-B7', 'MEN-B8', 'MEN-B9', 'MEN-B10', 'MEN-B11', 'MEN-B12', 'MEN-C13', 'MEN-C14', 'MEN-C15', 'MEN-C16', 'MEN-C17', 'MEN-C18', 'MEN-D19', 'MEN-D20', 'MEN-D21', 'MEN-D22', 'MEN-D23', 'MEN-D24', 'WOMEN-A1', 'WOMEN-A2', 'WOMEN-A3', 'WOMEN-A4', '--', '--', 'WOMEN-B5', 'WOMEN-B6', 'WOMEN-B7', 'WOMEN-B8', '--', '--']
			this.teams =  _teams;
		},
		recreateTeams: function(){
			this.initTeams(this.new_numberOfTeams);
		},
		toggle_view_teams_all: function(){
			this.view_teams_all = !this.view_teams_all;
		},
		generateSchedule: function(){
			this.generatingSchedule = true;
			this.may_contain_invalid_cases = false;

			console.log('[generateSchedule]')

			let teams = [];
			let noOfTeams = this.teams.length;
			let noOfGroups = this.new_numberOfGroups;

			let groups = {};

			for (let i = 0; i < noOfTeams; i++) {
				teams.push(i);
			}

			for (let i = 0; i < noOfGroups; i++) {
				groups[i] = _.filter(teams, function(team){
					return team < ((noOfTeams/noOfGroups)*(i + 1)) && team >= ((noOfTeams/noOfGroups)*(i));
				})
			}

			console.log('groups',groups);

			let group_matches = {};


			for (var _index = 0; _index < noOfGroups; _index++) {
				console.log(groups[_index])
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
			console.log('group_matches', group_matches);

			this._finalGroups = {};
			this._assigned = 0;

			let _test_iterations = 0;
			while(this._assigned<noOfGroups-1){
				this._assigned = 0;

				for (var i = 0; i < noOfGroups; i++) {
					this.getGroupMatchList(i, _.cloneDeep(group_matches[i]));
				}


				_test_iterations++;
				if(_test_iterations>10){
					break;
				}
			}

			this.scheduled_groups = this._finalGroups;
			console.log('this._finalGroups...');
			console.log(this._finalGroups);

			this.things_changed = false;
			this.generatingSchedule = false;
		},
		getGroupMatchList: function(_group_id, group_matches, aloneCall){

			if(aloneCall && aloneCall == true){
				this._finalGroups = this.scheduled_groups;
			}

			let group_matches_list = [];

			let _iteration = 0;

			while(true){

				_iteration++;
				if(_iteration > 4000) {
					// console.error('[HALTED] !!! timed out, ', _group_id);
					break;
				}

				let  rand_int = Math.floor(Math.random()*(group_matches.length));
				let _match = group_matches[rand_int];

				let _match_team_1 = _match[0];
				let _match_team_2 = _match[1];


				let _last_match_len = group_matches_list.length;

				// console.log('_iteration', _iteration, _match_team_1, _match_team_2)

				if(_iteration < 2000) {
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
				} else if(_iteration < 2500) {
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
				} else if(_iteration < 3000) {

					if(group_matches_list[_last_match_len-1]){
						if((group_matches_list[_last_match_len-1].indexOf(_match_team_2) != -1) || group_matches_list[_last_match_len-1].indexOf(_match_team_1) != -1){

							// console.log('--', group_matches_list[_last_match_len-1].indexOf(_match_team_2))
							// console.log('--', group_matches_list[_last_match_len-1].indexOf(_match_team_1))
							continue;
						}
					}
					
				} else {
					this.may_contain_invalid_cases = true;
				}

				group_matches_list.push([_match_team_1, _match_team_2]);
				group_matches.splice(rand_int, 1)
				if(group_matches.length == 0) {
					this._assigned++;
					this._finalGroups[_group_id] = group_matches_list;
					break
				};

				if(aloneCall && aloneCall == true){
					this.scheduled_groups = this._finalGroups;
					this.getAllocatedCourtsForMatches()
				}
			}
		},
		downloadSchedule: function(){
			let pom = document.createElement('a');
			let csvContent= this.getData();
			let blob = new Blob([csvContent],{type: 'text/csv;charset=utf-8;'});
			let url = URL.createObjectURL(blob);

			let _d = new Date();
			pom.href = url;

			pom.setAttribute('download', 'Teams ' + _d.toLocaleString() + '.csv');
			pom.click();
		},
		getData: function(){
			let vm = this;
			let output = '';
			let teams = vm.teams;

			output += 'Groups\n'
			_.forEach(vm.scheduled_groups, function(_groups, _group_id){
				output += 'Group ' + (+_group_id + 1) + '\n';
				output += 'court,Team 1, , Team 2\n';

				_.forEach(_groups, function(_match, idx){
					output +=  'Court ' + (_match.court+1) + ',' + teams[_match[0]] + ',vs.,' + teams[_match[1]] + '\n';
				})

				output += '\n'
			})

			output += 'Time Schedule\n';
			_.forEach(vm.scheduled_courts, function(_court, _court_id){
				output += 'Court ' + (+_court_id + 1) + '\n';
				output += 'Time,Team 1, , Team 2,Group\n';

				_.forEach(_court, function(_match, idx){
					output += vm.moment(idx) + ',' + teams[_match[0]] + ',vs.,' + teams[_match[1]] + ',' + (_match.group + 1) + '\n';
				})

				output += '\n'
			})

			return output;
		},
		getAllocatedCourtsForMatches: function(){
			let vm = this;

			let _finalCourts = {};

			for (var i = 0; i < vm.new_numberOfCourts; i++) {
				_finalCourts[i] = [];
			}

			let _court_id = 0;

			let _scheduled_groups = _.cloneDeep(vm.scheduled_groups);

			let _indices = [];

			let _num_matches = 0;
			let _num_groups = vm.new_numberOfGroups;

			_.forEach(_scheduled_groups, function(_group,_idx){
				_num_matches += _.size(_group);
				_indices[_idx] = 0;
			})

			let _curr_group = 0;
			let _curr_court = 0;


			let teams = vm.teams;

			for (var i = 0; i < _num_matches; i++) {

				let __match = _.flatten(_scheduled_groups[_curr_group].splice(0,1));
				__match.group = _curr_group;


				if(!(teams[__match[0]]=='--' || teams[__match[1]].name=='--')){
					_finalCourts[_curr_court].push(__match);
				}
				vm.scheduled_groups[_curr_group][_indices[_curr_group]].court = _curr_court;
				_indices[_curr_group]++;

				_curr_group++;
				_curr_court++;


				if(_curr_court >= vm.new_numberOfCourts) _curr_court = 0;
				if(_curr_group >= vm.new_numberOfGroups) _curr_group = 0;

			}


			console.log('[_num_matches]', _num_matches);
			console.log('[_scheduled_groups]', _scheduled_groups);
			console.log('[_finalCourts]', _finalCourts);

			vm.scheduled_courts = _finalCourts;
			
		},
		fixIdleMatches: function(){
			let vm = this;
			let _courts = vm.scheduled_courts;
			let teams = vm.teams;

			_.forEach(_courts, function(_court, i){
				_.remove(_court, function(_match){
					return (teams[_match[0]]=='--') || (teams[_match[1]]=='--');
				})
				_courts[i] = _court;
			})

			Vue.set(vm.scheduled_courts, _courts)
		},
		reorderScheduledCourtsParallel: function(_idx){
			let _matches = [];
			let _matches_groups = [];
			let vm = this;


			let _shuffleOrder = [];

			console.log('scheduled_courts',vm.scheduled_courts);

			_.forEach(vm.scheduled_courts, function(_court_matches, i){
				if(_.isUndefined(_court_matches)){
					return;
				}
				_shuffleOrder.push(i);
				_matches.push(_court_matches[_idx]);
				_matches_groups.push(_court_matches[_idx].group);
			})

			let _not_shuffledMatches = _.cloneDeep(_matches);
			_shuffleOrder = _.shuffle(_shuffleOrder);

			_.forEach(_shuffleOrder, function(i){
				_not_shuffledMatches[_shuffleOrder[i]].group = _matches_groups[_shuffleOrder[i]];
				Vue.set(vm.scheduled_courts[i], _idx, _not_shuffledMatches[_shuffleOrder[i]]);
			});

		},
		moment: function (index) {
			let vm = this;

			let _time = moment(vm.time_startTime, 'HH:mm');
			_time = _time.add(index*((+vm.time_matchDuration) + (+vm.time_matchInterval)), 'm');

			let _lunch = moment(vm.time_lunchStart, 'HH:mm');
			if(_time.isSameOrAfter(_lunch)){
				_time = _time.add((+vm.time_lunchDuration), 'm');

			};


			return moment(_time, 'HH:mm').format('HH:mm') + '-' + moment(_time.add(+vm.time_matchDuration,'m'), 'HH:mm').format('HH:mm');
		},


	},
	watch:{
		new_numberOfTeams: _.debounce(function(_count){

			_count = +_count;

			if(_count%this.new_numberOfGroups){
				let vm = this;
				vm.new_numberOfTeams = vm.new_numberOfGroups *Math.floor(_count/vm.new_numberOfGroups) + (+vm.new_numberOfGroups);
				return;
			}

			if(_count < 2*this.new_numberOfGroups){
				this.new_numberOfTeams = 2*this.new_numberOfGroups;
				return;
			}
			this.recreateTeams();

			this.things_changed = true;
			// this.generateSchedule()
		}, 1000),
		new_numberOfGroups: function(_new_numberOfGroups){
			_new_numberOfGroups = +_new_numberOfGroups;

			if(this.new_numberOfTeams%_new_numberOfGroups){
				this.new_numberOfTeams = _new_numberOfGroups *Math.floor(this.new_numberOfTeams/_new_numberOfGroups) + (+_new_numberOfGroups);
			} else if(this.new_numberOfTeams < _new_numberOfGroups*2) {
				this.new_numberOfTeams = _new_numberOfGroups*2;
			}

			this.things_changed = true;	
			// this.generateSchedule()
		},
		scheduled_groups: function(){
			this.getAllocatedCourtsForMatches();
		},
	},
	mounted: function(){

		this.initTeams(this.new_numberOfTeams);
		this.generateSchedule()
	}
})
