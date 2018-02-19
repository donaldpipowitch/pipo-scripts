* `pkg.main`: fully transpiled as CMS
* `pkg.module`: fully transpiled as ESM (We'll need to wait for [this issue](https://github.com/webpack/webpack/issues/2933) to use this, if our source code contains webpack specific stuff.)  
* `pkg.webpackModule`: also fully transpiled as ESM, but contains webpack specific stuff
* `pkg.webpack`: raw untranspiled source code