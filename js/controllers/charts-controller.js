app.controller("chartsController", function ($scope, $http, $q){

    /**
     * Статусы.
     * @type {Array}
     */
    $scope.data = [];
    /**
     * Пользователи системы.
     * @type {Array}
     */
    $scope.users = [];

    /* Пример модели пользователей можно найти в файле users.json */

    /**
     * Данные для графика "Количество статусов по пользователям за весь период".
     */
    var countByUsersData = [
        ['Пользователи', 'Количество статусов']
    ];

    /**
     * Данные для линейного графика.
     */
    var countByUserAndDateData;

    /**
     * Даты за выбранный период.
     */
    var period = [];

    /**
     * Диапазон поиска
     * @type {{from: null, to: null}}
     */
    var filter = {
        from: null,
        to: null
    };

    initViews();
    initFilter();
    initData();

    /**
     * Обработчик инпутов для фильтра.
     */
    angular.element(
        document.getElementsByClassName('datepicker')
    ).change(function(){
        period = []; // Обнуляем массив.
        if (angular.element(this).data('filter').localeCompare('from') === 0) {
            if (angular.element(this).val().length !== 0)
                filter.from = new Date(angular.element(this).val());
        }
        else{
            if (angular.element(this).val().length !== 0) {
                var date = new Date(angular.element(this).val());
                date.setHours(23);
                date.setMinutes(59);
                date.setSeconds(59);
                filter.to = date;
            }
        }
        initDates();
        initCountByUserAndDateChart();
    });

    /**
     * Получаем всех пользователей. Для удобства. Что бы на графиках отображать не id'шники а имена.
     * @name initUsers
     * @return {promise|null|b.Promise|f|*}
     */
    function initUsers(){
        //Timeout - типо грузим с сервака.
        var deferred = $q.defer();

        setTimeout(function (){
            $http({
                method: 'GET',
                url: 'users.json',
                cache: false,
                responseType: 'json'
            }).then(function successCallback(response){
                $scope.users = response.data;
                deferred.resolve();
            }, function errorCallback(){
                deferred.reject();
            });
        }, 1000);

        return deferred.promise;
    }

    /**
     * Инициализация данных. Запрос сработает, только после удачного получения всех пользователей.
     * @name initData
     */
    function initData(){
        var promise = initUsers();

        promise.then(
            function successCallback(){
                //Timeout - типо грузим с сервака.
                setTimeout(function (){
                    $http({
                        method: 'GET',
                        url: 'data.json',
                        responseType: 'json'
                    }).then(function successCallback(response){
                        $scope.data = response.data;

                        angular.element(
                            document.getElementsByClassName('datepicker')
                        ).removeAttr('disabled');

                        initCountByUsersChart(); //Инициализируем данные для графика "Количество статусов по пользователям", после отрисовываем.
                        initCountByUserAndDateChart(); //Инициализируем данные для линейного графика.

                    }, function errorCallback(){
                        Materialize.toast('Ошибка загрузки данных!', 5000);
                        angular.element(
                            document.querySelector('.progress')
                        ).remove();
                    })
                }, 2000);
            },
            function errorCallback(){
                Materialize.toast('Ошибка загрузки списка пользователей!', 5000);
                angular.element(
                    document.querySelector('.fullscreen-preloader')
                ).remove();
            });
    }

    /**
     * Инициализация фильтра. Базовые значения: предыдущая дата (00:00:00) - текущая дата (23:59:59)
     * @name initFilter
     */
    function initFilter(){
        var previousDate = new Date();
        previousDate.setDate(previousDate.getDate() - 1);
        filter.from = previousDate;

        angular.element(
            document.querySelector('#date_from')
        ).val(previousDate.getFullYear() + '-' + (previousDate.getMonth() + 1) + '-' + previousDate.getDate());

        var date = new Date();
        filter.to = date;

        angular.element(
            document.querySelector('#date_to')
        ).val(date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate());

        initDates();
    }

    /**
     * Создаем список дат в выбранном периоде.
     * @name initDates()
     */
    function initDates(){
        var currentDate = filter.from;
        while (currentDate <= filter.to){
            period.push(new Date(currentDate));
            currentDate = nextDate(currentDate);
        }
    }

    /**
     * Тупо чтоб не грузить код. Функция для нахождения следующего дня)
     * @name nextDate()
     */
    function nextDate(currentDate) {
        var date = new Date(currentDate);
        date.setDate(date.getDate() + 1);
        return date;
    }

    /**
     * Инициализация данных для гафика "Количество статусов по пользователям за весь период".
     * @name initCountByUsersChart
     */
    function initCountByUsersChart(){
        $scope.users.forEach(function (user){
            countByUsersData.push([user.name + ' ' + user.surname, $scope.data.filter(function (item){
                return item.author === user.id;
            }).length])
        });

        google.charts.load('current', {'packages':['bar']});
        google.charts.setOnLoadCallback(drawCountByUsersChart);
    }

    /**
     * Отрисовка графика "Количество статусов по пользователям за весь период".
     * @name drawCountByUsersChart
     */
    function drawCountByUsersChart(){
        var options = {
            chart: {
                title: 'Количество статусов по пользователям за весь период.'
            }
        };
        var chart = new google.charts.Bar(document.getElementById('count_by_users'));

        angular.element(
            document.querySelector('#count_by_users_progress')
        ).remove();

        chart.draw(
            google.visualization.arrayToDataTable(countByUsersData),
            google.charts.Bar.convertOptions(options)
        );
    }

    /**
     * Инициализация данных для линейного гафика.
     * @name initCountByUserAndDateChart
     */
    function initCountByUserAndDateChart(){
        countByUserAndDateData = [
            ['Дата']
        ];

        /* Добавляем всех пользователей в countByUserAndDate */

        $scope.users.forEach(function (user) {
            countByUserAndDateData[0].push(user.name + ' ' + user.surname);
        });

        period.forEach(function (periodItem) {
            var countByUserAndDateDataItem = [periodItem];
            var date = new Date(periodItem);

            date.setHours(0);
            date.setMinutes(0);
            date.setSeconds(0);
            var startOfDay = Math.floor(date / 1000);

            date.setHours(23);
            date.setMinutes(59);
            date.setSeconds(59);
            var endOfDay = Math.floor(date / 1000);

            $scope.users.forEach(function (user) {
                countByUserAndDateDataItem.push($scope.data.filter(function(item){
                    return item.date >= startOfDay && item.date <= endOfDay && item.author === user.id;
                }).length);
            });

            countByUserAndDateData.push(countByUserAndDateDataItem);
        });

        google.charts.load('current', {'packages':['corechart']});
        google.charts.setOnLoadCallback(drawCountByUserAndDateChart);
    }

    /**
     * Отрисовка линейного графика.
     * @name drawCountByUserAndDateChart
     */
    function drawCountByUserAndDateChart(){
        var options = {
            chart: {
                title: 'Активность пользователей за выбранный период.',
                curveType: 'function',
                legend: {
                    position: 'bottom'
                }
            }
        };
        var chart = new google.visualization.LineChart(document.getElementById('count_by_users_and_date'));

        angular.element(
            document.querySelector('#count_by_users_and_date_progress')
        ).remove();

        chart.draw(
            google.visualization.arrayToDataTable(countByUserAndDateData),
            google.charts.Bar.convertOptions(options)
        );
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