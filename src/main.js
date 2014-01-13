requirejs.config({
    baseUrl: '',
    paths: {
        jquery: 'lib/jquery/jquery',
        backbone_org: 'lib/backbone/backbone',
        'backbone_p': 'lib/backbone.plugin',
        lodash: 'lib/lodash/js/lodash',
        when: 'lib/when/when',
        store: 'lib/store.js/store',

        bootstrap: 'lib/bootstrap/bootstrap',
        'backbone.epoxy': 'lib/backbone.epoxy/backbone.epoxy',
        'backbone.localStorage': 'lib/backbone.localStorage/backbone.localStorage',
        'crypto-js': 'lib/crypto-js/rollups/sha3',

        /* requirejs plugins */
        ldsh: 'lib/lodash-template-loader/loader',
        async: 'lib/requirejs-plugins/async',
        font: 'lib/requirejs-plugins/font',
        goog: 'lib/requirejs-plugins/goog',
        image: 'lib/requirejs-plugins/image',
        json: 'lib/requirejs-plugins/json',
        noext: 'lib/requirejs-plugins/noext',
        mdown: 'lib/requirejs-plugins/mdown',
        text: 'lib/requirejs-plugins/text',
        propertyParser: 'lib/requirejs-plugins/propertyParser',
        markdownConverter: 'lib/requirejs-plugins/Markdown.Converter',
    },
    map: {
        '*': {
            underscore: 'lodash',
            backbone: 'backbone_p'
        }
    },
    shim: {
        'backbone_org': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'bootstrap': {
            deps: ['jquery']
        },
        'crypto-js': {
            exports: 'CryptoJS'
        }
    }
});

require(['jquery', 'app/oauth/view', 'lib/jquery.plugin', 'when',
        'app/oauth/api/oauth'
    ],
    function($, oauthview, jqp, when, oauth) {


        var profile, apis = oauthview.apiCollection,
            browser = new oauthview.BrowserView({
                apis: apis
            });
        browser.on('select', function(key) {
            if (profile) {
                profile.$el.remove();
            }
            profile = new oauthview.ProfileView({
                api: apis.get(key)
            });
            profile.on('authenticate', function(api) {
                console.log('authenticated using ' + api.get('name'));
                console.log(api.attributes);

                // when.chain(api.requestProfile(), profileResolver, api);
            });
            profile.render().$el.appendTo('.social-buttons-details');
        });
        browser.render().$el.appendTo($('body'));

        // var deferred = when.defer(),
        //     profileResolver = deferred.resolver;


        // deferred.promise.then(function(api) {
        //     console.log('displaying profile view');
        //     var profileView = new oauthview.ProfileView({
        //         api: api
        //     });
        //     profileView.render().$el.appendTo('body');
        // });
    });
