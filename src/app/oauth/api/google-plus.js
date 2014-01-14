"use strict"
define(['./oauth', 'lodash', 'backbone', 'when', 'jquery',
    'ldsh!./tpl/google-plus'
], function(oauth, _, Backbone, when, $, tpl) {

    var attributes = {
        id: 'google-plus',
        name: 'Google Plus',
        authUri: 'https://accounts.google.com/o/oauth2/auth',
        authParams: {
            response_type: 'token',
            client_id: '498863542464-5rjn9g912doqridict2ron9b3bk15abm.apps.googleusercontent.com',
            redirect_uri: '',
            scope: 'profile email'
        },
    };

    var GooglePlus = oauth.Model.extend({

        renderProfile: function() {
            var d,
                self = this,
                deferred = when.defer();
            if (d = this.get('profile_data')) {
                return deferred.resolve(tpl(d));
            }
            this.requestProfile().then(function(resp) {
                var data = {
                    displayName: resp.displayName,
                    occupation: resp.occupation,
                    skills: resp.skills,
                    emailAddress: resp.emails[0].value,
                    image: resp.image.url,
                    url: resp.url
                };
                self.set('profile_data', data);
                deferred.resolve(tpl(data));
            });
            return deferred.promise;
        },

        requestProfile: function() {
            var deferred = when.defer(),
                resolver = deferred.resolver,
                url = 'https://www.googleapis.com/plus/v1/people/me',
                params = _.map({
                    'access_token': this.get('access_token')
                }, function(v, k) {
                    return k + '=' + encodeURI(v);
                }).join('&');
            $.ajax({
                url: url + '?' + params
            }).done(resolver.resolve).fail(resolver.reject);
            return deferred.promise;
        }

    });

    return new GooglePlus(attributes);
});
