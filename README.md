# Jellyfish [![Build Status](https://travis-ci.org/cferdinandi/jellyfish.svg)](https://travis-ci.org/cferdinandi/jellyfish)
A progressively enhanced image and iframe lazy loader.

[Download Jellyfish 3](https://github.com/cferdinandi/jellyfish/archive/master.zip) / [View the demo](http://cferdinandi.github.io/jellyfish/)

**In This Documentation**

1. [Getting Started](#getting-started)
2. [Installing with Package Managers](#installing-with-package-managers)
3. [Options & Settings](#options-and-settings)
4. [Browser Compatibility](#browser-compatibility)
5. [How to Contribute](#how-to-contribute)
6. [License](#license)
7. [Changelog](#changelog)
8. [Older Docs](#older-docs)



## Getting Started

Compiled and production-ready code can be found in the `dist` directory. The `src` directory contains development code. Unit tests are located in the `test` directory.

### 1. Include Jellyfish on your site.

```html
<script src="js/jellyfish.js"></script>
```

Don't forget to add the `img/loading.gif` image to your site, too.

### 2. Add the markup to your HTML.

```html
<div data-lazy-load="img/elephant.jpg">
	<a href="img/elephant.jpg">View Photo</a>
</div>
```

You can turn any `<p>`, `<span>`, or `<div>` tag into an image lazy loader by adding the `[data-lazy-load]` data attribute. If users should have access to the image even if Jellyfish isn't compatible with their browser or the JavaScript file fails to load, include a link that points to the image source inside the wrapper element. Jellyfish will remove it when initialized.

### 3. Initialize Jellyfish.

```html
<script>
	jellyfish.init();
</script>
```

In the footer of your page, after the content, initialize Jellyfish. And that's it, you're done. Nice work!



## Installing with Package Managers

You can install Jellyfish with your favorite package manager.

* **NPM:** `npm install cferdinandi/jellyfish`
* **Bower:** `bower install https://github.com/cferdinandi/jellyfish.git`
* **Component:** `component install cferdinandi/jellyfish`



## Options and Settings

Jellyfish includes smart defaults and works right out of the box. But if you want to customize things, it also has a robust API that provides multiple ways for you to adjust the default options and settings.

### Global Settings

You can pass options and callbacks into Jellyfish through the `init()` function:

```javascript
jellyfish.init({
	icon: 'img/loading.gif', // Image to display when image is loading
	offset: 0, // How far below fold to begin loading images
	type: 'img', // Type of content to load ('img' or 'iframe')
	callbackBeforeIcons: function ( wrappers ) {}, // Function to run before icon is loaded
	callbackAfterIcons: function ( wrappers ) {}, // Function to run after icon is loaded
	callbackBeforeContent: function ( wrapper ) {}, // Function to run before content is loaded
	callbackAfterContent: function ( wrapper ) {} // Function to run after content is loaded
});
```

### Override settings with data attributes

Jellyfish also lets you override global settings on a content-by-content basis using the `[data-options]` data attribute:

```html
<div
	data-lazy-load="img/elephant.jpg"
	data-options="icon: img/loading-alt.gif;
	              offset: 50;
	              type: iframe;"

>
	<a href="img/elephant.jpg">View Image</a>
</div>
```

### Setting Content Attributes

You can set content attributes using the `[data-load-attributes]` data attribute:

```html
<div
	data-lazy-load="img/elephant.jpg"
	data-load-attributes="class: img-border;
	                      id: elephant;
	                      title: A picture of an elephant;
	                      height: 728;
	                      width: 1024;
	                      data-name: Dumbo;"
>
	<a href="img/elephant.jpg">View Image</a>
</div>
```

You can even pass data attributes along to the image or iframe this way. Here's what the example above would look like after being lazy loaded:

```html
<div data-lazy-load="img/elephant.jpg" data-load-attributes="class: img-border; id: elephant; title: A picture of an elephant; height: 728; width: 1024;">
	<img
		class="img-border"
		id="elephant"
		title="A picture of an elephant"
		height="728"
		width="1024"
		data-name="Dumbo"
		src="img/elephant.jpg"
	>
</div>
```

### Use Jellyfish events in your own scripts

You can also call Jellyfish's function to check for images in the viewport in your own scripts&mdash;useful if you've added content after the DOM has loaded:

```javascript
// Replace placeholders with loading graphics
jellyfish.addLoadingIcons(
	wrappers, // A node list of content selectors. ex. document.querySelectorAll('[data-lazy-load]')
	options // Classes and callbacks. Same options as those passed into the init() function.
);

// Load content that's in the viewport
jellyfish.checkViewport(
	wrappers, // A node list of content selectors. ex. document.querySelectorAll('[data-lazy-load]')
	options // Classes and callbacks. Same options as those passed into the init() function.
);
```

**Example 1**

```javascript
var wrappers = document.querySelectorAll('[data-lazy-load]');
var options = { icon: 'img/loading.gif' };
jellyfish.addLoadingIcons( wrappers, options );
```

**Example 2**

```javascript
var wrappers = document.querySelectorAll('[data-lazy-load]');
var options = { offset: 200 };
jellyfish.checkViewport( wrappers, options );
```



## Browser Compatibility

Jellyfish works in all modern browsers, and IE 9 and above.

Jellyfish is built with modern JavaScript APIs, and uses progressive enhancement. If the JavaScript file fails to load, or if your site is viewed on older and less capable browsers, links to the image files will be displayed instead (if you've used that method).



## How to Contribute

In lieu of a formal style guide, take care to maintain the existing coding style. Don't forget to update the version number, the changelog (in the `readme.md` file), and when applicable, the documentation.



## License
Jellyfish is licensed under the [MIT License](http://gomakethings.com/mit/). Loading icon by [AjaxLoad](http://www.ajaxload.info/).



## Changelog

* v3.2.1 - June 28, 2014
	* Fixed `extend()` method.
* v3.2.0 - June 20, 2014
	* Converted to gulp.js workflow.
	* Added unit testing.
	* Updated naming conventions.
	* Added minified versions of files.
* v3.1.1 - June 19, 2014
	* Fixed factory/root/UMD definition.
* v3.1.0 - June 8, 2014
	* Added UMD support.
	* Moved public APIs to exports variable.
	* Improved feature test.
	* Replaced `Array.prototype.forEach` hack with proper `forEach` function.
	* Added a more well supported `trim` function.
	* General code optimizations for better minification and performance.
	* Updated to JSDoc documentation.
	* Updated to three number versioning system.
	* Added package manager installation info.
* v3.0 - March 20, 2014
	* [Added iframe lazy loading support.](https://github.com/cferdinandi/jellyfish/issues/3)
	* Renamed `data-options` attribute to `data-load-attributes`.
	* [Added options overrides on a content-by-content basis.](https://github.com/cferdinandi/jellyfish/issues/3)
	* Added callbacks during icon loading phase.
	* Renamed various private and public functions to account increased types of content that can be loaded.
* v2.4 - March 19, 2014
	* Passed arguments into callback functions.
* v2.3 - February 28, 2014
	* Added `addImgLoaders` to publicly available methods.
* v2.2 - February 27, 2014
	* Converted `_defaults` to a literal object
* v2.1 - Feburary 25, 2014
	* Fixed callbacks.
* v2.0 - February 24, 2014
	* Better public/private method namespacing.
	* Require `init()` call to run.
	* New API exposes additional methods for use in your own scripts.
	* Better documentation.
* v1.1 - Feburary 19, 2014
	* Added an option to start loading images before they enter the viewport.
* v1.0 - February 19, 2014
	* Initial release.



## Older Docs

* [Version 2](https://github.com/cferdinandi/jellyfish/tree/archive-v2)
* [Version 1](http://cferdinandi.github.io/jellyfish/archive/v1/)