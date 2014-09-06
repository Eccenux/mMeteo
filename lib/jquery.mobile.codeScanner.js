/**
 * codeScanner input element.
 *
 * Code to add to CSS if you add a type="number" to your input:
 *		.ui-input-codeScanner input[type=number]::-webkit-inner-spin-button,
 *		.ui-input-codeScanner input[type=number]::-webkit-outer-spin-button {
 *			-webkit-appearance: none;
 *			margin: 0;
 *		}
 *		
 * This should work with JQM 1.4 and above (hopefully)... See revision history for JQM 1.0 compatible version.
 *
 * Parts of this code are borrowed from JQM code for mobile input (most from the code used to create a search input).
 *
 * <del>For now assuming codes are more or less numeric.</del> Removed mapping input to number.
 *
 * See also:
 * http://www.hiddentao.com/archives/2011/11/07/how-to-write-a-custom-widget-for-jquery-mobile/
 *
 * @param {jQuery} $
 * @param {CodeScanner} codeScanner Code scanner mock.
 */
(function( $, codeScanner ) {

$.widget( "mobile.codeScanner", $.mobile.textinput, {
	initSelector: "input[type='codeScanner'],input[data-type='codeScanner']",

	options: {
		buttonText: 'scan',			// can be changed from attr: data-button-text
		buttonIcon: 'action'		// can be changed from attr: data-button-icon
	},

	_create: function() {
		var options = this.options,
			$input = this.element;

		// read some options from data attributes
		options.buttonText = $input.jqmData("button-text") || options.buttonText;
		options.buttonIcon = $input.jqmData("button-icon") || options.buttonIcon;
		
		this._super();

		// will render as input with scan button only if scanner is available
		// so must init and check...
		codeScanner.init();

		if ( codeScanner.scannerAvailable ) {
			this._addClearBtn();
		}
	},

	// replacing to add custom icon and text
	clearButton: function() {
		return $( "<a href='#' class='ui-input-clear ui-btn ui-icon-" + this.options.buttonIcon + " ui-btn-icon-notext ui-corner-all" 
				+ "' title='" + this.options.buttonText + "'>" + this.options.buttonText + "</a>" );
	},

	// replacing for custom action
	_clearBtnClick: function( event ) {
		var $input = this.element;

		codeScanner.scan(
			/**
			 * @param {CodeScannerResult} results
			 * @returns {undefined}
			 */
			function (results) {
				$input.val( results.text )
					.focus()
					.trigger( "change" )
				;
				event.preventDefault();
			}
		);

		event.preventDefault();
	},
	
	// replacing to remove unwanted events
	_addClearBtn: function() {

		if ( !this.options.enhanced ) {
			this._enhanceClear();
		}

		$.extend( this, {
			_clearBtn: this.widget().find("a.ui-input-clear")
		});
		
		// just click/tap
		this._on( this._clearBtn, {
			"tap": "_clearBtnClick"
		});
	},

	// replacing to add codeScanner class
	_wrap: function() {
		var $input = this.element;
		
		// already wrapped? => just add our class
		// (happens when `data-type='codeScanner'` is used instead of of `type` attribute)
		if ($input.attr("type") == "text") {
			$input[0].parentNode.className += " ui-input-codeScanner";
			return "";
		}
		
		return $( "<div class='" +
			( codeScanner.scannerAvailable ? "ui-input-codeScanner ui-input-text " : "ui-input-text " ) +
			this.classes.join( " " ) + " " +
			"ui-shadow-inset'></div>" );
	}
});

})( jQuery, window.codeScanner );
