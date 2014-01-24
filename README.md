#OAuth browser

Experiment on the [OAuth 2.0][0] protocol.

You find a demo page [here][30].

OAuth lets the user of your web application authenticate using a third party service. A number of OAuth service providers already exist - for instance Google Plus, Facebook, Twitter, GitHub, just to name a few. 

The goal of this experiment is to find out which providers are out there offering the service and how I can use the provider's api in each case. Though the protocol is very clear and simple, it's also very flexible and unrestrictive. Different providers implement the protocol to different grades, sometimes using different declarations etc.

To showcase each providers capabilities, I created a unified interface based on [backbone][10], [bootstrap][11] and [requirejs][12]. There are already some simple views that let the user log in and show some limited profile information from the selected provider.

In a first step, I will cover the providers that offer webclient-only, [implicit grant][20] flow. After that, I'll implement some server modules for each of the providers that restrain to offer [authorization coder grant][21] flow.

##Roadmap

For roadmap and progress information see my [Trello Project Board][1].

##Getting started

Clone the repository

    $ git clone git@github.com:jhohlfeld/oauth-browser.git

If not already done, read about [grunt][3] and [bower][4]. You'll need [node.js][2], obviously.

Enter the cloned dir and run `bower install`

    $ cd oauth-browser
    $ bower install

With this command, install required 3rd party libs into `src/lib/` directory and compile [less][5] into `src/css`:

    $ grunt dev

For now, we'll serve from `src/` dir. There is a server for development purposes written in javascript:

    $ cd src/
	$ node server.js &

The server will start on `localhost:4000`, where you can view the rendered pages. To actually use this service, please read ahead:

### Windows Live

Windows Live requires a unique auth redirect url other than `localhost:4000`. You have to set it to something more globally recognizable.

As of now, we configured this application with `http://dev.peoplepool.netronaut.de:4000/`. To use this domain locally, you have to update your machine's hosts config. Under linux this would be:

    $ cat /etc/hosts
    127.0.0.1	localhost
	127.0.1.1	dev.peoplepool.netronaut.de

As a matter of fact, due to the limitations of windows live, we decided to take this route for all our providers. As many providers (GitHub for instance) do not allow to configure multiple redirect uris (as Google Plus does), we have to pick a host name that works for apis.


[1]: https://trello.com/b/eiTVEUdf/oauth-browser

[0]: http://oauth.net/2/
[2]: http://nodejs.org/
[3]: http://gruntjs.com/
[4]: http://bower.io/
[5]: http://www.lesscss.de/

[10]: http://backbonejs.org/
[11]: http://getbootstrap.com/
[12]: http://requirejs.org/

[20]: http://tools.ietf.org/html/rfc6749#section-4.2
[21]: http://tools.ietf.org/html/rfc6749#section-4.1

[30]: http://www.netronaut.de/oauth-browser/
