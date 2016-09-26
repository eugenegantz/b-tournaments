modules.define('m-api', [], function(provide) {

    provide({

        _tData: void 0,

        ajax: function(url, callback) {
            var http;

            if (typeof callback != 'function')
                callback = new Function();

            if (window.XMLHttpRequest){
                http = new XMLHttpRequest();
                if (http.overrideMimeType)
                    http.overrideMimeType('text/xml'); // фикс для FireFox

            } else if (window.ActiveXObject) {
                try {
                    http = new ActiveXObject("Msxml2.XMLHTTP");
                } catch (e) {
                    try {
                        http = new ActiveXObject("Microsoft.XMLHTTP");
                    } catch (e) {}
                }
            }

            http.onreadystatechange = function() {
                if (  http.readyState == 4  ){
                    if (  http.status == 200  ){
                        callback.call(http, null, http);

                    } else if (
                        // фикс для IE, где onerror имеет другое поведение
                        http.status != 200
                        && typeof http.onerror != "function"
                    ) {
                        callback.call(http, "XMLHttpRequest.status: " + http.status, http);
                    }
                }
            };

            http.open('GET', url, true);

            http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

            http.send();
        },


        _buildTournamentsData: function() {
            var c, d, m_data, prop, match = this._tData.match_data;

            for (prop in match) {
                if (!match.hasOwnProperty(prop)) continue;
                m_data = match[prop].m_data;

                for (c=0; c<m_data.length; c++) {
                    d = new Date();
                    m_data[c].timestamp = m_data[c].time.split(':');
                    d.setHours(+m_data[c].timestamp[0]);
                    d.setMinutes(+m_data[c].timestamp[1]);
                    m_data[c].timestamp = d.getTime();
                }
            }
        },


        getTournamentsData: function(callback) {
            var self = this;

            if (!this._tData) {
                this.ajax('./data.json', function(err, http) {
                    if (err) throw new Error(err);
                    self._tData = JSON.parse(http.responseText);
                    self._buildTournamentsData();
                    callback(self._tData);
                });
                return;
            }

            callback(this._tData);
        },

        /**
         * Сохранить избранные матчи
         * @param {Array | Number} id
         * */
        saveLocStorageTourData: function(id) {
            if (typeof id == 'undefined') return;

            if (!Array.isArray(id)) {
                id = [id];
            }

            localStorage.setItem('b-tournaments__fav-matches', JSON.stringify(id));
        },

        /**
         * Получить изюранные матчи
         * @return {Array}
         * */
        getLocStorageTourData: function() {
            return JSON.parse(localStorage.getItem('b-tournaments__fav-matches')) || [];
        }

    });

});