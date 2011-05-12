/*
* jQuery ViewMaster plugin
*
* Developed by Matthew Lein
* matthewlein.com
*
* Released under the MIT license.
* Please leave this license info and author info intact.
*
* Copyright 2011
* 
* Tested with jQuery 1.5.2
* 
* Tested browsers: Safari 4+, Firefox 4+, Chrome 11+, iOS 4.3 Mobile Safari, Opera 11.10
* 
* Left/Right arrow key support, click any photo to view it.
* Optional next/prev arrows
* 
* Due to local testing security with the xml, test on a server, or visit matthewlein.com/viewmaster/
*/



(function($){


jQuery.fn.viewMaster = function(options) {
	
	// default options
	var defaults = {
		source : null,
		arrows : false
    }
    
    var opts = $.extend(defaults, options);	
	
	// proceed if a matching element is found
	if (this.length) {
		
		return this.each( function(){

			var $element = $(this)

			$.ajax({
			    type: "GET",
			    url: opts.source,
			    dataType: 'xml',
			    success: parseXml
			});
	
			function parseXml(xml) {
		
				// to store all the images
				var images = ""
		
				$(xml).find("image").each(function() {
			
					// if an image filename is found
					if ( $(this).find('filename').length ) {
				
						// get its filename
						var filename = $(this).find('filename').text(),
							title;
						
						// and title
						if ( $(this).find('title').length ) {
							title = '" title="' + $(this).find('title').text() + '"'
						} else {
							title = ''
						}
				
						// add to the images string
						newImg = '<div class="holder"><img src = "' + filename + '"' + title + '></div>'

					}
			
					//build a big string for quick injection
					images += newImg
			
				});
		
		
				// put in the slideshow and controls
				$element.append('<div class="vmSlideshow"></div>')
				
				if ( opts.arrows ) {
					
					$element.children('.vmSlideshow').append('<a id="prev" href="#"></a><a id="next" href="#"></a>')
					
				}
				
				//put in images
				$('.vmSlideshow').append(images)
				
				// start 'er up
				init()
		
			}
			
			var rotation;
	
			function init() {
		
				// get the amount of rotation based on the number of images
				rotation = (360 / $('.holder').length).toFixed(2)
	
				$('.holder').each(function(index) {
		
					// set all the rotations and store that in data, with index
					// the .holder gets all the data
					// translateZ for webkit GPU acceleration, downside uses more battery
					var transform = 'rotate(' + -(rotation * index) + 'deg) translate(0, 380px)'
					
					$(this).css({
						'-webkit-transform' : transform + ' translateZ(0)',
						'-moz-transform' : transform,
						'-ms-transform' : transform,
						'-o-transform' : transform,
						'transform' : transform
					}).data({
						'rotation' : -(rotation * index),
						'index' : index
					})
	
				});
		
				// set the first one to show
				var currentTransform = 'rotate( 0deg ) translate(0, -208px)'
				
				$('.holder').first().css({
					'-webkit-transform': currentTransform + ' translateZ(0)',
					'-moz-transform' : currentTransform,
					'-ms-transform' : currentTransform,
					'-o-transform' : currentTransform,
					'transform' : currentTransform
				}).addClass('current')
				
				//show the slideshow now that its built
				$('.vmSlideshow').fadeIn(500)
				
		
				// set next and prev handlers
				$('.vmSlideshow #next').click( controls.nextSlide );
				$('.vmSlideshow #prev').click( controls.prevSlide );

				$('.holder img').click(function(event) {

					controls.advance( $(this).parent('.holder').data('index') )

				});
		
				$(document).keydown( function(event) {

					var key = event.keyCode

					if (key === 37) {
						//left arrow
						controls.prevSlide(event)

					} else if (key === 39) {
						//right arrow
						controls.nextSlide(event)

					}
				});
		
		
			}
	
			
			controls = {
				
				advance : function(next) {
					
					var currentIndex = $('.current').data('index'),
						increment,
						direction,
						distance;

					// There's gotta be an easier way...
					if (next > currentIndex) {

						if ( next - currentIndex < ( $('.holder').length - next ) + currentIndex ) {

							// the next one is closer to the right
							direction = 1
							distance = next - currentIndex

						} else {

							// the next one is closer to the left
							direction = -1
							distance = ( $('.holder').length - next ) + currentIndex

						}

					} else { // next < currentIndex

						if ( currentIndex - next < ( $('.holder').length - currentIndex ) + next ) {

							// the next one is closer to the left
							direction = -1
							distance = currentIndex - next

						} else {

							// the next one is closer to the right
							direction = 1
							distance = ( $('.holder').length - currentIndex ) + next

						}

					}

					increment = rotation * distance * direction

					$('.holder').each(function( index ) {

						var newRotation = $(this).data('rotation') + increment,
							newTransform = 'rotate(' + ( newRotation ) + 'deg) translate(0, 380px)'
						// set all the rotations and store that in data
						$(this).css({
							'-webkit-transform': newTransform + ' translateZ(0)',
							'-moz-transform' : newTransform,
							'-ms-transform' : newTransform,
							'-o-transform' : newTransform,
							'transform' : newTransform
						}).data('rotation', newRotation )
						
					});
					
					//remove current slide
					$('.current').removeClass('current')

					//set next current and pull it to the center
					$('.holder').eq(next).addClass('current')

					// Number() to fix odd issue getting 0.14e-14 style numbers that would break it
					var nextTransform = 'rotate(' + Number( $('.current').data('rotation') ).toFixed(2) + 'deg) translate(0, -208px)'

					$('.current').css({
						'-webkit-transform': nextTransform + ' translateZ(0)',
						'-moz-transform' : nextTransform,
						'-ms-transform' : nextTransform,
						'-o-transform' : nextTransform,
						'transform' : nextTransform
					})

					
					
				},
				
				nextSlide : function(event) {
					
					var key = event.keyCode,
						currentSlide,
						nextSlide;

					event.preventDefault()
					currentSlide = $('.current').data('index')

					if (currentSlide === $('.holder').length - 1 ) {
						// its at the last slide, go to beginning
						nextSlide = 0
					} else {
						nextSlide = currentSlide + 1
					}

					controls.advance( nextSlide )
					
				},
				
				prevSlide : function(event) {
					
					var currentSlide,
						nextSlide;

					event.preventDefault()
					currentSlide = $('.current').data('index')

					if (currentSlide === 0) {
						// its at the first slide, go to end
						nextSlide = $('.holder').length - 1
					} else {
						nextSlide = currentSlide - 1 
					}

					controls.advance( nextSlide )
					
				}
				
			}
	
		
		})
	}

}

})(jQuery);