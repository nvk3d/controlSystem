app.controller("addController", function ($scope, $http, $cookies, $timeout){

    $scope.id = $cookies.get(AUTHENTICATION);

    $scope.filter = {
        from: null,
        to: null
    };

    $scope.additionalFilter = 'my';

    $scope.status = {};

    $scope.data = [];
    initViews();
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

    $scope.copyStatus = function (item){
      $scope.status.title = item.title;
      $scope.status.content = item.content;
      $scope.status.isKeyWork = item.is_key_work;
      $scope.status.isNews = item.is_news;
      $scope.status.percentageOfReadiness = item.percentage_of_readiness;
      $scope.isNewTitle = true;
      $timeout(function (){
          Materialize.updateTextFields();
          angular.element(
              document.getElementsByClassName('modal')
          ).modal('close');
      }, 100)
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

        if (status.title === null){
            Materialize.toast('Выберите заголовок!', 5000);
            return;
        }

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
        $timeout(function (){
            Materialize.updateTextFields();

            angular.element(
                document.querySelector('#title')
            ).removeClass('valid');

            angular.element(
                document.querySelector('.materialize-textarea')
            ).trigger('autoresize');
        }, 100)
    }

    function initViews(){
        angular.element(
            document.getElementsByClassName('modal')
        ).modal();
    }

});