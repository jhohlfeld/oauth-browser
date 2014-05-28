define(['lodash', 'jquery', 'backbone', 'when', 'crypto-js'],
  function(_, $, Backbone, when, CryptoJS) {

    'use strict';

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
        apiModel: null,
        template: _.template(''),
        profileModelClass: Backbone.Model,
        url: ''
      },

      template: null,

      /**
       * Initialize..
       *
       * @method initialize
       */
      initialize: function() {
        this.options = _.extend(this.defaultOptions, this.options);
        this.template = this.options.template;
        this.apiModel = this.options.apiModel;
      },

      /**
       * Called by render(), always returns a promise.
       *
       * @method load
       * @return {Promise} promise on the loaded data
       */
      load: function() {
        var model;
        if ((model = this.apiModel.get('profile_data')) &&
          model instanceof Backbone.Model) {
          return when.resolve(model);
        }
        var self = this,
          deferred = when.defer(),
          resolver = deferred.resolver,
          params = _.map({
              'access_token': this.options.apiModel.get('access_token')
            },
            function(v, k) {
              return k + '=' + encodeURI(v);
            }).join('&');
        $.ajax({
          url: this.options.url + '?' + params
        }).done(function(resp) {
          var data = self.handleResponse(resp);
          model = new self.options.profileModelClass(data);
          self.apiModel.set('profile_data', model);
          self.apiModel.trigger('load-profile', self.apiModel);
          deferred.resolve(model);
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
          if (err) {
            throw err;
          }
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

      model: {
        profile_data: Backbone.Model
      },

      initialize: function() {
        // this.profileView = this.createProfileView(this);
        // var self = this;
        // this.listenTo(this.profileView, 'load', function(data) {
        //   self.set('profile_data', data);
        // });
      },

      /**
       * Whether the session expired.
       *
       *  This implies that the session has been active earlier.
       *
       * @method isExpired
       */
      isExpired: function() {
        var expires = this.get('expires_in') > 0 ? this.get('access_granted') +
          this.get('expires_in') : 0;
        return this.get('access_token') && !(expires > 0 ? (expires > new Date().getTime() / 1000) : true);
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

      parse: function(response) {
        for (var key in this.model) {
          var EmbeddedClass = this.model[key];
          if (_.isFunction(EmbeddedClass)) {
            response[key] = new EmbeddedClass(response[key], {
              parse: true
            });
          }
        }
        return response;
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

        // state - anti XSRF measure
        params.state = state.toString(CryptoJS.enc.Hex);
        this.set('state', params.state);

        // build redirect_uri
        if (!params.redirect_uri) {
          var l = window.location,
            c = this.get('redirectUriConf'),
            lpath = l.pathname.match(/(.*?)([\w]+\.[\w#\?]+){0,1}$/)[1];
          params.redirect_uri = (c.protocol || l.protocol) + '//' +
            (c.host || l.host) + lpath + c.path;
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
        if (resp.error) {
          throw new Error(JSON.stringify(resp));
        }
        this.set({
          'access_token': resp.access_token,
          'access_granted': new Date().getTime() / 1000,
          'expires_in': resp.expires_in ? parseInt(resp.expires_in) : 0
        });
        return _.extend(resp, this.get('access_granted'));
      },

      handleError: function(resp) {
        var error = new Error('Error while authenticating ' + this.id);
        error.response = resp;
        return error;
      },

      /**
       * Make an api call.
       *
       *  When finished, an 'authenticate' event will be triggered.
       *  We support OAuth 2.0 implicit grant as well as authentication
       *  code flow. See http://tools.ietf.org/html/rfc6749 for details.
       *
       *  Not all authentication providers offer all flow types.
       *  For the authentication code flow, we will need a round trip
       *  via server proxy to exchange a temporary code for a permanent
       *  auth_token.
       *
       * @method request
       * @param {Window} A popup window instance
       */
      request: function(w) {
        w.location.href = this.formRequest();
        var deferred = when.defer(),
          resp,
          self = this,
          promise = deferred.promise;
        var poll = function() {
          try {
            if (w.location.href !== 'about:blank') {
              resp = self.fetchResponse(w);
            }
          } catch (e) {

            // TODO: not clear whether this makes sense
            if (e.isOAuthError) {
              throw e;
            }
          }
          if (_.isObject(resp)) {
            w.close();

            // we might get another promise, if we are 
            // using authentication code grant flow.
            // yield() resolves our original promise with
            // the outcome of the new promise.
            if (when.isPromise(resp)) {
              promise.yield(resp);
            } else {

              // directly resolve our current promise
              // to authenticate with implicit grant flow.
              resp = self.handleResponse(resp);
              deferred.resolve(resp);
              self.trigger('authenticate', self);
            }
            return;
          }
          setTimeout(poll, 100);
        };
        poll();
        return promise;
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
        var location = w.location,
          search = location.search,
          hash = location.hash,
          resp,
          responseErr = new Error('Unable to parse response!'),
          stateErr = new Error('Response does not contain required \'state\' ' +
            'parameter or state does not match. Possible CSRF detected!');
        _.mixin(responseErr, {
          isOAuthError: true
        });
        _.mixin(stateErr, {
          isOAuthError: true
        });
        switch (this.get('authParams').response_type) {

          // handle authorization code flow
          case 'code':
            if (search.search(/\?code=/) === -1) {
              throw responseErr;
            }
            var params = {},
              self = this;
            search.substr(1).split('&').forEach(function(v) {
              var p = v.split('=');
              params[p[0]] = p[1];
            });

            // check against XSRF attacks
            if (!params.state || params.state !== this.get('state')) {
              throw stateErr;
            }

            // start process to exchange temporary code for 
            // a permanent auth_token.
            // resp will end up as another promise, which we
            // will be returning.
            resp = when.promise(function(resolve, reject) {
              if (!params.code) {
                reject({
                  'error': 'bad response - `code` missing',
                  'response': resp
                });
              }
              var accessRequestURL,
                f = self.get('authParams').accessRequestURL;
              if (_.isFunction(f)) {
                accessRequestURL = f(params.code);
              } else {
                accessRequestURL = '/authenticate/' + params.code;
              }
              $.getJSON(accessRequestURL, function(data) {
                data = self.handleResponse(data);
                self.trigger('authenticate', self);
                resolve(data);
              });
            });
            break;

            // handle most simple implicit grant flow
          case 'token':
            if (hash.search(/access_token/) === -1) {
              throw responseErr;
            }
            resp = {};
            var a = hash.substr(1).split('&');
            _.forEach(a, function(q) {
              var k = q.split('=');
              resp[k[0]] = k[1];
            });

            // check against XSRF attacks
            if (!resp.state || resp.state !== this.get('state')) {
              throw stateErr;
            }
            break;
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
      createProfileView: function() {
        return new DefaultProfileView(this);
      }
    });


    /**
     * Collection of auth provider models.
     *
     * @class Collection
     */
    var Collection = Backbone.Collection.extend({

      model: Model,
      localStorage: new Backbone.LocalStorage('app.oauth.api.collection'),

      initialize: function() {
        this.on('authenticate load-profile', function(model) {
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
