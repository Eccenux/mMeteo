/**
	@file mJqmApplication JS controllers

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
		Settings page
	*/
	_self.controller.settings = function(parameters)
	{
		var $thisForm = $('#settings-form');
		
		//
		// setup form
		
		var tmpFormData = _self.form.init('settings');

		// get HTML
		var formData = formCreator (
		[
			_self.form.getElementOptions('getPositionType')
			,
			_self.form.getElementOptions('language')
			,
			_self.form.startSet()
				,
				_self.form.startGroup('mainNavi', {collapsed:true})
					,
					_self.form.getElementOptions('mainNaviFormat')
					,
					_self.form.getElementOptions('mainNaviPosition')
				,
				_self.form.endGroup()
				,
				_self.form.startGroup('advanced', {collapsed:true})
					,
					_self.form.getElementOptions('pageTransitions')
				,
				_self.form.endGroup()
			,
			_self.form.endSet()
			,
			{
				type      : 'submit'
				,name     : 'settings-submit'
				,lbl      : _self.i18n.get("submit")
			}
		]);
		_self.form.close();

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
				if (!_self.form.valid(this))
				{
					return false;
				}

				// save
				_self.storage.set('settings', tmpFormData);
				
				// refresh to main (need this especially for language change)
				location.href = 'index.html';
				
				event.preventDefault();
				return false;
			})
		;
	};
	
	/**
		(re)Fill geolocation info
	*/
	var _fillGeo = function ()
	{
		_self.geo.initGet (function(pos)
		{
            $('#forecastform-lat')
				.val(pos.coords.latitude)
				.change()
			;
            $('#forecastform-lon')
				.val(pos.coords.longitude)
				.change()
			;
		});
	};

	/**
		Start controller status
	*/
	var _startDone = false;
	
	/**
		Start (default/main) page
	*/
	_self.controller.start = function(parameters)
	{
		// we need to set this up only once
		if (_startDone)
		{
			return;
		}
		_startDone = true;
		
		//
		// Fill geolocation on load
		var getPositionType = _self.storage.get('settings.getPositionType');
		if (getPositionType == 'automatic')
		{
			_fillGeo();
		}
		
		//
		// Auto-save
		if (getPositionType == 'manual-but-saved')
		{
			// setup saving
			$('#forecastform-lat').change(function()
			{
				_self.storage.set('position.favorite.lat', $(this).val());
			});
			$('#forecastform-lon').change(function()
			{
				_self.storage.set('position.favorite.lon', $(this).val());
			});
			
			// restore
			$('#forecastform-lat').val(_self.storage.get('position.favorite.lat'));
			$('#forecastform-lon').val(_self.storage.get('position.favorite.lon'));
		}
		
		// refresh button(s)
		$('.refresh-geo').click(function()
		{
			_fillGeo();
		});
		
		//
		// Forecast submit action
		$('#forecastform').submit(function()
		{
			// auto-fix values
			var ll = { lat: $('#forecastform-lat').val(), lon: $('#forecastform-lon').val() };
			ll.lat = ll.lat.replace(/,/, '.');
			ll.lon = ll.lon.replace(/,/, '.');
			$('#forecastform-lat').val(ll.lat);
			$('#forecastform-lon').val(ll.lon);

			// validate values
			var info = "";
			if (ll.lat == '' || ll.lon == '')
			{
				info = "error: position empty";
			}
			else if (ll.lat.search(/^[0-9.]+$/) < 0 || ll.lon.search(/^[0-9.]+$/) < 0)
			{
				info = "error: position must be decimal";
			}
			
			// show error
			if (info.length)
			{
				alert(_self.i18n.get(info));
				return false;
			}
			
			// switch between two forms
			var modelChoosen = $('#forecastform').attr('data-model');	// this was set onclick
			if (modelChoosen == 'um')
			{
				if (typeof(UM_FULLDATE) != 'undefined')		// UM_FULLDATE is from http://www.meteo.pl/meteorogram_um_js.php
				{
					$('#forecastform-date').val(UM_FULLDATE);
				}
			}
			else
			{
				if (typeof(COAMPS_FULLDATE) != 'undefined')	// COAMPS_FULLDATE is from http://www.meteo.pl/meteorogram_coamps_js.php
				{
					$('#forecastform-date').val(COAMPS_FULLDATE);
				}
			}
			// setup action
			var actionUrl = $('#forecastform').attr('data-action-'+modelChoosen);
			if (actionUrl)
			{
				$('#forecastform').attr('action', actionUrl);
			}
			return true;
		});
	};
	
})(jQuery, window.mJqmApplication);