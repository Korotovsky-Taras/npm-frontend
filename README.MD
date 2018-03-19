# About:

> empty

# Getting Started:

1.  clone the repo in the directory you wish to have your project in `git clone git://github.com/Korotovsky-Taras/npm-frontend.git <project-name>`
2.  run the command `npm install`
3.  run the command `npm run dev`

# Installing A Javascript Package:

1.  Install your package with [npm](https://npmjs.org) `npm install <package-name> --save`
2.  Import it in your main javascript file in`./src/babel/script.js` Using `import package from 'package';`

# Installing a CSS library:

1.  install your package with [npm](https://npmjs.org) `npm install <package-name> --save`
2.  Import your package by placing the package's name in the `./src/sass/_vendor.scss` file
*   `@import '<package-name>'`
*   `@import 'normalize-css'` as an example
