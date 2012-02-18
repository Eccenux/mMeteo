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
	//! @see lib/jquery.store.js
	//! @see mMeteo.model.js
	storage :
	{
		schema : null
		,
		data : null
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
