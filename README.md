#OAuth browser

Experiment on various web service's oauth capabilities - including google plus, facebook and windows live.

##Getting started

Check it out

    $ git clone git@github.com:jhohlfeld/oauth-browser.git

If not already done, read about [grunt][3] and [bower][4].

In the checked-out project dir, run

    $ bower install

and to install needed 3rd party libs into the `src/lib/` directory:

    $ grunt dev

Then, to create a server, cd into 'src/' dir

    $ cd src/

and run a web server (i.e. using python's simple http module)

	$ python -m SimpleHTTPServer 4000 &

That's it! The server should now run on `localhost:4000` where you can access the project.


[3]: http://gruntjs.com/
[4]: http://bower.io/
