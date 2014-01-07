define(['lodash', 'backbone', 'when', 'crypto-js'], function(_, Backbone, when, CryptoJS) {

    /**
     * Auth provider profile.
     *
     * Authentication providers are organized in profiles
     * which extend from {oauth.Profile}.
     *
     * By overriding individual methods, it's possible to
     * customize the behavior of the authentication process.
     *
     * @class Profile
     */
    var Profile = function(config) {
        this.config = config;
        this.id = config.id;
        this.name = config.name;
    };

    /**
     * Extend.
     *
     * Creates a new class based on {Profile}. Used to
     * define new authentication provider profiles.
     *
     * Copy this over from the Backbone lib.
     *
     * @method extend
     */
    Profile.extend = Backbone.Model.extend;

    /**
     * Form the auth request.
     *
     * With this method, it's possible to override the behavior
     * how requests are formed.
     *
     * @method formRequest
     * @return {String} the request url with parameters
     */
    Profile.prototype.formRequest = function() {
        var randomNumber = Math.round(Math.random() * Math.pow(10, 16)),
            state = CryptoJS.SHA3(randomNumber.toString(16)),
            params = this.config.authParams;
        this.state = params['state'] = state.toString(CryptoJS.enc.Hex);
        return this.config.authUri + '?' + _.map(params, function(v, k) {
            return k + '=' + encodeURI(v);
        }).join('&');
    };

    /**
     * Request.
     *
     * Do the request.
     *
     * @method request
     * @param {Window} A popup window instance
     */
    Profile.prototype.request = function(w) {
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
                } else {
                    deferred.reject(resp);
                }
                return;
            }
            setTimeout(poll, 100);
        })();
        return deferred.promise;
    };

    /**
     * A way to fetch the response from the auth window.
     *
     * By overriding this method, it's possible to define
     * how authentication responses are extracted from
     * the client window.
     *
     * @method fetchResponse
     */
    Profile.prototype.fetchResponse = function(w) {
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
    };

    /**
     * Handle auth response.
     *
     * By overriing this, responses may be post-processed.
     *
     * @method handleResponse
     */
    Profile.prototype.handleResponse = function(resp) {
        this.response = resp;
        if (!this.response.error) {
            if (this.response.state != this.state) {
                throw new Error('State does not match, posible CSRF detected!');
            }
            this.access_token = this.response.access_token;
        }
        return this.response;
    };

    return Profile;
});
