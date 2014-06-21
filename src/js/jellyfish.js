(function (root, factory) {
	if ( typeof define === 'function' && define.amd ) {
		define('jellyfish', factory(root));
	} else if ( typeof exports === 'object' ) {
		module.exports = factory(root);
	} else {
		root.jellyfish = factory(root);
	}
})(this, function (root) {

	'use strict';

	//
	// Variables
	//

	var exports = {}; // Object for public APIs
	var supports = !!document.querySelector && !!root.addEventListener; // Feature test

	// Default settings
	var defaults = {
		icon: 'img/loading.gif',
		offset: 0,
		type: 'img',
		callbackBeforeIcons: function () {},
		callbackAfterIcons: function () {},
		callbackBeforeContent: function () {},
		callbackAfterContent: function () {}
	};


	//
	// Methods
	//

	/**
	 * Merge defaults with user options
	 * @private
	 * @param {Object} defaults Default settings
	 * @param {Object} options User options
	 * @returns {Object} Merged values of defaults and options
	 */
	var extend = function ( defaults, options ) {
		for ( var key in options ) {
			if (Object.prototype.hasOwnProperty.call(options, key)) {
				defaults[key] = options[key];
			}
		}
		return defaults;
	};

	/**
	 * A simple forEach() implementation for Arrays, Objects and NodeLists
	 * @private
	 * @param {Array|Object|NodeList} collection Collection of items to iterate
	 * @param {Function} callback Callback function for each iteration
	 * @param {Array|Object|NodeList} scope Object/NodeList/Array that forEach is iterating over (aka `this`)
	 */
	var forEach = function (collection, callback, scope) {
		if (Object.prototype.toString.call(collection) === '[object Object]') {
			for (var prop in collection) {
				if (Object.prototype.hasOwnProperty.call(collection, prop)) {
					callback.call(scope, collection[prop], prop, collection);
				}
			}
		} else {
			for (var i = 0, len = collection.length; i < len; i++) {
				callback.call(scope, collection[i], i, collection);
			}
		}
	};

	/**
	 * Remove whitespace from a string
	 * @private
	 * @param {String} string
	 * @returns {String}
	 */
	var trim = function ( string ) {
		return string.replace(/^\s+|\s+$/g, '');
	};

	/**
	 * Convert data-options attribute into an object of key/value pairs
	 * @private
	 * @param {String} options Link-specific options as a data attribute string
	 * @returns {Object}
	 */
	var getDataOptions = function ( options ) {
		var settings = {};
		// Create a key/value pair for each setting
		if ( options ) {
			options = options.split(';');
			options.forEach( function(option) {
				option = trim(option);
				if ( option !== '' ) {
					option = option.split(':');
					settings[option[0]] = trim(option[1]);
				}
			});
		}
		return settings;
	};

	/**
	 * For each lazy load content, replace the default placeholder with a loading icon
	 * @public
	 * @param {NodeList} wrappers A nodelist of wrapper elements around each image
	 * @param {Object} options
	 */
	exports.addLoadingIcons = function ( wrappers, options ) {
		var settings = extend( defaults, options || {} ); // Merge user options with defaults
		settings.callbackBeforeIcons( wrappers ); // Run callbacks before loading icons
		forEach(wrappers, function (wrapper) {
			var overrides = getDataOptions( wrapper.getAttribute( 'data-options' ) );
			var icon = overrides.icon || settings.icon;
			wrapper.innerHTML = '<img src="' + icon + '">';
		});
		settings.callbackBeforeIcons( wrappers ); // Run callbacks after loading icons
	};

	/**
	 * Check if the content wrapper is visible in the viewport
	 * @private
	 * @param  {Element} wrapper The element that contains the image to load
	 * @param  {Number}  offset The number of pixels before the viewport to start loading the image
	 * @return {Boolean} True when image is in viewport
	 */
	var isContentInViewport = function ( wrapper, offset ) {
		var distance = wrapper.getBoundingClientRect();
		return (
			distance.top >= 0 &&
			distance.left >= 0 &&
			distance.bottom <= (window.innerHeight + offset || document.documentElement.clientHeight + offset) &&
			distance.right <= (window.innerWidth || document.documentElement.clientWidth)
		);
	};

	/**
	 * Add attributes to the content node
	 * @private
	 * @param {Array} array An array of node attributes
	 */
	var setContentAttributes = function ( array ) {
		var attributes = '';
		if ( array !== null ) {
			for ( var key in array ) {
				attributes = attributes + ' ' + key + '="' + array[key] + '"';
			}
		}
		return attributes;
	};

	/**
	 * Replace the loading icon with the actual content
	 * @private
	 * @param  {Element} wrapper The element that contains the content
	 * @param  {Object} settings
	 * @param  {Object} overrides
	 */
	var loadContent = function ( wrapper, settings, overrides ) {

		// Get content attributes
		overrides = overrides || getDataOptions( wrapper.getAttribute( 'data-options' ) );
		var src = wrapper.getAttribute( 'data-lazy-load' );
		var getAttributes = getDataOptions( wrapper.getAttribute( 'data-load-attributes' ) );
		var attributes = setContentAttributes( getAttributes );
		var type = overrides.type || settings.type;

		settings.callbackBeforeContent( wrapper ); // Run callbacks before loading content

		// Load content
		if ( type.toLowerCase() === 'img' ) {
			wrapper.innerHTML = '<img ' + attributes + 'src="' + src + '">';
		} else if ( type.toLowerCase() === 'iframe' ) {
			wrapper.innerHTML = '<iframe ' + attributes + 'src="' + src + '"></iframe>';
		}

		settings.callbackAfterContent( wrapper ); // Run callbacks after loading content

	};

	/**
	 * Check if any lazy load content wrappers are visibile in the viewport
	 * @public
	 * @param  {NodeList} wrappers A nodelist of elements that contain content
	 * @param  {Object} options
	 */
	exports.checkViewport = function ( wrappers, options ) {
		var settings = extend( defaults, options || {} ); // Merge user options with defaults
		forEach(wrappers, function (wrapper) {
			var overrides = getDataOptions( wrapper.getAttribute( 'data-options' ) );
			var offset = overrides.offset || settings.offset;
			if ( isContentInViewport( wrapper, offset ) === true && !wrapper.hasAttribute('data-content-loaded') ) {
				loadContent( wrapper, settings, overrides );
				wrapper.setAttribute( 'data-content-loaded', true );
			}
		});
	};

	/**
	 * On window scroll and resize, only run `checkViewport` at a rate of 15fps for better performance
	 * @private
	 * @param  {Function} eventTimeout Timeout function
	 * @param  {NodeList} wrappers The nodelist of elements that contain lazy load content
	 * @param  {Object} settings
	 */
	var eventThrottler = function ( eventTimeout, wrappers, settings ) {
		if ( !eventTimeout ) {
			eventTimeout = setTimeout( function() {
				eventTimeout = null;
				exports.checkViewport( wrappers, settings );
			}, 66);
		}
	};

	/**
	 * Initialize Plugin
	 * @public
	 * @param {Object} options User settings
	 */
	exports.init = function ( options ) {

		// feature test
		if ( !supports ) return;

		// Selectors and variables
		var settings = extend( defaults, options || {} ); // Merge user options with defaults
		var wrappers = document.querySelectorAll('[data-lazy-load]'); // Get all lazy load wrappers
		var eventTimeout; // Timer for event throttler

		// Stop init if no lazy load content is found
		if ( wrappers.length === 0 ) return;

		exports.addLoadingIcons( wrappers, settings ); // replace placeholders with loading icons
		exports.checkViewport( wrappers, settings ); // check if any content is visible on load

		// check if any content is visible on scroll or resize
		window.addEventListener('scroll', eventThrottler.bind( null, eventTimeout, wrappers, settings ), false);
		window.addEventListener('resize', eventThrottler.bind( null, eventTimeout, wrappers, settings ), false);

	};


	//
	// Public APIs
	//

	return exports;

});