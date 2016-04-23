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
		});
		$locationProvider.html5Mode(true);
});

app.run(function($rootScope, Auth){
	Auth.$onAuth(function(authData){
		try{
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
