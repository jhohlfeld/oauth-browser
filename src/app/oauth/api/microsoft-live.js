define(['../oauth'], function(oauth) {

    var attributes = {
        id: 'windows',
        name: 'Windows Live',
        authUri: 'https://login.live.com/oauth20_authorize.srf',
        authParams: {
            response_type: 'token',
            client_id: '000000004C10C936',
            redirect_uri: '',
            scope: 'wl.basic'
        },
    };

    return new oauth.Model(attributes);
});
