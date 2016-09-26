block('b-games')(
    js()(true),
    content()(function() {
        return [
            {
                block: 'b-tabs',
                mix: [{ block: 'b-games', elem: 'tabs' }],
                tabs: []
            },
            {
                elem: 'body',
                elemMods: { type: 'every' },
                tournaments: this.ctx.tournaments
            }
        ];
    }),

    elem('body')(
        content()(function() {
            var tournaments = this.ctx.tournaments || {};

            return Object.keys(tournaments).map(function(key) {
                var tour = tournaments[key];

                return {
                    elem: 'tournament',
                    name: tour.name,
                    js: {
                        id: tour.id
                    },
                    mods: { js: 'inited' },
                    m_data: tour.m_data
                };
            })
        })
    )
);