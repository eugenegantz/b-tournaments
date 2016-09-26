modules.define('b-games__tournament', ['i-bem__dom', 'BEMHTML'], function(provide, BEMDOM, BEMHTML) {

    provide(BEMDOM.decl({ block: 'b-games', elem: 'tournament' },
            {
                onSetMod: {
                    js: {
                        inited: function() {
                            var self = this;

                            this.block().tElemCache[this.params.id] = this.domElem;

                            this.elemInstances('match').forEach(function(elem) {
                                self.block().mElemCache[elem.params.id] = elem.domElem;

                                elem.on({ modName: 'js', modVal: '' }, function() {
                                    delete self.block().mElemCache[elem.params.id];
                                });
                            });
                        },

                        '': function() {
                            delete this.block().tElemCache[this.params.id];
                        }
                    }
                }
            },
            {
                /* статические методы */
            }
        )
    );

});