app.controller("myController", function ($scope, $http, $cookies){

    $scope.id = $cookies.get(AUTHENTICATION);
    $scope.filter = 'my';
    $scope.additionalFilter = {
        from: null,
        to: null
    };

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

    /**
     * Обработчик инпутов для фильтра.
     */
    angular.element(
        document.getElementsByClassName('datepicker')
    ).change(function(){
        if (angular.element(this).data('filter').localeCompare('from') === 0)
            $scope.additionalFilter.from = Math.floor(new Date(angular.element(this).val()) / 1000);
        else{
            var date = new Date(angular.element(this).val());
            date.setHours(23);
            date.setMinutes(59);
            date.setSeconds(59);
            $scope.additionalFilter.to = Math.floor(date / 1000);
        }
        $scope.$apply();
    });

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

                angular.element(
                    document.getElementsByClassName('datepicker')
                ).removeAttr('disabled');

            }, function errorCallback(){
                Materialize.toast('Ошибка загрузки данных!', 5000);
                angular.element(
                    document.querySelector('.progress')
                ).remove();
            })
        }, 2000);
    }

    function initFilter(){
        var date = new Date();
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        $scope.additionalFilter.from = Math.floor(date / 1000);

        angular.element(
            document.querySelector('#date_from')
        ).val(date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate());

        date.setHours(23);
        date.setMinutes(59);
        date.setSeconds(59);
        $scope.additionalFilter.to = Math.floor(date / 1000);

        angular.element(
            document.querySelector('#date_to')
        ).val(date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate());

    }

    /**
     * Инициализация инпутов фильтра.
     * @name initViews
     */
    function initViews(){
        angular.element(document.getElementsByClassName('datepicker')).pickadate({
            selectMonths: true,
            selectYears: 5,
            labelMonthNext: 'Следующий месяц',
            labelMonthPrev: 'Прошлый месяц',
            labelMonthSelect: 'Выберите месяц',
            labelYearSelect: 'Выберите год',
            monthsFull: [ 'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь' ],
            monthsShort: [ 'Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек' ],
            weekdaysFull: [ 'Понедельник', 'Вторник', 'Среда', 'Чеверг', 'Пятница', 'Суббота', 'Воскресенье' ],
            weekdaysShort: [ 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс' ],
            weekdaysLetter: [ 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс' ],
            today: 'Сегодня',
            clear: 'Сброс',
            close: 'ОК',
            format: 'yyyy-mm-dd'
        });
    }
});