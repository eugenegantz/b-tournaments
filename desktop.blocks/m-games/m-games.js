modules.define('m-games', ['m-default-data-model', 'm-tournament', 'jquery'], function(provide, ddm, MTour, $) {

    var Games = function() {
        ddm.call(this);

        // TODO возможно _m можно и убрать

        this._tour = {}; // турниры
        this._m = {}; // матчи
        this._fav = {}; // избранное

        this.on('remove-tournament', this._onRemoveTournament);
        this.on('add-tournament', this._onAddTournament);
    };

    Games.prototype = ddm.prototype._objectsPrototyping(
        ddm.prototype,
        {
            _onRemoveMatch: function(ctx, e) {
                this.trigger('remove-match', e);
                delete this._m[e.id];
            },

            _onAddMatch: function(ctx, e) {
                this._m[e.model.id] = e.model;
                this.trigger('add-match', e);
            },

            _onRemoveTournament: function(ctx, e) {
                var t = this._tour[e.id]; // t = tournament
                if (t) {
                    var m = t.getM(); // getMatch
                    for (var matchId in m) {
                        if (!m.hasOwnProperty(matchId)) continue;
                        delete this._m[matchId];
                    }
                }
            },

            _onAddTournament: function(ctx, e) {
                var m = e.model.getM(); // getMatch
                $.extend(this._m, m);
            },

            /**
             * Добавить модель турнира
             * */
            addTournament: function(obj) {
                if (!(obj instanceof MTour)) {
                    var m = new MTour();
                    m.set(obj);
                    obj = m;
                }

                this._tour[obj.get('id')] = obj;

                obj.on('remove-match', this._onRemoveMatch.bind(this));
                obj.on('add-match', this._onAddMatch.bind(this));

                this.trigger(
                    'add-tournament',
                    {
                        model: obj,
                        id: obj.get('id')
                    }
                );

                return this;
            },

            /**
             * Удалить модель турнира
             * */
            removeTournament: function(arg) {
                if (typeof arg == 'object') {
                    arg = arg.get('id');
                }

                this._onRemoveTournament(this, { id: arg });

                delete this._tour[arg];

                this.trigger(
                    'remove-tournament',
                    { id: obj.get('id') }
                );

                return this;
            },

            /**
             * Получить одну или все модели турнира
             * @param {Number | String} id
             * @return {m-tournament}
             * */
            getTournament: function(id) {
                return !id
                    ? this._tour
                    : this._tour[id];
            },

            /**
             * Получить матч из плоского кэша
             * @param {Number | String} id
             * @return {Object}
             * */
            getMatch: function(id) {
                return this._m[id];
            },

            /**
             * Добавить в избранное
             * */
            setFavorite: function(obj) {
                this._fav[obj.id] = obj;

                this.trigger('change-favorite', { model: obj, id: obj.id });
                this.trigger('set-favorite', { model: obj, id: obj.id });
            },

            /**
             * Исключить из списка избранного
             * @param {Number | String} arg - ID или объект матча
             * */
            unsetFavorite: function(arg) {
                if (typeof arg == 'object') arg = arg.id;

                this.trigger('unset-favorite', { id: arg, model: this._fav[arg] });

                delete this._fav[arg];

                this.trigger('change-favorite', { model: this._fav[arg], id: arg });
            },

            /**
             * Получить избранное
             * @param {Number | String} id
             * @return {Object}
             * */
            getFavorites: function(id) {
                return !id
                    ? this._fav
                    : this._fav[id];
            },

            /**
             * Есть ли в турнире избранные матчи
             * @param {m-tournament} t - модель турнира
             * @param {Array=} except - исключение
             * @return {Boolean}
             * */
            isContainFavorites: function(t, except) {
                var m = t.getM(); // матчи внутри турнира
                !Array.isArray(except) && (except = []);

                for (var prop in m) {
                    if (!m.hasOwnProperty(prop)) continue;
                    if (!!~except.indexOf(m[prop].id)) continue;
                    if (this.getFavorites(m[prop].id)) {
                        return true;
                    }
                }

                return false;
            }
        }
    );

    provide(Games);

});