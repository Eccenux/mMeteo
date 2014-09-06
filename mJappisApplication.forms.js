/**
	@file mJappisApplication form creator helper class/module

    Copyright:  ©2012 Maciej "Nux" Jaros
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
	 * Raw HTML "element" for \a formCreator class.
	 *
	 * @param {String} value HTML string.
	 * @type {rawHtmlElement}
	 */
	function rawHtmlElement(value) {
		this.type =  'rawHTML';
		this.value = value;
	}

	/**
	 * Form creator helper class/module.
	 *
	 * @class {mJappisApplication.form}
	 */
	$mJ.form = new Object();

	/** Current schema part */
	var _schemaPart = null;
	/** Current data part */
	var _dataPart = null;
	/** Current base object Name */
	var _baseObjectName = null;
	/** Current status to avoid interference from paralel (shouldn't happen but...) */
	var _isCreatorAlreadyStarted = null;
	/** Is item array */
	var _isItemArray = null;
	
	/**
	 * Init (constructor).
	 *
	 * @param {String} baseObjectName
	 * @param {string|null} itemId
	 *		Meanigful only for item arrays:
	 *		<li> To edit an item provide itemId
	 *		<li> To add an item set itemId to null (or simply omit it).
	 *
	 * @returns {object} object reference that must be saved upon submitting the form.
	 */
	$mJ.form.init = function (baseObjectName, itemId)
	{
		if (_isCreatorAlreadyStarted)
		{
			alert($mJ.i18n.get('form creator already started'));
		}
		_isCreatorAlreadyStarted = true;
		
		_schemaPart = $mJ.storage.getSchema(baseObjectName);
		_dataPart = $mJ.storage.get(baseObjectName);
		_baseObjectName = baseObjectName;

		_isItemArray = ($.isArray(_schemaPart) && typeof(_schemaPart[0]) == 'object');

		var item;
		if (_isItemArray)
		{
			_schemaPart = _schemaPart[0];
			
			var _itemId = (typeof(itemId)=='undefined' ? null : itemId);

			// get item to check if it exists
			if (_itemId)
			{
				item = $mJ.getItemById(_itemId, _dataPart);
				if (item == null)
				{
					_itemId = null;
				}
			}
			
			// if item not found - add new one
			if (_itemId == null)
			{
				item = $mJ.storage.getNewItem(baseObjectName);
				_itemId = item.id;
				_dataPart.push(item);
			}
			
			// this shouldn't happen as it should either be found or created
			if (item == null)
			{
				alert($mJ.i18n.get('item not found'));
			}
		}

		// this is needed to save data
		if (typeof(window.tmpFormData)!='object')
		{
			window.tmpFormData = new Object();
		}
		window.tmpFormData[_baseObjectName] = _dataPart;	// not making a deep copy - already done on storage side

		// this is needed for item manipulation
		if (_isItemArray && item != null)
		{
			if (typeof(window.tmpFormDataItem)!='object')
			{
				window.tmpFormDataItem = new Object();
			}
			_dataPart = window.tmpFormDataItem[_baseObjectName] = item;
		}
		
		return window.tmpFormData[_baseObjectName];
	};

	/**
	 * Close creation (destructor).
	 */
	$mJ.form.close = function ()
	{
		_schemaPart = _dataPart = _baseObjectName = _isCreatorAlreadyStarted = _isItemArray = null;
	};

	/**
	 * Start a form elements group.
	 *
	 * The object is filled based on previously set \a baseObjectName.
	 *
	 * @param {String} groupName Is a name of the group (used for i18n purposes)
	 * @param {object} options An options object that can have one of the following properties set:
	 *		{
	 *			'collapsed'     : false,	// is to be collapsed by default
	 *			'theme'         : 'd',		// jQuery mobile color theme to be used for header
	 *			'contentTheme'  : 'd'		// jQuery mobile color theme to be used for content (and frame)
	 *		}
	 *
	 * @todo
	 *		All of the below should work for _schemaPart[objectName].type = 'select'
	 *		Add other types...
	 *
	 * @returns {rawHtmlElement} HTML to be put in the form.
	 */
	$mJ.form.startGroup = function (groupName, options)
	{
		// std check
		if (!_isCreatorAlreadyStarted)
		{
			alert($mJ.i18n.get('you must init form creator first'));
		}
		
		// prepare options
		var options = $.extend({
		  'collapsed'     : false,
		  'theme'         : 'd',
		  'contentTheme'  : 'd'
		}, options);
		options.collapsed = (!options.collapsed) ? 'false' : 'true';
		
		// group name to label form
		var i18nLabel = _baseObjectName.replace(/\./g, '-');
		i18nLabel = 'group-'+ i18nLabel +'-'+ groupName;

		// done
		return new rawHtmlElement(''
				+'<div data-role="collapsible"'
					+' data-collapsed="'+options.collapsed+'"'
					+' data-theme="'+options.theme+'"'
					+' data-content-theme="'+options.contentTheme+'"'
					+'>'
					+'<h3>'+$mJ.i18n.get(i18nLabel)+'</h3>'
					+'<div>'
		);
	};
	/**
	 * End group previously started by `.form.startGroup`.
	 *
	 * @returns {rawHtmlElement} HTML to be put in the form.
	 */
	$mJ.form.endGroup = function ()
	{
		// std check
		if (!_isCreatorAlreadyStarted)
		{
			alert($mJ.i18n.get('you must init form creator first'));
		}
		
		return new rawHtmlElement('</div></div>');
	};
	
	/**
	 * Start a set of groups (collapsed together).
	 *
	 * @returns {rawHtmlElement} HTML to be put in the form.
	 */
	$mJ.form.startSet = function ()
	{
		// std check
		if (!_isCreatorAlreadyStarted)
		{
			alert($mJ.i18n.get('you must init form creator first'));
		}
		
		return new rawHtmlElement('<div data-role="collapsible-set">');
	};
	/**
	 * End group previously started by `.form.endSet`.
	 *
	 * @returns {rawHtmlElement} HTML to be put in the form.
	 */
	$mJ.form.endSet = function ()
	{
		// std check
		if (!_isCreatorAlreadyStarted)
		{
			alert($mJ.i18n.get('you must init form creator first'));
		}
		
		return new rawHtmlElement('</div>');
	};
	
	/**
	 * Create options object for \a objectName.
	 *
	 * @param {String} objectName Object name relative to `baseObjectName` given in `$mJ.form.init`.
	 * @returns {object} Options for the object.
	 *
	 * @note \a schemaPart and \a dataPart are assumed to be the direct parents of the object given by \a objectName.
	 */
	$mJ.form.getElementOptions = function (objectName)
	{
		// std check
		if (!_isCreatorAlreadyStarted)
		{
			alert($mJ.i18n.get('you must init form creator first'));
		}
		
		// object name to label form
		var labelBase = _baseObjectName.replace(/\./g, '-');
		// shorts
		var elType = _schemaPart[objectName].type;
		
		//
		// prepare general return data
		var elementOptions = {
			type      : elType
			,name     : labelBase+'-'+objectName
			,value    : _dataPart[objectName]
			,extraAttributes : []
			//,jsUpdate : 'window.tmpFormData[\''+_baseObjectName+'\'].'+objectName+' = jQuery(this).val()'
		};
		if (elType == 'flip' && typeof(elementOptions.value) == 'string')
		{
			elementOptions.value = (elementOptions.value == 'true');
		}
		if (_isItemArray)
		{
			elementOptions.jsUpdate = 'window.tmpFormDataItem[\''+_baseObjectName+'\'].'+objectName+' = jQuery(this).val()';
		}
		else
		{
			elementOptions.jsUpdate = 'window.tmpFormData[\''+_baseObjectName+'\'].'+objectName+' = jQuery(this).val()';
		}
		if ('validationJson' in _schemaPart[objectName])
		{
			elementOptions.validationJson = _schemaPart[objectName].validationJson;
		}
		
		//
		// type specific...
		// text and similar -> lbl
		if ($.inArray(elType, ['text', 'number', 'email', 'url', 'date', 'textarea', 'codeScanner']) >= 0)
		{
			elementOptions.lbl = $mJ.i18n.get('label-'+labelBase+'-'+objectName);
		}
		// flip, radio, select -> title
		if ($.inArray(elType, ['radio', 'select', 'flip']) >= 0)
		{
			elementOptions.title = $mJ.i18n.get('label-'+labelBase+'-'+objectName);
		}

		// number
		if ($.inArray(elType, ['number']) >= 0)
		{
			if ('min' in _schemaPart[objectName]) elementOptions.extraAttributes.push({name:'min', value:_schemaPart[objectName].min});
			if ('max' in _schemaPart[objectName]) elementOptions.extraAttributes.push({name:'max', value:_schemaPart[objectName].max});
		}

		// radio, select, flip -> lbls
		if ($.inArray(elType, ['radio', 'select', 'flip']) >= 0)
		{
			var formLabels = [];
			if ('options' in _schemaPart[objectName])
			{
				for (var i = 0; i < _schemaPart[objectName].options.length; i++)
				{
					var option = _schemaPart[objectName].options[i];
					if (typeof(option) == 'string')
					{
						formLabels.push({
							lbl   : $mJ.i18n.get('label-'+labelBase+'-'+objectName+'-' + option)
							,
							value : option
						});
					}
					// assuming object {valueKey:'to be saved', internalValue:'to be used'}
					else
					{
						formLabels.push({
							lbl   : $mJ.i18n.get('label-'+labelBase+'-'+objectName+'-' + option.valueKey)
							,
							value : option.valueKey
						});
					}
				}
			}
			// automatic options (designed for flip, but it might work for select)
			else
			{
				formLabels.push({
					lbl   : $mJ.i18n.get('yes')
					,
					value : true
				});
				formLabels.push({
					lbl   : $mJ.i18n.get('no')
					,
					value : false
				});
			}
			
			elementOptions.lbls = formLabels;
		}
		
		//
		return elementOptions;
	};

	/**
	 * Our form validation.
	 *
	 * @param {Element} form The DOM element of the form.
	 * @returns {Boolean} True if the form is valid.
	 */
	$mJ.form.valid = function(form)
	{
		// validation with plugin
		if (!$(form).valid())
		{
			var $focused = $( document.activeElement );
			alert( $mJ.i18n.get("form-invalid") );
			// focus previous if was invalid
			if ($focused.is(':input.error'))	// was already focused?
			{
				$focused.focus();
			}
			// focus first invalid
			else
			{
				$(':input.error', form)[0].focus();
			}
			return false;
		}
		return true;
	};

})(jQuery, window.mJappisApplication);