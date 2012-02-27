/**
	@file mMeteo form creator helper class/module

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

	/**
		Current schema part
	*/
	var _schemaPart = null;
	/**
		Current data part
	*/
	var _dataPart = null;
	/**
		Current base object Name
	*/
	var _baseObjectName = null;
	/**
		Current status to avoid interference from paralel
		(shouldn't happen but...)
	*/
	var _isCreatorAlreadyStarted = null;
	
	/**
		Init (constructor)
		
		@note You can use `window.tmpFormData[baseObjectName]`
			to access current data.
	*/
	_self.form.init = function (baseObjectName)
	{
		if (_isCreatorAlreadyStarted)
		{
			alert(_self.i18n.get('form creator already started'));
		}
		_isCreatorAlreadyStarted = true;
		
		_schemaPart = _self.storage.schema.settings;
		_dataPart = _self.storage.get (baseObjectName);
		_baseObjectName = baseObjectName;

		// deep copy of the data object to avoid immediate changes to store (only save on save button)
		if (typeof(window.tmpFormData)!='object')
		{
			window.tmpFormData = new Object();
		}
		window.tmpFormData[_baseObjectName] = _self.deepClone (_dataPart);
	};

	/**
		Close creation (destructor)
	*/
	_self.form.close = function ()
	{
		_schemaPart = _dataPart = _baseObjectName = _isCreatorAlreadyStarted = null;
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
		
		// all of the below should work for _schemaPart[objectName].type = 'select'
		var formLabels = [];
		for (var i = 0; i < _schemaPart[objectName].options.length; i++)
		{
			formLabels.push({
				lbl   : _self.i18n.get('label-'+_baseObjectName+'-'+objectName+'-' + _schemaPart[objectName].options[i])
				,
				value : _schemaPart[objectName].options[i]
			});
		}
		
		return {
			type      : _schemaPart[objectName].type
			,name     : _baseObjectName+'-'+objectName
			,title    : _self.i18n.get('label-'+_baseObjectName+'-'+objectName)
			,lbls     : formLabels
			,value    : _dataPart[objectName]
			,jsUpdate : 'window.tmpFormData.'+_baseObjectName+'.'+objectName+' = jQuery(this).val()'
		};
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

})(jQuery, window.mMeteo);