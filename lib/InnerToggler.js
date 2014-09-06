/**
 * This is a generic toggle class.
 *
 * Example override
 * <pre>
	function Map(containerSelector){
		var _class = function() {};
		_class.prototype = new InnerToggler(containerSelector);
		var _ = _class.prototype._getProtected();

		_.onShow = function() {
			var $map = _.$container;
			var latitude = $map.attr('data-latitude');
			var longitude = $map.attr('data-longitude');
			_.$innerContainer.show();
			$mJ.geo.loadMap(latitude, longitude, _.$innerContainer);
		};

		return new _class();
	}
 * </pre>
 * Example usage
 * <pre>
 * </pre>
 *
 * @author Maciej Nux Jaros
 * @license MIT
 *
 * @requires jQuery
 * @provides InnerToggler
 *
 * @param {jQuery} $ The jQuery object.
 * @param {Object} namespace <del>InnerToggler namespace (by default window)</del>. Ignored for now... Netbeans doesn't understand :-(
 */
(function($, namespace) {


/**
 * Map loader helper.
 *
 * @param {String} containerSelector Container to which toggled element will be appended.
 * @returns {InnerToggler}
 */
window.InnerToggler = function (containerSelector){
// Netbeans doesn't understand :-(
// namespace.InnerToggler = function (containerSelector){
	var _self = this;

	/**
	 * @protected :-)
	 * 
	 * @type Object
	 */
	var _ = {
		'containerSelector': containerSelector,
		'$container': null,
		'$innerContainer': null,
		/**
		 * Hides inner container.
		 */
		'onHide': null,
		/**
		 * Shows inner container.
		 */
		'onShow': null
	};

	/**
	 * Use when extending this class to get some protected values.
	 */
	this._getProtected = function() {
		return _;
	};
	/**
	 * Use when extending this class to override a single protected values.
	 * @param {String} key
	 * @param {mixed} value
	 * @returns {undefined}
	 */
	this._setProtected = function(key, value) {
		_[key] = value;
	};

	/**
	 * Init. element variables.
	 * @param {Element|jQuery} allContainer e.g. page.container
	 * @returns {InnerToggler}
	 */
	this.initElements = function (allContainer){
		_.$container = $(_.containerSelector, allContainer);
		if (!_.$container.has(".inner-container").length) {
			_.$container.append('<div class="inner-container"/>');
		}
		_.$innerContainer = _.$container.find(".inner-container");
		return this;
	};

	var state = 'hide';
	/**
	 * Show or hide inner container.
	 *
	 * @param {Boolean} show [optional] defaults to true.
	 * @returns {InnerToggler}
	 */
	this.show = function (show) {
		state = (typeof(show)=='undefined' || show) ? 'show' : 'hide';
		if (state=='hide') {
			_.onHide();
		} else {
			_.onShow();
		}
		return this;
	};
	/**
	 * Hide.
	 *
	 * @param {Boolean} show
	 * @returns {InnerToggler}
	 */
	this.hide = function () {
		this.show(false);
		return this;
	};
	/**
	 * Toogle visiblity.
	 * @returns {InnerToggler}
	 */
	this.toggle = function () {
		if (state=='hide') {
			_self.show(true);
		} else {
			_self.show(false);
		}
		return this;
	};

	_.onHide = function() {
		_.$innerContainer.hide();
	};
	_.onShow = function() {
		_.$innerContainer.show();
	};
};

})(jQuery, window);