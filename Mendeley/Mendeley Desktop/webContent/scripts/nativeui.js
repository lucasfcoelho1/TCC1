// Helper functions for invoking native UIs via the MendeleyDesktop.ui module
var MendeleyUi = (function() {
	'use strict';

	function MendeleyUi() {}

	/** Displays a native Yes/No question prompt. */
	MendeleyUi.questionPrompt = function(title, prompt, extraText) {
		var ui = MendeleyDesktop.module('ui');
		return ui.showPrompt(ui.QuestionMessage, title, prompt, extraText, [ui.YesButton, ui.NoButton], ui.NoButton) == ui.YesButton;
	};

	/** Displays a native context menu at @p element.
	 * @p items is an array of objects of the form:
	 * {
	 *   label : '<item text>',
	 *   handler : function() {
	 *     // callback to invoke when menu item
	 *     // is selected
	 *   }
	 * };
	 */
	MendeleyUi.showMenu = function(element, items, leftOffset) {
		var labels = [];
		items.forEach(function(item) {
			labels.push(item.label);
		});
		var offset = UiUtils.dropDownMenuOffset(element);
		if (leftOffset) {
			offset.left += leftOffset;
		}

		var selectedItem = MendeleyDesktop.module('ui').showMenu(offset.left, offset.top, labels);

		if (selectedItem != -1) {
			var item = items[selectedItem];
			item.handler();
		}
	};

	/** Attach a drop-down menu to a given DOM element.
	 * See showMenu() for the format of @p items.
	 */
	MendeleyUi.addMenu = function(menuElement, items, leftOffset) {
		menuElement.mousedown(function(event) {
			event.stopPropagation();
			MendeleyUi.showMenu(menuElement, items, leftOffset);
		});
	};

	return MendeleyUi;
}());
