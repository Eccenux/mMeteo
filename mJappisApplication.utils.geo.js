/**
	@file mJappisApplication gelocation utility functions

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
	/**
	 * @class mJappisApplication.geo
	 */
	$mJ.geo = new Object();

	/**
	 * Init geolocation reader.
	 *
	 * @param {type} onSuccess Function to be run upon successfully receiving location data.
	 *		The location data is passed in the first parameter.
	 *		If the parameter name is `location` then lat, lon is available as:
	 *			location.coords.latitude, location.coords.longitude
	 */
	$mJ.geo.initGet = function(onSuccess)
	{
		if (typeof(navigator) != 'undefined' 
			&& typeof(navigator.geolocation) != 'undefined' 
			&& typeof(navigator.geolocation.getCurrentPosition) == 'function')
		{
			navigator.geolocation.getCurrentPosition(onSuccess, $mJ.geo.errorHandler);
		}
	};

	/**
	 * Change this to load map from different place or with different attributes.
	 *
	 * You MUST mark places to insert longitude and latitiude with `%%lon%%`, `%%lat%%` respectively.
	 *
	 * @type string
	 */
	$mJ.geo.mapUrl = 'http://maps.google.com/maps/api/staticmap?center=%%lat%%,%%lon%%&markers=%%lat%%,%%lon%%&maptype=mobile&sensor=false&zoom=10&size=200x200';

	/**
	 * Map loader.
	 *
	 * Tested for Google, but should be universal if you change \a $mJ.geo.mapUrl.
	 *
	 * @param {String} latitude Latitude of map center to be shown.
	 * @param {String} longitude Longitude of map center to be shown.
	 * @param {String|jQuery} imageParent Destination element for image.
	 */
	$mJ.geo.loadMap = function(latitude, longitude, imageParent)
	{
		if (typeof(imageParent) == 'string') {
			imageParent = $(imageParent);
		}

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
			imageParent.html($mJ.i18n.get(info));
		}
		// show
		else
		{
			var url = $mJ.geo.mapUrl;
			
			url = url
				.replace(/%%lat%%/g, ll.lat)
				.replace(/%%lon%%/g, ll.lon)
			;
			imageParent.html('<a href="'+url+'" target="_blank"><img src="'+url+'" alt="'+$mJ.i18n.get('map')+'"></a>');
		}
	};
	
	/**
	 * Init geolocation reader.
	 *
	 * @param {type} error Error object returned by geolocation.getCurrentPosition after an error.
	 */
	$mJ.geo.errorHandler = function(error)
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
			alert($mJ.i18n.get(info));
		}
	};

})(jQuery, window.mJappisApplication);