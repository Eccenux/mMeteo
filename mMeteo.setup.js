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

	/**
		(re)Fill geolocation info
	*/
	_self.fillGeo = function ()
	{
		_self.geo.initGet (function(pos)
		{
            $('#umform-lat').val(pos.coords.latitude);
            $('#umform-lon').val(pos.coords.longitude);
            $('#coampsform-lat').val(pos.coords.latitude);
            $('#coampsform-lon').val(pos.coords.longitude);
		});
	}
	
	//
	// Onready, general setup
	//
	$(function()
	{
		//
		// Setup geolocation
		_self.fillGeo ();
		
		// UM_FULLDATE is from http://www.meteo.pl/meteorogram_um_js.php
		$('#umform-date').val(UM_FULLDATE);
		// COAMPS_FULLDATE is from http://www.meteo.pl/meteorogram_coamps_js.php
		$('#coampsform-date').val(COAMPS_FULLDATE);
	});

	/**
	//
	// Onready, general setup
	//
	$(function()
	{
		//
		// Setup i18nalized HTML (hide all marked with language attribute and show thoose having current language)
		$('*[data-lang]').hide();
		$('*[data-lang|="'+lang+'"]').show();
		
		//
		// Main page must be set-up when no hash or just hash is given
		// (if hash is not given jQueryMobile doeasn't call pagebeforechange with url in toPage)
		if (location.hash.length <= 1)
		{
			_self.controller.start();
		}
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
		
		// other
		$.mobile.defaultPageTransition = "none";		// none for performance
		//$.mobile.fallbackTransition.slideout = "none";	// transition for non-3D animation enabled browser
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