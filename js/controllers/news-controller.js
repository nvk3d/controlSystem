app.controller("newsController", function ($scope, $http){

    $scope.data = [];

    initData();

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