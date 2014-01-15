define(['lodash', 'backbone', 'when', 'crypto-js'], function(_, Backbone, when, CryptoJS) {

    "use strict"

    /**
     * A view that renders data from a single profile.
     *
     * Override `handleResponse` to customize how raw data
     *  recieved from the api is handled.
     * 
     * When creating instances, be sure to configure
     *  with at the properties for template and api-url:
     *
     * @example
     *     new ProfileView({
     *       template: _.template('..'), 
     *       url: 'https://api.com/me'
     *     });
     *
     * @class ProfileView
     */
    var ProfileView = Backbone.View.extend({

        defaultOptions: {
            accessToken: '',
            template: _.template(''),
            modelClass: Backbone.Model,
            url: ''
        },

        template: null,
        model: null,

        /**
         * Initialize..
         * 
         * @method initialize
         */
        initialize: function() {
            this.options = _.extend(this.defaultOptions, this.options);
            this.template = this.options.template;
        },

        /**
         * Called by render(), always returns a promise.
         * 
         * @method load
         * @return {Promise} promise on the loaded data
         */
        load: function() {
            var self = this,
                deferred = when.defer();
            if (this.model) {
                return deferred.resolve(this.model);
            }
            var resolver = deferred.resolver,
                params = _.map({
                        'access_token': this.options.accessToken
                    },
                    function(v, k) {
                        return k + '=' + encodeURI(v);
                    }).join('&');
            $.ajax({
                url: this.options.url + '?' + params
            }).done(function(resp) {
                var data = self.handleResponse(resp);
                self.model = new self.options.modelClass(data);
                deferred.resolve(self.model);
            }).fail(resolver.reject);
            return deferred.promise;
        },

        /**
         * Renders the view.
         *  Replaces the view's `$el` as soon as 
         *  {{#crossLink "Profile/load:method"}} resolves successfully. 
         * 
         * @method render
         */
        render: function() {
            var self = this;
            this.load().then(function(model, err) {
                if (err) throw err;
                self.$el.html(self.template({
                    model: model
                }));
            });
            return this;
        },

        /**
         * Default response handling.
         *  Override this for custom behavior.
         * 
         * @method handleResponse
         */
        handleResponse: function(resp) {
            return resp;
        }
    });


    /**
     * Placeholder for profile view.
     *
     *  This view is not actually meant to be used.
     *  It's just there to fill the gap for the 
     *  yet-to-be-created, real view.
     * 
     * @class DefaultProfileView
     */
    var DefaultProfileView = ProfileView.extend({
        render: function() {
            this.$el.html('<i>to be implemented..</i>');
            return this;
        }
    });


    /**
     * Auth provider model.
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
            profile_data: '',
            access_token: '',
            access_granted: 0,
            expires_in: 0,
            state: '',
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

        /**
         * Whether the session expired.
         * 
         *  This implies that the session has been active earlier.
         * 
         * @method isExpired
         */
        isExpired: function() {
            return this.get('access_token') && !(this.get('access_granted') +
                this.get('expires_in') > new Date().getTime() / 1000);
        },

        /**
         * Whether the session is active.
         * 
         * @method isActive
         */
        isActive: function() {
            return this.get('access_token').length > 0 && !this.isExpired();
        },

        /**
         * Invalidate session - logout if you like.
         * 
         * @method invalidate
         */
        invalidate: function() {
            this.sync('delete', this);

            // reset to defaults
            this.set(_.pick(this.defaults, ['access_token',
                'access_granted', 'expires_in', 'state'
            ]));
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
         * Make an api call
         *
         *  When finished, it will trigger an 'authenticate' event.
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
        },

        /**
         * Return a readily configured profile view.
         *
         *  Override this to implement your custom view.
         * 
         * @method getProfileView
         */
        getProfileView: function() {
            return new DefaultProfileView();
        }
    });


    /**
     * Collection of auth provider models.
     * 
     * @class Collection
     */
    var Collection = Backbone.Collection.extend({

        model: Model,
        localStorage: new Backbone.LocalStorage("app.oauth.api.collection"),

        initialize: function() {
            this.on('authenticate', function(model) {
                this.sync('update', model);
            });
        }
    });


    return {
        Model: Model,
        Collection: Collection,
        ProfileView: ProfileView
    };
});
