/**
	@file controllers - settings

	Copyright:  ©2012-2014 Maciej "Nux" Jaros
	  License:  CC-BY or MIT
	            CC-BY: http://creativecommons.org/licenses/by/3.0/
	            MIT: http://www.opensource.org/licenses/mit-license 
*/

/**
 * @param {jQuery} $ jQuery object
 * @param {mJappisApplication} $mJ Main object of this application
 */
(function($, $mJ)
{
	//var LOG = new Logger('controller.settings');
	
	/**
	 * Settings page.
	 * 
	 * Note adding a new option to form is easy:
	 * 1. Add it to your model.
	 * 2. Add new field to builder like so:
	 * $mJ.form.getElementOptions('theOptionKey')
	 * 
	 * @param {object} parameters Parameters map.
	 */
	$mJ.controller.settings = function(parameters)
	{
		var $thisForm = $('#settings-form');
		
		//
		// setup form
		
		var tmpFormData = $mJ.form.init('settings');

		// build HTML
		var formData = formCreator (
		[
			$mJ.form.getElementOptions('getPositionType')
			,
			$mJ.form.getElementOptions('language')
			,
			$mJ.form.startSet()
				,
				$mJ.form.startGroup('mainNavi', {collapsed:true})
					,
					$mJ.form.getElementOptions('mainNaviFormat')
					,
					$mJ.form.getElementOptions('mainNaviPosition')
				,
				$mJ.form.endGroup()
				,
				$mJ.form.startGroup('advanced', {collapsed:true})
					,
					$mJ.form.getElementOptions('pageTransitions')
				,
				$mJ.form.endGroup()
			,
			$mJ.form.endSet()
			,
			{
				type      : 'submit'
				,name     : 'settings-submit'
				,lbl      : $mJ.i18n.get("submit")
			}
		]);
		$mJ.form.close();

		// insert HTML
		$thisForm.html(formData);

		// re-render mobile page markup
		$thisForm.trigger( "create" );
		
		// setup save button to submit form
		$('#settings-submit-btn')
			.unbind()
			.click(function()
			{
				$thisForm.submit();
				return false;
			})
		;

		// validation setup
		$thisForm.validate({meta: "validation"});

		//
		// save action
		$thisForm
			.unbind()
			.submit(function(event)
			{
				// validation check
				if (!$mJ.form.valid(this))
				{
					return false;
				}

				// save
				$mJ.storage.set('settings', tmpFormData);
				
				// refresh to main (need this especially for language change)
				location.href = 'index.html';
				
				event.preventDefault();
				return false;
			})
		;
	};
	
})(jQuery, window.mJappisApplication);