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
        setData: function(resp) {
            this.data = {
                displayName: resp.displayName,
                occupation: resp.occupation,
                skils: resp.skills,
                emailAddress: resp.emails[0].value,
                image: respimage.url
            }
        },

        render: function(data) {
            return tpl(this.data);
        },

        requestProfile: function() {
            var deferred = when.defer(),
                resolver = deferred.resolver,
                url = 'https://www.googleapis.com/plus/v1/people/me',
                params = _.map({
                    'access_token': this.access_token
                }, function(v, k) {
                    return k + '=' + encodeURI(v);
                }).join('&');

            console.log(url + '?' + params);
            $.ajax({
                url: url + '?' + params
            }).done(resolver.resolve).fail(resolver.reject);
            deferred.promise.then(_.bind(this.setData, this));
            return deferred.promise;
        }

    });

    return new GooglePlus(attributes);
});
