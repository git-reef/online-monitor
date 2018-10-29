'use strict';

webApp.controller('overView', ['$rootScope', '$scope', '$http', '$state', function ($rootScope, $scope, $http, $state) {

	$scope.initModel = function () {
		$scope.ulEl = null;//滑块的父级元素
		$scope.currentIndex = 0; //当前显示的滑块,依下标计算
		
		$scope.lineChart = null;
		$scope.chartCache = null;
		
		$scope.lastTime = '';
	}

	$scope.initFns = function () {
		
		/*------------------轮播---------------------*/
		
		$scope.clickWitch = function(index) {
			$scope.ulEl.style.marginLeft = -(index * window.innerWidth) + 'px';
			$scope.currentIndex = index;
		}
		
		$scope.setStyle = function() {
			var width = document.getElementsByClassName('over-view-wrapper')[0].clientWidth;
			var height = document.getElementsByClassName('over-view-wrapper')[0].clientHeight;
			
			var slideEl = document.getElementById('slide-wrapper');
			slideEl.style.width = width + 'px';
			slideEl.style.height = height + 'px';
			for(var k = 0, ken = $scope.ulEl.children.length; k < ken; k++){
				$scope.ulEl.children[k].style.width = width + 'px';
				$scope.ulEl.children[k].style.height = height + 'px';
			}
		}
		
		$scope.autoCarouse = function() {
			$scope.clickWitch(0);
			$scope.carouseInter = setInterval(function(){
				$scope.currentIndex = ($scope.currentIndex + 1) % $scope.ulEl.children.length;
				$scope.clickWitch($scope.currentIndex);
				$scope.$apply();
			},5000)
		}
		
		/*------------------因子监测页---------------------*/
		
		$scope.setBoxStyle = function() {
			var wrapperListEl = document.getElementsByClassName('circle-wapper');
			var height = window.innerWidth * 0.952 * 0.92 *0.13;
			for(var i = 0; i < wrapperListEl.length; i++){
				wrapperListEl[i].style.height = height + 4 + 'px';
				wrapperListEl[i].style.borderRadius = height / 2 + 'px';
			}
			
			var waves = document.getElementsByClassName('waves');
			var ratio = height / 231;
			for(var i = 0; i < waves.length; i++){
				waves[i].style.width = 1500 * ratio + 'px';
			}
			
			var rects = document.getElementsByClassName('rect-wrapper');
			for(var i = 0; i < rects.length; i++){
				rects[i].style.height = height + 'px';
			}
		}
		
		//创建折线图数据
		$scope.createChartData = function(isAddData){
			var lengendNames = ['COD', '氨氮'];
			var colorList = ['#2863e3', '#26dfd4'];
			var dataList = [];
			var timeList = [];
			
			var addZero = function(num) {
				if(num < 10) {
					num = '0' + num;
				}
				return num;
			};
			
			var nowHour = $scope.now.getHours();
			var nowMonth = addZero($scope.now.getMonth() + 1);
			var nowDate = addZero($scope.now.getDate());
			var _nowMonth = addZero((new Date($scope.now.getTime() - 24 * 60 * 60 * 1000)).getMonth() + 1);
			var _nowDate = addZero((new Date($scope.now.getTime() - 24 * 60 * 60 * 1000)).getDate());
			var __nowMonth = addZero((new Date($scope.now.getTime() - 48 * 60 * 60 * 1000)).getMonth() + 1);
			var __nowDate = addZero((new Date($scope.now.getTime() - 48 * 60 * 60 * 1000)).getDate());
			if(!$scope.chartCache || !$scope.chartCache.timeList){
				for(var i = 0; i < 48; i++){
					var hour = (nowHour - i) % 24;
					switch (true){
						case hour >= 0 && hour <= 9:
							hour = '0' + hour + ':00';
							break;
						case hour > 9:
							hour = hour + ':00';
							break;
						case hour < 0:
							if(48 + nowHour - i >= 24){
								nowMonth = _nowMonth;
								nowDate = _nowDate;
							}else {
								nowMonth = __nowMonth;
								nowDate = __nowDate;
							}
							hour = (48 + hour) % 24;
							if(hour >= 0 && hour <= 9){
								hour = '0' + hour + ':00';
							}else{
								hour = hour + ':00';
							}
							break;
						default:
							break;
					}
					timeList.splice(0, 0, nowMonth + '-' + nowDate + ' ' + hour);
				}
				
				lengendNames.forEach(function(item, index){
					var max = item == 'COD' ? 40 : 1.5;
					var tempList = [];
					for(var i = 0; i < 48; i++){
						tempList.splice(0, 0, Math.random() * max);
					}
					dataList.push(tempList)
				});
				
			}else if(isAddData){
				var hour = (Number($scope.chartCache.timeList[$scope.chartCache.timeList.length - 1].split(' ')[1].split(':')[0]) + 1) % 24;
				if(hour >= 0 && hour <= 9) {
					hour = '0' + hour + ':00';
				}else if(hour > 9) {
					hour = hour + ':00';
				}
				$scope.chartCache.timeList.push(nowMonth + '-' + nowDate + ' ' + hour);
				$scope.chartCache.timeList.splice(0, 1);
				timeList = $scope.chartCache.timeList;
				
				lengendNames.forEach(function(item, index){
					var max = item == 'COD' ? 40 : 1.5;
					$scope.chartCache.dataList[index].push(Math.random() * max)
					$scope.chartCache.dataList[index].splice(0, 1);
				});
				dataList = $scope.chartCache.dataList;
			}
			$scope.chartCache = {
				colorList: colorList,
				lengendNames: lengendNames,
				dataList: dataList,
				timeList: timeList
			};
			$scope.lastTime = $scope.chartCache.timeList[$scope.chartCache.timeList.length - 1].split(' ')[1];
			$scope.createLineChart(colorList, lengendNames, dataList, timeList);
		}
		
		//创建折线图
		$scope.createLineChart = function(colorList, lengendNames, dataList, axisDataList){
			var el = document.getElementById('chart-line-id');
			if(echarts && echarts.init && el){
				var series = [];
				lengendNames.forEach(function(name, index){
					series.push({
			            name: name,
			            smooth: true,
			            type: 'line',
			            symbolSize: 8,
			            lineStyle: {
			            	width: 3
			            },
			            areaStyle: {
			            	normal: {
							    opacity: 0.16,
							    globalCoord: false // 缺省为 false
			            	}
			            },
			            itemStyle: {
				            normal: {
				                borderWidth: 2
				            }
				        },
			            data: dataList[index]
			        })
				})
				$scope.lineChart = echarts.init(el);
				$scope.lineChart.setOption({
				    color: colorList,
				    tooltip: {
				        trigger: 'axis'
				    },
				    legend: {
				        y: 0,
				        right: '1%',
				        itemWidth: 23,
				        itemHeight: 10,
				        textStyle: {
				            color: '#000',
				            fontSize: 14
				        },
				        itemGap: 30,
				        data: lengendNames
				    },
				    grid: {
				        left: '1%',
				        right: '0%',
				        top: '16%',
				        bottom: '5%',
				        containLabel: true
				    },
				    toolbox: {
				        "show": false,
				        feature: {
				            saveAsImage: {}
				        }
				    },
				    xAxis: {
                        type : 'category',
                        axisTick:{
                            show: false
                        },
                        axisLine:{
                            show: false
                        },
                        axisLabel:{
                            textStyle:{
                                color:'#868686',
                                fontSize: 14
                            }
                        },
                        offset: 10,
                        data: axisDataList.map(function(item) {
			              return item.replace(/ /, '\n');
			            })
				    },
				    yAxis: {
				    	axisTick:{
                            show:false
                        },
                        axisLine:{
                          show:false
                        },
                        splitLine: {
                        	show: true,
                        	lineStyle: {
                        		type: 'dashed',
                        		color: '#ccc',
                        		width: 1,
                        		opacity: 0.3
                        	}
                        },
                        axisLabel:{
                            textStyle:{
                                color:'#868686',
                                fontSize: 16
                            }
                        },
				        type: 'value'
				    },
				    series: series
				})
			}
		}
		
		/*------------------站房详情页---------------------*/
		
		
		
		
	}


	$scope.initPage = (function () {
		$scope.initModel();
		$scope.initFns();
		
		$scope.ulEl = document.getElementById('slide-ul');
		$scope.currentIndex = $scope.ulEl.children.length;
		$scope.setStyle();
		$scope.autoCarouse();
		$scope.setBoxStyle();
		$scope.createChartData();
		
		$scope.minuteInterval = setInterval(function(){
			if($scope.now.getHours() == 0){
				$scope.createChartData(true);
			}
			$scope.$apply();
		}, 60000);
		
		window.addEventListener('resize', function(){
			//修改样式
			$scope.setStyle();
			$scope.setBoxStyle();
			//重绘lineChart
			if($scope.lineChart){
				$scope.lineChart.dispose();
				$scope.createLineChart($scope.chartCache.colorList, $scope.chartCache.lengendNames, $scope.chartCache.dataList, $scope.chartCache.timeList);
			}
		});
		
		$scope.$on("$destroy", function() {
            if($scope.minuteInterval){
            	clearInterval($scope.minuteInterval);
            	$scope.minuteInterval = null;
            }
            if($scope.carouseInter){
            	clearInterval($scope.carouseInter);
            	$scope.carouseInter = null;
            }
            if($scope.lineChart){
				$scope.lineChart.dispose();
				$scope.lineChart = null;
			}
        })
		
	})();
}])
