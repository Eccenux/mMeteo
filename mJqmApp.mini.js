
// base, line#0

// EOC@line#8
// EOC@line#11
window.mJqmApplication =
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


	i18n : null
	,


	controller : null
};

// base, EOF
// utils, line#0

// EOC@line#8
// EOC@line#14
(function($, _self)
{
// EOC@line#22
	_self.getItemById = function(id, items)
	{
		var item = null;
		for (var i = 0; i < items.length; i++)
		{
			if (items[i].id == id)
			{
				item = items[i];
				break;
			}
		}

		return item;
	};
// EOC@line#43
	_self.delItemById = function(id, items)
	{
		for (var i = 0; i < items.length; i++)
		{
			if (items[i].id == id)
			{
				items.splice(i, 1);
				break;
			}
		}
	};
// EOC@line#61
	_self.activateInternalBackButtons = function()
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
// EOC@line#91
	_self.deepClone = function(source)
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
// EOC@line#114
	_self.bindInput = function(selector, storagePath)
	{

		var bindIndicator = 'data-jqm-bind-' + storagePath;
		if ($(selector).attr(bindIndicator) != 'true')
		{
			$(selector).attr(bindIndicator, 'true');

			$(selector).change(function()
			{
				_self.storage.set(storagePath, $(this).val());
			});
		}


		$(selector).val(_self.storage.get(storagePath));
	};

})(jQuery, window.mJqmApplication);
// utils, EOF
// storage, line#0

// EOC@line#8
// EOC@line#14
(function($, _self)
{
// EOC@line#96
	_self.storage.schema = {};
// EOC@line#103
	var dataStore = null;
// EOC@line#110
	_self.storage.init = function ()
	{
		if (_self.storage.storageKey == null)
		{
			throw new Error('Fatal error: storageKey not defined. Make sure it is defined before setup.');
		}
		$.storage = new $.store();
		var data = $.storage.get (_self.storage.storageKey);
		if (data)
		{
			dataStore = data;
		}

		else
		{
			dataStore = null;
			if ('initialData' in _self.storage)
			{
				dataStore = _self.storage.initialData;
			}
		}
	};
// EOC@line#135
	_self.storage.save = function ()
	{
		$.storage.set (_self.storage.storageKey, dataStore);
	};
// EOC@line#146
	_self.storage.clear = function ()
	{
		dataStore = null;
		if ('initialData' in _self.storage)
		{
			dataStore = _self.storage.initialData;
		}
		$.storage.flush();
	};
// EOC@line#166
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
// EOC@line#215
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
// EOC@line#265
	var _getParentObjectByPath = function (baseObject, objectPath)
	{

		if (objectPath.indexOf('.')==-1)
		{
			return null;
		}


		objectPath = objectPath.replace(/(.+)\..+/, '$1');


		return _getObjectByPath (baseObject, objectPath);
	};
// EOC@line#298
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
// EOC@line#343
	_self.storage.getSchema = function (objectPath)
	{
		var schemaPart = _getObjectByPath(_self.storage.schema, objectPath);
		if (schemaPart == null)
		{
			return null;
		}
		if (typeof(schemaPart) == 'object')
		{
			schemaPart = _self.deepClone (schemaPart);
		}

		return schemaPart;
	};
// EOC@line#365
	_self.storage.get = function (objectPath)
	{

		var data = _getObjectByPath(dataStore, objectPath);
		if (data != null && typeof(data) == 'object')
		{
			data = _self.deepClone (data);
		}


		var schemaPart = _getObjectByPath(_self.storage.schema, objectPath);
		if (schemaPart == null)
		{
			return data;
		}
		if (typeof(schemaPart) == 'object')
		{
			schemaPart = _self.deepClone (schemaPart);
		}


		if (data != null && typeof(data) != 'object')
		{
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
// EOC@line#431
	_self.storage.getNewItem = function (objectPath)
	{

		var schemaPart = _getObjectByPath(_self.storage.schema, objectPath);
		if (schemaPart == null || !$.isArray(schemaPart) || schemaPart.length < 1)
		{
			return null;
		}
		schemaPart = _self.deepClone (schemaPart);


		var parentData = _getParentObjectByPath(dataStore, objectPath);


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
// EOC@line#478
	_self.storage.set = function (objectPath, data)
	{

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
		_self.storage.save ();
	};
// EOC@line#510
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

})(jQuery, window.mJqmApplication);
// storage, EOF
// forms, line#0

// EOC@line#8
// EOC@line#14
(function($, _self)
{
	_self.form = new Object();


	var _schemaPart = null;

	var _dataPart = null;

	var _baseObjectName = null;
	//! Current status to avoid interference from paralel (shouldn't happen but...)
	var _isCreatorAlreadyStarted = null;

	var _isItemArray = null;
// EOC@line#38
	_self.form.init = function (baseObjectName, itemId)
	{
		if (_isCreatorAlreadyStarted)
		{
			alert(_self.i18n.get('form creator already started'));
		}
		_isCreatorAlreadyStarted = true;

		_schemaPart = _self.storage.getSchema(baseObjectName);
		_dataPart = _self.storage.get(baseObjectName);
		_baseObjectName = baseObjectName;

		_isItemArray = ($.isArray(_schemaPart) && typeof(_schemaPart[0]) == 'object');

		var item;
		if (_isItemArray)
		{
			_schemaPart = _schemaPart[0];

			var _itemId = (typeof(itemId)=='undefined' ? null : itemId);


			if (_itemId)
			{
				item = _self.getItemById(_itemId, _dataPart);
				if (item == null)
				{
					_itemId = null;
				}
			}


			if (_itemId == null)
			{
				item = _self.storage.getNewItem('library.items');
				_itemId = item.id;
				_dataPart.push(item);
			}

			// this shouldn't happen as it should either be found or created
			if (item == null)
			{
				alert(_self.i18n.get('item not found'));
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
// EOC@line#107
	_self.form.close = function ()
	{
		_schemaPart = _dataPart = _baseObjectName = _isCreatorAlreadyStarted = _isItemArray = null;
	};
// EOC@line#129
	_self.form.startGroup = function (groupName, options)
	{

		if (!_isCreatorAlreadyStarted)
		{
			alert(_self.i18n.get('you must init form creator first'));
		}


		var options = $.extend({
		  'collapsed'     : false,
		  'theme'         : 'd',
		  'contentTheme'  : 'd'
		}, options);
		options.collapsed = (!options.collapsed) ? 'false' : 'true';


		var i18nLabel = _baseObjectName.replace(/\./g, '-');
		i18nLabel = 'group-'+ i18nLabel +'-'+ groupName;


		return {
			type      : 'rawHTML'
			,value    : ''
				+'<div data-role="collapsible"'
					+' data-collapsed="'+options.collapsed+'"'
					+' data-theme="'+options.theme+'"'
					+' data-content-theme="'+options.contentTheme+'"'
					+'>'
					+'<h3>'+_self.i18n.get(i18nLabel)+'</h3>'
					+'<div>'
		};
	}
// EOC@line#165
	_self.form.endGroup = function ()
	{

		if (!_isCreatorAlreadyStarted)
		{
			alert(_self.i18n.get('you must init form creator first'));
		}

		return {
			type      : 'rawHTML'
			,value    : '</div></div>'
		};
	}
// EOC@line#182
	_self.form.startSet = function ()
	{

		if (!_isCreatorAlreadyStarted)
		{
			alert(_self.i18n.get('you must init form creator first'));
		}

		return {
			type      : 'rawHTML'
			,value    : '<div data-role="collapsible-set">'
		};
	}
// EOC@line#198
	_self.form.endSet = function ()
	{

		if (!_isCreatorAlreadyStarted)
		{
			alert(_self.i18n.get('you must init form creator first'));
		}

		return {
			type      : 'rawHTML'
			,value    : '</div>'
		};
	}
// EOC@line#230
	_self.form.getElementOptions = function (objectName)
	{

		if (!_isCreatorAlreadyStarted)
		{
			alert(_self.i18n.get('you must init form creator first'));
		}


		var labelBase = _baseObjectName.replace(/\./g, '-');

		var elType = _schemaPart[objectName].type;

		//

		var elementOptions = {
			type      : elType
			,name     : labelBase+'-'+objectName
			,value    : _dataPart[objectName]
			//,jsUpdate : 'window.tmpFormData[\''+_baseObjectName+'\'].'+objectName+' = jQuery(this).val()'
		};
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
// EOC@line#273
		if ($.inArray(elType, ['text', 'email', 'url', 'date', 'textarea']) >= 0)
		{
			elementOptions.lbl = _self.i18n.get('label-'+labelBase+'-'+objectName);
		}

		if ($.inArray(elType, ['radio', 'select']) >= 0)
		{
			elementOptions.title = _self.i18n.get('label-'+labelBase+'-'+objectName);
		}


		if ($.inArray(elType, ['radio', 'select']) >= 0)
		{
			var formLabels = [];
			for (var i = 0; i < _schemaPart[objectName].options.length; i++)
			{
				formLabels.push({
					lbl   : _self.i18n.get('label-'+labelBase+'-'+objectName+'-' + _schemaPart[objectName].options[i])
					,
					value : _schemaPart[objectName].options[i]
				});
			}

			elementOptions.lbls = formLabels;
		}

		//
		return elementOptions;
	};
// EOC@line#308
	_self.form.valid = function(form)
	{

		if (!$(form).valid())
		{
			var $focused = $( document.activeElement );
			alert( _self.i18n.get("form-invalid") );

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

})(jQuery, window.mJqmApplication);
// forms, EOF
// utils.geo, line#0

// EOC@line#8
// EOC@line#14
(function($, _self)
{
	_self.geo = new Object();
// EOC@line#25
	_self.geo.initGet = function(onSuccess)
	{
		if (typeof(navigator) != 'undefined'
			&& typeof(navigator.geolocation) != 'undefined'
			&& typeof(navigator.geolocation.getCurrentPosition) == 'function')
		{
			navigator.geolocation.getCurrentPosition(onSuccess, _self.geo.errorHandler);
		}
	}
// EOC@line#42
	_self.geo.loadMap = function(latitude, longitude, imageParent)
	{

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
			$(imageParent).html(_self.i18n.get(info));
		}

		else
		{
			//var url = 'http://maps.googleapis.com/staticmap?center=%%lat%%,%%lon%%&markers=%%lat%%,%%lon%%&maptype=mobile&sensor=false&zoom=2&size=200x200&key=AIzaSyDgIGdkNTcSSJO-NXGyVtoRoBNDvZdy4S8';
			//var url = 'http://maps.google.com/staticmap?center=%%lat%%,%%lon%%&markers=%%lat%%,%%lon%%&maptype=mobile&sensor=false&zoom=15&size=200x200';
			var url = 'http://maps.google.com/maps/api/staticmap?center=%%lat%%,%%lon%%&markers=%%lat%%,%%lon%%&maptype=mobile&sensor=false&zoom=10&size=200x200';

			url = url
				.replace(/%%lat%%/g, ll.lat)
				.replace(/%%lon%%/g, ll.lon)
			;
			$(imageParent).html('<a href="'+url+'" target="_blank"><img src="'+url+'" alt="'+_self.i18n.get('map')+'"></a>');
		}
	}
// EOC@line#85
	_self.geo.errorHandler = function(error)
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
			alert(_self.i18n.get(info));
		}
	}

})(jQuery, window.mJqmApplication);
// utils.geo, EOF
// i18n, line#0

// EOC@line#8
// EOC@line#28
window.mJqmApplication.i18n = {"":""

	,'pl' : {"":""

		,"title-application" : "Prognoza"

		,"unexpected error" : "Niespodziewany błąd!"

		,"add - title" : "Dodaj"
		,"edit - title" : "Edytuj"
		,"delete - title" : "Usuń"

		,"could not detect your position"     : "Nie udało się wykryć położenia. Włącz sieć bezprzewodową (WiFi) lub odbiornik GPS."
		,"retrieving your position timed out" : "Nie udało się wykryć położenia w rozsądnym czasie. Spróbuj jeszcze raz."

		,"button-show-map" : "Pokaż położenie (mini-mapa)"
		,"map" : "mapa"

		,"error: position empty"           : "Błąd! Współrzędne położenia są puste.\n\nOdśwież położenie lub wpisz długość i szerokość ręcznie."
		,"error: position must be decimal" : "Błąd! Współrzędne położenia są nieprawidłowe. Długość i szerokość muszą być wpisane w formie liczb dziesiętnych.\n\nPopraw lub spróbuj odświeżyć położenie."

		,"title-um-model" : "Krótka prognoza"
		,"title-coamps-model" : "Długa prognoza"
		,"label-latitude"  : "Szerokość (N)"
		,"label-longitude" : "Długość (E)"

		,"label-settings-language"         : "Język"
		,"label-settings-language-pl"      : "Polski"
		,"label-settings-language-en"      : "English"
		,"label-settings-getPositionType"                  : "Pobieranie położenia"
		,"label-settings-getPositionType-automatic"        : "Od razu po uruchomieniu"
		,"label-settings-getPositionType-manual-only"      : "Ręcznie przyciskiem"
		,"label-settings-getPositionType-manual-but-saved" : "Ręcznie z automatycznym zapisem poprzedniej"
		,"group-settings-mainNavi" : "Przyciski nawigacyjne"
		,"label-settings-mainNaviFormat"            : "Format"
		,"label-settings-mainNaviFormat-icons&text" : "Ikony i tekst"
		,"label-settings-mainNaviFormat-icons-only" : "Tylko ikony"
		,"label-settings-mainNaviFormat-text-only"  : "Tylko tekst"
		,"label-settings-mainNaviPosition"               : "Pozycja"
		,"label-settings-mainNaviPosition-bottom-fixed"  : "Przytwierdzone na dole"
		,"label-settings-mainNaviPosition-below-content" : "Pod zawartością"
		,"label-settings-mainNaviPosition-below-header"  : "Pod nagłówkiem"
		,"group-settings-advanced" : "Zaawansowane"
		,"label-settings-pageTransitions"           : "Animacje przy zmianie stron"
		,"label-settings-pageTransitions-none"      : "Brak (wysoka wydajność)"
		,"label-settings-pageTransitions-slide"     : "Przesunięcie"
		,"label-settings-pageTransitions-slideup"   : "Do góry"
		,"label-settings-pageTransitions-slidedown" : "W dół"
		,"label-settings-pageTransitions-pop"       : "Wyskakujące"
		,"label-settings-pageTransitions-fade"      : "Przenikanie"
		,"label-settings-pageTransitions-flip"      : "Obrocik"

		,"button-refresh" : "Odśwież położenie"

		,"form-invalid" : "Proszę poprawić formularz"
		,"submit"       : "Zapisz"

		,"validator-messages" :
		{
			required: "To pole jest wymagane.",
			remote: "Proszę o wypełnienie tego pola.",
			email: "Proszę o podanie prawidłowego adresu email.",
			url: "Proszę o podanie prawidłowego URL.",
			date: "Proszę o podanie prawidłowej daty.",
			dateISO: "Proszę o podanie prawidłowej daty (ISO).",
			number: "Proszę o podanie prawidłowej liczby.",
			digits: "Proszę o podanie samych cyfr.",
			creditcard: "Proszę o podanie prawidłowej karty kredytowej.",
			equalTo: "Proszę o podanie tej samej wartości ponownie.",
			accept: "Proszę o podanie wartości z prawidłowym rozszerzeniem.",
			maxlength: jQuery.validator.format("Proszę o podanie nie więcej niż {0} znaków."),
			minlength: jQuery.validator.format("Proszę o podanie przynajmniej {0} znaków."),
			rangelength: jQuery.validator.format("Proszę o podanie wartości o długości od {0} do {1} znaków."),
			range: jQuery.validator.format("Proszę o podanie wartości z przedziału od {0} do {1}."),
			max: jQuery.validator.format("Proszę o podanie wartości mniejszej bądź równej {0}."),
			min: jQuery.validator.format("Proszę o podanie wartości większej bądź równej {0}.")
		}

	}

	,'en' : {"":""

		,"title-application" : "Forecast"

		,"unexpected error" : "Unexpected error!"

		,"add - title" : "Add"
		,"edit - title" : "Edit"
		,"delete - title" : "Delete"

		,"button-show-map" : "Show position (mini-map)"
		,"map" : "map"

		,"could not detect your position"     : "Could not detect your position. Turn on your wireless network (WiFi) or GPS."
		,"retrieving your position timed out" : "Retrieving your position timed out. You can try again."

		,"error: position empty"           : "Error! Geo. position is empty.\n\nPlease refresh position or type in latitude and longitude yourself."
		,"error: position must be decimal" : "Error! Geo. position is incorrect. Latitude and longitude must be decimal.\n\nCorrect thoose values or try to refresh the position."

		,"title-um-model" : "Short forecast"
		,"title-coamps-model" : "Long forecast"
		,"label-latitude"  : "Latitude (N)"
		,"label-longitude" : "Longitude (E)"

		,"label-settings-language"         : "Language"
		,"label-settings-language-pl"      : "Polski"
		,"label-settings-language-en"      : "English"
		,"label-settings-getPositionType"                  : "Position acquiry"
		,"label-settings-getPositionType-automatic"        : "Automatic (at startup)"
		,"label-settings-getPositionType-manual-only"      : "Manual (refresh for automatic)"
		,"label-settings-getPositionType-manual-but-saved" : "Manual with saving previous"
		,"group-settings-mainNavi" : "Navigation buttons"
		,"label-settings-mainNaviFormat"            : "Format"
		,"label-settings-mainNaviFormat-icons&text" : "Icons & text"
		,"label-settings-mainNaviFormat-icons-only" : "Icons only"
		,"label-settings-mainNaviFormat-text-only"  : "Text only"
		,"label-settings-mainNaviPosition"               : "Position"
		,"label-settings-mainNaviPosition-bottom-fixed"  : "Fixed to the bottom"
		,"label-settings-mainNaviPosition-below-content" : "Below content"
		,"label-settings-mainNaviPosition-below-header"  : "Below header"
		,"group-settings-advanced" : "Advanced"
		,"label-settings-pageTransitions"           : "Animation type for transitions"
		,"label-settings-pageTransitions-none"      : "None (best performance)"
		,"label-settings-pageTransitions-slide"     : "Slide"
		,"label-settings-pageTransitions-slideup"   : "Slide up"
		,"label-settings-pageTransitions-slidedown" : "Slide down"
		,"label-settings-pageTransitions-pop"       : "Pop"
		,"label-settings-pageTransitions-fade"      : "Fade"
		,"label-settings-pageTransitions-flip"      : "Flip"

		,"button-refresh" : "Refresh position"

		,"form-invalid" : "Please correct the form"
		,"submit"       : "Save"

		,"validator-messages" :
		{
			required: "This field is required.",
			remote: "Please fix this field.",
			email: "Please enter a valid email address.",
			url: "Please enter a valid URL.",
			date: "Please enter a valid date.",
			dateISO: "Please enter a valid date (ISO).",
			number: "Please enter a valid number.",
			digits: "Please enter only digits.",
			creditcard: "Please enter a valid credit card number.",
			equalTo: "Please enter the same value again.",
			accept: "Please enter a value with a valid extension.",
			maxlength: jQuery.validator.format("Please enter no more than {0} characters."),
			minlength: jQuery.validator.format("Please enter at least {0} characters."),
			rangelength: jQuery.validator.format("Please enter a value between {0} and {1} characters long."),
			range: jQuery.validator.format("Please enter a value between {0} and {1}."),
			max: jQuery.validator.format("Please enter a value less than or equal to {0}."),
			min: jQuery.validator.format("Please enter a value greater than or equal to {0}.")
		}
	}
};
// i18n, EOF
// model, line#0

// EOC@line#8
// EOC@line#14
(function($, _self)
{
// EOC@line#19
	_self.storage.storageKey = 'mMeteoData';
// EOC@line#26
	_self.storage.schema =
	{
		position :
		{
			favorite :
			{
				 lat : {type:"text", value:""}
				,lon : {type:"text", value:""}
			}
		}
		,
		settings :
		{
			language        : {type:"select", value:"pl", options:["pl", "en"]}

			,mainNaviFormat  : {type:"select", value:"icons&text", options:['icons&text', 'icons-only', 'text-only']}

			,getPositionType : {type:"select", value:"manual-but-saved", options:['automatic', 'manual-only', 'manual-but-saved']}

			,skin            : {type:"select", value:"default", options:['default']}

			,pageTransitions : {type:"select", value:"none", options:['none', 'slide', 'slideup', 'slidedown', 'pop', 'fade', 'flip']}
			// type of footer/buttons: fixed to bottom*, below content, below header; *default, but don't work too good on all phones (browsers)
			,mainNaviPosition: {type:"select", value:"bottom-fixed", options:['bottom-fixed', 'below-content', 'below-header']}
		}
	};
// EOC@line#65
})(jQuery, window.mJqmApplication);
// model, EOF
// controller, line#0

// EOC@line#8
// EOC@line#14
(function($, _self)
{
	_self.controller = new Object();
// EOC@line#21
	_self.controller.settings = function(parameters)
	{
		var $thisForm = $('#settings-form');

		//


		var tmpFormData = _self.form.init('settings');


		var formData = formCreator (
		[
			_self.form.getElementOptions('getPositionType')
			,
			_self.form.getElementOptions('language')
			,
			_self.form.startSet()
				,
				_self.form.startGroup('mainNavi', {collapsed:true})
					,
					_self.form.getElementOptions('mainNaviFormat')
					,
					_self.form.getElementOptions('mainNaviPosition')
				,
				_self.form.endGroup()
				,
				_self.form.startGroup('advanced', {collapsed:true})
					,
					_self.form.getElementOptions('pageTransitions')
				,
				_self.form.endGroup()
			,
			_self.form.endSet()
			,
			{
				type      : 'submit'
				,name     : 'settings-submit'
				,lbl      : _self.i18n.get("submit")
			}
		]);
		_self.form.close();


		$thisForm.html(formData);


		$thisForm.trigger( "create" );


		$('#settings-submit-btn')
			.unbind()
			.click(function()
			{
				$thisForm.submit();
				return false;
			})
		;


		$thisForm.validate({meta: "validation"});

		//

		$thisForm
			.unbind()
			.submit(function(event)
			{

				if (!_self.form.valid(this))
				{
					return false;
				}


				_self.storage.set('settings', tmpFormData);


				location.href = 'index.html';

				event.preventDefault();
				return false;
			})
		;
	};

	var _currentGeoSelectorPrefix = '#forecastform-';
// EOC@line#111
	var _fillGeo = function ()
	{
		_self.geo.initGet (function(pos)
		{
			$(_currentGeoSelectorPrefix + 'lat')
				.val(pos.coords.latitude)
				.change()
			;
			$(_currentGeoSelectorPrefix + 'lon')
				.val(pos.coords.longitude)
				.change()
			;
		});
	};
// EOC@line#129
	var _startDone = false;
// EOC@line#134
	_self.controller.start = function(parameters)
	{

		if (_startDone)
		{
			return;
		}
		_startDone = true;

		//

		var getPositionType = _self.storage.get('settings.getPositionType');
		if (getPositionType == 'automatic')
		{
			_fillGeo();
		}

		//

		if (getPositionType == 'manual-but-saved')
		{
			_self.bindInput(_currentGeoSelectorPrefix + 'lat', 'position.favorite.lat');
			_self.bindInput(_currentGeoSelectorPrefix + 'lon', 'position.favorite.lon');
		}

		//

		$('.refresh-geo').click(function()
		{
			_fillGeo();
		});

		//

		$('#forecastform').submit(function()
		{

			var ll = { lat: $(_currentGeoSelectorPrefix + 'lat').val(), lon: $(_currentGeoSelectorPrefix + 'lon').val() };
			ll.lat = ll.lat.replace(/,/, '.');
			ll.lon = ll.lon.replace(/,/, '.');
			$(_currentGeoSelectorPrefix + 'lat').val(ll.lat);
			$(_currentGeoSelectorPrefix + 'lon').val(ll.lon);


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
				alert(_self.i18n.get(info));
				return false;
			}


			var modelChoosen = $('#forecastform').attr('data-model');
// EOC@line#214
			var actionUrl = $('#forecastform').attr('data-action-'+modelChoosen);
			if (actionUrl)
			{
				$('#forecastform').attr('action', actionUrl);
			}
			return true;
		});
	};

})(jQuery, window.mJqmApplication);
// controller, EOF
// setup, line#0

// EOC@line#8
// EOC@line#14
(function($, _self)
{
	//

	//
	_self.storage.init();

	//


	var lang = _self.storage.get('settings.language');
	_self.i18n = new I18n(_self.i18n, lang);

	//

	//
 	$.extend($.validator.messages, _self.i18n.get("validator-messages"));
	$.metadata.setType('html5');

	//

	//
	$(function()
	{
		//


		$('*[data-lang]').hide();
		$('*[data-lang|="'+lang+'"]').show();

		$('*[data-i18n-key]').each(function()
		{
			var key = $(this).attr('data-i18n-key');
			if ($(this).attr('type') == 'button')
			{
				$(this).val(_self.i18n.get(key));
			}
			else
			{
				$(this).html(_self.i18n.get(key));
			}
		});

		//


		// 'icons&text', 'icons-only', 'text-only'
		$('*[data-id|="main-navi"]').each(function()
		{
			var naviFormat = _self.storage.get('settings.mainNaviFormat');
			if (naviFormat == 'icons-only')
			{
				$('a[data-icon]', this)
					.attr('data-iconpos', 'notext')
					.html('')
				;
			}
			else if (naviFormat == 'text-only')
			{
				$('a[data-icon]', this).removeAttr('data-icon');
			}
		});

		//

		//
		switch (_self.storage.get('settings.mainNaviPosition'))
		{
			default:
			case 'bottom-fixed':

			break;
			case 'below-content':
				$('*[data-id|="main-navi"]').each(function()
				{
					$(this).attr('data-position', 'below-content');
				});
			break;
			case 'below-header':
				$('*[data-id|="main-navi"]').each(function()
				{
					$(this).attr('data-position', 'below-header');
				});
			break;
		}

		//

		// (if hash is not given jQueryMobile doeasn't call pagebeforechange with url in toPage)
		if (location.hash.length <= 1)
		{
			if (_self.controller && typeof(_self.controller.start) == 'function')
			{
				_self.controller.start();
			}
		}
	});

	//

	//
	$(document).bind("mobileinit", function()
	{

		if (lang == "pl")
		{
			$.mobile.listview.prototype.options.filterPlaceholder = "Filtruj listę...";
		}


		$.mobile.defaultPageTransition = _self.storage.get('settings.pageTransitions');
		//$.mobile.fallbackTransition.slideout = "none";


		if (_self.storage.get('settings.mainNaviPosition') == 'bottom-fixed')
		{
			$.mobile.touchOverflowEnabled = true;
			$.mobile.fixedToolbars.setTouchToggleEnabled(false);
		}
	});

	//

	//
	$(document).bind( "pagebeforechange", function( e, data )
	{


		if ( typeof data.toPage === "string" )
		{
			var newPageHash = $.mobile.path.parseUrl( data.toPage ).hash;


			if (newPageHash.length <= 1)
			{
				newPageHash = "#page-start";
			}


			var controllerName = "";
			var parameters = {};
			newPageHash.replace(/^#page-([^?&]+)([?&].+)?$/, function(a, matchedController, matchedParams)
			{
				controllerName = matchedController;
				if (matchedParams)
				{
					matchedParams.replace(/[?&]([^?&=]+)=([^?&=]+)/g, function(a, name, value)
					{
						parameters[name] = value;
					});
				}
			});

			if (controllerName.length && typeof(_self.controller[controllerName]) == 'function')
			{
				_self.controller[controllerName](parameters);
			}
		}
	});

})(jQuery, window.mJqmApplication);
// setup, EOF