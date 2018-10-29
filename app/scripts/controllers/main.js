'use strict';

webApp.controller('main', ['$rootScope', '$scope', '$state', function($rootScope, $scope, $state) {
	/*
	 * 作用域变量定义区
	 */
	$scope.initModel = function() {
		$scope.now = null;
		$scope._date = '';
		$scope._time = '';
	}
	/*
	 * 方法声明区
	 */
	$scope.initFns = function() {
		
		$scope.getDateTime = function(){
			var now = new Date();
			var addZero = function(num) {
				if(num < 10) {
					num = '0' + num;
				}
				return num;
			};
			$scope.now = now;
			$scope._date = now.getFullYear() + '-' + addZero(now.getMonth() + 1) + '-' + addZero(now.getDate())
			$scope._time = addZero(now.getHours()) + ':' + addZero(now.getMinutes()) + ':' + addZero(now.getSeconds());
		}
	}
	/*
	 * 执行入口
	 */
	$scope.initPage = (function() {
		$scope.initModel();
		$scope.initFns();
		
		$scope.getDateTime();
		
		$scope.timeInterval = setInterval(function(){
			$scope.getDateTime();
			$scope.$apply();
		}, 1000);
		
		$scope.$on('$destroy', function(){
			clearInterval($scope.timeInterval);
			$scope.timeInterval = null;
		})
	})()
}]);