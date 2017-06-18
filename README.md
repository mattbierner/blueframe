<div align="center">
    <div><img src="documentation/logo.png" /></div>
    <br>
    <br>
</div>

* [Try it out][site]

> Nobody knows they saw it but they did - *Fight Club*

*blueframe* is a experiment that splices a single frame of pornography into any old gif. After picking a gif using [giphy](https://giphy.com) the site  randomly inserts a blue frame from a small set of pornographic image sources into that gif. The new frame is shown so quicly as to almost be subliminal. 


## Building and Running
The website uses [Jekyll](http://jekyllrb.com/) and [Webpack](http://webpack.github.io/) for building:

```bash
$ git checkout gh-pages
$ npm install
```

Start Jekyll with:

```bash
$ jekyll serve -w
```

Start webpack with:

```bash
$ webpack --watch
```

Main TypeScript code is in `src` and output to `dist` folder.


[site]: https://mattbierner.github.io/blueframe/
