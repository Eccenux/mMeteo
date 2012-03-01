/**
	@file mJqmApplication form creator helper class/module

    Copyright:  ©2012 Maciej "Nux" Jaros
	  License:  CC-BY-SA
	            http://creativecommons.org/licenses/by-sa/3.0/
*/

/**
	@param $
		jQuery object
	@param _self
		Main object of this application
*/
(function($, _self)
{
	_self.form = new Object();

	//! Current schema part
	var _schemaPart = null;
	//! Current data part
	var _dataPart = null;
	//! Current base object Name
	var _baseObjectName = null;
	//! Current status to avoid interference from paralel (shouldn't happen but...)
	var _isCreatorAlreadyStarted = null;
	//! Is item array
	var _isItemArray = null;
	
	/**
		Init (constructor)
				
		@param itemId [optional] Meanigful only for item arrays:
			\li To edit an item provide itemId
			\li To add an item set itemId to null (or simply omit it).
		
		@return object that must be saved on submit
	*/
	_self.form.init = function (baseObjectName, itemId)
	{
		if (_isCreatorAlreadyStarted)
		{
			alert(_self.i18n.get('form creator already started'));
		}
		_isCreatorAlreadyStarted = true;
		
		_schemaPart = _self.storage.getSchema(baseObjectName);
		_dataPart = _self.storage.get(baseObjectName);
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
				item = _self.getItemById(_itemId, _dataPart);
				if (item == null)
				{
					_itemId = null;
				}
			}
			
			// if item not found - add new one
			if (_itemId == null)
			{
				item = _self.storage.getNewItem('library.items');
				_itemId = item.id;
				_dataPart.push(item);
			}
			
			// this shouldn't happen as it should either be found or created
			if (item == null)
			{
				alert(_self.i18n.get('item not found'));
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
		Close creation (destructor)
	*/
	_self.form.close = function ()
	{
		_schemaPart = _dataPart = _baseObjectName = _isCreatorAlreadyStarted = _isItemArray = null;
	};
	
	/**
		Create options object for given \a objectName
		
		The object is filled based on previously set \a baseObjectName
		
		@note \a schemaPart and \a dataPart are assumed to be the direct parents 
		of the object given by \a objectName
		
		@param objectPath Is an object path in the original schema (model) that is to be used to 
			create i18n labels for the element
		@param updated
			In schema Is the key in i18n and/or a base key for labels for select options
			e.g for language this would be 'label-settings-language'
		
		@todo
			All of the below should work for _schemaPart[objectName].type = 'select'
			Add other types...
	*/
	_self.form.getElementOptions = function (objectName)
	{
		if (!_isCreatorAlreadyStarted)
		{
			alert(_self.i18n.get('you must init form creator first'));
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
			//,jsUpdate : 'window.tmpFormData[\''+_baseObjectName+'\'].'+objectName+' = jQuery(this).val()'
		};
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
		/**
			@todo checkbox
				\li Should we implement it at all?
				\li Implement filp instead?
				\li What i18n keys should we use? (checkbox normaly should have lbl and title)
		*/
		// text and similar -> lbl
		if ($.inArray(elType, ['text', 'email', 'url', 'date', 'textarea']) >= 0)
		{
			elementOptions.lbl = _self.i18n.get('label-'+labelBase+'-'+objectName);
		}
		// checkbox, radio, select -> title
		if ($.inArray(elType, ['radio', 'select']) >= 0)
		{
			elementOptions.title = _self.i18n.get('label-'+labelBase+'-'+objectName);
		}
		
		// radio, select -> lbls
		if ($.inArray(elType, ['radio', 'select']) >= 0)
		{
			var formLabels = [];
			for (var i = 0; i < _schemaPart[objectName].options.length; i++)
			{
				formLabels.push({
					lbl   : _self.i18n.get('label-'+labelBase+'-'+objectName+'-' + _schemaPart[objectName].options[i])
					,
					value : _schemaPart[objectName].options[i]
				});
			}
			
			elementOptions.lbls = formLabels;
		}
		
		//
		return elementOptions;
	};

	/**
		Our form validation
		
		@param form A DOM element of the form
	*/
	_self.form.valid = function(form)
	{
		// validation with plugin
		if (!$(form).valid())
		{
			var $focused = $( document.activeElement );
			alert( _self.i18n.get("form-invalid") );
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

})(jQuery, window.mJqmApplication);