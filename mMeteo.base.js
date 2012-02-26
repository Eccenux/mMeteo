/**
	@file mMeteo base file

    Copyright:  ©2012 Maciej "Nux" Jaros
	  License:  CC-BY-SA
	            http://creativecommons.org/licenses/by-sa/3.0/
*/

/**
	Main, global object
*/
window.mMeteo =
{
	//! storage schema, data and basic data manipulation object/class
	//! @see lib/jquery.store.js Core storage class (used in storage functions)
	//! @see mMeteo.storage.js Storage class for high level data manipulation
	//! @see mMeteo.model.js Model for this application
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
	//! @see mMeteo.i18n.js
	i18n : null
	,
	//! controllers for various pages
	//! @see mMeteo.controller.js
	controller : null
};
