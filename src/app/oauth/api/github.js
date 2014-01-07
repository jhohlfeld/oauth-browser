define(['lodash'], function(_) {
    var config = {
        name: 'GitHub',
        authUri: 'https://github.com/login/oauth/authorize',
        authParams: {
            client_id: '9c48eeb8190d5452b88c',
            redirect_uri: 'http://localhost:4000/blank.html',
            response_type: 'token',
            scope: 'user:email',
            state: ''   // unguessable random string!
        }
    };

    return config;
});
