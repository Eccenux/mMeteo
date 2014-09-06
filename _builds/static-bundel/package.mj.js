
// mJappisApplication.base.js, line#0

// EOC
// EOC
window.$mJ = window.mJappisApplication =
{




	storage :
	{
		schema : null
		,
		initialData : null
		,
		storageKey : null
	}
	,



	i18n : {}
	,


	controller : null
};

// mJappisApplication.base.js, EOF
// mJappisApplication.utils.js, line#0

// EOC
// EOC
(function($, $mJ)
{
// EOC
	$.extend($.fn, {
		mjLoader: function(userOptions) {
			var options = $.extend({
				size : '35px'
			}, userOptions);
			this.html('<img src="css/images/loader-black.svg" width="' + options.size + '" height="' + options.size + '" />');
		}
	});
// EOC
	$mJ.pLOG = new Logger('perf');
// EOC
	$mJ.parseParameters = function(parameters, types) {

		for (var key in types) {
			if (!(key in parameters)) {
				parameters[key] = null;
			}
			else {
				switch (types[key]) {
					case 'int':
						try {
							parameters[key] = parseInt(parameters[key], 10);
						} catch (e) {}
					break;
					case 'str':
					case 'string':
						parameters[key] = decodeURIComponent(parameters[key].toString());
					break;
					default:
						parameters[key] = parameters[key].toString();
					break;
				}
			}
		}
		return parameters;
	};
// EOC
	$mJ.getItemById = function(id, items, userOptions)
	{
		var options = $.extend({
			idField	: 'id',
			compareFunction : function (field, id) {
				return field === id;
			}
		}, userOptions);

		var item = null;
		for (var i = 0; i < items.length; i++)
		{
			if (options.compareFunction(items[i][options.idField], id))
			{
				item = items[i];
				break;
			}
		}

		return item;
	};
// EOC
	$mJ.delItemById = function(id, items)
	{
		for (var i = 0; i < items.length; i++)
		{
			if (items[i].id === id)
			{
				items.splice(i, 1);
				break;
			}
		}
	};
// EOC
	$mJ.makeList = function(pageSelector, containerSelector, listObject, options)
	{
		var $listContainer = $(containerSelector);


		var list = $mJ.buildList(listObject, options);


		$listContainer
			.empty()
			.html(list)
			.trigger('create')
		;

		try {

			$('ul', $listContainer).listview('refresh');
		} catch (e) {


			document.title += ' [list error!]';
		}
// EOC
		$('a', $listContainer)
			.unbind()
			.click(function(event)
			{
// EOC
				var pageSelector = this.hash.replace(/\?.+/, '');
				$(pageSelector).jqmData( "url", this.href);
			})
		;
		/**/

		if (typeof(options) == 'object' && 'showItemExtraActionFunction' in options) {
			var items = typeof(listObject)=='string' ? $mJ.storage.get(listObject + '.items') : listObject;
			$('a[data-show-index]', $listContainer)
				.click(function()
				{
					var index = this.getAttribute('data-show-index');
					options.showItemExtraActionFunction(items[index]);
				})
			;
		}
	};
// EOC
	$mJ.buildList = function(listObject, userOptions)
	{

		var options = $.extend(
			{

				'listTextFunction' : function (item) {
					return item.name;
				},
				'showItemUrlFunction' : function (item) {
					return '#page-show?id='+ item.id;
				},
				'actionItemUrlFunction' : function (item) {
					return '#page-remove?id='+ item.id;
				},

				'actionItemIgnoreFunction' : function (item) {
					return false;
				},
				'addActionButton'	: false,
				'addFilter'			: true,
				'actionIcon'		: 'delete',
				'actionTheme'		: 'd',
				'maxItems'			: Infinity
			}
		, userOptions);
		options.maxItems = parseInt(options.maxItems);
		if (isNaN(options.maxItems)) {
			options.maxItems = Infinity;
		}


		var listAttributes = "data-role='listview' data-inset='true'";
		if (options.addFilter) {
			listAttributes += " data-filter='true'";
		}
		if (options.addActionButton)
		{
			listAttributes += ' data-split-icon="'+options.actionIcon+'" data-split-theme="'+options.actionTheme+'"';
		}
		var html = '<ul '+listAttributes+'>';


		var items = typeof(listObject)=='string' ? $mJ.storage.get(listObject + '.items') : listObject;
		var displayLength = items.length;
		if ('maxItems' in options && displayLength > options.maxItems) {
			displayLength = parseInt(options.maxItems);
		}
		for (var i = 0; i < displayLength; i++)
		{
			html += '<li>';
			html += '<a data-show-index="'+i+'" href="'+ options.showItemUrlFunction(items[i]) +'">'+ options.listTextFunction(items[i]) +'</a>';
			if (options.addActionButton && !options.actionItemIgnoreFunction(items[i]))
			{
				html += '<a href="'+ options.actionItemUrlFunction(items[i]) +'">'+ $mJ.i18n.get("delete - title") +'</a>';
			}
			html += '</li>';
		}
		html += '</ul>';

		if (items.length < 1)
		{
			html = $mJ.i18n.get("the list is empty");
		}

		return html;
	};
// EOC
	$mJ.activateInternalBackButtons = function()
	{
		//

		$('a[data-rel|="back-internal-html"]')
			.unbind()
			.click(function(event)
			{

				if (typeof(navigator) != 'undefined' && typeof(navigator.app) != 'undefined' && typeof(navigator.app.backHistory) == 'function')
				{
					navigator.app.backHistory();
				}

				else
				{
					history.go(-1);
				}
				event.preventDefault();
				return false;
			})
		;
	};
// EOC
	$mJ.deepClone = function(source)
	{
		if ($.isArray(source))
		{
			return $.extend(true, [], source);
		}
		else
		{
			return $.extend(true, {}, source);
		}
	};
// EOC
	$mJ.bindInput = function(selector, storagePath)
	{

		var bindIndicator = 'data-jqm-bind-' + storagePath;
		if ($(selector).attr(bindIndicator) != 'true')
		{
			$(selector).attr(bindIndicator, 'true');

			$(selector).change(function()
			{
				$mJ.storage.set(storagePath, $(this).val());
			});
		}


		$(selector).val($mJ.storage.get(storagePath));
	};

})(jQuery, window.mJappisApplication);
// mJappisApplication.utils.js, EOF
// mJappisApplication.storage.js, line#0

// EOC
// EOC
(function($, $mJ)
{
	$mJ.storage = $mJ.storage || {};

	var LOG = new Logger('mJ.storage');
// EOC
	$mJ.storage.schema = {};
// EOC
	var dataStore = null;
// EOC
	var storeServices = {length:0, services:{}};
// EOC
	$mJ.storage.init = function ()
	{
		if ($mJ.storage.storageKey == null)
		{
			throw new Error('Fatal error: storageKey not defined. Make sure it is defined before setup.');
		}
		$.storage = new $.store();
		var data = $.storage.get ($mJ.storage.storageKey);
		if (data)
		{
			dataStore = data;
		}

		else
		{
			dataStore = null;
			if ('initialData' in $mJ.storage)
			{
				dataStore = $mJ.storage.initialData;
			}
		}
	};
// EOC
	$mJ.storage.replaceData = function (remoteData)
	{

		var remoteWins = false;
		if (typeof(remoteData) == 'object') {

			if (!('__lastSave' in remoteData) && !('__lastSave' in dataStore)) {
				LOG.info('no dates');
				if (typeof(dataStore) != 'object') {
					remoteWins = true;
				}

			} else if (!('__lastSave' in remoteData) || !('__lastSave' in dataStore)) {
				LOG.info('only one date');
				if ('__lastSave' in remoteData) {
					remoteWins = true;
				}

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


		if (remoteWins) {
			if (typeof(remoteData) == 'object') {
				$.storage.set ($mJ.storage.storageKey, remoteData);
				dataStore = remoteData;
			}

		} else {
			if (typeof(dataStore) == 'object') {
				$mJ.storage.save({localSave:false, ignoreSync:true});
			}
		}
	};
// EOC
	$mJ.storage.clearLocalSyncDate = function ()
	{
		LOG.info('clearing __lastSave: ', dataStore.__lastSave);
		dataStore.__lastSave = '0';
		$.storage.set ($mJ.storage.storageKey, dataStore);
	};
// EOC
	$mJ.storage.save = function (userOptions)
	{
		var options = {
			ignoreSync	: false,// will save in either local or external storage but won't modify last change marker
			localSave	: true,
			remoteSave	: true
		};
		options = $.extend(options, userOptions);

		if (!options.ignoreSync) {

			dataStore.__lastSave = new Date();
			LOG.info('__lastSave: ', dataStore.__lastSave);
			LOG.info('options: ', options);
		}


		if (options.localSave) {
			$.storage.set ($mJ.storage.storageKey, dataStore);
		}


		if (options.remoteSave && storeServices.length > 0) {
			for (var serviceName in storeServices.services) {
				var service = storeServices.services[serviceName];
				if (typeof(service['saveFunction']) == 'function') {
					service.saveFunction.call(service.contextObject, $mJ.storage.storageKey, dataStore);
				}
			}
		}
	};
// EOC
	$mJ.storage.appendStoreService = function (serviceName, saveFunction, contextObject)
	{
		if (!(serviceName in storeServices.services)) {
			storeServices.length++;
		}
		storeServices.services[serviceName] = {saveFunction:saveFunction};
		storeServices.services[serviceName].contextObject = (contextObject ? contextObject : $mJ);
	};
// EOC
	$mJ.storage.removeStoreService = function (serviceName)
	{
		if (!(serviceName in storeServices.services)) {
			return;
		}
		storeServices[serviceName] = null;	// just in case delete won't work
		delete storeServices[serviceName];
		storeServices.length--;
	};
// EOC
	$mJ.storage.clear = function ()
	{
		dataStore = null;
		if ('initialData' in $mJ.storage)
		{
			dataStore = $mJ.storage.initialData;
		}
		$.storage.flush();
	};
// EOC
	var _propertiesXorCopy = function(source, destination)
	{

		if ($.isArray(source))
		{
			destination.length = 0;
		}

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


		for (var key in source)
		{
			if (source.hasOwnProperty(key))
			{

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
// EOC
	var _getObjectByPath = function (baseObject, objectPath)
	{
		var data = null;

		if (baseObject==null || typeof(baseObject)!='object')
		{
			return null;
		}


		if (objectPath.indexOf('.')==-1)
		{
			if (typeof(baseObject[objectPath]) != 'undefined')
			{
				data = baseObject[objectPath];
			}
		}

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
// EOC
	var _getParentObjectByPath = function (baseObject, objectPath, isArray)
	{

		if (objectPath.indexOf('.')==-1)
		{
			return null;
		}


		var parentPath = objectPath.replace(/(.+)\..+/, '$1');

		var parentData = _getObjectByPath (baseObject, parentPath);

		if (isArray && parentData == null)
		{
			parentData = {lastId : 0, items : []};
			$mJ.storage.set(parentPath, parentData);

			parentData = _getParentObjectByPath(dataStore, objectPath);
		}


		return parentData;
	};
// EOC
	var _createObjectByPath = function (baseObject, objectPath)
	{
		if (baseObject==null || typeof(baseObject)!='object')
		{
			return undefined;
		}

		var data;


		if (objectPath.indexOf('.')==-1)
		{
			if (typeof(baseObject[objectPath]) == 'undefined')
			{
				baseObject[objectPath] = new Object();
			}
			data = baseObject[objectPath];
		}

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
// EOC
	$mJ.storage.getSchema = function (objectPath)
	{
		var schemaPart = _getObjectByPath($mJ.storage.schema, objectPath);
		if (schemaPart == null)
		{
			return null;
		}
		if (typeof(schemaPart) == 'object')
		{
			schemaPart = $mJ.deepClone (schemaPart);
		}

		return schemaPart;
	};
// EOC
	$mJ.storage.get = function (objectPath)
	{

		var data = _getObjectByPath(dataStore, objectPath);
		if (data != null && typeof(data) == 'object')
		{
			data = $mJ.deepClone (data);
		}


		var schemaPart = _getObjectByPath($mJ.storage.schema, objectPath);
		if (schemaPart == null)
		{
			return data;
		}
		if (typeof(schemaPart) == 'object')
		{
			schemaPart = $mJ.deepClone (schemaPart);
		}


		if (  data != null && (
				typeof(data) != 'object' || ('type' in schemaPart && schemaPart.type == 'object')
		)  )
		{

			if (schemaPart.type == 'flip' && typeof(data) == 'string')
			{
				data = (data == 'true');
			}
			return data;	//! @todo or should we validate this anyway e.g. for type:"select"?
		}


		if ($.isArray(schemaPart))
		{
			if (data == null)
			{
				data = [];
			}
			return data;
		}

		else if (schemaPart.type)
		{
			return schemaPart.value;
		}

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
// EOC
	$mJ.storage.getInternal = function (valueKey, objectPath)
	{

		if (typeof(objectPath) != 'string') {
			objectPath = valueKey;
			valueKey = this.get(objectPath);
		}


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
		return valueKey;
	};
// EOC
	$mJ.storage.getNewItem = function (objectPath)
	{

		var schemaPart = _getObjectByPath($mJ.storage.schema, objectPath);
		if (schemaPart == null || !$.isArray(schemaPart) || schemaPart.length < 1)
		{
			return null;
		}
		schemaPart = $mJ.deepClone (schemaPart);


		var parentData = _getParentObjectByPath(dataStore, objectPath, true);


		if (!(parentData != null && typeof(parentData) == 'object'))
		{
			return null;
		}


		if (!('lastId' in parentData))
		{
			parentData.lastId = 0;
		}
		parentData.lastId++;




		var newItem = new Object();
		_copyDefaults (schemaPart[0], newItem);
		newItem.id = parentData.lastId;

		return newItem;
	};
// EOC
	$mJ.storage.set = function (objectPath, data, userOptions)
	{
		var options = {

			ignoreSync	: false,// will save in either local or external storage but won't modify last change marker
			localSave	: true,
			remoteSave	: true
		};
		options = $.extend(options, userOptions);


		var schemaPart = _getObjectByPath($mJ.storage.schema, objectPath);
		if (schemaPart != null && 'saveOptions' in schemaPart) {
			options = $.extend(options, schemaPart.saveOptions);
		}



		if (dataStore == null || typeof(dataStore) != 'object')
		{
			dataStore = new Object();
		}
		var dataPart = _createObjectByPath (dataStore, objectPath);


		if (typeof(data) == 'object')
		{
			_propertiesXorCopy (data, dataPart);	//! @todo or should we validate data e.g. for interals type:"select"?
		}

		else
		{
			var parent = _getParentObjectByPath (dataStore, objectPath);
			var childName = objectPath.replace(/.+\.(.+)/, '$1');
			parent[childName] = data;
		}

		$mJ.storage.save (options);
	};
// EOC
	var _copyDefaults = function(source, destination)
	{
		for (var key in source)
		{
			if (source.hasOwnProperty(key) && key.indexOf('_')!=0 )
			{

				if (typeof(destination[key]) == 'undefined')
				{
					destination[key] = new Object();
				}

				else if (typeof(destination[key]) != 'object')
				{
					continue;	//! @todo or should we validate this anyway e.g. for type:"select"?
				}

				if (!source[key]._isObject)
				{
					destination[key] = source[key].value;
				}

				else
				{
					_copyDefaults(source[key], destination[key]);
				}
			}
		}
	};

})(jQuery, window.mJappisApplication);
// mJappisApplication.storage.js, EOF
// mJappisApplication.forms.js, line#0

// EOC
// EOC
(function($, $mJ)
{
// EOC
	function rawHtmlElement(value) {
		this.type =  'rawHTML';
		this.value = value;
	}
// EOC
	$mJ.form = new Object();
// EOC
	var _schemaPart = null;
// EOC
	var _dataPart = null;
// EOC
	var _baseObjectName = null;
// EOC
	var _isCreatorAlreadyStarted = null;
// EOC
	var _isItemArray = null;
// EOC
	$mJ.form.init = function (baseObjectName, itemId)
	{
		if (_isCreatorAlreadyStarted)
		{
			alert($mJ.i18n.get('form creator already started'));
		}
		_isCreatorAlreadyStarted = true;

		_schemaPart = $mJ.storage.getSchema(baseObjectName);
		_dataPart = $mJ.storage.get(baseObjectName);
		_baseObjectName = baseObjectName;

		_isItemArray = ($.isArray(_schemaPart) && typeof(_schemaPart[0]) == 'object');

		var item;
		if (_isItemArray)
		{
			_schemaPart = _schemaPart[0];

			var _itemId = (typeof(itemId)=='undefined' ? null : itemId);


			if (_itemId)
			{
				item = $mJ.getItemById(_itemId, _dataPart);
				if (item == null)
				{
					_itemId = null;
				}
			}


			if (_itemId == null)
			{
				item = $mJ.storage.getNewItem(baseObjectName);
				_itemId = item.id;
				_dataPart.push(item);
			}

			// this shouldn't happen as it should either be found or created
			if (item == null)
			{
				alert($mJ.i18n.get('item not found'));
			}
		}


		if (typeof(window.tmpFormData)!='object')
		{
			window.tmpFormData = new Object();
		}
		window.tmpFormData[_baseObjectName] = _dataPart;


		if (_isItemArray && item != null)
		{
			if (typeof(window.tmpFormDataItem)!='object')
			{
				window.tmpFormDataItem = new Object();
			}
			_dataPart = window.tmpFormDataItem[_baseObjectName] = item;
		}

		return window.tmpFormData[_baseObjectName];
	};
// EOC
	$mJ.form.close = function ()
	{
		_schemaPart = _dataPart = _baseObjectName = _isCreatorAlreadyStarted = _isItemArray = null;
	};
// EOC
	$mJ.form.startGroup = function (groupName, options)
	{

		if (!_isCreatorAlreadyStarted)
		{
			alert($mJ.i18n.get('you must init form creator first'));
		}


		var options = $.extend({
		  'collapsed'     : false,
		  'theme'         : 'd',
		  'contentTheme'  : 'd'
		}, options);
		options.collapsed = (!options.collapsed) ? 'false' : 'true';


		var i18nLabel = _baseObjectName.replace(/\./g, '-');
		i18nLabel = 'group-'+ i18nLabel +'-'+ groupName;


		return new rawHtmlElement(''
				+'<div data-role="collapsible"'
					+' data-collapsed="'+options.collapsed+'"'
					+' data-theme="'+options.theme+'"'
					+' data-content-theme="'+options.contentTheme+'"'
					+'>'
					+'<h3>'+$mJ.i18n.get(i18nLabel)+'</h3>'
					+'<div>'
		);
	};
// EOC
	$mJ.form.endGroup = function ()
	{

		if (!_isCreatorAlreadyStarted)
		{
			alert($mJ.i18n.get('you must init form creator first'));
		}

		return new rawHtmlElement('</div></div>');
	};
// EOC
	$mJ.form.startSet = function ()
	{

		if (!_isCreatorAlreadyStarted)
		{
			alert($mJ.i18n.get('you must init form creator first'));
		}

		return new rawHtmlElement('<div data-role="collapsible-set">');
	};
// EOC
	$mJ.form.endSet = function ()
	{

		if (!_isCreatorAlreadyStarted)
		{
			alert($mJ.i18n.get('you must init form creator first'));
		}

		return new rawHtmlElement('</div>');
	};
// EOC
	$mJ.form.getElementOptions = function (objectName)
	{

		if (!_isCreatorAlreadyStarted)
		{
			alert($mJ.i18n.get('you must init form creator first'));
		}


		var labelBase = _baseObjectName.replace(/\./g, '-');

		var elType = _schemaPart[objectName].type;

		//

		var elementOptions = {
			type      : elType
			,name     : labelBase+'-'+objectName
			,value    : _dataPart[objectName]
			,extraAttributes : []
			//,jsUpdate : 'window.tmpFormData[\''+_baseObjectName+'\'].'+objectName+' = jQuery(this).val()'
		};
		if (elType == 'flip' && typeof(elementOptions.value) == 'string')
		{
			elementOptions.value = (elementOptions.value == 'true');
		}
		if (_isItemArray)
		{
			elementOptions.jsUpdate = 'window.tmpFormDataItem[\''+_baseObjectName+'\'].'+objectName+' = jQuery(this).val()';
		}
		else
		{
			elementOptions.jsUpdate = 'window.tmpFormData[\''+_baseObjectName+'\'].'+objectName+' = jQuery(this).val()';
		}
		if ('validationJson' in _schemaPart[objectName])
		{
			elementOptions.validationJson = _schemaPart[objectName].validationJson;
		}

		//


		if ($.inArray(elType, ['text', 'number', 'email', 'url', 'date', 'textarea', 'codeScanner']) >= 0)
		{
			elementOptions.lbl = $mJ.i18n.get('label-'+labelBase+'-'+objectName);
		}

		if ($.inArray(elType, ['radio', 'select', 'flip']) >= 0)
		{
			elementOptions.title = $mJ.i18n.get('label-'+labelBase+'-'+objectName);
		}


		if ($.inArray(elType, ['number']) >= 0)
		{
			if ('min' in _schemaPart[objectName]) elementOptions.extraAttributes.push({name:'min', value:_schemaPart[objectName].min});
			if ('max' in _schemaPart[objectName]) elementOptions.extraAttributes.push({name:'max', value:_schemaPart[objectName].max});
		}


		if ($.inArray(elType, ['radio', 'select', 'flip']) >= 0)
		{
			var formLabels = [];
			if ('options' in _schemaPart[objectName])
			{
				for (var i = 0; i < _schemaPart[objectName].options.length; i++)
				{
					var option = _schemaPart[objectName].options[i];
					if (typeof(option) == 'string')
					{
						formLabels.push({
							lbl   : $mJ.i18n.get('label-'+labelBase+'-'+objectName+'-' + option)
							,
							value : option
						});
					}
					// assuming object {valueKey:'to be saved', internalValue:'to be used'}
					else
					{
						formLabels.push({
							lbl   : $mJ.i18n.get('label-'+labelBase+'-'+objectName+'-' + option.valueKey)
							,
							value : option.valueKey
						});
					}
				}
			}

			else
			{
				formLabels.push({
					lbl   : $mJ.i18n.get('yes')
					,
					value : true
				});
				formLabels.push({
					lbl   : $mJ.i18n.get('no')
					,
					value : false
				});
			}

			elementOptions.lbls = formLabels;
		}

		//
		return elementOptions;
	};
// EOC
	$mJ.form.valid = function(form)
	{

		if (!$(form).valid())
		{
			var $focused = $( document.activeElement );
			alert( $mJ.i18n.get("form-invalid") );

			if ($focused.is(':input.error'))
			{
				$focused.focus();
			}

			else
			{
				$(':input.error', form)[0].focus();
			}
			return false;
		}
		return true;
	};

})(jQuery, window.mJappisApplication);
// mJappisApplication.forms.js, EOF
// mJappisApplication.setup.js, line#0

// EOC
// EOC
(function($, $mJ)
{
	$mJ.setup = {};

	var LOG = new Logger('mJ.setup');
	var lang = 'pl';


	$mJ.setup.full = function()
	{
		$mJ.setup.basics();
		$mJ.setup.validation();
		$mJ.setup.navigation();
		$mJ.setup.controllers();
		$mJ.setup.jqm();
	};
// EOC
	$mJ.setup.basics = function()
	{

		$mJ.storage.init();



		lang = $mJ.storage.get('settings.language');
		$mJ.i18n = new I18n($mJ.i18n, lang);


		$(function()
		{
			//


			$('*[data-lang]').each(function(){
				if (lang != this.getAttribute('data-lang')) {
					this.parentNode.removeChild(this);
				}
			});

			$('*[data-i18n-key]').each(function()
			{
				var key = $(this).attr('data-i18n-key');
				if ($(this).attr('type') == 'button')
				{
					$(this).val($mJ.i18n.get(key));
				}
				else
				{
					$(this).html($mJ.i18n.get(key));
				}
			});
			// atributes (note - for input button data-i18n-key is automatically put in it's value)
			$('*[data-i18n-key-attribute]').each(function()
			{
				var mapping = this.getAttribute('data-i18n-key-attribute').split(':');
				var key = mapping[0];
				var attribute = mapping[1];

				var content = $mJ.i18n.get(key);
				this.setAttribute(attribute, content);
			});


			if ($mJ.storage.get('settings.pageTransitions') == 'none') {
				$('*[data-transition]').each(function()
				{
					this.removeAttribute('data-transition');
				});
			}
		});
	};
// EOC
	$mJ.setup.validation = function()
	{
		$.extend($.validator.messages, $mJ.i18n.get("validator-messages"));
		$.metadata.setType('html5');
	};
// EOC
	function findParentPage(element) {
		do {
			var parent = element.parentNode;
			if (parent && parent.getAttribute('data-role') === 'page') {
				return parent;
			}
		} while(parent);
		return null;
	}
// EOC
	$mJ.setup.navigation = function()
	{
		$(function()
		{
			//

			//

			// 'icons&text', 'icons-only', 'text-only'
			$('*[data-id|="main-navi"]').each(function()
			{
				var naviFormat = $mJ.storage.get('settings.mainNaviFormat');
				if (naviFormat === 'icons-only')
				{
					$('a[data-icon]', this)
						.attr('data-iconpos', 'notext')
						.html('')
					;
				}
				else if (naviFormat === 'text-only')
				{
					$('a[data-icon]', this).removeAttr('data-icon');
				}
			});

			//

			//
			switch ($mJ.storage.get('settings.mainNaviPosition'))
			{
				default:
				case 'bottom-fixed':

				break;
				case 'below-content':
					$('*[data-id|="main-navi"]').each(function()
					{
						var $navi = $(this);
						$navi.attr('data-position', 'below-content');

						if ($navi.attr('data-position-setup') === 'static') {
							$navi.addClass('ui-body-a');
							$navi.removeAttr('data-role');
							$navi.removeAttr('data-position');
						}
					});
				break;
				case 'below-header':
					$('*[data-id|="main-navi"]').each(function()
					{
						var $navi = $(this);
						$navi.attr('data-position', 'below-header');

						if ($navi.attr('data-position-setup') === 'static') {
							$navi.removeAttr('data-role');
							$navi.removeAttr('data-position');
							var page = findParentPage(this);
							$('div[data-role|="header"]', page).append($navi);
						}
					});
				break;
			}
		});
	};
// EOC
	function runController(newPageHash)
	{

		var controllerName = "";
		var parameters = {};
		newPageHash.replace(/^#page-([^?&]+)([?&].+)?$/, function(a, matchedController, matchedParams)
		{
			controllerName = matchedController.replace(/-/g, '_');
			if (matchedParams)
			{
				matchedParams.replace(/[?&]([^?&=]+)=([^?&=]+)/g, function(a, name, value)
				{
					parameters[name] = value;
				});
			}
		});


		var page = $(newPageHash.replace(/\?.+/, ''));
		var viewOnlyVisit = page.attr('data-ignore-visit') == 'true' && newPageHash.search(/[^\w]ignore-visit=false[^\w]/) < 0;
		viewOnlyVisit |= newPageHash.search(/^#table.*-popup$/) === 0;
		if (!controllerIgnorance.appendVisit(newPageHash, controllerName, viewOnlyVisit)) {
			LOG.info('will NOT run controller');
			return;
		}
		else {
			LOG.info('will run controller or attempt it');
		}


		if (controllerName.length && typeof($mJ.controller[controllerName]) == 'function')
		{
			$(function () {
				$mJ.controller[controllerName](parameters);
			});
		}
	}


	var initialLoad = true;
// EOC
	$mJ.setup.controllers = function()
	{
		//

		//
		$(document).bind( "pagebeforechange", function( e, data )
		{
			//LOG.info('navigation data: ', data);

			var newPageHash = '';

			if ( typeof data.toPage === "string" ) {

				if (data.toPage.search(/#&ui-state=dialog$/) >= 0) {

					location.hash = '#'+$('[data-role="page"]')[0].id;
					return;
				}
				newPageHash = $.mobile.path.parseUrl( data.toPage ).hash;
				initialLoad = false;

				if (newPageHash.length == 0) {
					newPageHash = '#'+$('[data-role="page"]')[0].id;
				}
				runController(newPageHash);
			}

			else if ( initialLoad
					&& typeof data.toPage === "object" && data.toPage.length && 'id' in data.toPage[0] ) {
				newPageHash = '#' + data.toPage[0].id;

				location.hash = newPageHash;
				initialLoad = false;

				$(function()
				{
					data.toPage.trigger('create');
				});
			}
			else {
				// LOG.info('skip navigation (probably second call from JQM)');
			}
		});
	};
// EOC
	$mJ.setup.jqm = function()
	{
		$(document).bind("mobileinit", function()
		{

			if (lang == "pl")
			{
				$.mobile.filterable.prototype.options.filterPlaceholder = "Filtruj listę...";
			}


			$.mobile.defaultPageTransition = $mJ.storage.get('settings.pageTransitions');
			//$.mobile.fallbackTransition.slideout = "none";
// EOC
		});
	};

})(jQuery, window.mJappisApplication);
// mJappisApplication.setup.js, EOF
// mJappisApplication.controller._base.js, line#0

// EOC
// EOC
(function($, $mJ)
{
	$mJ.controller = new Object();
// EOC
	$mJ.controller.PaginationHelper = function () {
		var _self = this;

		var tpl = {
			renderOptions: function () {
				var html = '';
				for (var i = 0; i < _self.pagesNo; i++) {
					var selected = "";
					if (_self.currentPageIndex == i) {
						selected = "selected='selected'";
					}
					html += '<option '+selected+' value="'+i+'">'+(i+1)+'</option>';
				}
				return html;
			},
			smallScreen : function () {
				if (_self.pagesNo < 2) {
					return '';
				}
				return ''
					+'<fieldset class="ui-grid-a">'
					+'	<div class="ui-block-a"><a data-id="prev" href="" data-role="button" data-icon="arrow-l" data-iconpos="left"  >'+$mJ.i18n.get('Previous')+'</a></div>'
					+'	<div class="ui-block-b"><a data-id="next" href="" data-role="button" data-icon="arrow-r" data-iconpos="right" >'+$mJ.i18n.get('Next')+'</a></div>'
					+'</fieldset>'
					+'<select name="pageIndex">'+tpl.renderOptions()+'</select>'
				;
			}
		};

		this.currentPageIndex = 0;
		this.itemsPerPage = 5;
		this.totalItems = 0;
		this.pagesNo = 1;
// EOC
		this.getPagination = function (currentPageIndex, itemsPerPage, totalItems) {
			this.currentPageIndex = +currentPageIndex;
			this.itemsPerPage = itemsPerPage;
			this.totalItems = totalItems;
			this.pagesNo = Math.ceil(totalItems / itemsPerPage);

			return tpl.smallScreen(this.pagesNo);
		};
// EOC
		this.setupControls = function (paginationContainer, onPageIndexChange) {
			var $pageIndex = $('[name="pageIndex"]', paginationContainer);
			$pageIndex.unbind().change(function (){
				onPageIndexChange($pageIndex.val());
			});
			$('[data-id="prev"]', paginationContainer).unbind().click(function (){
				var index = _self.currentPageIndex;
				if (index > 0) {
					onPageIndexChange(index - 1);
				}
			});
			$('[data-id="next"]', paginationContainer).unbind().click(function (){
				var index = _self.currentPageIndex;
				if (index < _self.pagesNo - 1) {
					onPageIndexChange(index + 1);
				}
			});
		};
	};
// EOC
	$mJ.controller.Page = function (pageId) {
		var _page = this;
		this.id = pageId;
		this.container = document.getElementById(pageId);
		this.selector = '#'+pageId;
		this.header = {
			$container : $('[data-role=header]', _page.container)
		};
		this.content = {
			$container : $('[data-role=content]', _page.container)
		};
	};

})(jQuery, window.mJappisApplication);
// mJappisApplication.controller._base.js, EOF
// mJappisApplication.utils.geo.js, line#0

// EOC
// EOC
(function($, $mJ)
{
// EOC
	$mJ.geo = new Object();
// EOC
	$mJ.geo.initGet = function(onSuccess)
	{
		if (typeof(navigator) != 'undefined'
			&& typeof(navigator.geolocation) != 'undefined'
			&& typeof(navigator.geolocation.getCurrentPosition) == 'function')
		{
			navigator.geolocation.getCurrentPosition(onSuccess, $mJ.geo.errorHandler);
		}
	};
// EOC
	$mJ.geo.mapUrl = 'http://maps.google.com/maps/api/staticmap?center=%%lat%%,%%lon%%&markers=%%lat%%,%%lon%%&maptype=mobile&sensor=false&zoom=10&size=200x200';
// EOC
	$mJ.geo.loadMap = function(latitude, longitude, imageParent)
	{
		if (typeof(imageParent) == 'string') {
			imageParent = $(imageParent);
		}


		var ll = { lat: latitude, lon: longitude };
		ll.lat = ll.lat.replace(/,/, '.');
		ll.lon = ll.lon.replace(/,/, '.');


		var info = "";
		if (ll.lat == '' || ll.lon == '')
		{
			info = "error: position empty";
		}
		else if (ll.lat.search(/^[0-9.]+$/) < 0 || ll.lon.search(/^[0-9.]+$/) < 0)
		{
			info = "error: position must be decimal";
		}


		if (info.length)
		{
			imageParent.html($mJ.i18n.get(info));
		}

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
// EOC
	$mJ.geo.errorHandler = function(error)
	{
		var info = "unexpected error";
		switch(error.code)
		{
			case error.PERMISSION_DENIED:
				info = "";
			break;
			case error.POSITION_UNAVAILABLE:
				info = "could not detect your position";
			break;
			case error.TIMEOUT:
				info = "retrieving your position timed out";
			break;
		}

		if (info.length)
		{
			alert($mJ.i18n.get(info));
		}
	};

})(jQuery, window.mJappisApplication);
// mJappisApplication.utils.geo.js, EOF