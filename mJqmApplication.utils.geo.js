/**
	@file mJqmApplication gelocation utility functions

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
		Map loader (Google)
		
		@param latitude Latitude of position to be shown
		@param longitude Longitude of position to be shown
		@param imageParent Destination element for image
	*/
	_self.geo.loadMap = function(latitude, longitude, imageParent)
	{
		// auto-fix values
		var ll = { lat: latitude, lon: longitude };
		ll.lat = ll.lat.replace(/,/, '.');
		ll.lon = ll.lon.replace(/,/, '.');

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
		
		// error
		if (info.length)
		{
			$(imageParent).html(_self.i18n.get(info));
		}
		// show
		else
		{
			var url = 'http://maps.googleapis.com/staticmap?center=%%lat%%,%%lon%%&markers=%%lat%%,%%lon%%&maptype=mobile&sensor=false&zoom=15&size=200x200&key=AIzaSyDgIGdkNTcSSJO-NXGyVtoRoBNDvZdy4S8';
			url = url
				.replace(/%%lat%%/g, ll.lat)
				.replace(/%%lon%%/g, ll.lon)
			;
			$(imageParent).html('<a href="'+url+'" target="_blank"><img src="'+url+'" alt="'+_self.i18n.get('map')+'"></a>');
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

})(jQuery, window.mJqmApplication);