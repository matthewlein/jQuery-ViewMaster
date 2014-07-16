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
*/(function(e){jQuery.fn.viewMaster=function(t){var n={source:null,arrows:!1},r=e.extend(n,t);if(this.length)return this.each(function(){function n(n){var i="";e(n).find("image").each(function(){if(e(this).find("filename").length){var t=e(this).find("filename").text(),n;e(this).find("title").length?n='" title="'+e(this).find("title").text()+'"':n="";newImg='<div class="holder"><img src = "'+t+'"'+n+"></div>"}i+=newImg});t.append('<div class="vmSlideshow"></div>');r.arrows&&t.children(".vmSlideshow").append('<a id="prev" href="#"></a><a id="next" href="#"></a>');e(".vmSlideshow").append(i);s()}function s(){i=(360/e(".holder").length).toFixed(2);e(".holder").each(function(t){var n="rotate("+ -(i*t)+"deg) translate(0, 380px)";e(this).css({"-webkit-transform":n+" translateZ(0)","-moz-transform":n,"-ms-transform":n,"-o-transform":n,transform:n}).data({rotation:-(i*t),index:t})});var t="rotate( 0deg ) translate(0, -208px)";e(".holder").first().css({"-webkit-transform":t+" translateZ(0)","-moz-transform":t,"-ms-transform":t,"-o-transform":t,transform:t}).addClass("current");e(".vmSlideshow").fadeIn(500);e(".vmSlideshow #next").click(controls.nextSlide);e(".vmSlideshow #prev").click(controls.prevSlide);e(".holder img").click(function(t){controls.advance(e(this).parent(".holder").data("index"))});e(document).keydown(function(e){var t=e.keyCode;t===37?controls.prevSlide(e):t===39&&controls.nextSlide(e)})}var t=e(this);e.ajax({type:"GET",url:r.source,dataType:"xml",success:n});var i;controls={advance:function(t){var n=e(".current").data("index"),r,s,o;if(t>n)if(t-n<e(".holder").length-t+n){s=1;o=t-n}else{s=-1;o=e(".holder").length-t+n}else if(n-t<e(".holder").length-n+t){s=-1;o=n-t}else{s=1;o=e(".holder").length-n+t}r=i*o*s;e(".holder").each(function(t){var n=e(this).data("rotation")+r,i="rotate("+n+"deg) translate(0, 380px)";e(this).css({"-webkit-transform":i+" translateZ(0)","-moz-transform":i,"-ms-transform":i,"-o-transform":i,transform:i}).data("rotation",n)});e(".current").removeClass("current");e(".holder").eq(t).addClass("current");var u="rotate("+Number(e(".current").data("rotation")).toFixed(2)+"deg) translate(0, -208px)";e(".current").css({"-webkit-transform":u+" translateZ(0)","-moz-transform":u,"-ms-transform":u,"-o-transform":u,transform:u})},nextSlide:function(t){var n=t.keyCode,r,i;t.preventDefault();r=e(".current").data("index");r===e(".holder").length-1?i=0:i=r+1;controls.advance(i)},prevSlide:function(t){var n,r;t.preventDefault();n=e(".current").data("index");n===0?r=e(".holder").length-1:r=n-1;controls.advance(r)}}})}})(jQuery);