define(['../oauth', 'lodash'], function(oauth, _) {
    var attributes = {
        id: 'github',
        name: 'GitHub',
        authUri: 'https://github.com/login/oauth/authorize',
        authParams: {
            response_type: 'code',
            client_id: '9c48eeb8190d5452b88c',
            redirect_uri: '',
            scope: 'user:email',
        }
    };

    return new oauth.Model(attributes);
});
