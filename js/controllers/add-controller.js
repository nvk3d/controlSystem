app.controller("addController", function ($scope, $http, $cookies){

    $scope.id = $cookies.get(AUTHENTICATION);

    $scope.filter = {
        from: null,
        to: null
    };

    $scope.data = [];

    initFilter();
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

    /**
     * Инициализация фильтра. Базовые значения: текущая дата (00:00:00) - текущая дата (23:59:59)
     * @name initFilter
     */
    function initFilter(){
        var date = new Date();
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        $scope.filter.from = Math.floor(date / 1000);

        date.setHours(23);
        date.setMinutes(59);
        date.setSeconds(59);
        $scope.filter.to = Math.floor(date / 1000);
    }

    /**
     * Добавление нового статуса.
     * @param status (объект)
     */
    $scope.addStatus = function (status){


        //ToDo: привязываем ajax. сервер обязательно должен возвращать id добавленного элемента!!!

        /**
         * В success callback создаем новый объект. Пример ниже. id'шник из респонса. И добавляем его к модели.
         * Либо получаем данные снова (initData).
         * В error callback выводим ошибку. Materialize.toast('Ошибка отправки данных!', 5000);
         */

        //ToDo: удалить push ниже после привязки к ajax.
        $scope.data.push(
            {
                title: status.title,
                content: status.content,
                is_news: status.isNews,
                is_key_work: status.isKeyWork,
                percentage_of_readiness: status.percentageOfReadiness,
                date: Math.floor(new Date() / 1000),
                author: $scope.id
            }
        );

        resetInputs();

    };


    /**
     * Сброс всех инпутов
     * @name resetInputs
     */
    function resetInputs() {
        $scope.status.title = null;
        $scope.status.content = null;
        $scope.status.isKeyWork = false;
        $scope.status.isNews = false;
        $scope.status.percentageOfReadiness = 50;
        angular.element(
            document.querySelector('#title')
        ).removeClass('valid');

        angular.element(
            document.querySelector('.materialize-textarea')
        ).trigger('autoresize');
    }

});