/**
	@file mJappisApplication setup of controllers mapping and general initialization

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
	$mJ.setup = {};

	var LOG = new Logger('mJ.setup');
	var lang = 'pl';
	
	// Standard full setup
	$mJ.setup.full = function()
	{
		$mJ.setup.basics();
		$mJ.setup.validation();
		$mJ.setup.navigation();
		$mJ.setup.controllers();
		$mJ.setup.jqm();
	};

	/**
	 * Basics - storage and i18n.
	 */
	$mJ.setup.basics = function()
	{
		// Setup storage
		$mJ.storage.init();
		
		// Setup JS i18n
		// (see below for HTML setup)
		lang = $mJ.storage.get('settings.language');
		$mJ.i18n = new I18n($mJ.i18n, lang);
		
		// on-ready init
		$(function()
		{
			//
			// Setup i18nalized HTML
			// remove all elements marked with language attribute that is different then current
			$('*[data-lang]').each(function(){
				if (lang != this.getAttribute('data-lang')) {
					this.parentNode.removeChild(this);	// remove so that e.g. JQM will not add strings to title
				}
			});
			// other HTML content not setup in controllers
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

			// turn of transitions in HTML when user turn them of in settings
			if ($mJ.storage.get('settings.pageTransitions') == 'none') {
				$('*[data-transition]').each(function()
				{
					this.removeAttribute('data-transition');
				});
			}
		});
	};
	
	/**
	 * Setup validation.
	 */
	$mJ.setup.validation = function()
	{
		$.extend($.validator.messages, $mJ.i18n.get("validator-messages"));
		$.metadata.setType('html5');
	};

	/**
	 * Searches up the tree for a JQM page.
	 * @param {Element} element
	 * @returns {Element} found page or null if no parent page could be found.
	 */
	function findParentPage(element) {
		do {
			var parent = element.parentNode;
			if (parent && parent.getAttribute('data-role') === 'page') {
				return parent;
			}
		} while(parent);
		return null;
	}

	/**
	 * Setup Main Navigation.
	 */
	$mJ.setup.navigation = function()
	{
		$(function()
		{
			//
			// Format
			//
			// @note MUST be done after i18n keys setup (because they insert HTML)
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
			// Position settings
			//
			switch ($mJ.storage.get('settings.mainNaviPosition'))
			{
				default:
				case 'bottom-fixed':
					// should already be OK.
				break;
				case 'below-content':
					$('*[data-id|="main-navi"]').each(function()
					{
						var $navi = $(this);
						$navi.attr('data-position', 'below-content');
						// dynamic postion setup was static and must be re-done manually
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
						// dynamic postion setup was static and must be re-done manually
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
	
	/**
	 * Run controller based on new hash.
	 *
	 * @note To ignore visits to some pages (e.g. menu) use data-ignore-visit="true" attribute.
	 * @note To force non-ignoring visit from some location use "ignore-visit=false" in parameters.
	 *
	 * To see how skippig controllers works see ControllerIgnorance library.
	 */
	function runController(newPageHash)
	{
		// get controller name and parameters
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

		// ignore controller if returning from some pages (e.g. menu)
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

		// run controller
		if (controllerName.length && typeof($mJ.controller[controllerName]) == 'function')
		{
			$(function () {
				$mJ.controller[controllerName](parameters);
			});
		}
	}

	// marker for initial load
	var initialLoad = true;

	/**
	 * Setup controllers.
	 */
	$mJ.setup.controllers = function()
	{
		//
		// Setup page transitions to controllers mapping
		//
		$(document).bind( "pagebeforechange", function( e, data )
		{
			//LOG.info('navigation data: ', data);
			
			var newPageHash = '';
			// standard navigation
			if ( typeof data.toPage === "string" ) {
				// dialog leftovers...
				if (data.toPage.search(/#&ui-state=dialog$/) >= 0) {
					// redir to start page
					location.hash = '#'+$('[data-role="page"]')[0].id;
					return;
				}
				newPageHash = $.mobile.path.parseUrl( data.toPage ).hash;
				initialLoad = false;
				// make sure we have hash...
				if (newPageHash.length == 0) {
					newPageHash = '#'+$('[data-role="page"]')[0].id;
				}
				runController(newPageHash);
			}
			// start page - when no hash is given JQM has jQ element array in toPage and undefined in absUrl
			else if ( initialLoad
					&& typeof data.toPage === "object" && data.toPage.length && 'id' in data.toPage[0] ) {
				newPageHash = '#' + data.toPage[0].id;
				// insert in history (and redirect) to avoid inconsistent behaviour...
				location.hash = newPageHash;
				initialLoad = false;
				// seem to be needed for multi-footer...
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

	/**
	 * Startup settings for jquery mobile.
	 */
	$mJ.setup.jqm = function()
	{
		$(document).bind("mobileinit", function()
		{
			// i18n in settings
			if (lang == "pl")
			{
				$.mobile.filterable.prototype.options.filterPlaceholder = "Filtruj listę...";
			}

			// animation on page change
			$.mobile.defaultPageTransition = $mJ.storage.get('settings.pageTransitions');
			//$.mobile.fallbackTransition.slideout = "none";	// transition for non-3D animation enabled browser
			
			// @note: removed after JQM 1.4 update
			// @todo TEST me after update
			/*
			// footer fixation (not working: about -> tap on the page -> open sub-collapsed section)
			if ($mJ.storage.get('settings.mainNaviPosition') == 'bottom-fixed')
			{
				$.mobile.touchOverflowEnabled = true;
				$.mobile.fixedToolbars.setTouchToggleEnabled(false);
			}
			*/
		});
	};
	
})(jQuery, window.mJappisApplication);