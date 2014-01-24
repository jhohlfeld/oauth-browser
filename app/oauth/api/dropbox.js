define(['lodash', 'backbone'], function(_, Backbone) {

    var config = {
        name: 'Dropbox',
        authParams: {
            response_type: 'token',
            client_id: 'cfi9r0nskhhazg6',
            redirect_uri: 'http://localhost:4000/blank.html',
            scope: '',
            state:''    // protection against CSRF!!
        },
        authUri: 'https://www.dropbox.com/1/oauth2/authorize'
    };

    return config;
});
