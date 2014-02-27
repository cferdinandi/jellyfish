# Jellyfish
A progressively enhanced image lazy loader. [View the demo](http://cferdinandi.github.io/jellyfish/).

**In This Documentation**

1. [Getting Started](#getting-started)
2. [Options & Settings](#options-and-settings)
3. [Browser Compatibility](#browser-compatibility)
4. [License](#license)
5. [Changelog](#changelog)
6. [Older Docs](#older-docs)



## Getting Started

### 1. Include Jellyfish on your site.

```html
<script src="js/jellyfish.js"></script>
```

Don't forget to add the `img/loading.gif` image to your site, too.

### 2. Add the markup to your HTML.

```html
<span data-lazy-load="img/elephant.jpg"></span>
<a data-lazy-load="img/friends.jpg" href="img/friends.jpg">
	View Photo
</a>
```

You can turn any `a`, `span`, or `div` tag into an image lazy loader by adding the `[data-lazy-load]` data attribute. If users should have access to the image even if Jellyfish isn't compatible with their browser or the JavaScript file fails to load, use a link that points to the image source instead of a `span` or `div`.

### 3. Initialize Jellyfish.

```html
<script>
	jellyfish.init();
</script>
```

In the footer of your page, after the content, initialize Jellyfish. And that's it, you're done. Nice work!



## Options and Settings

Jellyfish includes smart defaults and works right out of the box. But if you want to customize things, it also has a robust API that provides multiple ways for you to adjust the default options and settings.

### Global Settings

You can pass options and callbacks into Jellyfish through the `init()` function:

```javascript
jellyfish.init({
	loadingIcon: 'img/loading.gif', // Image to display when image is loading
	offset: 0, // How far below fold to begin loading images
	callbackBefore: function () {}, // Function to run before image is replaced
	callbackAfter: function () {} // Function to run after image is replaced
});
```

### Setting Image Attributes

You can set image attributes using the `[data-options]` data attribute:

```html
<a
	data-lazy-load="img/elephant"
	data-options="class: img-border;
	              id: elephant;
	              title: A picture of an elephant;
	              height: 728;
	              width: 1024;"
	href="img/elephant"
>
	View Image
</a>
```

You can even pass data attributes along to the image this way.

### Use Jellyfish events in your own scripts

You can also call Jellyfish's function to check for images in the viewport in your own scripts:

```javascript
jellyfish.checkForImages(
	images, // A node list of image selectors. ex. document.querySelectorAll('[data-lazy-load]')
	options // Classes and callbacks. Same options as those passed into the init() function.
);
```

**Example**

```javascript
var images = document.querySelectorAll('[data-lazy-load]');
var options = { offset: 200 };
jellyfish.checkForImages( images, options );
```



## Browser Compatibility

Jellyfish works in all modern browsers, and IE 9 and above.

Jellyfish is built with modern JavaScript APIs, and uses progressive enhancement. If the JavaScript file fails to load, or if your site is viewed on older and less capable browsers, links to the image files will be displayed instead (if you've used that method).



## License
Jellyfish is licensed under the [MIT License](http://gomakethings.com/mit/). Loading icon by [AjaxLoad](http://www.ajaxload.info/).



## Changelog
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

* [Version 1](http://cferdinandi.github.io/jellyfish/archive/v1/)