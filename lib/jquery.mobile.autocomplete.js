/**
 * Autocomplete helper for JQM.
 *
 * Copyright © 2014 Maciej Nux Jaros.
 * @license MIT
 *
 * @requires jQuery
 * @requires Logger
 * @provides AutocompleteHelper
 *
 * @todo (?) Option to add loader (add in init stage and just show/hide it). Maybe as a simple overlay (element positioned over ul listview).
 * @todo (?) Choosing item with keyboard (arrows)
 *
 * @param {jQuery} $ The jQuery object.
 * @param {jQuery} $ul Listview element; e.g.: $("#page-search .autocomplete")
 * @param {jQuery} $input Text input element; e.g.: $("#page-search [name=query]")
 * @param {jQuery} $clear Button that clears input value or any other that should hide autocomplete.
 *		So for type=search add a clear button e.g.: $("#page-search [name=query] + .ui-input-clear")
 *		You might also want to include search button here to clear autocomplete when search button is pressed.
 * @param {Function} deferredGet
 *		Function returning jQuery.Deferred (like `jQuery.ajax` does).
 *		It MUST get data based on first parameter (entered text).
 *		It MUST return data with `.resolve(list)` and the list MUST be a simple array with text values.
 */
function AutocompleteHelper($, $ul, $input, $clear, deferredGet)
{
	var _self = this;
	var LOG = new Logger('AutocompleteHelper');
	LOG.enabled = false;

	// bind
	if (typeof($clear) != 'undefined') {
		$clear.click(function() {
			clear();
		});
	}
	$input.keyup(function() {
		onNewText.call(this);
	});

	/**
	 * Min text length after which query is sent.
	 */
	this.minLength = 2;

	/**
	 * If set this function will be run on selected text before inserted into input.
	 */
	this.parseSelected = null;

	/**
	 * Turn on caching.
	 */
	this.caching = false;

	var cache = {};

	/**
	 * Clear cache if you change some options that might change autocomplete results.
	 */
	this.clearCache = function() {
		cache = {};
	};

	/**
	 * Clear list.
	 */
	function clear() {
		$ul.html( "" );
		$ul.listview( "refresh" );
	}

	/**
	 * Insert text of choosen item.
	 */
	function onSelect() {
		var text = $(this).text();
		if (_self.parseSelected) {
			text = _self.parseSelected(text);
		}
		LOG.info('select', text);
		$input.val(text);
		clear();
	}

	var escapeRegExp = /[-[\]{}()*+?.,\\^$|#\s]/g;

	/**
	 * Make an AJAX call when new text is in the input.
	 *
	 * @note keypress is fired before the char is added, keyup seem to work better.
	 */
	function onNewText() {
		var value = this.value;
		if (value.length < _self.minLength) {
			return;
		}
		if (value in cache) {
			renderList(cache[value], value);
			return;
		}
		deferredGet(value)
		.done(function(list){
			LOG.info('list', list);
			cache[value] = list;
			renderList(list, value);
		});
	}
	
	/**
	 * Render list.
	 * @param {Array} list A simple array with text values.
	 * @param {String} text Searched text.
	 */
	function renderList(list, text) {
		var html = "";
		//var html = (list.length < 1 ? "" : "<li>" + list.join('</li><li>') + "</li>");
		if (list.length) {
			var re = new RegExp("(" + text.replace(escapeRegExp, "\\$&") + ")", 'gi');
			for (var i=0; i<list.length; i++) {
				list[i] = list[i].replace(re, '<b>$1</b>');
			}
			html = "<li>" + list.join('</li><li>') + "</li>";
		}
		$ul
			.html(html)
			.listview("refresh")
			.trigger("updatelayout")
		;
		$('li', $ul).click(onSelect);
	}
}