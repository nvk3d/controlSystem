app.controller("myController", function ($scope, $http, $cookies){

    $scope.id = $cookies.get(AUTHENTICATION);
    $scope.filter = 'my';

    $scope.data = [];
    initData();

    /**
     * Функция для обновления статуса по клику на кнопку сохранить.
     * Любые изменения в статус может внести только его создатель.
     * @name updateStatus
     * @param item (объект)
     */
    $scope.updateStatus = function (item){
        //ToDo: привязать ajax.
    };

    /**
     * Инициализация данных.
     * @name initData
     */
    function initData(){
        //Timeout - типо грузим с сервака.
        setTimeout(function (){
            $http({
                method: 'GET',
                url: 'data.json',
                responseType: 'json'
            }).then(function successCallback(response){
                $scope.data = response.data;

                angular.element(
                    document.querySelector('.progress')
                ).remove();

            }, function errorCallback(){
                Materialize.toast('Ошибка загрузки данных!', 5000);
                angular.element(
                    document.querySelector('.progress')
                ).remove();
            })
        }, 2000);
    }
});