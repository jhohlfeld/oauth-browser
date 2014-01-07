define(['./oauth', 'lodash'], function(Profile, _) {
    var config = {
        id: 'facebook',
        name: 'Facebook',
        authUri: 'https://www.facebook.com/dialog/oauth',
        authParams: {
            app_id: '568262759920841',
            client_id: 'ce767453b23218cdaf145b8dbb2aede7',
            redirect_uri: 'http://dev.peoplepool.netronaut.de:4000/blank.html',
            response_type: 'token',
            scope: 'email'
        }
    };

    return new Profile(config);
});
