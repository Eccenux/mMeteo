/**
	@file mJappisApplication utility functions

    Copyright:  ©2012-2014 Maciej "Nux" Jaros
	  License:  CC-BY-SA
	            http://creativecommons.org/licenses/by-sa/3.0/
*/

/**
 * @param {jQuery} $ jQuery object
 * @param {mJappisApplication} $mJ Main object of this application
 */
(function($, $mJ)
{
	/**
	 * Loader - jQuery extension/plugin.
	 * 
	 * Inserts loader in matched tag(s). Usage:
	 * $('#list-container').mjLoader();
	 *
	 * Custom size:
	 * $('#list-container').mjLoader({size:'40px'});
	 * 
	 * @note Replaces any content of the tag.
	 */
	$.extend($.fn, {
		mjLoader: function(userOptions) {
			var options = $.extend({
				size : '35px'
			}, userOptions);
			this.html('<img src="css/images/loader-black.svg" width="' + options.size + '" height="' + options.size + '" />');
		}
	});

	/**
	 * Usage:
	 * $mJ.pLOG.performance('comment');
	 */
	$mJ.pLOG = new Logger('perf');

	/**
	 * Parameters helper.
	 *
	 * Supported types:
	 * <li>int - Value is parsed as an integer.
	 * <li>str or string - Value is parsed as a String and assumed to be URL encoded.
	 *
	 * @param {Object} parameters Parameters object (key:value).
	 * @param {Object} types Types of the parameters (key:type).
	 * @returns {Object}
	 *	Returns parameters object with parameters parsed.
	 *	Note that any parametr in `types` object is guaranteed to be set.
	 *	Value is set to null upon parsing error or when item was not found.
	 */
	$mJ.parseParameters = function(parameters, types) {

		for (var key in types) {
			if (!(key in parameters)) {
				parameters[key] = null;
			}
			else {
				switch (types[key]) {
					case 'int':
						try {
							parameters[key] = parseInt(parameters[key], 10);
						} catch (e) {}
					break;
					case 'str':
					case 'string':
						parameters[key] = decodeURIComponent(parameters[key].toString());
					break;
					default:
						parameters[key] = parameters[key].toString();
					break;
				}
			}
		}
		return parameters;
	};

	/**
	 * Get by ID helper function.
	 * 
	 * @param {String} id Id of an item to get.
	 * @param {array} items Items array (must contain objects that have id set).
	 * @param {Object} userOptions [optional] Options object, see code for defaults.
	 * @returns {object} Object that has `id` property equal to `id`.
	 */
	$mJ.getItemById = function(id, items, userOptions)
	{
		var options = $.extend({
			idField	: 'id',
			compareFunction : function (field, id) {
				return field === id;
			}
		}, userOptions);

		var item = null;
		for (var i = 0; i < items.length; i++)
		{
			if (options.compareFunction(items[i][options.idField], id))
			{
				item = items[i];
				break;
			}
		}
		
		return item;
	};

	/**
	 * Remove by ID helper function.
	 * 
	 * @param {String} id Id of an item to get.
	 * @param {array} items Items array (must contain objects that have id set).
	 */
	$mJ.delItemById = function(id, items)
	{
		for (var i = 0; i < items.length; i++)
		{
			if (items[i].id === id)
			{
				items.splice(i, 1);	// remove 1 element at i
				break;
			}
		}
	};

	/**
	 * Build a list of items and insert it in the container.
	 *
	 * @param {String} pageSelector The page container selector of the list.
	 * @param {String} containerSelector The container to hold the list.
	 * @param {String|Array} listObject Base object name in the model OR an array of objects.
	 * @param {object} options Options to pass to $mJ.buildList
	 *	with optional addition of function that is called
	 *	just before moving to a list item: `'showItemExtraActionFunction' : function (item) {}`
	 * @param {object} options Options to pass to $mJ.buildList.
	 */
	$mJ.makeList = function(pageSelector, containerSelector, listObject, options)
	{
		var $listContainer = $(containerSelector);
		
		// build HTML
		var list = $mJ.buildList(listObject, options);
		
		// replace list
		$listContainer
			.empty()
			.html(list)
			.trigger('create')
		;

		try {
			//$(pageSelector).page();
			$('ul', $listContainer).listview('refresh');
		} catch (e) {
			// might make footer disapear when something weird happens...
			// maybe it will be fixed in JQM (seem to be related with _createSubPages)...
			document.title += ' [list error!]';
		}
		/*
			Bug fix for JQM 1.4:
			# Click on a list item
			# Notice the URL

			Now in a location you will NOT see the id of the library.
			
			JQM report:
			https://github.com/jquery/jquery-mobile/issues/6965

			Previous JQM bug:
			# Click on a list item.
			# URL is correct.
			# Go back.
			# Click on another list item.
			# URL is the same as in step 2.
		*/
		$('a', $listContainer)
			.unbind()
			.click(function(event)
			{
				/*
				// location.href = this.href;
				$.mobile.navigate(this.href);
				event.preventDefault();
				return false;
				*/
				var pageSelector = this.hash.replace(/\?.+/, '');
				$(pageSelector).jqmData( "url", this.href);
			})
		;
		/**/
		// extra action
		if (typeof(options) == 'object' && 'showItemExtraActionFunction' in options) {
			var items = typeof(listObject)=='string' ? $mJ.storage.get(listObject + '.items') : listObject;
			$('a[data-show-index]', $listContainer)
				.click(function()
				{
					var index = this.getAttribute('data-show-index');
					options.showItemExtraActionFunction(items[index]);
				})
			;
		}
	};

	/**
	 * Build HTML for a item list.
	 * 
	 * @note By default it's assumed object contain at least `id` and `name`, but you can change `options` to support any object.
	 * @note default action is to remove item or to be more exact to go to #page-remove?id=...
	 *
	 * @param {String|Array} listObject Base object name in the model OR an array of objects.
	 * @param {Object} userOptions
	 *		An options object that can have any or none of the properties set.
	 *		See code for available options.
	 * @returns {html}
	 */
	$mJ.buildList = function(listObject, userOptions)
	{
		// options
		var options = $.extend(
			{
				// functions take list item and return text
				'listTextFunction' : function (item) {
					return item.name;
				},
				'showItemUrlFunction' : function (item) {
					return '#page-show?id='+ item.id;
				},
				'actionItemUrlFunction' : function (item) {
					return '#page-remove?id='+ item.id;
				},
				// if true is returned no action item will be visible for the item
				'actionItemIgnoreFunction' : function (item) {
					return false;
				},
				'addActionButton'	: false,		// just add show link
				'addFilter'			: true,			// show filtering input
				'actionIcon'		: 'delete',		// jQM icon name
				'actionTheme'		: 'd',			// jQM color theme to be used for the button
				'maxItems'			: Infinity		// stop display at X items (by default show all)
			}
		, userOptions);
		options.maxItems = parseInt(options.maxItems);
		if (isNaN(options.maxItems)) {
			options.maxItems = Infinity;
		}

		// start html
		var listAttributes = "data-role='listview' data-inset='true'";
		if (options.addFilter) {
			listAttributes += " data-filter='true'";
		}
		if (options.addActionButton)
		{
			listAttributes += ' data-split-icon="'+options.actionIcon+'" data-split-theme="'+options.actionTheme+'"';
		}
		var html = '<ul '+listAttributes+'>';
		
		// build list
		var items = typeof(listObject)=='string' ? $mJ.storage.get(listObject + '.items') : listObject;
		var displayLength = items.length;
		if ('maxItems' in options && displayLength > options.maxItems) {
			displayLength = parseInt(options.maxItems);
		}
		for (var i = 0; i < displayLength; i++)
		{
			html += '<li>';
			html += '<a data-show-index="'+i+'" href="'+ options.showItemUrlFunction(items[i]) +'">'+ options.listTextFunction(items[i]) +'</a>';
			if (options.addActionButton && !options.actionItemIgnoreFunction(items[i]))
			{
				html += '<a href="'+ options.actionItemUrlFunction(items[i]) +'">'+ $mJ.i18n.get("delete - title") +'</a>';
			}
			html += '</li>';
		}
		html += '</ul>';

		if (items.length < 1)
		{
			html = $mJ.i18n.get("the list is empty");
		}
		
		return html;
	};

	/**
	 * Activate links with special attribute to work accros various solutions.
	 *
	 * To use this replace data-rel="back" links
	 * with the attribute set to data-rel="back-internal-html".
	 */
	$mJ.activateInternalBackButtons = function()
	{
		//
		// Back to internal HTML page setup
		$('a[data-rel|="back-internal-html"]')
			.unbind()
			.click(function(event)
			{
				// phonegap
				if (typeof(navigator) != 'undefined' && typeof(navigator.app) != 'undefined' && typeof(navigator.app.backHistory) == 'function')
				{
					navigator.app.backHistory();
				}
				// standard
				else
				{
					history.go(-1);
				}
				event.preventDefault();
				return false;
			})
		;
	};

	/**
	 * Create a deep (recursive) copy of an object (or an array).
	 *
	 * @param {object|array} source Object to be cloned.
	 * @returns {object|array} Cloned object (related only by value)
	 */
	$mJ.deepClone = function(source)
	{
		if ($.isArray(source))
		{
			return $.extend(true, [], source);
		}
		else
		{
			return $.extend(true, {}, source);
		}
	};

	/**
	 * Bind input to a storage value.
	 *
	 * @note SHOULD be run in a controller or whenever the input is available (don't have to be visible though).
	 * Second call only restores the value.
	 *
	 * @param {String} selector jQuery selector of input element.
	 * @param {String} storagePath Path for $mJ.storage.get/set.
	 */
	$mJ.bindInput = function(selector, storagePath)
	{
		// setup saving (only once)
		var bindIndicator = 'data-jqm-bind-' + storagePath;
		if ($(selector).attr(bindIndicator) != 'true')
		{
			$(selector).attr(bindIndicator, 'true');
			
			$(selector).change(function()
			{
				$mJ.storage.set(storagePath, $(this).val());
			});
		}
		
		// restore
		$(selector).val($mJ.storage.get(storagePath));
	};
	
})(jQuery, window.mJappisApplication);