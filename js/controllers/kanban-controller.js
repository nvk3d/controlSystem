app.controller("kanbanController", function ($scope, $http){


    $scope.board = {};

    /**
     * Пример модели.
     * Важно!!! Даже при отсутствии данных, сервер должен возвращать объект с пустыми массивами! В противном случае ничего работать не будет!!!
     */

    /* $scope.board = {
        selected: null,
        states: {
            staging: [
                {
                    "id": "_9gfa505ww",
                    "date": 1505399042,
                    "title": "TEST1"
                }
            ],
            development: [],
            testing: [],
            uat: [],
            success: []
        }
    }; */

    initKanban();

    /**
     * Инициализация данных для доски.
     * @name initKanban
     */
    function initKanban(){
        /**
         * Пример получения данных
         */
        $http({
            method: 'GET',
            url: 'kanban.json',
            responseType: 'json'
        }).then(function successCallback(response){
            $scope.board = response.data;
        }, function errorCallback(){
            Materialize.toast('Ошибка загрузки данных для канбан доски!', 5000);
            angular.element(
                document.getElementsByClassName('kanban-action')
            ).addClass('disabled');
            angular.element(
                document.getElementsByClassName('kanban-state')
            ).addClass('grey lighten-1');
        })
    }

    /**
     * Drag and drop добавление нового элемента.
     * @name draggable
     */
    $scope.draggable = function (){
        return item();
    };

    /**
     * Добавление нового элемента по клику.
     * @name addItem
     */
    $scope.addItem = function(){
      $scope.board.states.staging.push(
          item()
      );
    };

    /**
     * Удаление элемента по клику.
     * @name deleteItem
     */
    $scope.deleteItem = function (){

        if ($scope.board.selected === null)
            return;

        var itemTitle = 'без имени';

        if (typeof ($scope.board.selected.title) !== "undefined")
            itemTitle = $scope.board.selected.title;

        if (!confirm('Удалить элемент ' + itemTitle + '?'))
            return;

        if (indexOf($scope.board.states.staging, $scope.board.selected.id) !== -1){
            $scope.board.states.staging.splice(
                indexOf($scope.board.states.staging, $scope.board.selected.id),
                1
            );
            $scope.board.selected = null;
            return;
        }

        if (indexOf($scope.board.states.development, $scope.board.selected.id) !== -1){
            $scope.board.states.development.splice(
                indexOf($scope.board.states.development, $scope.board.selected.id),
                1
            );
            $scope.board.selected = null;
            return;
        }

        if (indexOf($scope.board.states.testing, $scope.board.selected.id) !== -1){
            $scope.board.states.testing.splice(
                indexOf($scope.board.states.testing, $scope.board.selected.id),
                1
            );
            $scope.board.selected = null;
            return;
        }

        if (indexOf($scope.board.states.uat, $scope.board.selected.id) !== -1){
            $scope.board.states.uat.splice(
                indexOf($scope.board.states.uat, $scope.board.selected.id),
                1
            );
            $scope.board.selected = null;
            return;
        }

        if (indexOf($scope.board.states.success, $scope.board.selected.id) !== -1){
            $scope.board.states.success.splice(
                indexOf($scope.board.states.success, $scope.board.selected.id),
                1
            );
            $scope.board.selected = null;
        }

    };

    /**
     * Сохранение текущего состояния.
     * Варианта 2: Простой ajax. Или прицепить на вебсокет. Если цеплять на вебсокет, то надо в initKanban докинуть подписку.
     * @name saveBoard
     */
    $scope.saveBoard = function (){

    };

    /**
     * Watch'er для дебага. Отслеживание изменений модели.
     */
    /* $scope.$watch('board', function(model) {
         console.log(angular.toJson(model, true));
    }, true); */


    /**
     * Генерация нового элемента.
     * @return {{id: string, date: number}}
     */
    function item(){
        return {
            id: '_' + Math.random().toString(36).substr(2, 9),
            date: Math.floor(new Date() / 1000)
        };
    }

    /**
     * Поиск объекта по id'шнику
     * @name indexOf
     * @param arg1 - массив для поиска
     * @param arg2 - id'шник
     * @return {number} - индекс, если элемент найден, -1 в противном случае.
     */
    var indexOf = function (arg1, arg2) {
        for (var i = 0, l = arg1.length; arg1[i] && (arg1[i].id.localeCompare(arg2) !== 0); i++);
        return i === l ? -1 : i;
    };

});