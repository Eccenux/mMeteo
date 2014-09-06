/**
	@file mJappisApplication base file

    Copyright:  ©2012 Maciej "Nux" Jaros
	  License:  CC-BY-SA
	            http://creativecommons.org/licenses/by-sa/3.0/
*/

/**
 * Main, global object
 * 
 * @type mJappisApplication
 */
window.$mJ = window.mJappisApplication =
{
	//! storage schema, data and basic data manipulation object/class
	//! @see lib/jquery.store.js Core storage class (used in storage functions)
	//! @see mJappisApplication.storage.js Storage class for high level data manipulation
	//! @see app/model.js Model for this application (includes storageKey definition!)
	storage :
	{
		schema : null
		,
		initialData : null
		,
		storageKey : null
	}
	,
	//! i18n object
	//! @see lib/I18n.js For the core I18n library that will replace this object.
	//! @see app/i18n/ For internationalization strings of this application.
	i18n : {}
	,
	//! controllers for various pages
	//! defined in app/controllers/
	controller : null
};
