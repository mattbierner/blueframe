<div align="center">
    <div><img src="documentation/logo.png" /></div>
    <br>
    <br>
</div>

* [Try it out][site]
* [About and documentation][documentation]


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
[documentation]: documentation/about.md