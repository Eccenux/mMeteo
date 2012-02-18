/**
	@file mMeteo model (schema with defaults) and test data

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
	/**
		Init
	*/
	_self.storage.init = function ()
	{
		$.storage = new $.store(); 
		var data = $.storage.get (_self.storage.storageKey);
		if (data)	// not null and not undefined
		{
			_self.storage.data = data;
		}
	}
	/**
		Save all data from temp store (storage.data) to permanent store
	*/
	_self.storage.save = function ()
	{
		$.storage.set (_self.storage.storageKey, _self.storage.data);
	}
	/**
		Remove all data from permanent store
	*/
	_self.storage.remove = function ()
	{
		$.storage.flush();
	}
	
	/**
		Schema
		
		Building i18n labels:
		\li label-[objectFieldName]...-[objectFieldName]
		\li label-[objectFieldName]...-[objectFieldName]-[optionName]

		Building field name/id:
		\li [formName]-[objectFieldName]
		
		@note value for a field is the default value
		
		Types:
		\li text - simple, short text
		\li password - text that should not be visible when typing (re-entering advised or show/hide characters); should be encrypted
		\li url - simple, short text
		\li textarea - multi-line text
		\li select - one of values in options array (for labels see above)
		\li flip - flip switch yes/no select (true/false)
		\li id - non-editable item identification value, should auto-increment on insert and MUST update (usualy increment) lastId of the container object
		
	*/
	_self.storage.schema =
	{
		settings :
		{
			 language         : {type:"select", value:"pl", options:["pl", "en"]}
		}
	};

	/**
		Test data
	*/
	_self.storage.data =
	{
		settings :
		{
			 language : "pl"
		}
	};

})(jQuery, window.mMeteo);