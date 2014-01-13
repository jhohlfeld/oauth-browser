define(['lodash', 'backbone', 'when', 'crypto-js'], function(_, Backbone, when, CryptoJS) {

    "use strict"

    /**
     * Auth provider profile.
     *
     * Authentication providers are organized in profiles
     * which extend from {oauth.Model}.
     *
     * By overriding individual methods, it's possible to
     * customize the behavior of the authentication process.
     *
     * @class Model
     */
    var Model = Backbone.Model.extend({

        defaults: {
            name: '',
            access_token: '',
            access_granted: 0,
            expires_in: 0,
            authParams: {
                response_type: 'token',
                client_id: '',
                redirect_uri: '',
                scope: ''
            },
            authUri: '',
            redirectUriConf: {
                protocol: '',
                host: '',
                path: 'blank.html'
            }
        },

        isExpired: function() {
            return this.get('access_token') && !(this.get('access_granted') +
                this.get('expires_in') > new Date().getTime() / 1000);
        },

        /**
         * Form the auth request.
         *
         * With this method, it's possible to override the behavior
         * how requests are formed.
         *
         * @method formRequest
         * @return {String} the request url with parameters
         */
        formRequest: function() {
            var randomNumber = Math.round(Math.random() * Math.pow(10, 16)),
                state = CryptoJS.SHA3(randomNumber.toString(16)),
                params = this.get('authParams');

            // state - anit XSRF measure
            params['state'] = state.toString(CryptoJS.enc.Hex);
            this.set('state', params['state']);

            // build redirect_uri
            if (!params.redirect_uri) {
                var l = window.location,
                    c = this.get('redirectUriConf');
                params.redirect_uri = (c.protocol || l.protocol) + '//' +
                    (c.host || l.host) + '/' + c.path;
            }

            return this.get('authUri') + '?' + _.map(params, function(v, k) {
                return k + '=' + encodeURI(v);
            }).join('&');
        },


        /**
         * Handle auth response.
         *
         * By overriing this, responses may be post-processed.
         *
         * @method handleResponse
         */
        handleResponse: function(resp) {
            if (!resp.error) {
                if (resp.state != this.get('state')) {
                    throw new Error('State does not match, posible CSRF detected!');
                }
                this.set({
                    'access_token': resp.access_token,
                    'access_granted': new Date().getTime() / 1000,
                    'expires_in': parseInt(resp.expires_in)
                });
            }
            return resp;
        },

        /**
         * Request.
         *
         * Do the request. When finished, it will trigger an 'authenticate' event.
         *
         * @method request
         * @param {Window} A popup window instance
         */
        request: function(w) {
            w.location.href = this.formRequest();
            var deferred = when.defer(),
                poll,
                resp,
                self = this;
            (poll = function() {
                try {
                    resp = self.fetchResponse(w);
                } catch (e) {}
                if (_.isObject(resp)) {
                    w.close();
                    resp = self.handleResponse(resp);
                    if (!resp.error) {
                        deferred.resolve(resp);
                        self.trigger('authenticate', self);
                    } else {
                        deferred.reject(resp);
                    }
                    return;
                }
                setTimeout(poll, 100);
            })();
            return deferred.promise;
        },


        /**
         * A way to fetch the response from the auth window.
         *
         * By overriding this method, it's possible to define
         * how authentication responses are extracted from
         * the client window.
         *
         * @method fetchResponse
         */
        fetchResponse: function(w) {
            var hash = w.location.hash,
                resp;
            if (hash.search(/access_token/) != -1) {
                resp = {};
                var a = hash.substr(1).split('&'),
                    p = _.forEach(a, function(q) {
                        var k = q.split('=');
                        resp[k[0]] = k[1];
                    });
            }
            return resp;
        }

    });


    var Collection = Backbone.Collection.extend({

        model: Model,
        localStorage: new Backbone.LocalStorage("app.oauth.api.collection"),

        initialize: function() {
            this.on('authenticate', function(model) {
                this.sync('create', model);
            });
        }
    });

    return {
        Model: Model,
        Collection: Collection
    };
});
