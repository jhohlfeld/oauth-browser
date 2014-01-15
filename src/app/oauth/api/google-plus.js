"use strict"
define(['../oauth', 'lodash', 'backbone', 'when', 'jquery',
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

    var ProfileView = oauth.ProfileView.extend({
        handleResponse: function(resp) {
            return {
                displayName: resp.displayName,
                occupation: resp.occupation,
                skills: resp.skills,
                emailAddress: resp.emails[0].value,
                image: resp.image.url,
                url: resp.url
            };
        }
    });

    var GooglePlus = oauth.Model.extend({

        getProfileView: function() {
            return new ProfileView({
                accessToken: this.get('access_token'),
                modelClass: Backbone.Model,
                template: tpl,
                url: 'https://www.googleapis.com/plus/v1/people/me'
            })
        }

    });

    return new GooglePlus(attributes);
});
