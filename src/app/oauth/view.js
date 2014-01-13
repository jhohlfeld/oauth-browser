define(['lodash', 'backbone', './api/oauth',
    'ldsh!./tpl/view', 'ldsh!./tpl/profile',
    './api/google-plus', './api/facebook',
    /*'./microsoft-live', './stack-exchange',
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
            var el = $(event.target);
            el.addClass('active');
            this.trigger('select', el.data('key'));
        }
    });

    var ProfileView = Backbone.View.extend({

        template: tpl_profile,
        className: 'social-buttons-profile',

        events: {
            'click a.btn-login': 'authenticate',
            'click a.btn-logout': 'logout'
        },

        initialize: function() {
            this.listenTo(this.options.api, 'authenticate', function(api) {
                this.render();
                this.trigger('authenticate', api);
            });
        },

        render: function() {
            this.$el.html(this.template({
                api: this.options.api
            }));
            return this;
        },

        authenticate: function(event) {
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
