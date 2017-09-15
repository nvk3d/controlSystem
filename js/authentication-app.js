"use strict";
var app = angular.module("authenticationApp", ['ngCookies']).run(
    function (authenticationService){
        if (authenticationService.isLoggedIn())
            window.location = 'index.html';
    }
);