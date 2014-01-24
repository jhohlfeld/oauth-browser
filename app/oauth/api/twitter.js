define(['lodash'], function(_) {
    var config = {
        name: 'Twitter',
        authUri: 'https://api.twitter.com/oauth/authorize',
        authParams: {
            client_id: '',
            redirect_uri: 'http://localhost:4000/blank.html',
            response_type: 'token',
            scope: '',
            state: ''   // unguessable random string!
        }
    };

    return config;
});
