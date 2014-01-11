define(['lodash', 'backbone', './api/oauth',
    'ldsh!./tpl/login', 'ldsh!./tpl/profile',
    './api/google-plus', './api/facebook',
    /*'./microsoft-live', './stack-exchange',
    './linkedin'*/
], function(
    _, Backbone, oauth, tpl_login, tpl_profile) {

    "use strict"

    // provider profiles may be added beyond the third depenednecy
    var api_profiles = _.values(arguments).slice(5),
        apis = new oauth.Collection(api_profiles);

    /**
     * Login view..
     *
     * @class LoginView
     */
    var LoginView = Backbone.View.extend({
        template: tpl_login,
        className: 'social-buttons',

        initialize: function() {},

        bindEvents: function() {
            var self = this;
            apis.forEach(function(api) {
                var cb = _.bind(self.authenticate, self, api);
                self.$('.btn-' + api.get('id')).on('click', cb);
            });
        },

        render: function() {
            this.$el.html(this.template({
                apis: apis
            }));
            this.bindEvents();
            return this;
        },

        authenticate: function(api, event) {
            var self = this,
                w = window.open();
            api.request(w).then(function(resp) {
                self.trigger('authenticate', api, resp);
            });
        }
    });

    var ProfileView = Backbone.View.extend({

        className: 'social-profile',

        initialize: function() {
            this.api = this.options.api;
            this.data = this.api.getData(this.options.response);
        },

        render: function() {
            this.$el.html(this.api.render(this.data));
            return this;
        }
    });

    return {
        LoginView: LoginView,
        ProfileView: ProfileView
    };
});
