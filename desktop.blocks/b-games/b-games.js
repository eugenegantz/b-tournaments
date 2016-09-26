modules.define('b-games', ['i-bem__dom', 'BEMHTML'], function(provide, BEMDOM, BEMHTML) {

    provide(BEMDOM.decl(this.name,
            {
                onSetMod: {
                    js: {
                        inited: function() {
                            this.setMod('tab', 'every');

                            this._applyEvents();
                        }
                    }
                },

                _model: void 0,

                mElemCache: {},

                tElemCache: {},

                selectTab: function(mod) {
                    var tabs = this.findBlockInside('b-tabs').elemInstances('tab');

                    tabs.forEach(function(tab) {
                        var elemTab = this.elemInstance(tab.domElem);

                        if (!elemTab.hasMod('type', mod)) {
                            tab.delMod('selected');
                        } else {
                            tab.setMod('selected', true);
                        }
                    }, this);
                },

                renderTabs: function() {
                    var m = this.getModel();
                    var tourns = m.getTournament();
                    var lenFav = Object.keys(this.getModel().getFavorites()).length;
                    var lenEvery = Object.keys(tourns).reduce(function(prev, curr) {
                        return prev + Object.keys(tourns[curr].getM()).length;
                    }, 0);

                    BEMDOM.replace(
                        this.findBlockInside('b-tabs').domElem,

                        BEMHTML.apply({
                            block: 'b-tabs',
                            mix: [{ block: 'b-games', elem: 'tabs' }],
                            tabs: [
                                {
                                    selected: this.hasMod('tab', 'every'),
                                    content: 'Все матчи (' + lenEvery + ')',
                                    mix: [{ block: 'b-games', elem: 'tab', elemMods: { type: 'every' } }]
                                },
                                {
                                    selected: this.hasMod('tab', 'fav'),
                                    content: 'Избранное (' + lenFav + ')',
                                    mix: [{ block: 'b-games', elem: 'tab', elemMods: { type: 'fav' } }]
                                }
                            ]
                        })
                    );
                },

                /**
                 * Присвоить модель
                 * */
                setModel: function(model) {
                    this._model = model;

                    this.emit('set-model');
                },

                /**
                 * Получить модель
                 * */
                getModel: function() {
                    return this._model;
                },

                _applyEvents: function() {
                    var self = this, gModel = this.getModel();

                    if (!gModel) {
                        this.on('set-model', this._applyEvents);
                        return;
                    }

                    gModel.on('change-favorite', function() {
                        self.renderTabs();
                    });

                    gModel.on('add-tournament', this._onAddT.bind(this));

                    gModel.on('set-favorite', this._onSetFav.bind(this));

                    gModel.on('unset-favorite', this._onUnsetFav.bind(this));
                },

                _onUnsetFav: function(ctx, e) {
                    var gModel = this.getModel();
                    var elemM = this.elemInstance(this.mElemCache[e.id]);
                    var elemT = this.elemInstance(this.tElemCache[e.model.tournament.get('id')]);
                    elemM.delMod('fav');

                    if (!gModel.isContainFavorites(e.model.tournament, [e.id])) {
                        elemT.delMod('fav');
                    }
                },

                _onSetFav: function(ctx, e) {
                    var elemM = this.elemInstance(this.mElemCache[e.id]);
                    var elemT = this.elemInstance(this.tElemCache[e.model.tournament.get('id')]);
                    elemM.setMod('fav', true);
                    elemT.setMod('fav', true)
                },

                _onAddT: function(ctx, data) {
                    var m = data.model, id = m.get('id');

                    if (this.tElemCache[id]) return;

                    BEMDOM.append(
                        this.elem('body'),

                        BEMHTML.apply({
                            block: 'b-games',
                            elem: 'tournament',
                            name: m.get('name'),
                            js: { id: id },
                            mods: { js: 'inited' },
                            m_data: m.get('m_data')
                        })
                    );

                    // TODO сделать щадящий вариант
                    this.renderTabs();
                    // self.dropElemCache();
                },

                _onAddMatch: function() {
                    // TODO добавить матч
                },

                _onRmMatch: function() {
                    // TODO удалить матч
                }
            },
            {
                /* статические методы */
                live : function() {
                    this.liveBindTo('tab', 'click', function(e) {
                        if ( this.hasMod(e.currentTarget, 'type', 'every') ) {
                            this.setMod('tab', 'every');
                            this.selectTab('every')

                        } else {
                            this.setMod('tab', 'fav');
                            this.selectTab('fav');
                        }
                    });

                    this.liveBindTo('checkbox-fav', 'change', this._onFavChange);
                },

                _onFavChange: function(e) {
                    var elemInst = this.elemInstance(e.currentTarget),
                        cbInst = e.currentTarget.bem('checkbox'),
                        model = this.getModel(),
                        match = model._m[elemInst.params.id];

                    if (cbInst.hasMod('checked')) {
                        model.setFavorite(match);
                        return;
                    }

                    model.unsetFavorite(match);
                }
            })
    );

});