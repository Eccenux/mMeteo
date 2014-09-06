/**
	@file controllers - start

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
	var _currentGeoSelectorPrefix = '#forecastform-';

	/**
		(re)Fill geolocation info
	*/
	var _fillGeo = function ()
	{
		$mJ.geo.initGet (function(pos)
		{
			$(_currentGeoSelectorPrefix + 'lat')
				.val(pos.coords.latitude)
				.change()
			;
			$(_currentGeoSelectorPrefix + 'lon')
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
	$mJ.controller.start = function(parameters)
	{
		// we need to set this up only once
		if (_startDone)
		{
			return;
		}
		_startDone = true;
		
		//
		// Fill geolocation on load
		var getPositionType = $mJ.storage.get('settings.getPositionType');
		if (getPositionType == 'automatic')
		{
			_fillGeo();
		}
		
		//
		// Auto-save
		if (getPositionType == 'manual-but-saved')
		{
			$mJ.bindInput(_currentGeoSelectorPrefix + 'lat', 'position.favorite.lat');
			$mJ.bindInput(_currentGeoSelectorPrefix + 'lon', 'position.favorite.lon');
		}
		
		//
		// Refresh button(s)
		$('.refresh-geo').click(function()
		{
			_fillGeo();
		});
		// map button
		$('#show-map-button').click(function()
		{
			$mJ.geo.loadMap($('#forecastform-lat').val(), $('#forecastform-lon').val(), '#map-preview');
		});
		
		//
		// Forecast submit action
		$('#forecastform').submit(function()
		{
			// auto-fix values
			var ll = { lat: $(_currentGeoSelectorPrefix + 'lat').val(), lon: $(_currentGeoSelectorPrefix + 'lon').val() };
			ll.lat = ll.lat.replace(/,/, '.');
			ll.lon = ll.lon.replace(/,/, '.');
			$(_currentGeoSelectorPrefix + 'lat').val(ll.lat);
			$(_currentGeoSelectorPrefix + 'lon').val(ll.lon);

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
				alert($mJ.i18n.get(info));
				return false;
			}
			
			// switch between two forms
			var modelChoosen = $('#forecastform').attr('data-model');	// this was set onclick
			/*
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
			*/
			// setup action
			var actionUrl = $('#forecastform').attr('data-action-'+modelChoosen);
			if (actionUrl)
			{
				$('#forecastform').attr('action', actionUrl);
			}
			return true;
		});
	};
	
})(jQuery, window.mJappisApplication);