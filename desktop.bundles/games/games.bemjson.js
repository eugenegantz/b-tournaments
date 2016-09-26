module.exports = {
    block : 'page',
    title : 'Список матчей',
    favicon : '/favicon.ico',
    head : [
        { elem : 'meta', attrs : { name : 'description', content : '' } },
        { elem : 'meta', attrs : { name : 'viewport', content : 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no' } },
        { elem : 'css', url : 'games.min.css' }
    ],
    scripts: [
        { elem : 'js', url : 'games.min.js' },
        { elem : 'js', url : 'games.bemhtml.js' },
        { elem : 'js', url : 'jquery-2.1.0.min.js' }
    ],
    mix: [{ block: 'p-games', js: true }],
    content : [{
        block: 'b-games'
    }]
};
