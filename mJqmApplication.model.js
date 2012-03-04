/**
	@file mJqmApplication model (schema with defaults) and inital/test data

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
		Schema
		
		@see mJqmApplication.storage.js
	*/
	_self.storage.schema =
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
			,pageTransitions : {type:"select", value:"none", options:['none', 'slide', 'slideup', 'slidedown', 'pop', 'fade', 'flip']}
			// type of footer/buttons: fixed to bottom*, below content, below header; *default, but don't work too good on all phones (browsers)
			,mainNaviPosition: {type:"select", value:"bottom-fixed", options:['bottom-fixed', 'below-content', 'below-header']}
		}
	};

	/**
		Initial/test data
	*
	_self.storage.initialData =
	{
		settings :
		{
			 language : "pl"
		}
	};
	/**/

})(jQuery, window.mJqmApplication);