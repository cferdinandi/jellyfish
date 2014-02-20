/* =============================================================

	Jellyfish v1.1
	A progressively enhanced image lazy loader, by Chris Ferdinandi.
	http://gomakethings.com

	Check for image in viewport provided by "Dan".
	http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport/7557433#7557433

	Free to use under the MIT License.
	http://gomakethings.com/mit/

 * ============================================================= */

window.jellyfish = (function (window, document, undefined) {

	'use strict';

	// Feature Test
	if ( 'querySelector' in document && 'addEventListener' in window && Array.prototype.forEach ) {

		// SELECTORS

		var images = document.querySelectorAll('[data-lazy-load]'); // Get all lazy load images
		var loadingIcon = 'img/loading.gif'; // Loading icon location
		var offset = 500; // How far below the fold to start loading images (in pixels)
		var eventTimeout; // Timer for event throttler


		// METHODS

		// Replace div, span, or link with image loading graphic
		var createImgLoader = function ( img ) {

			// SELECTORS
			var loadingImg = document.createElement( 'img' );
			var dataImg = img.getAttribute( 'data-img' );
			var dataClass = img.getAttribute( 'data-class' ) === null ? '' : img.getAttribute( 'data-class' );
			var dataHeight = img.getAttribute( 'data-height' ) === null ? '' : img.getAttribute( 'data-height' );
			var dataWidth = img.getAttribute( 'data-width' ) === null ? '' : img.getAttribute( 'data-width' );
			var dataTitle = img.getAttribute( 'data-title' ) === null ? '' : img.getAttribute( 'data-title' );
			var dataLoading = img.getAttribute( 'data-loading' ) === null ? loadingIcon : img.getAttribute( 'data-loading' );

			// EVENTS, LISTENERS, AND INITS
			loadingImg.setAttribute( 'data-lazy-load', '' );
			loadingImg.setAttribute( 'data-img', dataImg );
			loadingImg.setAttribute( 'data-class', dataClass );
			loadingImg.setAttribute( 'data-height', dataHeight );
			loadingImg.setAttribute(  'data-width', dataWidth );
			loadingImg.setAttribute( 'title', dataTitle );
			loadingImg.setAttribute( 'src', dataLoading );
			img.parentNode.replaceChild( loadingImg, img );

		};

		// For each lazy load image, replace the default placeholder with a loading graphic
		var addImgLoaders = function () {
			Array.prototype.forEach.call(images, function (img, index) {
				createImgLoader( img );
			});
			images = document.querySelectorAll('[data-lazy-load]');
		};

		// Check if an image is visible in the viewport
		// Returns true/false
		var isImgInViewport = function ( img ) {
			var distance = img.getBoundingClientRect();
			return (
				distance.top >= 0 &&
				distance.left >= 0 &&
				distance.bottom <= (window.innerHeight + offset || document.documentElement.clientHeight + offset) &&
				distance.right <= (window.innerWidth || document.documentElement.clientWidth)
			);
		};

		// Pass data attribute values to the image and remove the data attribute
		// If value exists, set it. Remove associated data attribute.
		var setImgAttribute = function ( img, attribute, value ) {
			if ( value !== '' ) {
				img.setAttribute( attribute, value );
			}
			img.removeAttribute( value );
		};

		// Replace the loading graphic with the actual image
		var replaceImg = function ( img ) {

			// SELECTORS
			var newImg = img.getAttribute( 'data-img' );
			var imgClass = img.getAttribute( 'data-class' );
			var imgHeight = img.getAttribute( 'data-height' );
			var imgWidth = img.getAttribute( 'data-width' );

			// EVENTS, LISTENERS, AND INITS
			setImgAttribute( img, 'class', imgClass );
			setImgAttribute( img, 'height', imgHeight );
			setImgAttribute( img, 'width', imgWidth );
			img.setAttribute( 'src', newImg );

		};

		// If the image is visibile in the viewport, replace the loading graphic with the real image
		var loadImg = function ( img ) {
			if ( isImgInViewport( img ) && img.hasAttribute('data-img') !== null && !img.hasAttribute('data-img-loaded') ) {
				replaceImg( img );
				img.setAttribute( 'data-img-loaded', '' );
			}
		};

		// Check if any lazy load images are visible in the viewport
		var checkForImages = function () {
			Array.prototype.forEach.call(images, function (img, index) {
				loadImg( img );
			});
		};

		// On window scroll and resize, only run `checkForImages` at a rate of 15fps.
		// Better for performance.
		var eventThrottler = function () {
			// ignore resize events as long as an actualResizeHandler execution is in the queue
			if ( !eventTimeout ) {
				eventTimeout = setTimeout( function() {
					eventTimeout = null;
					checkForImages();
				}, 66);
			}
		};


		// EVENTS, LISTENERS, AND INITS

		// Only run Jellyfish if lazy load images exist on the page
		if ( images.length !== 0 ) {

			addImgLoaders(); // replace placeholders with loading graphics
			checkForImages(); // check if any images are visible on load

			// check if any images are visible on scroll or resize
			window.addEventListener('scroll', eventThrottler, false);
			window.addEventListener('resize', eventThrottler, false);

		}

	}

})(window, document);