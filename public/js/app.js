//	var loginApp = angular.module('loginApp',[]);



var routerApp = angular.module('routerApp',
	['ui.router','dashboard','hcc','trends','meeting']);

	routerApp.filter('slice', function() {
	  return function(arr, start, end) {
	    return arr.slice(start, end);
	  };
	});

routerApp.config(
	
	function($stateProvider,$urlRouterProvider){

	//$urlRouterProvider.otherwise('/dashboard');

	$stateProvider
        .state('table-data', {
            url: '/table-data',
            templateUrl: 'table-data.html'
        })
	
        .state('socketio', {
            url: '/socketio',
            templateUrl: 'socketio.html'
        })





		.state('its',{
			url: '/its',
			templateUrl: 'its.html',
			controller: function($scope,$http){
				$scope.message='ng-work';

				$scope.its = [];
			  	for (var i = 0; i < 5; i++) $scope.its.push(i);
				$http.get('/api/its')
					.success(function(data){
						$scope.its=data;
					})
					.error(function(data){
						console.log('Error:' + data);
					});
						}
					})


		.state('its.list', {
            url: '/list',
            templateUrl: 'its-list.html',
            controller: function($scope) {
                $scope.dogs = ['Bernese', 'Husky', 'Goldendoodle'];
            }
        })
        .state('its.paragraph', {
            url: '/paragraph',
            template: 'I could sure use a drink right now.'
        });
});


/*
function loginController($scope,$http){
	$scope.formData = {};
	var inUname='',
		inUpsd='';
	$scope.message='ng-work'
	

	$scope.auth = function(){
		console.log('call login btn');
		$scope.formData.uname=$("#uname").val();
		$scope.formData.upsd=$("#upsd").val();

		//$scope.message=$scope.formData;

		$http({
		    method: 'POST',
		    url: '/login',
		    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
		    transformRequest: function(obj) {
		        var str = [];
		        for(var p in obj)
		        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
		        return str.join("&");
		    },
		    data: {username: $scope.formData.uname, password: $scope.formData.upsd}
		}).success(function (data) {
			console.log(data);
		});


	}};
};
*/