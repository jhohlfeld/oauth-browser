define(['./oauth', 'lodash'], function(oauth, _) {
    var attributes = {
        id: 'facebook',
        name: 'Facebook',
        authUri: 'https://www.facebook.com/dialog/oauth',
        authParams: {
            app_id: '568262759920841',
            response_type: 'token',
            client_id: 'ce767453b23218cdaf145b8dbb2aede7',
            redirect_uri: '',
            scope: 'email'
        }
    };

    return new oauth.Model(attributes);
});
