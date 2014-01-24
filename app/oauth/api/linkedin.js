define(['lodash', 'backbone'], function(_, Backbone) {

    var config = {
        name: 'LinkedIn',
        authParams: {
            response_type: 'code',
            client_id: '77holikjq9s0x2',
            redirect_uri: 'http://dev.peoplepool.netronaut.de:4000/blank.html',
            scope: 'r_basicprofile r_fullprofile r_emailaddress',
            state: ''
        },
        authUri: 'https://www.linkedin.com/uas/oauth2/authorization'
    };

    return {
        init: function(Profile) {
            Profile.apis['linkedin'] = new Profile(config);
        }
    }
});
