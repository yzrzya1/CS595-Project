
var contactApp = angular.module('contact',['ui.router'])
	.config(function config($stateProvider){
		$stateProvider.state('contact',{
			url: '/contact',
			templateUrl: 'contact.html',
			controller: 'contactCtrl'
		});
	})
	.controller('contactCtrl',function($scope,$http){
		





	});