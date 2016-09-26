modules.define('p-games', ['i-bem__dom', 'BEMHTML', 'm-api', 'm-games'], function(provide, BEMDOM, BEMHTML, API, mGames) {

    provide(BEMDOM.decl(this.name,
            {
                onSetMod: {
                    js: {
                        inited: function() {
                            var self = this;

                            API.getTournamentsData(function(data) {
                                var match_data = data.match_data;
                                var bGames = self.findBlockInside('b-games');
                                var m = new mGames();
                                bGames.setModel(m);

                                for (var prop in match_data) {
                                    if (!match_data.hasOwnProperty(prop)) continue;
                                    m.addTournament(match_data[prop]);
                                }

                                bGames.elemInstances('tournament');
                            });
                        }
                    }
                }
            },
            {
                /* статические методы */
            })
    );

});