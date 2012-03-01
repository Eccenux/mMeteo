/**
	@file mJqmApplication base file

    Copyright:  ©2012 Maciej "Nux" Jaros
	  License:  CC-BY-SA
	            http://creativecommons.org/licenses/by-sa/3.0/
				
	@note You will probably want to change storageKey here.
*/

/**
	Main, global object
*/
window.mJqmApplication =
{
	//! storage schema, data and basic data manipulation object/class
	//! @see lib/jquery.store.js Core storage class (used in storage functions)
	//! @see mJqmApplication.storage.js Storage class for high level data manipulation
	//! @see mJqmApplication.model.js Model for this application
	storage :
	{
		schema : null
		,
		initialData : null
		,
		storageKey : 'mMeteoData'
	}
	,
	//! i18n object
	//! @see mJqmApplication.i18n.js
	i18n : null
	,
	//! controllers for various pages
	//! @see mJqmApplication.controller.js
	controller : null
};
