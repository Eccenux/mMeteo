/**
 * Controller ignorance for mJappis / JQM.
 *
 * @author Maciej Nux Jaros
 * @license MIT
 *
 * Skipping controllers works in a following way:
 * 1. start page (non-ignored) => run start controller
 * 2. menu page (ignored) => run menu controller (if avialable)
 * 3. start page (was on ignored page) => DO NOT run start controller
 *
 * So if you only visit ignored pages and go back then you will only run controller onece.
 * Open menu and close it as many times as you want.
 *
 * But if you move to a different page...
 * 1. start page (non-ignored) => run start controller
 * 2. menu page (ignored) => run menu controller (if avialable)
 * 3. settings page (non-ignored, different page) => WILL run settings controller
 *
 * Also if you move to the same it's expected to be refreshed. Consider this sequence:
 * 1. start page => run start controller
 * 2. menu page  => run menu controller (if avialable)
 * 3. start page => DO NOT run start controller
 * 4. menu page  => run menu controller (if avialable)
 * 5. start page => DO NOT run start controller
 * 6. start page => run start controller
 *
 * @note More behaviour examples in ControllerIgnorance.dia
 *
 * @requires jQuery
 * @requires Logger
 * @provides controllerIgnorance
 *
 * @param {jQuery} $ The jQuery object.
 */
(function($) {

window.controllerIgnorance = new ControllerIgnorance();

/**
 * History details item
 * @param {String} hash Hash for controller.
 * @param {String} controller Name of the controller.
 * @param {Boolean} viewOnlyVisit Set to true if view-only view is being visited (i.e. no changes or non-crucial changes are made).
 * @returns {HistoryDetails}
 */
function HistoryDetails(hash, controller, viewOnlyVisit) {
	this.hash = hash;
	this.controller = controller;
	this.viewOnlyVisit = viewOnlyVisit;
}

function ControllerIgnorance() {
	var LOG = new Logger('ControllerIgnorance');
	LOG.enabled = false;

	/**
	 * Names of controllers already run.
	 * @type Array
	 */
	var runHistory = [];
	/**
	 * Names of controllers already run.
	 * @type Object {controllerName:new HistoryDetails()}
	 */
	var runHistoryDetails = {};
	/**
	 * Last change details.
	 * @type HistoryDetails
	 */
	var lastChangeView = null;

	/**
	 * Clear visit history.
	 * 
	 * Use to indicate a change was made and any previous history should be ignored.
	 */
	this.clear = function() {
		runHistory = [];
		runHistoryDetails = {};
	};

	/**
	 * Appends visit to the list.
	 *
	 * @param {String} hash Hash for controller.
	 * @param {String} controller Name of the controller.
	 * @param {Boolean} viewOnlyVisit Set to true if view-only view is being visited (i.e. no changes or non-crucial changes are made).
	 * @returns {Boolean} true if the visit requires running a controller.
	 */
	this.appendVisit = function(hash, controller, viewOnlyVisit) {
		var runCurrent = false;
		var currentDetails = new HistoryDetails(hash, controller, viewOnlyVisit);

		// check if we have controller in run history
		var runIndex = $.inArray(controller, runHistory);
		if (runIndex < 0) {
			runCurrent = true;
		}
		// check if we have hash in run history
		else if (controller in runHistoryDetails) {
			// run if hash is different
			if (currentDetails.hash != runHistoryDetails[controller].hash) {
				runCurrent = true;
			}
		}
		// append history if we are running the controller
		if (runCurrent)
		{
			// if we are running new change-view we must clear history
			if (!viewOnlyVisit && lastChangeView != null && lastChangeView.hash != currentDetails.hash)
			{
				this.clear();
			}
			runHistory.push(controller);
			runHistoryDetails[controller] = currentDetails;
		}
		// save change view
		if (!viewOnlyVisit) {
			lastChangeView = currentDetails;
		}
		LOG.info('runCurrent?: ', runCurrent);
		LOG.info('runHistory: ', runHistory.join(','));
		LOG.info('runHistoryDetails: ', runHistoryDetails);
		LOG.info('currentDetails: ', currentDetails);
		return runCurrent;
	};
}
})(jQuery);