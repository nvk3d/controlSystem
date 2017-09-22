"use strict";

const VIEWS_DIRECTORY = "templates/";
const ROUTERS = [
    '/home',
    '/add',
    '/logout',
    '/my',
    '/others',
    '/news',
    '/kanban',
    '/charts'
];

var app = angular.module("consoleApp", ['ngRoute', 'ngCookies', 'dndLists'])
    .config(function($routeProvider){
        $routeProvider.when(ROUTERS[0], {
            templateUrl: VIEWS_DIRECTORY + 'home.html',
            controller: 'homeController'
        });
        $routeProvider.when(ROUTERS[1], {
            templateUrl: VIEWS_DIRECTORY + 'add.html',
            controller: 'addController'
        });
        $routeProvider.when(ROUTERS[2], {});
        $routeProvider.when(ROUTERS[3], {
            templateUrl: VIEWS_DIRECTORY + 'my.html',
            controller: 'myController'
        });
        $routeProvider.when(ROUTERS[4], {
            templateUrl: VIEWS_DIRECTORY + 'others.html',
            controller: 'othersController'
        });
        $routeProvider.when(ROUTERS[5], {
            templateUrl: VIEWS_DIRECTORY + 'news.html',
            controller: 'newsController'
        });
        $routeProvider.when(ROUTERS[6], {
            templateUrl: VIEWS_DIRECTORY + 'kanban.html',
            controller: 'kanbanController'
        });
        $routeProvider.when(ROUTERS[7], {
            templateUrl: VIEWS_DIRECTORY + 'charts.html',
            controller: 'chartsController'
        });
        $routeProvider.otherwise({
            redirectTo: '/home'
        });
    });

app.run(function ($rootScope, $location, authenticationService){

    if (!authenticationService.isLoggedIn()) {
        window.location = 'login.html';
        return;
    }

    $rootScope.$on('$routeChangeStart', function (event, next){
        if (typeof(next.$$route) !== "undefined")
            if (next.$$route.originalPath.localeCompare('/logout') === 0){
                authenticationService.logout();
                window.location = 'login.html';
            }

    })

});