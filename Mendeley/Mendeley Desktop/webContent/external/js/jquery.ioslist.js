(function($){
	$.fn.ioslist = function(options) {
		//allow for defaults to be overridden even though we won't talk about it much
		//you can make this work with any set of DOM elements provided you know how to style it right
		var defaults = {
			groupContainer: "dl",
			groupHeader: "dt",
			stationaryHeaderClass: "fakeHeader",
			stationaryHeaderElement: "h2"
		};
		var options = $.extend(defaults,options);
		
		return this.each(function(){
			var $listWrapper;		      //wrap everything, holds $fakeHeader in place
			var $fakeHeader;		      //fixed header element
			var $listContainer; 	      //element ioslist method was called on
			var elems = [];			      //array of DOM elements and props, reduces DOM access
			var currentTop = 0;           //cached value for $listContainer.scrollTop()
			var currentHeaderText = '';   //cached value for $fakeHeader.html()

			//create and cache necessary elements
			$(this).wrap("<div class='listWrapper'></div>");
			$listContainer = $(this);
			$listWrapper = $(this).parent();
			$listWrapper.prepend("<" + options.stationaryHeaderElement + "/>");
			$fakeHeader = $listWrapper.find(options.stationaryHeaderElement).eq(0);
			$fakeHeader.addClass(options.stationaryHeaderClass);
			
			populateElements();
			updateItemsWithTimeout();
			
			$fakeHeader.html(elems[0].headerText);

			//bind to the scroll event
			$listContainer.scroll(function() {
				currentTop = $listContainer.scrollTop();
				testPosition();
			});
			
			$(window).resize(updateItems);
			
			function updateItemsWithTimeout() {
				updateItems();
				
				setTimeout(updateItemsWithTimeout, 500);
			}
			
			function populateElements() {
				$listContainer.find(options.groupContainer).each(function (index,elem) {
					var $tmp_list = $listContainer.find(options.groupContainer).eq(index);
					var $tmp_header = $tmp_list.find(options.groupHeader).eq(0);
					elems.push({"list" : $tmp_list,
								"header" : $tmp_header,
								"listHeight" : 0,
								"headerText" : $tmp_header.html(),
								"headerHeight" : $tmp_header.outerHeight(),
								"listOffset" : 0,
								"listBottom" : 0});
				});
			}
			
			function updateItems() {
				var hasChanged = false;
				
				$(elems).each(function (index,elem) {
					var $tmp_list = elem.list;
					var $tmp_listHeight = $tmp_list.height();
					
					if (hasChanged || $tmp_listHeight !== elem.listHeight) {						
						var $tmp_listOffset = $tmp_list.position().top + currentTop;

						hasChanged = true;
						
						elem.listHeight = $tmp_listHeight;
						elem.listOffset = $tmp_listOffset;
						elem.listBottom = $tmp_listHeight + $tmp_listOffset;
					}
				});
				
				if (hasChanged)
					testPosition();
			}
			
			function testPosition() {
				var topElement;
				var topElementBottom;
				var i = 0;
				
				while((elems[i].listOffset - currentTop) <= 0) {
					topElement = elems[i];
					topElementBottom = topElement.listBottom - currentTop;
					i++;
				}
				
				if(topElementBottom < 0 && topElementBottom > -topElement.headerHeight) {
					$fakeHeader.addClass("hidden");
					topElement.list.addClass("animated");
				} else {
					$fakeHeader.removeClass("hidden");
					topElement.list.removeClass("animated");
				}
				
				if (currentHeaderText !== topElement.headerText)
					$fakeHeader.html(currentHeaderText = topElement.headerText);
			}
		});
	}
})(jQuery);