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
		//_self.fillGeo ();
		
		// UM_FULLDATE is from http://www.meteo.pl/meteorogram_um_js.php
		if (typeof(UM_FULLDATE) != 'undefined')
		{
			$('#umform-date').val(UM_FULLDATE);
		}
		// COAMPS_FULLDATE is from http://www.meteo.pl/meteorogram_coamps_js.php
		if (typeof(COAMPS_FULLDATE) != 'undefined')
		{
			$('#coampsform-date').val(COAMPS_FULLDATE);
		}

		//
		// Setup i18nalized HTML
		// hide all marked with language attribute and show thoose having current language
		$('*[data-lang]').hide();
		$('*[data-lang|="'+lang+'"]').show();
		// other HTML not setup in controllers
		$('*[data-i18n-key]').each(function()
		{
			debugger;
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