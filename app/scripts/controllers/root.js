'use strict';

webApp.controller('root', ['$rootScope', '$scope', '$http', '$state', function($rootScope, $scope, $http, $state) {

	/*
	 * 公共方法，接收页面参数
	 * @return 参数列表，KeyValue
	 */
	$scope.pageParams = function() {
		//console.log('pageParams=' + JSON.stringify($stateParams));
		return $stateParams;
	};
	/*
	 * 公共方法，打开一个页面
	 * @param stateName 页面的状态名
	 * @param keyValueParam 参数列表，KeyValue，可选
	 */
	$scope.openWindow = function(stateName, keyValueParam) {
		if(stateName.indexOf('http://') == -1 && stateName.indexOf('https://') == -1) {
			keyValueParam = keyValueParam || {};
			//console.log('openWindow: state=' + stateName + ', params=' + JSON.stringify(keyValueParam));
			$state.go(stateName, keyValueParam);
		} else {
			window.open(stateName, '_blank');
		}
	}

	$scope.isBigScreen = screen.width < 1600 ? false : true;

	// 初始化 ws 对象
	//	if (location.search == '?ws') {
	//  	var ws = new WebSocket('ws://192.168.0.20:8868/ws');
	//	} else {
	//	    var ws = new SockJS('http://192.168.0.20:8868/stomp');
	//	}
	//	// 获得Stomp client对象
	//	var client = Stomp.over(ws);
	//	
	//	// SockJS does not support heart-beat: disable heart-beats
	//	client.heartbeat.outgoing = 0;
	//	client.heartbeat.incoming = 0;
	//	
	//	// 定义连接成功回调函数
	//	var on_connect = function(x) {
	//	    //data.body是接收到的数据
	//	    client.subscribe("MQ_TEST_ONE_QUEUE", function(data) {
	//	        var msg = data.body;
	//	        console.log('==========================收到数据：==================================');
	//	        console.log(msg);
	//	        console.log('=====================================================================');
	//	    });
	//	};
	//	
	//	// 定义错误时回调函数
	//	var on_error =  function() {
	//	    console.log('error');
	//	};
	//	
	//	// 连接RabbitMQ
	//	client.connect('web', 'x1016wm', on_connect, on_error, '/');
	//	console.log(">>>连接上http://localhost:15674");

	//根据当前页码改变分页显示
	$scope.getPageNumsBySelected = function(selPage, pageNums, totalCount) {
		selPage = Number(selPage);
		switch(true) {
			case selPage < pageNums[0] || selPage > pageNums[pageNums.length - 1]:
				var tempArr = [];
				if(selPage + 5 > totalCount) {
					for(var i = 5, len = 6; i >= 0; i--) {
						tempArr.push(totalCount - i);
					}
				} else {
					for(var i = 0, len = 6; i < len; i++) {
						tempArr.push(selPage + i);
					}
				}
				pageNums = tempArr;
				break;
			case pageNums[0] == selPage:
				var tempArr = [],
					add = Math.min(pageNums[0] - 1, 6);

				if(add < 6) {
					for(var i = 0; i < 6; i++) {
						i + 1 <= totalCount && tempArr.push(i + 1);
					}
				} else {
					angular.forEach(pageNums, function(num, index) {
						tempArr.push(num - add + 2);
					});
				}
				pageNums = tempArr;
				break;
			case pageNums[pageNums.length - 1] == selPage:
				var tempArr = [],
					add = Math.min(totalCount - pageNums[pageNums.length - 1], 6);

				if(add < 6) {
					for(var i = 5; i >= 0; i--) {
						totalCount - i > 0 && tempArr.push(totalCount - i);
					}
				} else {
					angular.forEach(pageNums, function(num, index) {
						tempArr.push(num + add - 2);
					});
				}
				pageNums = tempArr;
				break;
			default:
				break;
		}
		return pageNums;
	}
}])