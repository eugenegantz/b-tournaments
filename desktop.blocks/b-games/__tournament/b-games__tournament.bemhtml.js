block('b-games').elem('tournament').content()(function() {
    var tId = this.ctx.js.id;

    return [
        {
            elem: 'tournament-title',
            content: [this.ctx.name, { elem: 'star' }]
        },
        {
            elem: 'tournament-body',
            content: this
                .ctx
                .m_data
                .sort(function(a, b) { return a.timestamp < b.timestamp ? -1 : 1; })
                .map(function(match) {
                    return {
                        elem: 'match',
                        js: {
                            id: match.id
                        },
                        content: [
                            {
                                elem: 'match-time',
                                content: match.time
                            },
                            {
                                elem: 'match-name',
                                tag: 'a',
                                attrs: {
                                    href: match.link
                                },
                                content: match.name
                            },
                            {
                                elem: 'match-result',
                                content: match.result
                            },
                            {
                                elem: 'match-status',
                                content: match.status
                            },
                            {
                                block: 'checkbox',
                                mix: [{
                                    block: 'b-games',
                                    elem: 'checkbox-fav',
                                    js: {
                                        id: match.id,
                                        tid: tId
                                    }
                                }]
                            }
                        ]
                    }
                })
        }
    ]; // tournament.content
});