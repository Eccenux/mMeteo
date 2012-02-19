/**
	@file mMeteo setup of controllers mapping and general initialization

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
	//
	// Setup storage
	//
	_self.storage.init();
	
	//
	// Setup JS i18n
	// (see below for HTML setup)
	var lang = _self.storage.data.settings.language;
	_self.i18n = new I18n(_self.i18n, lang);
	
	//
	// Onready, general setup
	//
	$(function()
	{
		//
		// TEMP - setup fixed headers
		//$('div[data-role="header"]').attr('data-position', 'fixed');
		
		//
		// Setup geolocation
		_self.fillGeo ();
		
		//
		// Setup submit action
		$('#forecastform').submit(function()
		{
			// auto-fix values
			var ll = { lat: $('#forecastform-lat').val(), lon: $('#forecastform-lon').val() };
			ll.lat = ll.lat.replace(/,/, '.')
			ll.lon = ll.lon.replace(/,/, '.')
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

		//
		// Setup i18nalized HTML
		// hide all marked with language attribute and show thoose having current language
		$('*[data-lang]').hide();
		$('*[data-lang|="'+lang+'"]').show();
		// other HTML not setup in controllers
		$('*[data-i18n-key]').each(function()
		{
			var key = $(this).attr('data-i18n-key');
			if ($(this).attr('type') == 'button')
			{
				$(this).val(_self.i18n.get(key));
			}
			else
			{
				$(this).html(_self.i18n.get(key));
			}
		});
	});

	//
	// Startup settings for jquery mobile
	//
	$(document).bind("mobileinit", function()
	{
		// i18n in settings
		if (lang == "pl")
		{
			$.mobile.listview.prototype.options.filterPlaceholder = "Filtruj listę...";
		}
		
		// animation on page change
		$.mobile.defaultPageTransition = "none";		// none for performance
		//$.mobile.fallbackTransition.slideout = "none";	// transition for non-3D animation enabled browser
		
		// footer fixation (not working: about -> tap on the page -> open sub-collapsed section)
		$.mobile.touchOverflowEnabled = true;
		$.mobile.fixedToolbars.setTouchToggleEnabled(false);
	});
	
	//
	// Setup page transitions to controllers mapping
	//
	$(document).bind( "pagebeforechange", function( e, data )
	{
		// We only want to handle changePage() calls where the caller is
		// asking us to load a page by URL.
		if ( typeof data.toPage === "string" )
		{
			var newPageHash = $.mobile.path.parseUrl( data.toPage ).hash;
			
			// default page = #page-start
			if (newPageHash.length <= 1)
			{
				newPageHash = "#page-start";
			}
			
			// get controller name and parameters
			var controllerName = "";
			var parameters = {};
			newPageHash.replace(/^#page-([^?&]+)([?&].+)?$/, function(a, matchedController, matchedParams)
			{
				controllerName = matchedController;
				if (matchedParams)
				{
					matchedParams.replace(/[?&]([^?&=]+)=([^?&=]+)/g, function(a, name, value)
					{
						parameters[name] = value;
					});
				}
			});
			
			if (controllerName.length && typeof(_self.controller[controllerName]) == 'function')
			{
				_self.controller[controllerName](parameters);
			}
		}
	});
	/**/
	
})(jQuery, window.mMeteo);