/**
	@file mJappisApplication model (schema with defaults) and inital/test data

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
	$mJ.storage = $mJ.storage || {};
	
	/**
	 * Storage key (similar to database name) for this app.
	 */
	$mJ.storage.storageKey = 'mMeteoData';
	
	/**
	 * Schema.
	 * @see mJappisApplication.storage.js for examples
	 */
	$mJ.storage.schema =
	{
		position :
		{
			favorite :
			{
				 lat : {type:"text", value:""}
				,lon : {type:"text", value:""}
			}
		}
		,
		settings :
		{
			language        : {type:"select", value:"pl", options:["pl", "en"]}
			// Navigation buttons
			,mainNaviFormat  : {type:"select", value:"icons&text", options:['icons&text', 'icons-only', 'text-only']}
			// get position: automatic*, only manual, manual refresh with position saving**; *position is acquired when the application is loaded, **default.
			,getPositionType : {type:"select", value:"manual-but-saved", options:['automatic', 'manual-only', 'manual-but-saved']}
			// skin (default=application native; other: a,b,c,d,e? colors? other names?)
			,skin            : {type:"select", value:"default", options:['default']}
			// type of animation in transitions between pages
			// leave none default! Android pre 4.2 does not work too good with animations...
			,pageTransitions : {type:"select", value:"none", options:['none', 'slide', 'slideup', 'slidedown', 'pop', 'fade', 'flip', 'turn', 'flow', 'slidefade']}
			// type of footer/buttons: fixed to bottom*, below content, below header; *default, but don't work too good on all phones (browsers)
			,mainNaviPosition: {type:"select", value:"bottom-fixed", options:['bottom-fixed', 'below-content', 'below-header']}
		}
	};

	function getBrowserLanguage(fallback, available) {
		var language = window.navigator.userLanguage || window.navigator.language;
		if ($.inArray(language, available) < 0) {
			return fallback;
		}
		return language;
	}

	/**
	 * Initial/test data
	 */
	$mJ.storage.initialData =
	{
		settings :
		{
			 language :  getBrowserLanguage("pl", ["pl", "en"])
		}
	};
	/**/

})(jQuery, window.mJappisApplication);