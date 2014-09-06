/**
	@file mJappisApplication storage class/module

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

	var LOG = new Logger('mJ.storage');

	/**
	 * Schema for the model of the app.
	 *
	 * Building i18n labels:
	 * <li> label-[objectFieldName]...-[objectFieldName]
	 * <li> label-[objectFieldName]...-[objectFieldName]-[optionName]
	 *
	 * Building field name/id:
	 * <li> [formName]-[objectFieldName]
	 *
	 * @note Value for a field is the default value. If options are defined with keys then default key may be supplied.
	 *
	 * @warning You MUST at least provide type for each leaf schema object for the form magic to work.
	 *
	 * Supported types:
	 * <li> text - simple, short text
	 * <li> password - text that should not be visible when typing (re-entering advised or show/hide characters); should be encrypted
	 * <li> url - simple, short text
	 * <li> textarea - multi-line text
	 * <li> select - one of values in options array (for labels see above) or array of {valueKey:'to be saved', internalValue:'to be used'}
	 * <li> flip - flip switch yes/no select (true/false)
	 * <li> id - non-editable item identification value, should auto-increment on insert and MUST update (usualy increment) lastId of the container object
	 * <li> codeScanner - similar to number/text but with scanner button when avialable
	 * <li> object - free type object, use if you only whish to store some data without specific structure
	 *
	 * <h2>Examples</h2>
	 *
	 * <h3>Simple object</h3>
	 * <pre>
	 * $mJ.storage.schema = {
	 * 	favoriteLocation :
	 * 	{
	 * 		name       : {type:"text", value:""}
	 * 		,latitude  : {type:"text", value:""}
	 * 		,longitude : {type:"text", value:""}
	 * 	}
	 * };
	 * </pre>
	 *
	 * <h3>Items - basic example</h3>
	 * <p>If you would like to have more items with the same fields you define `items` as an array of objects:</p>
	 * <pre>
	 * $mJ.storage.schema = {
	 * 	locations :
	 * 	{
	 * 		items :
	 * 		[
	 * 			{
	 * 				name       : {type:"text", value:""}
	 * 				,latitude  : {type:"text", value:""}
	 * 				,longitude : {type:"text", value:""}
	 * 				,isFavorite : {type:"flip", value:false}
	 * 			}
	 * 		]
	 * 	}
	 * };
	 * </pre>
	 * <p>Notice that instead of having `favoriteLocation` we now use `isFavorite` property for the object in array.</p>
	 *
	 * @note For information on adding new items see next example or {@link #getNewItem()} function.
	 *
	 * <h3>Items - extra framework elements</h3>
	 * <p>The framework will add `lastId` property to your main object (in this case `locations`) upon using `getNewItem`.
	 * It will also add `id` to each item.</p>
	 *
	 * <p>For clarity you should include those in your schema like this:</p>
	 * <pre>
	 * $mJ.storage.schema = {
	 * 	locations :
	 * 	{
	 * 		lastId  : 0
	 * 		, items :
	 * 		[
	 * 			{
	 * 				id         : {type:"id"}
	 * 				,name      : {type:"text", value:""}
	 * 				,latitude  : {type:"text", value:""}
	 * 				,longitude : {type:"text", value:""}
	 * 				,isFavorite : {type:"flip", value:false}
	 * 			}
	 * 		]
	 * 	}
	 * };
	 * </pre>
	 *
	 * <h3>Save options</h3>
	 *
	 * You can use save options to use local storage but not force saving less imporant data to server.
	 * This will also allow you to e.g. set data during login before synchronization is over.
	 * <pre>
	 * $mJ.storage.schema = {
	 * 	settings :
	 * 	{
	 *		language    : {type:"select", value:"pl", options:["pl", "en"]}
	 *		,login		: {type:"text", value:"", saveOptions:{ignoreSync: true, remoteSave	: false}}
	 * 	}
	 * };
	 * </pre>
	 *
	 * Note that this will not(!) keep the login fully private. It will only skip remote save when you call:
	 * `$mJ.storage.set('settings.login', "foobar")`
	 * This however will ignore saveOptions:
	 * `$mJ.storage.set('settings', {language:"pl", login:"foobar"})`
	 * Also explicitly calling `$mJ.storage.save` will save all data.
	 *
	 * <h3>Store service and "private" data</h3>
	 * If you whish to keep some data "private" (not saved remotly at all) you can parse data in store service.
	 * 
	 * Example of such save function for the store service:
	 * <pre>
	 * function saveFunction (storageKey, dataStore) {
	 * 	// remove "private" data
	 * 	if ('settings' in dataStore) {
	 * 		delete data.settings.login;
	 * 	}
	 *
	 * 	// store data
	 * 	$.ajax({
	 * 		url: "/storage-service",
	 * 		type: "POST",
	 * 		data : {
	 * 			application:storageKey,
	 * 			data:JSON.stringify(dataStore)
	 * 		}
	 * 	})
	 * 	.done(function(responseData){
	 * 		LOG.info('update settings done');
	 * 	})
	 * 	.fail(function(){
	 * 		LOG.warn('update settings failed');
	 * 	});
	 * };
	 * </pre>
	 */
	$mJ.storage.schema = {};

	/**
	 * data store (not to be accessed directly)
	 *
	 * @note Was $mJ.storage.data
	 */
	var dataStore = null;

	/**
	 * Store services object.
	 * 
	 * @type Object
	 */
	var storeServices = {length:0, services:{}};
	
	/**
	 * Init
	 *
	 * @throws Error When storageKey was not defined.
	 */
	$mJ.storage.init = function ()
	{
		if ($mJ.storage.storageKey == null)
		{
			throw new Error('Fatal error: storageKey not defined. Make sure it is defined before setup.');
		}
		$.storage = new $.store(); 
		var data = $.storage.get ($mJ.storage.storageKey);
		if (data)	// not null and not undefined
		{
			dataStore = data;
		}
		// if storage empty then add inital data
		else
		{
			dataStore = null;
			if ('initialData' in $mJ.storage)
			{
				dataStore = $mJ.storage.initialData;
			}
		}
	};

	/**
	 * Replace whole data set.
	 *
	 * To be used e.g. when data was loaded from an external service.
	 *
	 * @note appendStoreService SHOULD be called before this function. This will allow syncing data.
	 *
	 * @param {Object} remoteData Data object stored previously in a store service.
	 */
	$mJ.storage.replaceData = function (remoteData)
	{
		// check who has the latest data
		var remoteWins = false;
		if (typeof(remoteData) == 'object') {
			// No dates? (backward compatibility)
			if (!('__lastSave' in remoteData) && !('__lastSave' in dataStore)) {
				LOG.info('no dates');
				if (typeof(dataStore) != 'object') {
					remoteWins = true;
				}
			// only one date is set
			} else if (!('__lastSave' in remoteData) || !('__lastSave' in dataStore)) {
				LOG.info('only one date');
				if ('__lastSave' in remoteData) {
					remoteWins = true;
				}
			// both dates are set and remote is newer
			} else if (remoteData.__lastSave > dataStore.__lastSave) {
				LOG.info('both dates; remot bigger');
				remoteWins = true;
			} else {
				LOG.info('both dates; local bigger or equal');
			}
		}
		LOG.info('replaceData winner: ', (remoteWins ? 'remote' : 'local'));
		LOG.info('remoteData.__lastSave: ', remoteData.__lastSave);
		LOG.info('dataStore.__lastSave: ', dataStore.__lastSave);
		
		// all data seem to have been pushed to the server - update local
		if (remoteWins) {
			if (typeof(remoteData) == 'object') {
				$.storage.set ($mJ.storage.storageKey, remoteData);
				dataStore = remoteData;
			}
		// local data replaces remote (if anything was changed)
		} else {
			if (typeof(dataStore) == 'object') {
				$mJ.storage.save({localSave:false, ignoreSync:true});
			}
		}
	};

	/**
	 * Clears last save date used for synchronization.
	 * 
	 * This should force remote winner on next save (unless user adds new data).
	 * 
	 * Use e.g. after logout and custom clear.
	 */
	$mJ.storage.clearLocalSyncDate = function ()
	{
		LOG.info('clearing __lastSave: ', dataStore.__lastSave);
		dataStore.__lastSave = '0';
		$.storage.set ($mJ.storage.storageKey, dataStore);
	};

	/**
	 * Save all data from temp store (dataStore) to permanent store.
	 *
	 * @note To append a service that can save data externally use: $mJ.storage.appendStoreService
	 *
	 * @todo Check if data was actually saved remotly rather then assume it...
	 *
	 * @param {Object} userOptions [optional] Options object, see code for defaults.
	 */
	$mJ.storage.save = function (userOptions)
	{
		var options = {
			ignoreSync	: false,// will save in either local or external storage but won't modify last change marker
			localSave	: true,	// save in localStorage
			remoteSave	: true	// save in external service (if defined)
		};
		options = $.extend(options, userOptions);

		if (!options.ignoreSync) {
			// set last save date (that way we can also say if it was stored to local storage)
			dataStore.__lastSave = new Date();
			LOG.info('__lastSave: ', dataStore.__lastSave);
			LOG.info('options: ', options);
		}
		
		// local save
		if (options.localSave) {
			$.storage.set ($mJ.storage.storageKey, dataStore);
		}

		// remote save
		if (options.remoteSave && storeServices.length > 0) {
			for (var serviceName in storeServices.services) {
				var service = storeServices.services[serviceName];
				if (typeof(service['saveFunction']) == 'function') {	// just in case...
					service.saveFunction.call(service.contextObject, $mJ.storage.storageKey, dataStore);
				}
			}
		}
	};

	/**
	 * Append a service that can save data externally.
	 *
	 * @note At the moment you need to load data manully (e.g. when user is logged in) and use replaceData function.
	 *
	 * @param {String} serviceName A service name just for the sake of not adding the service twice (and to remove it).
	 * @param {Function} saveFunction Function that MUST accept two parameters:
	 *		function({String} storageKey, {Object} dataStore)
	 * @param {Object} context Context to object in which the function shopuld be called (defaults to mJappis application object).
	 */
	$mJ.storage.appendStoreService = function (serviceName, saveFunction, contextObject)
	{
		if (!(serviceName in storeServices.services)) {
			storeServices.length++;
		}
		storeServices.services[serviceName] = {saveFunction:saveFunction};
		storeServices.services[serviceName].contextObject = (contextObject ? contextObject : $mJ);
	};
	
	/**
	 * Remove (disable) store service.
	 * 
	 * @param {String} serviceName A service name to be removed.
	 */
	$mJ.storage.removeStoreService = function (serviceName)
	{
		if (!(serviceName in storeServices.services)) {
			return;
		}
		storeServices[serviceName] = null;	// just in case delete won't work
		delete storeServices[serviceName];
		storeServices.length--;
	};

	/**
	 * Clear all storage contents
	 *
	 * Remove all data from permanent store
	 *
	 * @note That this will fallback to initialData if it was defined
	 */
	$mJ.storage.clear = function ()
	{
		dataStore = null;
		if ('initialData' in $mJ.storage)
		{
			dataStore = $mJ.storage.initialData;
		}
		$.storage.flush();
	};

	/**
	 * Copy properties of one object to another
	 *
	 * Also works for arrays.
	 *
	 * @param {object|array} source Source object
	 * @param {object|array} destination Destination object
 	 *
	 * @warning Removes destination keys that doesn't exist in source.
	 */
	var _propertiesXorCopy = function(source, destination)
	{
		// for arrays - start a new
		if ($.isArray(source))
		{
			destination.length = 0;
		}
		// for objects remove nonexistent keys
		else
		{
			for (var key in destination)
			{
				if (destination.hasOwnProperty(key) && !source.hasOwnProperty(key))
				{
					destination[key] = undefined;
				}
			}
		}
		
		// copy existent keys from source (this should also works for array elements)
		for (var key in source)
		{
			if (source.hasOwnProperty(key))
			{
				// objects need to be cloned (or changes in the destination would change the source)
				if (typeof(source[key]) == 'object')
				{
					destination[key] = $mJ.deepClone(source[key]);
				}
				// don't clone strings, numbers and such...
				else
				{
					destination[key] = source[key];
				}
			}
		}
	};

	/**
	 * Get object by path.
	 *
	 * @param {object} baseObject
	 *		Base object (source)
	 * @param {String} objectPath
	 *		Either direct key as in $mJ.storage.schema
	 *		or key.subkey.subkey...
	 *
	 * @returns {object|null} null (if not found) or the object
	 */
	var _getObjectByPath = function (baseObject, objectPath)
	{
		var data = null;
		
		if (baseObject==null || typeof(baseObject)!='object')
		{
			return null;
		}
		
		// simple get
		if (objectPath.indexOf('.')==-1)
		{
			if (typeof(baseObject[objectPath]) != 'undefined')
			{
				data = baseObject[objectPath];
			}
		}
		// deeper get
		else
		{
			var path = objectPath.split('.');
			data = baseObject[path[0]];
			if (typeof(data) == 'undefined')
			{
				return null;
			}
			for (var i = 1; i < path.length; i++)
			{
				if (typeof(data[path[i]]) == 'undefined')
				{
					break;
				}
				data = data[path[i]];
			}
		}
		
		return data;
	};

	/**
	 * Get parent object by path.
	 *
	 * @param {object} baseObject
	 *		Base object (source)
	 * @param {String} objectPath
	 *		Either direct key as in $mJ.storage.schema
	 *		or key.subkey.subkey...
	 *
	 * @returns {object|null} null (if not found) or the object
	 */
	var _getParentObjectByPath = function (baseObject, objectPath, isArray)
	{
		// no parent?
		if (objectPath.indexOf('.')==-1)
		{
			return null;
		}
		
		// parent path
		var parentPath = objectPath.replace(/(.+)\..+/, '$1');

		var parentData = _getObjectByPath (baseObject, parentPath);
		// no items stored yet?
		if (isArray && parentData == null)
		{
			parentData = {lastId : 0, items : []};
			$mJ.storage.set(parentPath, parentData);
			// need to re-read this from dataStore
			parentData = _getParentObjectByPath(dataStore, objectPath);
		}

		// get & return
		return parentData;
	};

	/**
	 * Create empty object by path.
	 *
	 * @param {object} baseObject
	 *		Base object (destination); CANNOT be null, MUST be an already existing object
	 * @param {String} objectPath
	 *		Either direct key as in $mJ.storage.schema
	 *		or key.subkey.subkey...
	 *
	 * @example
	 *		For baseObject = {}, objectPath = 'test.something'
	 *		Running _createObjectByPath(.) will change baseObject to: {test:{something:{}}}
	 * @example
	 *		For baseObject = {test:{blah:[1,2,3], more:{levels:1}}}, objectPath = 'test.something'
	 *		Running _createObjectByPath(.) will change baseObject to: {test:{blah:[1,2,3], more:{levels:1}, something:{}}}
	 *
	 * @returns {object|undefined} Last created object (or undefined upon error)
	 */
	var _createObjectByPath = function (baseObject, objectPath)
	{
		if (baseObject==null || typeof(baseObject)!='object')
		{
			return undefined;
		}
		
		var data;
		
		// simple create
		if (objectPath.indexOf('.')==-1)
		{
			if (typeof(baseObject[objectPath]) == 'undefined')
			{
				baseObject[objectPath] = new Object();
			}
			data = baseObject[objectPath];
		}
		// deeper create
		else
		{
			var path = objectPath.split('.');
			data = baseObject;
			for (var i = 0; i < path.length; i++)
			{
				if (typeof(data[path[i]]) == 'undefined')
				{
					data[path[i]] = new Object();
				}
				data = data[path[i]];
			}
		}
		
		return data;
	};

	/**
	 * Get schema part for given path.
	 *
	 * @param {String} objectPath
	 *		Either direct key in $mJ.storage.schema
	 *		or key.subkey.subkey...
	 *
	 * @returns {object|null} schema part or null when not found.
	 */
	$mJ.storage.getSchema = function (objectPath)
	{
		var schemaPart = _getObjectByPath($mJ.storage.schema, objectPath);
		if (schemaPart == null)
		{
			return null;
		}
		if (typeof(schemaPart) == 'object')	// includes arrays
		{
			schemaPart = $mJ.deepClone (schemaPart);
		}

		return schemaPart;
	};

	/**
	 * Get data (either stored or default).
	 * 
	 * @param {String} objectPath
	 *		Either direct key in $mJ.storage.schema
	 *		or key.subkey.subkey...
	 *
	 * @returns {object}
	 */
	$mJ.storage.get = function (objectPath)
	{
		// get stored data
		var data = _getObjectByPath(dataStore, objectPath);
		if (data != null && typeof(data) == 'object')
		{
			data = $mJ.deepClone (data);
		}
		
		// get schema part for the data
		var schemaPart = _getObjectByPath($mJ.storage.schema, objectPath);
		if (schemaPart == null)
		{
			return data;	//! @todo or should we return null? Updates?
		}
		if (typeof(schemaPart) == 'object')	// includes arrays
		{
			schemaPart = $mJ.deepClone (schemaPart);
		}
		
		// return data if we found it
		if (  data != null && (
				typeof(data) != 'object' || ('type' in schemaPart && schemaPart.type == 'object')
		)  )
		{
			// force flip into boolean
			if (schemaPart.type == 'flip' && typeof(data) == 'string')
			{
				data = (data == 'true');
			}
			return data;	//! @todo or should we validate this anyway e.g. for type:"select"?
		}
		
		// items array - by default empty
		if ($.isArray(schemaPart))
		{
			if (data == null)
			{
				data = [];
			}
			return data;
		}
		// leaf object - return default
		else if (schemaPart.type)
		{
			return schemaPart.value;
		}
		// normal object - copy defaults to data
		else
		{
			if (data == null)
			{
				data = new Object();
			}
			_copyDefaults (schemaPart, data);
			return data;
		}
	};

	/**
	 * Get internal value of the data.
	 *
	 * @note If param is empty then assuming it is objectPath.
	 *
	 * @param {String} valueKey [optional]
	 *		Value that is a key in options of the schema.
	 * @param {String} objectPath
	 *		Either direct key in $mJ.storage.schema
	 *		or key.subkey.subkey...
	 *
	 * @returns {object}
	 */
	$mJ.storage.getInternal = function (valueKey, objectPath)
	{
		// valueKey is objectPath
		if (typeof(objectPath) != 'string') {
			objectPath = valueKey;
			valueKey = this.get(objectPath);
		}

		// get schema part for the data
		var schemaPart = _getObjectByPath($mJ.storage.schema, objectPath);
		if (schemaPart != null && 'options' in schemaPart)
		{
			for (var i = 0; i < schemaPart.options.length; i++) {
				var option = schemaPart.options[i];
				if ('valueKey' in option && option.valueKey == valueKey) {
					return option.internalValue;
				}
			}
		}
		return valueKey;	//! @todo or should we return null? Updates?
	};

	/**
	 * Get new item (defaults).
	 *
	 * @param {String} objectPath
	 *		Either direct key in $mJ.storage.schema
	 *		or key.subkey.subkey...
	 *
	 * @note
	 *		The path MUST point to an array of items.
	 *		The parent SHOULD also contain lastId element.
	 *		The lastId is set in data stored on the user side.
	 *
	 * @returns {object|null} object item with defaults set or null on error (e.g. path not found in schema)
	 */
	$mJ.storage.getNewItem = function (objectPath)
	{
		// get schema part for the data
		var schemaPart = _getObjectByPath($mJ.storage.schema, objectPath);
		if (schemaPart == null || !$.isArray(schemaPart) || schemaPart.length < 1)
		{
			return null;
		}
		schemaPart = $mJ.deepClone (schemaPart);

		// get stored, parent data
		var parentData = _getParentObjectByPath(dataStore, objectPath, true);
		
		// data null or not an object - should not happen
		if (!(parentData != null && typeof(parentData) == 'object'))
		{
			return null;
		}
		
		// increment ID
		if (!('lastId' in parentData))
		{
			parentData.lastId = 0;
		}
		parentData.lastId++;
		
		//! @todo should we save changes now?
		
		// setup new item object
		var newItem = new Object();
		_copyDefaults (schemaPart[0], newItem);
		newItem.id = parentData.lastId;
		
		return newItem;
	};

	/**
	 * Set (and save) data.
	 *
	 * @note At least for now it is assumed that object under `objectPath` is the last pre-leaf object.
	 *
	 * @param {String} objectPath
	 *		Either direct key in $mJ.storage.schema
	 *		or key.subkey.subkey...
	 * @param {mixed} data
	 * @param {Object} userOptions [optional] Options object, see code for defaults.
	 *
	 * @todo validate and return some info?
	 */
	$mJ.storage.set = function (objectPath, data, userOptions)
	{
		var options = {
			//sessionOnly	: false,// will not save even to local storage (data is kept in an object that will perish on refresh)
			ignoreSync	: false,// will save in either local or external storage but won't modify last change marker
			localSave	: true,	// save in localStorage
			remoteSave	: true	// save in external service (if defined)
		};
		options = $.extend(options, userOptions);

		// get save options from model
		var schemaPart = _getObjectByPath($mJ.storage.schema, objectPath);
		if (schemaPart != null && 'saveOptions' in schemaPart) {
			options = $.extend(options, schemaPart.saveOptions);
		}


		// create data keys/objects if needed
		if (dataStore == null || typeof(dataStore) != 'object')
		{
			dataStore = new Object();
		}
		var dataPart = _createObjectByPath (dataStore, objectPath);
		
		// copy and save
		if (typeof(data) == 'object')
		{
			_propertiesXorCopy (data, dataPart);	//! @todo or should we validate data e.g. for interals type:"select"?
		}
		// this is for saving to leafs (which are not objects)
		else
		{
			var parent = _getParentObjectByPath (dataStore, objectPath);
			var childName = objectPath.replace(/.+\.(.+)/, '$1');
			parent[childName] = data;
		}

		$mJ.storage.save (options);
	};
	
	/**
	 * Copy defaults of one object to another.
	 *
	 * @param {object} source Source object.
	 * @param {object} destination Destination object; CANNOT be null, MUST be an existing object.
	 *
	 * @note Assumes keys starting from '_' in src to be private (not to be copied to dest).
	 */
	var _copyDefaults = function(source, destination)
	{
		for (var key in source)
		{
			if (source.hasOwnProperty(key) && key.indexOf('_')!=0 )
			{
				// no value
				if (typeof(destination[key]) == 'undefined')
				{
					destination[key] = new Object();
				}
				// got value
				else if (typeof(destination[key]) != 'object')
				{
					continue;	//! @todo or should we validate this anyway e.g. for type:"select"?
				}
				// copy value simple
				if (!source[key]._isObject)
				{
					destination[key] = source[key].value;
				}
				// deep copy
				else
				{
					_copyDefaults(source[key], destination[key]);
				}
			}
		}
	};
	
})(jQuery, window.mJappisApplication);