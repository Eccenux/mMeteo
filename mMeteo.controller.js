/**
	@file mMeteo JS controllers

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
	_self.controller = new Object();
	
	/**
		Start (default/main) page
	*/
	_self.controller.start = function(parameters)
	{
	}
	
	/**
		Settings page
	*/
	_self.controller.settings = function(parameters)
	{
		//
		// setup form
		/*
			 language         : {type:"select", value:"pl", options:["pl", "en"]}
		*/
		// for short...
		var schema = _self.storage.schema.settings;
		var data = _self.storage.get ('settings');
		// language labels/options
		var languageLabels = [];
		for (var i = 0; i < schema.language.options.length; i++)
		{
			languageLabels.push({
				lbl   : _self.i18n.get("label-settings-language-" + schema.language.options[i])
				,
				value : schema.language.options[i]
			})
		}
		// deep copy of the library object to avoid immediate changes to store (only save on save button)
		window.tmpSettings = _self.deepClone (data);
		// get HTML
		var formData = formCreator (
		[
			{
				type      : schema.language.type
				,name     : 'settings-language'
				,title    : _self.i18n.get("label-settings-language")
				,lbls     : languageLabels
				,value    : data.language
				,jsUpdate : 'tmpSettings.language = jQuery(this).val()'
			}
		]);
		// insert HTML
		$('#settings-form').html(formData);

		// re-render mobile page markup
		$('#settings-form').trigger( "create" );
		
		//
		// save action
		var saveAction = function()
		{
			/*
			// simple validation
			if (window.tmpSettings.name.length < 0)
			{
				alert(_self.i18n.get("error: name must not be empty"));
				return false;
			}
			*/
			// save
			_self.storage.set ('settings', window.tmpSettings);
			// go back (close)
			// history.go(-1);
			// refresh to main
			location.href = 'index.html';
			return false;
		}
		// bind
		$('#settings-submit-btn')
		.unbind()
		.click(saveAction);
		// TODO submit (ENTER)
		$('#settings-form').trigger( "create" );
	}
})(jQuery, window.mMeteo);