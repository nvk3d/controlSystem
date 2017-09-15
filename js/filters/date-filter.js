app.filter('dateFilter', function (){
    return function (items, filter) {
        var list = [];
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (item.date >= filter.from && item.date < filter.to)
                list.push(item);
        }
        return list;
    };
});