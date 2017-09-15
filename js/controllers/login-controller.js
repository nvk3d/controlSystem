app.controller("loginController", function ($scope, authenticationService){

    var pwdInput = angular.element(document.querySelector('#pwd'));
    var loginInput = angular.element(document.querySelector('#login'));
    $scope.pwdVisibility = "visibility_off";


    /**
     * Меняем тип поля на текст. Показываем пароль.
     * @name showPwd
     */
    $scope.showPwd = function (){
        pwdInput.attr('type', 'text');
        $scope.pwdVisibility = "visibility";
    };

    /**
     * Меняем тип поля на пароль. Скрываем пароль.
     * @name hidePwd
     */
    $scope.hidePwd = function (){
        pwdInput.attr('type', 'password');
        $scope.pwdVisibility = "visibility_off";
    };

    /**
     * Вход.
     * @name login
     * @param data (объект) {login, password}
     */
    $scope.login = function (data){
        if (!authenticationService.login(data.login, data.pwd)){
            Materialize.toast('Ошибка входа', 4000);
            loginInput.addClass('invalid');
            pwdInput.addClass('invalid');
        }
        else
            window.location = 'index.html';
    };

});