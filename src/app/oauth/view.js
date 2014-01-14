define(['lodash', 'backbone', './api/oauth',
    'ldsh!./tpl/view', 'ldsh!./tpl/profile',
    './api/google-plus', './api/facebook',
    './api/microsoft-live'/*, './stack-exchange',
    './linkedin'*/
], function(
    _, Backbone, oauth, tpl_view, tpl_profile) {

    "use strict"

    /**
     * Login view..
     *
     * @class BrowserView
     */
    var BrowserView = Backbone.View.extend({

        template: tpl_view,
        className: 'social-buttons container',

        events: {
            'click .provider-list a': 'select'
        },

        initialize: function() {},

        render: function() {
            this.$el.html(this.template({
                apis: this.options.apis
            }));
            return this;
        },

        select: function(event) {
            this.$('.active').removeClass('active');
            var el = _.isObject(event) ? $(event.target) : this.$('[data-key=' + event + ']');
            el.addClass('active');
            this.trigger('select', el.data('key'));
        }
    });

    var ProfileView = Backbone.View.extend({

        template: tpl_profile,
        className: 'social-buttons-profile',

        events: {
            'click a.btn-login': 'login',
            'click a.btn-logout': 'logout'
        },

        initialize: function() {
            var api = this.options.api;
            this.listenTo(api, 'authenticate', function(api) {
                this.render();
                this.trigger('authenticate', api);
            });
        },

        render: function(profile) {
            var api = this.options.api;
            this.$el.html(this.template({
                api: api
            }));
            if (api.isActive()) {
                var self = this;
                api.renderProfile().then(function(html) {
                    self.$('#profile-' + api.id).html(html);
                });
            }
            return this;
        },

        login: function(event) {
            var self = this,
                w = window.open(),
                api = this.options.api;
            api.request(w);
        },

        logout: function(event) {
            this.options.api.invalidate();
            this.render();
            this.trigger('logout');
        }

    });

    // provider profiles may be added beyond the fifth dependency
    var api_profiles = _.values(arguments).slice(5);

    var apiCollection = new oauth.Collection(api_profiles);
    apiCollection.fetch({
        remove: false
    });

    return {
        BrowserView: BrowserView,
        ProfileView: ProfileView,
        apiCollection: apiCollection
    };
});
