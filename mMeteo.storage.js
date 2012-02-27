/**
	@file mMeteo storage class/module

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
			dataStore = _self.storage.initialData;
		}
	}
	/**
		Save all data from temp store (storage.data) to permanent store
	*/
	_self.storage.save = function ()
	{
		$.storage.set (_self.storage.storageKey, dataStore);
	}
	/**
		Remove all data from permanent store
	*/
	_self.storage.remove = function ()
	{
		$.storage.flush();
	}

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
	}

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
			return;
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
			var data = baseObject;
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
	}

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
		if (typeof(schemaPart) == 'object')
		{
			schemaPart = _self.deepClone (schemaPart);
		}
		
		// return data if we found it
		if (data != null && typeof(data) != 'object')	// assuming we already got data
		{
			return data;	//! @todo or should we validate this anyway e.g. for type:"select"?
		}
		
		// we got a leaf (and assuming not to have data) - return default
		if (!schemaPart._isObject)
		{
			return schemaPart.value;
		}
		
		// go through schema part and add defaults to data
		//schemaPart._isObject = true;
		if (data == null)
		{
			data = new Object();
		}
		_copyDefaults (schemaPart, data);
		
		// go it - return it
		return data;
	}

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
		var dataPart = _createObjectByPath (dataStore, objectPath)
		
		// copy and save
		_self.propertiesCopy (data, dataPart);	//! @todo or should we validate data e.g. for interals type:"select"?
		_self.storage.save ();
	}
	
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
	}
	
	/**
		Schema
		
		Building i18n labels:
		\li label-[objectFieldName]...-[objectFieldName]
		\li label-[objectFieldName]...-[objectFieldName]-[optionName]
		
		Building field name/id:
		\li [formName]-[objectFieldName]
		
		@note value for a field is the default value
		
		@warning you MUST add `_isObject : true` for each non-leaf get-able schema object
		
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
	
})(jQuery, window.mMeteo);