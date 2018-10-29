'use strict';

/*
 * @description
 * 路由配置
 */
var stateList = [{
	    name: 'login',
	    templateUrl: 'views/login.html',
	    controller: 'login'
	},
	{
	    name: 'main',
	    templateUrl: 'views/main.html',
	    controller: 'main'
	},
	{
	    name: 'main.overView',
	    templateUrl: 'views/overView.html',
	    controller: 'overView'
	}
];
webApp.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function($stateProvider, $urlRouterProvider, $httpProvider) {
    angular.forEach(stateList, function(stateItem) {
        var tempArr = stateItem.name.split('.');
        $stateProvider.state('' + stateItem.name, {
            url: '/' + (stateItem.url || tempArr[tempArr.length - 1]),
            templateUrl: stateItem.templateUrl,
            controller: stateItem.controller
        });
    });
    $urlRouterProvider.otherwise('/login');
}]);
