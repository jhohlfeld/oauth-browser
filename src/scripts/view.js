define(['lodash', 'jquery', 'backbone', './oauth',
  'ldsh!./tpl/main', 'ldsh!./tpl/detail',

  /**
    simply add apis by adding dependencies 
    the script below will fetch the apis from `arguments`.
  */
  './api/google-plus', './api/facebook',
  './api/microsoft-live', './api/github',
  './api/stack-exchange'

], function(
  _, $, Backbone, oauth, tplMain, tplDetail) {

  'use strict';

  /**
   * The main view.
   *
   * @class BrowserView
   */
  var BrowserView = Backbone.View.extend({

    template: tplMain,
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


  /**
   * View that displays the api details.
   *
   * @class DetailView
   */
  var DetailView = Backbone.View.extend({

    template: tplDetail,
    className: 'social-buttons-profile',

    events: {
      'click a.btn-login': 'login',
      'click a.btn-logout': 'logout'
    },

    initialize: function() {
      var api = this.options.api;
      this.apiProfileView = api.createProfileView();
      this.listenTo(api, 'authenticate', function(api) {
        this.render();
        this.trigger('authenticate', api);
      });
    },

    render: function() {
      var api = this.options.api;
      this.$el.html(this.template({
        api: api
      }));

      // if logged in, render profile view
      if (api.isActive()) {
        this.$('.profile-view')
          .before(this.apiProfileView.render().$el)
          .remove();
      }
      return this;
    },

    login: function() {
      var w = window.open(),
        api = this.options.api;
      api.request(w).then(function(response, err) {

        // TODO: proper error handling!
        if (err) {
          console.err(err);
        }
      });
    },

    logout: function() {
      this.options.api.invalidate();
      this.render();
      this.trigger('logout');
    }

  });

  // provider profiles may be added beyond the sixth dependency
  var apiProfiles = _.values(arguments).slice(6);

  var apiCollection = new oauth.Collection(apiProfiles);
  apiCollection.fetch({
    remove: false
  });

  return {
    BrowserView: BrowserView,
    DetailView: DetailView,
    apiCollection: apiCollection
  };
});
