
const AUTHENTICATION = "authentication";

app.service('authenticationService', function ($http, $cookies){
    var authentication = {};

    /**
     *
     * @name login
     * @param login
     * @param pwd
     * @return boolean
     *
     */
    authentication.login = function (login, pwd){
        var isSuccessful = false;

        //ToDo: удалить блок if снизу, после привязки к серверу
        if (login.toLowerCase().trim().localeCompare('root') === 0 &&
            pwd.trim().localeCompare('ROOTROOT') === 0){
            $cookies.put(AUTHENTICATION, 1);
            isSuccessful = true;
        }

        return isSuccessful;
    };

    /**
     * Функция предусмотрена для проверки актуальности токена.
     * Отправляем запрос с текущим токеном на сервер. Проверяем респонс.
     * Возвращаем true, если токен пожтвержден. И false, если есть ошибки.
     * @name verify
     * @return boolean
     */
    authentication.verify = function (){
        return true;
    };

    /**
     * Проверка нахождения объекта пользователя / токена в cookies.
     * @name isLoggedIn
     * @return boolean
     */
    authentication.isLoggedIn = function (){
        var authentication = $cookies.get(AUTHENTICATION);
        return !!authentication;
    };

    /**
     * Удаление данных аутентификации из cookies.
     * @name logout
     */
    authentication.logout = function (){
        $cookies.remove(AUTHENTICATION);
    };

    return authentication;
});