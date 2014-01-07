define(['lodash', 'backbone'], function(_, Backbone) {

    var config = {
        name: 'Microsoft Live',
        authParams: {
            response_type: 'token',
            client_id: '000000004C10C936',
            redirect_uri: 'http://dev.peoplepool.netronaut.de:4000/blank.html',
            scope: 'wl.basic'
        },
        authUri: 'https://login.live.com/oauth20_authorize.srf'
    };

    return {
        init: function(Profile) {
            return Profile.apis['windows'] = new Profile(config);
        }
    };
});
