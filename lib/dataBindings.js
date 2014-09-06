/**
 * Data binding and transforms.
 *
 * jQuery Mobile is not crucial, but assumed.
 * You should remove `trigger('create')` if you plan to use this outside of JQM.
 *
 * See {@link DataBindings#bind} for examples on how to declare bindings in HTML.
 *
 * Author: Maciej Jaros
 * Web: http://enux.pl/
 *
 * Licensed under
 *   MIT License http://www.opensource.org/licenses/mit-license
 *   GPL v3 http://opensource.org/licenses/GPL-3.0
 *
 * @param {Element} baseElement
 *
 * @class {DataBindings}
 */
function DataBindings(baseElement)
{
	/**
	 * Me.
	 * @type DataBindings
	 */
	var _self = this;

	/**
	 * Configuration.
	 *
	 * @type Object
	 */
	this.configuration = {
		/**
		 * inAppBrowser action attribute for external links.
		 *
		 * _self = webview (plain)
		 * _blank = inAppBrowser window (with done/back button)
		 * _system = system default browser
		 *
		 * @see http://community.phonegap.com/nitobi/topics/_childbrowser_plugin_deprecating_use_inappbrowser
		 */
		inAppBrowserActionAttribute : 'onclick="window.open(this.href, \'_system\', \'location=yes,enableViewportScale=yes\'); return false;"',
		/**
		 * Default transform for data.
		 * @note It MUST be available in `.configuration.transforms` before you run `.bind(...)` for the first time.
		 */
		defaultTransform : 'escapeHtml',
		/**
		 * Transforms for data.
		 */
		transforms : {
			raw : new DataBindingsTransform(),
			escapeHtml : new DataBindingsTransform({
				transform : _htmlSpecialChars,
				insertsHtml : false
			}),
			textToHtml : new DataBindingsTransform({
				transform : _textToHtml
			}),
			urlToShortText : new DataBindingsTransform({
				transform : _urlToShortText
			}),
			isbnToUrl : new DataBindingsTransform({
				transform : _isbnToUrl
			}),
			urlToShares : new DataBindingsTransform({
				transform : _urlToShares,
				enhance : _urlToSharesEnhance
			}),
			mailToLink : new DataBindingsTransform({
				transform : _toLink,
				parameters : {type:'mail'}
			}),
			phoneToLink : new DataBindingsTransform({
				transform : _toLink,
				parameters : {type:'phone'}
			})
		},
		/**
		 * Various links templates
		 */
		linkTemplates : {
			mail : ' <a '
				+' href="mailto:%URL%" target="_blank" '
				+' data-role="button" data-inline="true" '
				+' %InAppBrowser%'
				+' data-icon="mail">%URL%</a>',
			phone : ' <a '
				+' href="tel:%URL%" target="_blank" '
				+' data-role="button" data-inline="true" '
				+' %InAppBrowser%'
				+' data-icon="phone">%URL%</a>'
		},
		/**
		 * Use to add toggle of share buttons with given name.
		 *
		 * @param {String} sharesToggle
		 */
		sharesToggle : '',
		/**
		 * Providers
		 */
		shareProviders : [
			{
				id:'facebook',
				name:'Facebook',
				icon:'facebook'
			}
			,
			{
				id:'twitter',
				name:'Twitter',
				icon:'twitter'
			}
			,
			{
				id:'google',
				name:'Google+',
				icon:'google-plus'
			}
		]
	};

	/**
	 * @param {String} text Text to transform.
	 * @returns {String} Transformed text.
	 */
	function _htmlSpecialChars(text)
	{
		if (text == null) {
			return "";
		}
		text = text.toString()
			.replace(/&/g, '&amp;')
			.replace(/>/g, '&gt;')
			.replace(/</g, '&lt;')
		;
		return text;
	}
	/**
	 * @param {String} text Text to transform.
	 * @returns {String} Transformed text.
	 */
	function _textToHtml(text)
	{
		text = _htmlSpecialChars(text);
		text = text
			// normalize new lines
			.replace(/\r\n/g, '\n')
			.replace(/\r/g, '\n')
			// paragraphs
			.replace(/(^|\n\n)(.+)(?=\n\n|$)/g, '<p>$2</p>')
			.replace(/<\/p>\s+/g, '</p>')
			// single new line
			.replace(/\n/g, '<br>\n')
			// whitespace
			.replace(/\t/g, '&nbsp; &nbsp; ')
			.replace(/  /g, '&nbsp; ')
		;
		return text;
	}
	/**
	 * @param {String} text Text to transform.
	 * @returns {String} Transformed text.
	 */
	function _urlToShortText(text)
	{
		text = _htmlSpecialChars(text);
		text = text
			// big: domain, final atribute xor file
			.replace(/^([a-z]+:[/]{2,})([^/]+)([^?&]*)(.*)$/g, function (a, protocol, domain, path, query)
			{
				// protocol
				protocol = '<small>'+protocol+'</small>';
				// shorten path
				if (path.length > 5) {
					path = path.replace(/([/][^/<>]+[/]).{5,}([/][^/<>]+[/])/g, '$1...$2');
				}
				// from path+query only final atribute xor file is big
				var resource = path + query;
				if (resource.length > 5) {
					resource = resource.replace(/^(.+?)([^/?&=]+)$/g, '<small>$1</small>$2');
				}
				return protocol + domain + resource;
			})
		;

		return text;
	}
	/**
	 * @param {String} text Text to transform.
	 * @returns {String} Transformed text.
	 */
	function _isbnToUrl(text)
	{
		if (text == null) {
			return "";
		}
		var isbnUrl = 'http://alpha.bn.org.pl/search*pol/i?SEARCH=%ISBN%&searchscope=5';
		var contentTpl = '<a href="%URL%" target="_blank"'
			+' ' + _self.configuration.inAppBrowserActionAttribute
			+'>%ISBN%</a>';
		text = contentTpl
			.replace(/%URL%/g, isbnUrl)
			.replace(/%ISBN%/g, text)
		;
		return text;
	}
	
	/**
	 * Add click function to button.
	 * @param {type} $elements
	 * @returns {undefined}
	 */
	function _urlToSharesEnhance($elements)
	{
		$('button.toggler', $elements).click(function(){
			var b=this;
			$('a',this.parentNode).toggle(0, function(){
				var iconName = (this.style.display=='none'?'plus':'minus');
				b.className=b.className.replace(/(ui-icon-)\w+/, '$1'+iconName);
			});
		});
	}

	/**
	 * @param {String} text Text to transform.
	 * @returns {String} Transformed text.
	 */
	function _urlToShares(text)
	{
		if (text == null) {
			return "";
		}
		var url = text.toString();
		var content = '';
		var addToggle = (_self.configuration.sharesToggle.length ? true : false);
		if (addToggle) {
			content = '<div><button class="toggler" data-icon="plus">'+_self.configuration.sharesToggle+'</button>';
		}
		var contentTpl = ' <a '
				+ (addToggle ? 'style="display:none"' : '')
				+' href="%URL%" target="_blank" '
				+' data-role="button" data-inline="true" '
				//+' data-phonegap-target="InAppBrowser" '
				+' %InAppBrowser%'
				+' data-icon="%PROVIDER-ICON%">%PROVIDER-NAME%</a>';
		var providers = _self.configuration.shareProviders;
		// generate content
		for (var i = 0; i < providers.length; i++) {
			var provider = providers[i];
			var shareUrl = window.internetShare.getShareUrl(provider.id, url);
			var tmpTpl;

			// for InAppBrowser
			if (shareUrl.search(/^http\w*:/) == 0) {	// only if external
				tmpTpl = contentTpl.replace(/%InAppBrowser%/g, _self.configuration.inAppBrowserActionAttribute);
			} else {
				//tmpTpl = contentTpl.replace(/(target="_blank"|%InAppBrowser%)/g, '');
				tmpTpl = contentTpl
						.replace(/target="_blank"/g, 'data-ajax="false"')
						.replace(/%InAppBrowser%/g, '')
				;
			}

			content += tmpTpl
				.replace(/%URL%/g, shareUrl)
				.replace(/%PROVIDER-ICON%/g, provider.icon)
				.replace(/%PROVIDER-NAME%/g, provider.name)
			;
		}
		// footer
		if (addToggle) {
			content += '</div>';
		}
		return content;
	}

	/**
	 * @param {String} text Text to transform.
	 * @param {Object} options {type:'mail/phone'},
	 * @returns {String} Transformed text.
	 */
	function _toLink(text, options)
	{
		// check
		if (text == null) {
			return "";
		}
		var url = text.toString();
		if (url.length < 1) {
			return "";
		}
		// transform
		var contentTpl = '' + _self.configuration.linkTemplates[options.type];
		var content = contentTpl
			.replace(/%InAppBrowser%/g, _self.configuration.inAppBrowserActionAttribute)
			.replace(/%URL%/g, url)
		;
		return content;
	}

	/**
	 * Check if value in dataObject is empty.
	 *
	 * It's empty if:
	 * <li>key is not in dataObject
	 * <li>value is an empty array
	 * <li>value is '' or null or 0 or false or NaN
	 *
	 * @param {String} key
	 * @param {Object} dataObject
	 * @returns {Boolean}
	 */
	function isEmpty(key, dataObject) {
		if (!(key in dataObject)) {
			return true;
		}
		var value = dataObject[key];
		var empty = false;
		if (typeof(value) == 'object' && 'length' in value) {
			empty = (value.length <= 0) == true;
		}
		// note: !'' = true
		else if (!value) {
			empty = true;
		}
		return empty;
	}

	/**
	 * Bind data from object to HTML elements.
	 *
	 * @example Basic binding
	 * 		<span data-binding-key="something"></span>
	 * 		Will be changed to: 
	 * 		<span data-binding-key="something">dataObject['something']</span>
	 *
	 * @example Binding to attribute
	 * 		<a data-binding-key-attribute="url:href" href="#">Item link</a>
	 * 		Will be changed to:
	 * 		<a data-binding-key-attribute="url:href" href="dataObject['url']">Item link</a>
	 *
	 * @example Binding to more attributes in one element
	 * 		<a data-binding-key-attribute="url:href,name:title" href="#">Item link</a>
	 * 		Will be changed to:
	 * 		<a data-binding-key-attribute="url:href,name:title" href="dataObject['url']" title="dataObject['name']">Item link</a>
	 *
	 * @example Hiding
	 * 		<a data-binding-hide-on-empty="url" data-binding-key-attribute="url:href" href="#">Item link</a>
	 * 		Above will be hidden if dataObject['url'] are empty
	 *
	 * @example Hiding when many empty
	 * 		<div data-binding-hide-on-empty="mail,phone">
	 *			<p data-binding-key="mail" data-binding-transform="mailToLink"></p>
	 *			<p data-binding-key="phone" data-binding-transform="phoneToLink"></p>
	 * 		</div>
	 * 		Above will be hidden if _both_ 'mail' and 'phone' fields are empty
	 *
	 * @example Transforms
	 * 		By default escapeHtml tranform is used, but it might be usefull to e.g. output raw HTML
	 * 		<div data-binding-key="htmlNotes" data-binding-transform="raw"></div>
	 * 		Above will NOT transform dataObject['htmlNotes'] and so will allow users to use HTML in notes.
	 *
	 * @param {Object} dataObject Object to be bound to HTML elements.
	 */
	this.bind = function(dataObject)
	{
		$('*[data-binding-key]', baseElement).each(function()
		{
			var key = this.getAttribute('data-binding-key');
			var content = (key in dataObject && typeof(dataObject[key])!='undefined') ? dataObject[key] : '';
			var transformName = this.getAttribute('data-binding-transform');
			// default
			if (!(transformName in _self.configuration.transforms)) {
				transformName = _self.configuration.defaultTransform;
			}
			// if default or choosen transform available then run it
			if (transformName in _self.configuration.transforms) {
				var transform = _self.configuration.transforms[transformName];
				content = transform.transform(content, transform.parameters);
				$this = $(this);
				$this.html(content);
				if (typeof(transform.enhance)=='function') {
					transform.enhance($this, transform.parameters);
				}
				if (transform.insertsHtml) {
					$this.trigger('create');
				}
			// fallback (SHOULD NOT happen)
			} else {
				this.innerHTML = content + '#';
			}
		});
		$('*[data-binding-hide-on-empty]', baseElement).each(function()
		{
			var keys = this.getAttribute('data-binding-hide-on-empty').split(',');
			var areEmpty = true;
			for (var i = 0; i < keys.length; i++) {
				var key = keys[i];
				if (!isEmpty(key, dataObject)) {
					areEmpty = false;
					break;
				}
			}
			if (areEmpty) {
				$(this).hide();
			} else {
				$(this).show();
			}
		});
		$('*[data-binding-key-attribute]', baseElement).each(function()
		{
			// can be CSV
			var mappings = this.getAttribute('data-binding-key-attribute').split(',');
			for (var i = 0; i < mappings.length; i++) {
				var mapping = mappings[i].split(':');
				var key = mapping[0];
				var attribute = mapping[1];

				var content = (key in dataObject) ? dataObject[key] : '';
				this.setAttribute(attribute, content);
			}
		});
	};
}

/**
 * Data binding transform.
 *
 * @param {DataBindingsTransform} options
 *
 * @class {DataBindingsTransform}
 */
function DataBindingsTransform(options)
{
	if (typeof(options) == 'undefined') {
		options = {};
	}
	/**
	 * Extra parameters object passed to transform and enhance functions.
	 * @type Object
	 */
	this.parameters = ('parameters' in options) ? options.parameters : null;
	this.insertsHtml = ('insertsHtml' in options) ? options.insertsHtml : true;
	this.transform = ('transform' in options) ? options.transform : function(content){return content;};
	/**
	 * Enhance function that recives jQuery object with the transformed content.
	 */
	this.enhance = ('enhance' in options) ? options.enhance : null;
}
