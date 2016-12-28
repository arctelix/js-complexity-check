angular.module('myApp')
	.directive('syncScroll', ['$document', function($document){
		var scrollTop = 0;
		var height = 0;
		var width = 0;

		var scrEvt = new Event('scroll');
		    scrEvt.isTrigger = true;
		var resizeEvt = new Event('mousemove');
		    resizeEvt.isTrigger = true;

		var dragging

		// Note: eventlistener-polyfill makes dispatchEvent cross browser!

		function combine(elements){
      // Handle text area resize

      elements.on('mousedown', function(e) {
				dragging = e.target
			});

			$document.on('mouseup', function(e) {
				dragging = false
			});

      $document.on('mousemove', dragHandler.bind(this, elements));

      elements.on('mousemove', dragHandler.bind(this, elements));

      // Handle scroll position change

			elements.on('scroll', scrollHandler.bind(this, elements));
		}

		function scrollHandler(elements, e){
      if(e.isTrigger){
        e.target.scrollTop = scrollTop;
      }else {
        scrollTop = e.target.scrollTop;
        each(elements, function(ele){
          if(ele != e.target){
            ele.dispatchEvent(scrEvt);
          }
        })
      }
    }

		function dragHandler(elements, e){
      if (!dragging) return;
      if(e.isTrigger){
        e.target.style.height = height;
        e.target.style.width = width;
      }else {
        height = dragging.style.height;
        width = dragging.style.width;
        each(elements, function(ele){
          if(ele != dragging){
            ele.dispatchEvent(resizeEvt);
          }
        })
      }
    }

		function each(elements, func){
			for (var i in elements) {
				// make sure we only iterate elements
        // Again, this trick makes jQuery un-necessary
				if (isNaN(parseInt(i))) break;
				func(elements[i]);
			}
		}

		return {
			restrict: 'A',
			replace: false,
			compile: function(element, attrs){
        // No need for full jQuery just for a class selector
				combine(element.children());
			}
		};
	}]);
