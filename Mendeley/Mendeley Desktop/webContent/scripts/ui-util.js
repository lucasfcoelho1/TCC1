// Utility functions for formatting objects (dates, URLs) etc.
// for the UI
var UiUtils = (function() {
	'use strict';

	function UiUtils() {}

	// returns a string describing |time| relative to the current
	// time, eg. '2 months ago', '4 mins ago'.
	UiUtils.relativeDate = function(time) {
		if (!time) {
			return "Unknown time";
		}

		var seconds = Math.floor((new Date() - time) / 1000);

		var interval = Math.floor(seconds / 31536000);

		if (interval > 1) {
			return interval + " years ago";
		}
		interval = Math.floor(seconds / 2592000);
		if (interval > 1) {
			return interval + " months ago";
		}
		interval = Math.floor(seconds / 86400);
		if (interval > 1) {
			return interval + " days ago";
		}
		interval = Math.floor(seconds / 3600);
		if (interval > 1) {
			return interval + " hours ago";
		}
		interval = Math.floor(seconds / 60);
		if (interval > 1) {
			return interval + " mins ago";
		}
		return "Just now";
	};

	// constants for UiUtils.getPrettyUrl()
	UiUtils.DOMAIN_ONLY = 1;
	UiUtils.DOMAIN_AND_PATH = 2;

	// returns a 'pretty' version of a URL, suitable
	// for display as the text of a link but not for the
	// URL target.
	UiUtils.getPrettyUrl = function(url, mode) {
		// strip scheme
		var result = url.replace(/^[a-z]+:\/\//, "");
		// decode URI
		result = decodeURIComponent(result);

		if (mode == UiUtils.DOMAIN_ONLY) {
			result = result.replace(/\/.*/, "");
		}

		return result;
	};

	// right-elide a string.  Truncates |str| to |length|-1 characters
	// and appends an ellipsis if the text was shortened.
	UiUtils.elideText = function(str, length) {
		if (str.length < length) {
			return str;
		} else {
			// elide the text.  We could return a more aesthetically pleasing
			// result by trying to elide at sentence or word boundaries
			// within reason.
			return str.slice(0, length - 1) + "\u2026";
		}
	};

	/** Return a prettified JSON string representation of an
	 * object.
	 */
	UiUtils.prettyJsonString = function(object) {
		return JSON.stringify(object, null, 2);
	};

	/** Replaces C-style escapes in strings, eg. '\\n' with
	 * the equivalent actual char.
	 */
	UiUtils.unescapeCString = function(str) {
		if (str.indexOf('\\') == -1) {
			// no unescaping required
			return str;
		}

		// this assumes that all characters not directly
		// representable in string literals are escaped using double-backslashes
		str.replace('\\\\', '\\');
		var json = '{"str":"' + str + '"}';
		try {
			return JSON.parse(json).str;
		} catch (e) {
			return str;
		}
	};

	/** Returns the position in |str| that is |count| words to the
	 * left of |start|
	 */
	UiUtils.wordsLeft = function(str, start, count) {
		var breaks = 0;
		var pos = start;
		while (pos > 0) {
			if (str[pos] == ' ') {
				++breaks;
				if (breaks >= count) {
					break;
				}
			}
			--pos;
		}
		return pos;
	}

	/** Returns the position in |str| that is |count| words to the
	 * right of |start|
	 */
	UiUtils.wordsRight = function(str, start, count) {
		var breaks = 0;
		var pos = start;
		while (pos < str.length) {
			if (str[pos] == ' ') {
				++breaks;
				if (breaks >= count) {
					break;
				}
			}
			++pos;
		}
		return pos;
	};

	/** Utility to coalesce multiple updates into a single update.
	 * This serves the same purpose as UpdateTimer in Mendeley Desktop.
	 */
	UiUtils.Debouncer = function() {
		return {
			currentTimeoutID: null,
			schedule: function(delay, callback) {
				if (this.currentTimeoutID) {
					window.clearTimeout(this.currentTimeoutID);
				}
				this.currentTimeoutID = window.setTimeout(callback, delay);
			}
		}
	};

	/** Given a jQuery() element, returns an object with (left, top) properties
	 * for a drop-down menu to be displayed below the element.
	 */
	UiUtils.dropDownMenuOffset = function(element) {
		return {
			left: element.offset().left,
			top: element.offset().top + element.height() + 3
		};
	};

	return UiUtils;
})();
