/* =============================================================

	Jellyfish v2.3
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

	// Default settings
	// Private {object} variable
	var _defaults = {
		loadingIcon: 'img/loading.gif',
		offset: 0,
		callbackBefore: function () {},
		callbackAfter: function () {}
	};

	// Merge default settings with user options
	// Private method
	// Returns an {object}
	var _mergeObjects = function ( original, updates ) {
		for (var key in updates) {
			original[key] = updates[key];
		}
		return original;
	};

	// Replace div, span, or link with image loading graphic
	// Private method
	// Runs functions
	var _createImgLoader = function ( img, loadingIcon ) {

		// Selectors and variables
		var loadingImg = document.createElement( 'img' );
		var dataImg = img.getAttribute( 'data-lazy-load' );
		var dataOptions = img.getAttribute( 'data-options' );

		// Set image attritibutes
		loadingImg.setAttribute( 'data-lazy-load', dataImg );
		if ( dataOptions !== null ) {
			loadingImg.setAttribute( 'data-options', dataOptions );
		}
		loadingImg.setAttribute( 'src', loadingIcon );
		img.parentNode.replaceChild( loadingImg, img );

	};

	// For each lazy load image, replace the default placeholder with a loading graphic
	// Public method
	// Runs functions
	var addImgLoaders = function ( images, options ) {
		options = _mergeObjects( _defaults, options || {} ); // Merge user options with defaults
		Array.prototype.forEach.call(images, function (img, index) {
			_createImgLoader( img, options.loadingIcon );
		});
	};

	// Check if an image is visible in the viewport
	// Boolean: Returns true/false
	var _isImgInViewport = function ( img, offset ) {
		var distance = img.getBoundingClientRect();
		return (
			distance.top >= 0 &&
			distance.left >= 0 &&
			distance.bottom <= (window.innerHeight + offset || document.documentElement.clientHeight + offset) &&
			distance.right <= (window.innerWidth || document.documentElement.clientWidth)
		);
	};

	// Convert data-options attribute into an object of key/value pairs
	// Private method
	// Returns an {object}
	var _getDataOptions = function ( options ) {
		if ( options === null || options === undefined  ) {
			return {};
		} else {
			var settings = {}; // Create settings object
			options = options.split(';'); // Split into array of options

			// Create a key/value pair for each setting
			options.forEach( function(option) {
				option = option.trim();
				if ( option !== '' ) {
					option = option.split(':');
					settings[option[0]] = option[1].trim();
				}
			});
			return settings;
		}
	};

	// Pass data attribute values to the image and remove the data attribute
	// Private method
	// Runs functions
	var _setImgAttributes = function ( img, attributes ) {
		if ( attributes !== null ) {
			for ( var key in attributes ) {
				img.setAttribute( key, attributes[key] );
			}
		}
	};

	// Replace the loading graphic with the actual image
	// Private method
	// Runs functions
	var _replaceImg = function ( img, options ) {

		// Get image attributes
		var newImg = img.getAttribute( 'data-lazy-load' );
		var imgAttributes = _getDataOptions( img.getAttribute( 'data-options' ) );

		options.callbackBefore(); // Run callbacks before replacing image

		// Replace image attributes
		_setImgAttributes( img, imgAttributes );
		img.setAttribute( 'src', newImg );
		img.removeAttribute( 'data-img' );
		img.removeAttribute( 'data-options' );

		options.callbackAfter(); // Run callbacks after replacing image

	};

	// If the image is visibile in the viewport, replace the loading graphic with the real image
	// Private method
	// Runs functions
	var _loadImg = function ( img, offset, options ) {
		if ( _isImgInViewport( img, offset ) === true && img.getAttribute('data-lazy-load') !== '' && !img.hasAttribute('data-img-loaded') ) {
			_replaceImg( img, options );
			img.setAttribute( 'data-img-loaded', '' );
		}
	};

	// Check if any lazy load images are visible in the viewport
	// Public method
	// Runs functions
	var checkForImages = function ( images, options ) {
		options = _mergeObjects( _defaults, options || {} ); // Merge user options with defaults
		Array.prototype.forEach.call(images, function (img, index) {
			_loadImg( img, parseInt(options.offset, 10), options ); // Load each image that's in the viewport
		});
	};

	// On window scroll and resize, only run `checkForImages` at a rate of 15fps for better performance
	// Private method
	// Runs functions
	var _eventThrottler = function ( eventTimeout, images, options ) {
		if ( !eventTimeout ) {
			eventTimeout = setTimeout( function() {
				eventTimeout = null;
				checkForImages( images, options );
			}, 66);
		}
	};

	// Initalize Jellyfish
	// Public method
	// Runs functions
	var init = function ( options ) {

		// Feature test before initializing
		if ( 'querySelector' in document && 'addEventListener' in window && Array.prototype.forEach ) {

			// Selectors and variables
			options = _mergeObjects( _defaults, options || {} ); // Merge user options with defaults
			var images = document.querySelectorAll('[data-lazy-load]'); // Get all lazy load images
			var eventTimeout; // Timer for event throttler

			// Run Jellyfish if lazy load images exist on the page
			if ( images.length !== 0 ) {

				addImgLoaders( images, options ); // replace placeholders with loading graphics
				images = document.querySelectorAll('[data-lazy-load]'); // Reset image variable with new nodes
				checkForImages( images, options ); // check if any images are visible on load

				// check if any images are visible on scroll or resize
				window.addEventListener('scroll', _eventThrottler.bind( null, eventTimeout, images, options ), false);
				window.addEventListener('resize', _eventThrottler.bind( null, eventTimeout, images, options ), false);

			}

		}

	};

	// Return public methods
	return {
		init: init,
		addImgLoaders: addImgLoaders,
		checkForImages: checkForImages
	};

})(window, document);