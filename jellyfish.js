/* =============================================================

	Jellyfish v3.0
	A progressively enhanced image lazy loader, by Chris Ferdinandi.
	http://gomakethings.com

	Check for image in viewport provided by "Dan".
	http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport/7557433#7557433

	Free to use under the MIT License.
	http://gomakethings.com/mit/

 * ============================================================= */

window.jellyfish = (function (window, document, undefined) {

	'use strict';

	// Default settings
	// Private {object} variable
	var _defaults = {
		icon: 'img/loading.gif',
		offset: 0,
		type: 'img',
		callbackBeforeIcons: function () {},
		callbackAfterIcons: function () {},
		callbackBeforeContent: function () {},
		callbackAfterContent: function () {}
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

	// Convert data-options and data-load-attributes values into an object of key/value pairs
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

	// For each lazy load content, replace the default placeholder with a loading icon
	// Public method
	// Runs functions
	var addLoadingIcons = function ( wrappers, options ) {
		options = _mergeObjects( _defaults, options || {} ); // Merge user options with defaults
		options.callbackBeforeIcons( wrappers ); // Run callbacks before loading icons
		Array.prototype.forEach.call(wrappers, function (wrapper, index) {
			var overrides = _getDataOptions( wrapper.getAttribute( 'data-options' ) );
			var icon = overrides.icon || options.icon;
			wrapper.innerHTML = '<img src="' + icon + '">';
		});
		options.callbackBeforeIcons( wrappers ); // Run callbacks after loading icons
	};

	// Check if content wrapper is visible in the viewport
	// Private method
	// Boolean: Returns true/false
	var _isContentInViewport = function ( wrapper, offset ) {
		var distance = wrapper.getBoundingClientRect();
		return (
			distance.top >= 0 &&
			distance.left >= 0 &&
			distance.bottom <= (window.innerHeight + offset || document.documentElement.clientHeight + offset) &&
			distance.right <= (window.innerWidth || document.documentElement.clientWidth)
		);
	};

	// Add attributes to the content node
	// Private method
	// Runs functions
	var _setContentAttributes = function ( array ) {
		var attributes = '';
		if ( array !== null ) {
			for ( var key in array ) {
				attributes = attributes + ' ' + key + '="' + array[key] + '"';
			}
		}
		return attributes;
	};

	// Replace the loading icon with the actual content
	// Private method
	// Runs functions
	var _loadContent = function ( wrapper, options, overrides ) {

		// Get content attributes
		overrides = overrides || _getDataOptions( wrapper.getAttribute( 'data-options' ) );
		var src = wrapper.getAttribute( 'data-lazy-load' );
		var getAttributes = _getDataOptions( wrapper.getAttribute( 'data-load-attributes' ) );
		var attributes = _setContentAttributes( getAttributes );
		var type = overrides.type || options.type;

		options.callbackBeforeContent( wrapper ); // Run callbacks before loading content

		// Load content
		if ( type === 'img' ) {
			wrapper.innerHTML = '<img ' + attributes + 'src="' + src + '">';
		} else if ( type === 'iframe' ) {
			wrapper.innerHTML = '<iframe ' + attributes + 'src="' + src + '"></iframe>';
		}

		options.callbackAfterContent( wrapper ); // Run callbacks after loading content

	};

	// Check if any lazy load content wrappers are visible in the viewport
	// Public method
	// Runs functions
	var checkViewport = function ( wrappers, options ) {
		options = _mergeObjects( _defaults, options || {} ); // Merge user options with defaults
		Array.prototype.forEach.call(wrappers, function (wrapper, index) {
			var overrides = _getDataOptions( wrapper.getAttribute( 'data-options' ) );
			var offset = overrides.offset || options.offset;
			if ( _isContentInViewport( wrapper, offset ) === true && !wrapper.hasAttribute('data-content-loaded') ) {
				_loadContent( wrapper, options, overrides );
				wrapper.setAttribute( 'data-content-loaded', true );
			}
		});
	};

	// On window scroll and resize, only run `checkViewport` at a rate of 15fps for better performance
	// Private method
	// Runs functions
	var _eventThrottler = function ( eventTimeout, wrappers, options ) {
		if ( !eventTimeout ) {
			eventTimeout = setTimeout( function() {
				eventTimeout = null;
				checkViewport( wrappers, options );
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
			var wrappers = document.querySelectorAll('[data-lazy-load]'); // Get all lazy load wrappers
			var eventTimeout; // Timer for event throttler

			// Run Jellyfish if lazy load content exist on the page
			if ( wrappers.length !== 0 ) {

				addLoadingIcons( wrappers, options ); // replace placeholders with loading icons
				checkViewport( wrappers, options ); // check if any content is visible on load

				// check if any content is visible on scroll or resize
				window.addEventListener('scroll', _eventThrottler.bind( null, eventTimeout, wrappers, options ), false);
				window.addEventListener('resize', _eventThrottler.bind( null, eventTimeout, wrappers, options ), false);

			}

		}

	};

	// Return public methods
	return {
		init: init,
		addLoadingIcons: addLoadingIcons,
		checkViewport: checkViewport
	};

})(window, document);