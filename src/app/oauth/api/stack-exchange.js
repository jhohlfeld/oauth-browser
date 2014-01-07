define(['lodash', 'when', 'jquery'], function(_, when, $) {
    var config = {
        name: 'Stack Exchange',
        authUri: 'https://stackexchange.com/oauth/dialog',
        authParams: {
            client_id: '2388',
            redirect_uri: 'http://dev.peoplepool.netronaut.de:4000/blank.html',
            scope: 'read_inbox private_info'
        }
    };

    var api;

    return {
        init: function(Profile) {
            return api = Profile.apis['stack-exchange'] = new Profile(config);
        },

        requestProfile: function() {
            var deferred = when.deferred();
            $.get('https://api.stackexchange.com/2.1/me?order=desc&sort=reputation&site=stackoverflow');
            return deferred.promise;
        }
    };
});
