app.controller("mainController", function (){
    initViews();
});

/**
 * Заставляем работать боковое меню.
 * @name initViews
 */

function initViews(){
    angular.element(
        document.querySelector('.button-collapse')
    ).sideNav();
}