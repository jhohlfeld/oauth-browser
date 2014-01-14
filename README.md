#OAuth browser

Experiment on the increasingly popular [oauth2][0] protocol. Various API providers already support this protocol in some form - including google plus, facebook and windows live.

##Getting started

Clone the repository

    $ git clone git@github.com:jhohlfeld/oauth-browser.git

If not already done, read about [grunt][3] and [bower][4].

Enter the cloned dir and run `bower install`

    $ cd oauth-browser
    $ bower install

With this command, install required 3rd party libs into the `src/lib/` directory and compile [less][5] into `src/css`:

    $ grunt dev

For now, we'll serve from `src/` dir (using python for convenience):

    $ cd src/
	$ python -m SimpleHTTPServer 4000 &

Of course you are free to use any web server on any port.

That's it! The server should now run on `localhost:4000` where you can access the project.


### Windows Live

Windows Live requires a unique auth redirect url other than `localhost:4000`. You have to set this to something more globally recognizable.

For instance `http://dev.peoplepool.netronaut.de:4000/` will do the job. 

To use this domain locally, you have to set the domain in the hosts config of your system. Under linux this would be:

    $ cat /etc/hosts
    127.0.0.1	localhost
	127.0.1.1	dev.peoplepool.netronaut.de



[0]: http://oauth.net/2/
[3]: http://gruntjs.com/
[4]: http://bower.io/
[5]: http://www.lesscss.de/
