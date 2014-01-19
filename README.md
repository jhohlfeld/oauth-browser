#OAuth browser

Experiment on the increasingly popular [OAuth 2.0][0] protocol.

OAuth lets the user of your web application authenticate via third party service and return an authenticated session token from that service. Various OAuth service providers already exist - for instance google Plus, Facebook, Twitter, GitHub, just to name a few. 

What we need is doing some research about which are the providers offering the service and how each provider's api is used. Though the protocol is very clear and simple, it is also very open and different providers behave differently. Quite a lot of them do not support the full range of the protocol.

To showcase each providers cpabilities, we plan to implement a unified interface, based on [backbone][10], [bootstrap][11] and [requirejs][12]. We'll then create some simple views that let the user log in and show some limited profile information from each provider.

In a first step, we'll cover the providers that offer webclient-only, [implicit grant][20] flow. After that, we'll implement some server modules for each of the providers that restrain to offer [authorization coder grant][21] flow.

##Roadmap

For roadmap and progress information see our [Trello Project Board][1].

##Getting started

Clone the repository

    $ git clone git@github.com:jhohlfeld/oauth-browser.git

If not already done, read about [grunt][3] and [bower][4].

Enter the cloned dir and run `bower install`

    $ cd oauth-browser
    $ bower install

With this command, install required 3rd party libs into `src/lib/` directory and compile [less][5] into `src/css`:

    $ grunt dev

For now, we'll serve from `src/` dir (using python for convenience):

    $ cd src/
	$ python -m SimpleHTTPServer 4000 &

Of course you are free to use any web server on any port.

Now the server should now run on `localhost:4000` where you can access the project.

To actually use this service, please read ahead:

### Windows Live

Windows Live requires a unique auth redirect url other than `localhost:4000`. You have to set it to something more globally recognizable.

As of now, we configured this application with `http://dev.peoplepool.netronaut.de:4000/`. To use this domain locally, you have to update your machine's hosts config. Under linux this would be:

    $ cat /etc/hosts
    127.0.0.1	localhost
	127.0.1.1	dev.peoplepool.netronaut.de

As a matter of fact, due to the limitations of windows live, we decided to take this route for all our providers. As many providers (GitHub for instance) do not allow to configure multiple redirect uris (as Google Plus does), we have to pick a host name that works for apis.


[1]: https://trello.com/b/eiTVEUdf/oauth-browser

[0]: http://oauth.net/2/
[3]: http://gruntjs.com/
[4]: http://bower.io/
[5]: http://www.lesscss.de/

[10]: http://backbonejs.org/
[11]: http://getbootstrap.com/
[12]: http://requirejs.org/

[20]: http://tools.ietf.org/html/rfc6749#section-4.2
[21]: http://tools.ietf.org/html/rfc6749#section-4.1
