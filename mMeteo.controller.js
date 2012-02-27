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
		
		// create HTML
		_self.formCreator.init('settings');	// sets //window.tmpFormData['settings'] 
		var formData = formCreator (
		[
			_self.getFormCreatorElementOptions('language')
		]);
		_self.formCreator.close();
		
		// insert HTML
		$('#settings-form').html(formData);

		// re-render mobile page markup
		$('#settings-form').trigger( "create" );
		
		//
		// save action
		$('#settings-form')
			.unbind()
			.submit(function()
			{
				// save
				_self.storage.set ('settings', window.tmpFormData['settings']);
				// refresh to main
				location.href = 'index.html';
				return false;
			})
		;
		// bind save button with submit
		$('#settings-submit-btn')
			.unbind()
			.click(function()
			{
				$('#settings-form').submit();
			})
		;
	}
})(jQuery, window.mMeteo);