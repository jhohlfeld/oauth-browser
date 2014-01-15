define(['../oauth', 'ldsh!./tpl/facebook'], function(oauth, tpl) {

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

    var Facebook = oauth.Model.extend({
        getProfileView: function() {
            return new oauth.ProfileView({
                accessToken: this.get('access_token'),
                template: tpl,
                url: 'https://graph.facebook.com/me'
            });
        }
    });

    return new Facebook(attributes);
});
