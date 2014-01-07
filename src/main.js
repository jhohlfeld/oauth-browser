requirejs.config({
    baseUrl: '',
    paths: {
        jquery: 'lib/jquery/jquery',
        backbone: 'lib/backbone/backbone',
        'backbone_p': 'lib/backbone.plugin',
        lodash: 'lib/lodash/js/lodash',
        when: 'lib/when/when',

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
            underscore: 'lodash'
        }
    },
    shim: {
        'backbone': {
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

require(['jquery', 'app/oauth/view', 'lib/jquery.plugin', 'when'],
    function($, oauth, jqp, when) {
        $.loadCSS([
            'css/main.css',
            '//netdna.bootstrapcdn.com/font-awesome/4.0.1/css/font-awesome.css'
        ]);

        var login = new oauth.LoginView();
        login.render().$el.appendTo($('body'));

        var deferred = when.defer(),
            profileResolver = deferred.resolver;

        login.on('authenticate', function(api) {
            debugger;
            console.log('authenticated using ' + api.name);
            console.log(api.response);
            
            when.chain(api.requestProfile(), profileResolver, api);
        });

        deferred.promise.then(function(api) {
            console.log('displaying profile view');
            var profileView = new oauth.ProfileView({
                api: api
            });
            profileView.render().$el.appendTo('body');
        });
    });
