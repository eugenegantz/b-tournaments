block('b-tabs')(
    content()(function() {
        return (this.ctx.tabs || []).map(function(tab) {
            if (typeof tab == 'string') {
                tab = {
                    mix: [],
                    content: tab,
                    selected: false
                };
            }

            return {
                elem: 'tab',
                mix: [].concat(tab.mix || []),
                content: tab.content,
                elemMods: { selected: tab.selected }
            };
        });
    })
);