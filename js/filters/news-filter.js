app.filter('newsFilter', function (){
    return function (items) {
        var list = [];
        for (var i = 0; i < items.length; i++)
            if (items[i].is_news)
                list.push(items[i]);
        return list;
    };
});