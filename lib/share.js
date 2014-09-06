/**
 * Simple internet shares.
 *
 * Author: Maciej Jaros
 * Web: http://enux.pl/
 *
 * Licensed under
 *   MIT License http://www.opensource.org/licenses/mit-license
 *   GPL v3 http://opensource.org/licenses/GPL-3.0
 *
 * @class {InternetShare}
 */
function InternetShare()
{
	/**
	 * Me.
	 * @type InternetShare
	 */
	var _self = this;

	/**
	 * Configuration.
	 *
	 * @type Object
	 */
	this.configuration = {
		/**
		 * Configuration for sharing links.
		 *
		 * Facebook feed share:
		 * https://developers.facebook.com/docs/reference/dialogs/feed/
		 * Simple sharer info:
		 * https://developers.facebook.com/docs/reference/plugins/share-links/
		 *
		 * @type Object
		 */
		urlShares : {
			facebook : 'https://www.facebook.com/sharer/sharer.php?u=%URL%',
			twitter : 'https://twitter.com/intent/tweet?url=%URL%',
			google : 'https://plus.google.com/share?url=%URL%',
		}
	};

	/**
	 * Get an URL to open when sharing another URL.
	 *
	 * @param {String} provider Provider name (one of the ones defined in configuration.urlShares)
	 * @param {String} url Url to share
	 * @returns {String} URL which can be opened e.g. in new widnow.
	 */
	this.getShareUrl = function(provider, url) {
		var shareUrl = '';
		if (provider in _self.configuration.urlShares) {
			shareUrl = _self.configuration.urlShares[provider];
		} else {
			shareUrl = 'mailto:?body=%URL%';
		}
		return shareUrl.replace('%URL%', encodeURIComponent(url));
	};
};
window.internetShare = new InternetShare();