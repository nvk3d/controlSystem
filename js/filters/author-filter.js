app.filter('authorFilter', function ($cookies){
    return function (items, filter) {
        var list = [];


        if (filter.localeCompare('my') === 0) {
            for (var i = 0; i < items.length; i++)
                if (items[i].author === parseInt($cookies.get(AUTHENTICATION)))
                    list.push(items[i]);
        }
        else
            for (i = 0; i < items.length; i++)
                if (items[i].author !== parseInt($cookies.get(AUTHENTICATION)))
                    list.push(items[i]);

        return list;
    };
});