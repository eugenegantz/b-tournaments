modules.define('m-tournament', ['m-default-data-model'], function(provide, ddm) {

    /**
     * Модель турнира
     * @constructor
     * */
    var Tournament = function() {
        ddm.call(this);

        this.on('afterset:m_data', function() {
            var mData = {};

            this.props.m_data.forEach(function(m) {
                mData[m.id] = m;
                m.tournament = this;
            }, this);

            this.props.mdata = mData;
        });

        this.set('mData', {});
    };

    Tournament.prototype = ddm.prototype._objectsPrototyping(
        ddm.prototype,
        {
            /**
             * Добавить матч
             * @param {Object} m
             * @return this
             * */
            addM: function(m) {
                var mData = this.get('mData');
                mData[m.id] = m;
                m.tournament = this;

                this.trigger('add-match', { model: m });

                return this;
            },

            /**
             * Удалить матч
             * @param {Number | String} id
             * @return this
             * */
            rmM: function(id) {
                var mData = this.get('mData');

                this.trigger('remove-match', { id: id });

                delete mData[m.id].tournament;
                delete mData[m.id];

                return this;
            },

            /**
             * Получить один или все матчи
             * @param {Number | String} id
             * @return {Object}
             * */
            getM: function(id) {
                var mData = this.get('mData');

                if (!id) return mData;

                return mData[id];
            }
        }
    );

    provide(Tournament);

});