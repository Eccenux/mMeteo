/**
	@file mJqmApplication storage class/module

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
		
		Building i18n labels:
		\li label-[objectFieldName]...-[objectFieldName]
		\li label-[objectFieldName]...-[objectFieldName]-[optionName]
		
		Building field name/id:
		\li [formName]-[objectFieldName]
		
		@note value for a field is the default value
		
		@warning you MUST at least provide type for each leaf schema object
		
		Types:
		\li text - simple, short text
		\li password - text that should not be visible when typing (re-entering advised or show/hide characters); should be encrypted
		\li url - simple, short text
		\li textarea - multi-line text
		\li select - one of values in options array (for labels see above)
		\li flip - flip switch yes/no select (true/false)
		\li id - non-editable item identification value, should auto-increment on insert and MUST update (usualy increment) lastId of the container object
		
	*/
	_self.storage.schema = {};

	/**
		data store (not to be accessed directly)
		
		@note Was _self.storage.data
	*/
	var dataStore = null;
	
	/**
		Init
	*/
	_self.storage.init = function ()
	{
		$.storage = new $.store(); 
		var data = $.storage.get (_self.storage.storageKey);
		if (data)	// not null and not undefined
		{
			dataStore = data;
		}
		// if storage empty then add inital data
		else
		{
			dataStore = null;
			if ('initialData' in _self.storage)
			{
				dataStore = _self.storage.initialData;
			}
		}
	};
	/**
		Save all data from temp store (dataStore) to permanent store
	*/
	_self.storage.save = function ()
	{
		$.storage.set (_self.storage.storageKey, dataStore);
	};
	/**
		Clear all storage contents
		
		Remove all data from permanent store
		
		@note That this will fallback to initialData if it was defined
	*/
	_self.storage.clear = function ()
	{
		dataStore = null;
		if ('initialData' in _self.storage)
		{
			dataStore = _self.storage.initialData;
		}
		$.storage.flush();
	};

	/**
		Copy properties of one object to another
		
		Also works for arrays.
		
		@param source Source object
		@param destination Destination object

		@warning Removes destination keys that doesn't exist in source.
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
					destination[key] = _self.deepClone(source[key]);
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
		Get object by path
		
		@param baseObject
			Base object (source)
		@param objectPath
			Either direct key as in _self.storage.schema
			or key.subkey.subkey...
			
		@return null (if not found) or the object
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
		Get parent object by path
		
		@param baseObject
			Base object (source)
		@param objectPath
			Either direct key as in _self.storage.schema
			or key.subkey.subkey...
			
		@return null (if not found) or the object
	*/
	var _getParentObjectByPath = function (baseObject, objectPath)
	{
		// no parent?
		if (objectPath.indexOf('.')==-1)
		{
			return null;
		}
		
		// parent path
		objectPath = objectPath.replace(/(.+)\..+/, '$1');
		
		// get & return
		return _getObjectByPath (baseObject, objectPath);
	};

	/**
		Create empty object by path
		
		@param baseObject
			Base object (destination); CANNOT be null, MUST be an already existing object
		@param objectPath
			Either direct key as in _self.storage.schema
			or key.subkey.subkey...
		
		@example
			For baseObject = {}, objectPath = 'test.something'
			Running _createObjectByPath(.) will change baseObject to: {test:{something:{}}}
		@example
			For baseObject = {test:{blah:[1,2,3], more:{levels:1}}}, objectPath = 'test.something'
			Running _createObjectByPath(.) will change baseObject to: {test:{blah:[1,2,3], more:{levels:1}, something:{}}}
			
		@return Last created object (or undefined upon error)
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
		Get schema part for given path
		
		@param objectPath
			Either direct key in _self.storage.schema
			or key.subkey.subkey...
		
		@return schema part or null when not found
	*/
	_self.storage.getSchema = function (objectPath)
	{
		var schemaPart = _getObjectByPath(_self.storage.schema, objectPath);
		if (schemaPart == null)
		{
			return null;
		}
		if (typeof(schemaPart) == 'object')	// includes arrays
		{
			schemaPart = _self.deepClone (schemaPart);
		}
		
		return schemaPart;
	};

	/**
		Get data (either stored or default)
		
		@param objectPath
			Either direct key in _self.storage.schema
			or key.subkey.subkey...
	*/
	_self.storage.get = function (objectPath)
	{
		// get stored data
		var data = _getObjectByPath(dataStore, objectPath);
		if (data != null && typeof(data) == 'object')
		{
			data = _self.deepClone (data);
		}
		
		// get schema part for the data
		var schemaPart = _getObjectByPath(_self.storage.schema, objectPath);
		if (schemaPart == null)
		{
			return data;	//! @todo or should we return null? Updates?
		}
		if (typeof(schemaPart) == 'object')	// includes arrays
		{
			schemaPart = _self.deepClone (schemaPart);
		}
		
		// return data if we found it
		if (data != null && typeof(data) != 'object')	// assuming we already got data
		{
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
		Get new item (defaults)
		
		@param objectPath
			Either direct key in _self.storage.schema
			or key.subkey.subkey...
		
		@note
			The path MUST point to an array of items.
			The parent SHOULD also contain lastId element.
			The lastId is set in data stored on the user side.
			
		@return object item with defaults set or null on error (e.g. path not found in schema)
	*/
	_self.storage.getNewItem = function (objectPath)
	{
		// get schema part for the data
		var schemaPart = _getObjectByPath(_self.storage.schema, objectPath);
		if (schemaPart == null || !$.isArray(schemaPart) || schemaPart.length < 1)
		{
			return null;
		}
		schemaPart = _self.deepClone (schemaPart);

		// get stored, parent data
		var parentData = _getParentObjectByPath(dataStore, objectPath);
		
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
		Set data
		
		@note For now assume objectPath is the last pre-leaf
		
		@param objectPath
			Either direct key in _self.storage.schema
			or key.subkey.subkey...
			
		@todo validate and return some info?
	*/
	_self.storage.set = function (objectPath, data)
	{
		// create data keys/objects if needed
		if (dataStore == null || typeof(dataStore) != 'object')
		{
			dataStore = new Object();
		}
		var dataPart = _createObjectByPath (dataStore, objectPath);
		
		// copy and save
		_propertiesXorCopy (data, dataPart);	//! @todo or should we validate data e.g. for interals type:"select"?
		_self.storage.save ();
	};
	
	/**
		Copy defaults of one object to another
		
		@param source Source object
		@param destination Destination object; CANNOT be null, MUST be an existing object

		@note Assumes keys starting from '_' in src to be private (not to be copied to dest)
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
	
})(jQuery, window.mJqmApplication);