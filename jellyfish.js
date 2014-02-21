/* =============================================================

	Jellyfish v2.0
	A progressively enhanced image lazy loader, by Chris Ferdinandi.
	http://gomakethings.com

	Check for image in viewport provided by "Dan".
	http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport/7557433#7557433

	Free to use under the MIT License.
	http://gomakethings.com/mit/

	// TODO: Convert various data attributes into single data-options parser

 * ============================================================= */

window.jellyfish = (function (window, document, undefined) {

	'use strict';

	// Replace div, span, or link with image loading graphic
	// Private method
	var _createImgLoader = function ( img, loadingIcon ) {

		// Selectors and variables
		var loadingImg = document.createElement( 'img' );
		var dataImg = img.getAttribute( 'data-img' );
		var dataOptions = img.getAttribute( 'data-options' );

		// Set image attritibutes
		loadingImg.setAttribute( 'data-lazy-load', '' );
		loadingImg.setAttribute( 'data-img', dataImg );
		if ( dataOptions !== null ) {
			loadingImg.setAttribute( 'data-options', dataOptions );
		}
		loadingImg.setAttribute( 'src', loadingIcon );
		img.parentNode.replaceChild( loadingImg, img );

	};

	// For each lazy load image, replace the default placeholder with a loading graphic
	// Private method
	var _addImgLoaders = function ( images, loadingIcon ) {
		Array.prototype.forEach.call(images, function (img, index) {
			_createImgLoader( img, loadingIcon );
		});
	};

	// Check if an image is visible in the viewport
	// Boolean: Returns true/false
	var _isImgInViewport = function ( img, offset ) {
		var distance = img.getBoundingClientRect();
		console.log(offset);
		return (
			distance.top >= 0 &&
			distance.left >= 0 &&
			distance.bottom <= (window.innerHeight + offset || document.documentElement.clientHeight + offset) &&
			distance.right <= (window.innerWidth || document.documentElement.clientWidth)
		);
	};

	// Convert data-options attribute into an object of key/value pairs
	// Private method
	// Returns {object}
	var _getDataOptions = function ( options ) {

		if ( options === null ) {
			return null;
		} else {
			var settings = {}; // Create settings object
			options = options.split(';'); // Split into array of options

			// Create a key/value pair for each setting
			options.forEach( function(option) {
				option = option.trim();
				option = option.split(':');
				settings[option[0]] = option[1].trim();
			});

			return settings;
		}

	};

	// Pass data attribute values to the image and remove the data attribute
	// Private method
	var _setImgAttributes = function ( img, attributes ) {
		if ( attributes !== null ) {
			for ( var key in attributes ) {
				img.setAttribute( key, attributes[key] );
			}
		}
	};

	// Replace the loading graphic with the actual image
	// Private method
	var _replaceImg = function ( img ) {

		// Get image attributes
		var newImg = img.getAttribute( 'data-img' );
		var options = _getDataOptions( img.getAttribute( 'data-options' ) );

		// Replace image attributes
		_setImgAttributes( img, options );
		img.setAttribute( 'src', newImg );
		img.removeAttribute( 'data-img' );
		img.removeAttribute( 'data-options' );

	};

	// If the image is visibile in the viewport, replace the loading graphic with the real image
	// Private method
	var _loadImg = function ( img, offset ) {
		if ( _isImgInViewport( img, offset ) && img.hasAttribute('data-img') !== null && !img.hasAttribute('data-img-loaded') ) {
			_replaceImg( img );
			img.setAttribute( 'data-img-loaded', '' );
		}
	};

	// Check if any lazy load images are visible in the viewport
	// Private method
	var _checkForImages = function ( images, offset ) {
		Array.prototype.forEach.call(images, function (img, index) {
			_loadImg( img, offset );
		});
	};

	// On window scroll and resize, only run `_checkForImages` at a rate of 15fps for better performance
	// Private method
	var _eventThrottler = function ( eventTimeout, images, offset ) {
		if ( !eventTimeout ) {
			eventTimeout = setTimeout( function() {
				eventTimeout = null;
				_checkForImages( images, offset );
			}, 66);
		}
	};

	// Initalize Jellyfish
	// Public method
	var init = function ( options ) {

		// Feature test before initializing
		if ( 'querySelector' in document && 'addEventListener' in window && Array.prototype.forEach ) {

			// Options and defaults
			options = options || {};
			var loadingIcon = options.loadingIcon || 'img/loading.gif'; // Loading icon location
			var offset = parseInt(options.offset, 10) || 0; // How far below the fold to start loading images (in pixels)

			// Selectors and variables
			var images = document.querySelectorAll('[data-lazy-load]'); // Get all lazy load images
			var eventTimeout; // Timer for event throttler

			// Only run Jellyfish if lazy load images exist on the page
			if ( images.length !== 0 ) {

				_addImgLoaders( images, loadingIcon ); // replace placeholders with loading graphics
				images = document.querySelectorAll('[data-lazy-load]'); // Reset image variable with new ndoes
				_checkForImages( images, offset ); // check if any images are visible on load

				// check if any images are visible on scroll or resize
				window.addEventListener('scroll', _eventThrottler.bind( this, eventTimeout, images, offset ), false);
				window.addEventListener('resize', _eventThrottler.bind( this, eventTimeout, images, offset ), false);

			}

		}

	};

	// Return public methods
	return {
		init: init
	};

})(window, document);