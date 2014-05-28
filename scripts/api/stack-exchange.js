'use strict';

define(['../oauth', 'lodash'], function(oauth, _) {
    var attributes = {
        id: 'stack-exchange',
        name: 'Stack Exchange',
        authUri: 'https://stackexchange.com/oauth/dialog',
        authParams: {
            response_type: 'token',
            client_id: '2388',
            redirect_uri: '',
            scope: 'read_inbox private_info'
        }
    };

    var StackExchange = oauth.Model.extend({
        handleResponse: function(resp) {
            if (resp.error) {
                throw new Error(resp);
            }
            this.set({
                'access_token': resp.access_token,
                'access_granted': new Date().getTime() / 1000,
                'expires_in': resp.expires ? parseInt(resp.expires) : 0
            });
            return _.extend(resp, this.get('access_granted'));
        }
    });

    return new StackExchange(attributes);
});
