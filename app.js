var app = angular.module('appMain', ["firebase", "ngRoute"]);

app.config(function($routeProvider, $locationProvider){
	$routeProvider
		.when('/', {
			templateUrl: 'pages/login.html',
			controller: 'AuthController'
		})
		.when('/login', {
			templateUrl: 'pages/login.html',
			controller: 'AuthController'
		})
		.when('/home', {
			templateUrl: 'pages/home.html'
		})
		.when('/calendar', {
			templateUrl: 'pages/calendar.html',
			controller: 'CalendarController'
		})
		.when('/details', {
			templateUrl: 'pages/details.html',
			controller: 'DetailsController'
		})
		.when('/settings', {
			templateUrl: 'pages/settings.html',
			controller: 'SettingsController'
		})
		.when('/call-a-nurse', {
			templateUrl: 'pages/nurse.html',
			controller: 'NurseController'
		})
		.when('/survey', {
			templateUrl: 'pages/survey.html',
			controller: 'SurveyController'
		});
		$locationProvider.html5Mode(true);
});

app.run(function($rootScope, Auth){
	Auth.$onAuth(function(authData){
		try{
			$rootScope.menuleft = false;
			$rootScope.uid = authData.uid;
			$scope.user = authData.uid;
			if(authData.facebook)
				$rootScope.name = authData.facebook.displayName;
			else
				$rootScope.name = authData.google.displayName;
		} catch(err) {
			$rootScope.uid = 0;
		}
	});
	$rootScope.logout = function(){
		Auth.$unauth();
	}
})

app.factory('Auth', function($firebaseAuth){
	var ref = new Firebase('https://idoctor.firebaseio.com/');
	return $firebaseAuth(ref);
})

app.controller('AuthController', function($scope, $rootScope, Auth){
	$scope.auth = Auth;
	$scope.user = 0;
	$scope.auth.$onAuth(function(authData){
		console.log(authData);
		try{
			$rootScope.uid = authData.uid;
			$scope.user = authData.uid;
			if(authData.facebook)
				$rootScope.name = authData.facebook.displayName;
			else
				$rootScope.name = authData.google.displayName;
		} catch(err) {
			$rootScope.uid = 0;
			$scope.user = 0;
		}
	});
	$scope.signIn = function(){
		$scope.auth.$authWithPassword({
			email: $scope.email,
			password: $scope.password
		}).then(function(userData){
			$scope.message = "Logged In!";
		}).catch(function(err){
			$scope.message = err;
		});
		$scope.message = "";
		$scope.auth.$createUser({
			email: $scope.email, 
			password: $scope.password
		}).then(function(userData){
			$scope.message = "Account Created!";
			$scope.signIn();
		}).catch(function(err){
			$scope.message = err;
		});
	}
	$scope.signInGoogle = function(){
		$scope.auth.$authWithOAuthPopup("google").then(function(authData) {
			console.log("Logged in as:", authData.uid);
		}).catch(function(error) {
			console.log("Authentication failed:", error);
		});
	}
	$scope.signInFB = function(){
		$scope.auth.$authWithOAuthPopup("facebook").then(function(authData) {
			console.log("Logged in as:", authData.uid);
		}).catch(function(error) {
			console.log("Authentication failed:", error);
		});
	}
	$scope.logout = function(){
		$scope.auth.$unauth();
		$scope.message = "Logged Out!"
		$scope.user = 0;
	}
	$scope.signInDoctor = function(){
		$scope.doctorsignup = true;
	}
});

app.controller('NurseController', function($scope, $rootScope){
	$scope.callNurse = function(){
		console.log("call a nurse");
		$scope.nurse = true;
	}
	$scope.cancelCallNurse = function(){
		console.log("call cancelled");
		$scope.nurse = false;
	}
});

app.controller('SurveyController', function($scope, $rootScope){
	$scope.p1 = true;
	$scope.p2 = false;
	$scope.p3 = false;
	$scope.p4 = false;
	$scope.message1 = "I feel...";
	$scope.message2 = "No pain";
	$scope.message3 = "No pain";
	$scope.p1d = false;
	$scope.feeling = function(i){
		switch(i){
			case 1:
				$scope.message1 = "I feel great!";
				break;
			case 2:
				$scope.message1 = "I feel good";
				break;
			case 3:
				$scope.message1 = "I feel ok";
				break;
			case 4:
				$scope.message1 = "I feel bad";
				break;
			case 5:
				$scope.message1 = "I feel awful";
				break;
		}
		for(var j = 1; j < 6; j++){
			var clicked = document.getElementById("f"+j);
			clicked.style.backgroundColor = "transparent";
		}
		var clicked = document.getElementById("f"+i);
		clicked.style.backgroundColor = "#DF5555";
		$scope.p1d = true;
	}
	$scope.pain = function(i){
		switch(i){
			case 1:
				$scope.message2 = "Head!";
				break;
			case 2:
				$scope.message2 = "Upper Body!";
				break;
			case 3:
				$scope.message2 = "Arms or Legs!";
				break;
		}
		for(var j = 1; j < 4; j++){
			var clicked = document.getElementById("p"+j);
			clicked.style.backgroundColor = "transparent";
		}
		var clicked = document.getElementById("p"+i);
		clicked.style.backgroundColor = "#DF5555";
	}
	$scope.level = function(){
		var range = document.getElementById("lop");
		$scope.painrange = range.value;
		if($scope.painrange < 25)
			$scope.message3 = "Bearable";
		else if($scope.painrange < 50)
			$scope.message3 = "Moderate";
		else if($scope.painrange < 75)
			$scope.message3 = "Severe";
		else if($scope.painrange < 101)
			$scope.message3 = "Unbearable";
	}
	$scope.show = function(i){
		$scope.p1 = false;
		$scope.p2 = false;
		$scope.p3 = false;
		$scope.p4 = false;
		$scope.p5 = false;
		switch(i){
			case 1:
				$scope.p1 = true;
				break;
			case 2:
				$scope.p2 = true;
				break;
			case 3:
				$scope.p3 = true;
				break;
			case 4:
				$scope.p4 = true;
				break;
			case 5:
				$scope.p5 = true;
				break
		}
	}
});


app.controller('DetailsController', function($scope, $rootScope){

});

app.controller('SettingsController', function($scope, $rootScope, $firebaseObject, $firebaseArray){
	var ref = new Firebase('https://walletrak.firebaseio.com/');
    var userRef = ref.child($rootScope.uid);
    var userObject = $firebaseObject(userRef);
    var settingsRef = userRef.child('settings');
    $scope.settings = $firebaseObject(settingsRef);
 
    $scope.saveSettings = function(){
        $scope.settings.$save();
        alert("Settings Saved!");
    }
});

app.controller('CalendarController', function($scope, $rootScope){
	$('#calendar').fullCalendar({
		dayClick: function() {
        	alert('Sorry! We are full that day');
    	},
    	height: "auto"
	});

});