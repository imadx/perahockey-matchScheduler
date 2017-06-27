<!DOCTYPE html>
<?php
1+1;
?>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Match Scheduler - Pera 6s - by Ishan Madhusanka</title>
	<script src="js/vue.js"></script>
	<link rel="stylesheet" href="css/bootstrap.min.css">
	<link rel="stylesheet" href="css/font-awesome.min.css">
	<link rel="stylesheet" href="css/style.css">
	<script src="js/lodash.min.js"></script>
	<meta property="og:url"                content="https://perahockey.herokuapp.com/" />
	<meta property="og:type"               content="website" />
	<meta property="og:title"              content="Pera 6's - Match Scheduler - by Ishan Madhusanka" />
	<meta property="og:description"        content="A web application to prevent conflicts in match schedules, for group tournaments" />
	<meta property="og:image"              content="https://perahockey.herokuapp.com/img/promo.png" />
	<link rel="shortcut icon" href="/favicon.ico" type="image/x-icon">
	<link rel="icon" href="/favicon.ico" type="image/x-icon">
</head>
<body class="">
<div id="app">
<nav class="navbar navbar-toggleable-md navbar-light bg-primary">
  <!-- <button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation"> -->
  <!-- <span class="navbar-toggler-icon"></span> -->
<!-- </button> -->
  <a class="navbar-brand" href="https://github.com/imadx" target="_blank">
  	<img src="img/logo.png" alt="">
  	<span class="d-inline-flex flex-column ml-4">
	  	<h2 class="m-0">Match Scheduler</h2>
	  	<small class="text-muted m-0">by Ishan Madhusanka [ <i class="fa fa-github fa-inline"></i> github.com/imadx]</small>
  	</span>
	</a>

  <div class="collapse navbar-collapse" id="navbarColor01">
    <ul class="navbar-nav mr-auto">

    </ul>
  </div>
</nav>
<div class="container-fluid mt-5">
	<div id="playground" class="col">

		<h5 class="nav-header-link" @click="toggle_view_teams_all" style=""><i class="fa fa-users fa-inline"></i> Teams  
			<small class="text-muted small">{{teams.length}} teams</small>
			<span class="btn btn-primary float-right"><span>Toggle team names</span> <i class="fa fa-angle-down ml-3" style="font-size: 1em; line-height: 1" :class="{'fa-rotate-180': view_teams_all}"></i></span>
		</h5>
		<div class="clearfix mb-4"></div>
		<div class="row heading-controls">
			<span class="col">
					<label class="form-control" >Number of Teams
						<input class="mt-2 form-control" type="number" placeholder="0" v-model="new_numberOfTeams">
					</label>
			</span>
			<span class="col">
					<label class="form-control" >Number of Groups
						<input class="mt-2 form-control" type="number" placeholder="0" v-model="new_numberOfGroups">
					</label>
			</span>

<!-- 			<div class="col">
				<label for="" class="form-control">Add New Team
					<span class="form-inline">
						<input class="mt-2 form-control mr-auto" type="text" placeholder="New Team" v-model="new_teamName">
						<input class="btn btn-primary d-sm-block mt-sm-1" @click="addNewTeam" value="Add">
					</span>
				</label>
			</div>	 -->

		</div>
		<div class="expandable" :class="{'hidden': !view_teams_all}">




			<div class="row mt-2">
				<div class="col">
					<table class="table">
						<tr>
							<th>ID</th>
							<th>Team Name</th>
						</tr>
						<tr v-for="(team, id) in teams" v-if="id%2==0">
							<td>{{id}}</td>
							<td><input type="text" class="form-control" v-model="teams[id]"></td>
						</tr>
					</table>
				</div>
				<div class="col">
					<table class="table">
						<tr>
							<th>ID</th>
							<th>Team Name</th>
						</tr>
						<tr v-for="(team, id) in teams" v-if="id%2==1">
							<td>{{id}}</td>
							<td><input type="text" class="form-control" v-model="teams[id]"></td>
						</tr>
					</table>
				</div>
			</div>
		</div>

		<hr>
		<h5 class="mb-1">
			<i class="fa fa-clock-o fa-inline"></i> Schedules
			<template v-if="things_changed && !generatingSchedule">
				<span class="badge badge-info float-right">Teams changed, schedule again! <button class="btn btn-primary my-2 my-sm-0" @click="generateSchedule">Generate Schedule &nbsp;<i class="fa fa-refresh fa-inline"></i></button></span>
			</template>
			<template v-else v-show="!generatingSchedule">
				<span class="badge badge-danger float-right" v-if="_.keys(scheduled_groups).length != new_numberOfGroups">Some groups are missing, try again! <button class="btn btn-warning my-2 my-sm-0" @click="generateSchedule">Generate Schedule &nbsp;<i class="fa fa-refresh fa-inline"></i></button></span>
				<span class="badge badge-danger float-right" v-if="may_contain_invalid_cases">Some matches are conflicting, try again! <button class="btn btn-warning my-2 my-sm-0" @click="generateSchedule">Generate Schedule &nbsp;<i class="fa fa-refresh fa-inline"></i></button></span>
				<template v-else>
					<button class="btn btn-primary my-2 my-sm-0 float-right ml-1" @click="downloadSchedule">Download Schedule &nbsp;<i class="fa fa-download fa-inline"></i></button>
					<button class="btn btn-primary my-2 my-sm-0 float-right" @click="generateSchedule">Generate Schedule &nbsp;<i class="fa fa-refresh fa-inline"></i></button>
					
				</template>
				
			</template>
		</h5>
		<div class="clearfix"></div>
		
		<div class="mb-5">
			<div class="row mt-2">
				<div :class="{'col-md-4': (new_numberOfGroups%3==0), 'col-md-6': (new_numberOfGroups%2==0)}" v-for="(group, _group_id, _index) in scheduled_groups">
					<div class="m-2 card">
						<div class="card-header">
							<h5 class="mt-2">Group {{+_group_id+1}}
								<button class="btn btn-primary my-2 my-sm-0 float-right" @click="getGroupMatchList(_group_id, _.cloneDeep(group));"> Re-order &nbsp; <i class="fa fa-exchange fa-inline"></i></button>
							</h5>
						</div>
						<div class="card-block">
							<table class="table table-striped text-center">
								<tr>
									<th class="text-center">Team 1</th>
									<th></th>
									<th class="text-center">Team 1</th>
								</tr>
								<tr v-for="match in group" >
									<td>{{teams[match[0]]}}</td>
									<td>vs.</td>
									<td>{{teams[match[1]]}}</td>
								</tr>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>


	</div>
</div>
</div>


<script src="js/main.js"></script>
<div class="footer">
	<small>copyright &copy; Ishan Madhusanka. 2017</small>
</div>
</body>
</html>