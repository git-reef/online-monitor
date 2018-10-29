'use strict';

webApp.controller('login', ['$rootScope', '$scope', '$http', '$state', function($rootScope, $scope, $http, $state) {

	$scope.initModel = function() {
		
		$scope.imgUrlList = [
			'../images/login/1.png',
			'../images/login/2.png',
			'../images/login/3.png',
			'../images/login/4.png',
			'../images/login/5.png',
			'../images/login/6.png',
			'../images/login/7.png',
			'../images/login/8.png',
			'../images/login/9.png',
			'../images/login/10.png',
			'../images/login/11.png',
			'../images/login/12.png',
			'../images/login/13.png',
			'../images/login/14.png',
			'../images/login/15.png',
			'../images/login/16.png',
			'../images/login/17.png',
			'../images/login/18.png',
			'../images/login/19.png',
			'../images/login/20.png',
			'../images/login/21.png',
			'../images/login/22.png',
			'../images/login/23.png',
			'../images/login/24.png',
			'../images/login/25.png',
			'../images/login/26.png',
			'../images/login/27.png',
			'../images/login/28.png',
			'../images/login/29.png',
			'../images/login/30.png',
			'../images/login/31.png',
			'../images/login/32.png',
			'../images/login/33.png',
			'../images/login/34.png',
			'../images/login/35.png',
			'../images/login/36.png',
			'../images/login/37.png',
			'../images/login/38.png',
			'../images/login/39.png',
			'../images/login/40.png',
			'../images/login/41.png',
			'../images/login/42.png',
			'../images/login/43.png'
		];
		$scope.isAscending = false; //图片切换的顺序：true-升序，数字由小到大，反之，同理;从0开始，由降序变升序
		$scope.imgIndex = 0;
		
		$scope.MN = '';
	}

	$scope.initFns = function() {
		$scope.loginIn = function(evt){
			if(!evt || (evt && evt.keyCode == 13)){
				if($scope.MN){
					$scope.openWindow('main.overView');
				}else{
					alert('请随便输入mn号')
				}
			}
		}
		
		$scope.changeImageStyle = function(){
			var imgBox = document.getElementsByClassName('img-wrapper');
			if(!imgBox[$scope.imgIndex]){
				return false;
			}
			imgBox[$scope.imgIndex].style.opacity = 0;
			if($scope.imgIndex == 0 || $scope.imgIndex == imgBox.length - 1){
				$scope.isAscending = !$scope.isAscending;
			}
			if($scope.isAscending){
				$scope.imgIndex += 1;
			}else{
				$scope.imgIndex -= 1;
			}
			/*//打印图片序号
			var num = imgBox[$scope.imgIndex].style.background.slice(imgBox[$scope.imgIndex].style.background.lastIndexOf('/')+1,imgBox[$scope.imgIndex].style.background.lastIndexOf('.png'));
			console.log(num)*/
			imgBox[$scope.imgIndex].style.opacity = 1;
			$scope.$apply();
		}
		
	}

	$scope.initPage = (function() {
		$scope.initModel();
		$scope.initFns();
		
		var timeout = setTimeout(function(){
			$scope.imgPoll = setInterval(function(){
				$scope.changeImageStyle();
			}, 300);
			clearTimeout(timeout);
		}, 2000)
		
		$scope.$on("$destroy", function() {
            if($scope.imgPoll){
            	clearInterval($scope.imgPoll);
            	$scope.imgPoll = null;
            }
        })
		
	})();

}])