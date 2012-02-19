/**
	@file mMeteo gelocation utility functions

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
	_self.geo = new Object();
	
	/**
		Init geolocation reader
		
		@param onSuccess Function to be run upon successfully receiving data
			the data is passed in the first parameter which you can read like this:
			position.coords.latitude, position.coords.longitude
	*/
	_self.geo.initGet = function(onSuccess)
	{
		if (typeof(navigator) != 'undefined' 
			&& typeof(navigator.geolocation) != 'undefined' 
			&& typeof(navigator.geolocation.getCurrentPosition) == 'function')
		{
			navigator.geolocation.getCurrentPosition(onSuccess, _self.geo.errorHandler);
		}
	}

	/**
		Init geolocation reader
		
		@param error Error object returned by geolocation.getCurrentPosition after an error
	*/
	_self.geo.errorHandler = function(error)
	{
		var info = "unexpected error";
		switch(error.code)
		{
			case error.PERMISSION_DENIED:
				info = "";	// no info - user should know that
			break;
			case error.POSITION_UNAVAILABLE:
				info = "could not detect your position";
			break;
			case error.TIMEOUT:
				info = "retrieving your position timed out";
			break;
		}
		// show error
		if (info.length)
		{
			alert(_self.i18n.get(info));
		}
	}

})(jQuery, window.mMeteo);