/**
	@file Barcode generation classes

    Copyright:  ©2011 Maciej Jaros (pl:User:Nux, en:User:EcceNux)
      License:  GNU General Public License v2
                http://opensource.org/licenses/gpl-license.php
*/

/**
	Barcode draw class
	
	@param sCanvasId A canvas element ID (some div)
*/
function barcodeDraw(sCanvasId)
{
	//! variable containing an object of the class
	//! @access private
	var _this = this;

	//! interleaved 2/5 specific digit encoding
	//! n - narrow line, w - wide line
	//! N or W - black bar
	//! n or w - white bar
	//! @access private
	var aDigits = ["nnwwn","wnnnw","nwnnw","wwnnn","nnwnw","wnwnn","nwwnn","nnnww","wnnwn","nwnwn"];
	//! interleaved 2/5 start code
	//! @access private
	var sStart = "NnNn";
	//! interleaved 2/5 stop code
	//! @access private
	var sStop = "WnN";
	//! interleaved 2/5 narrow bar width
	//! @access private
	var nNWidth = 2;
	//! interleaved 2/5 wide bar width (in most cases should be nNWidth * 2)
	//! @access private
	var nWWidth = 4;
	//! units used - note that if "pt" is used the code might not look as it should before printing
	//! @access private
	var sWidthUnit = "px";
	//! margin width
	//! @access private
	var nMarginWidth = (5 * nNWidth);
	//! current position (for the next bar to be drawn)
	//! @access private
	var nCurPos = 0;
	//! html drawing object
	//! @access private
	var hDraw = null;
	//! true if drawing functions can already be used
	//! @access private
	var isDrawReady = true;
	
	//! height of a bar
	//! @access public
	this.sHeight = "60px";
	
	//! Canvas element ID
	//! @access private
	//var sCanvasId = sCanvasId;

	/**
		Normalize digits string
		
		Can be used for displaing an actual number that was encoded

		@access public
	*/
	this.decNormalize = function (sNum)
	{
		// remove non-digits and add leading 0 if needed
		sNum = sNum.replace(/[^0-9]+/, "");
		if (sNum.length % 2 == 1)
		{
			sNum = "0" + sNum;
		}
		return sNum;
	};

	/**
		Shuffles two strings
		
		Strings get shuffled character by character
		e.g. "aaa", "bbb" becomes "ababab"

		@access public
		@return shuffled string
	*/
	this.strShuffle = function (s1, s2)
	{
		var s = "";
		for (var i = 0; i < s1.length; i++)
		{
			s += s1.charAt(i);
			if (i < s2.length)
				s += s2.charAt(i)
			;
		}
		if (s2.length > s1.length)
		{
			s += s2.substring(s1.length);
		}
		
		return s;
	};

	/**
		Draw a given number as a barcode
		
		@param sNumber String representation of the number
		@param bAddNumberText if true number will be visible on the resulting "picture"
		
		@access public
	*/
	this.drawNumber = function (sNumber, bAddNumberText)
	{
		drawInit();
		// normalize
		if (typeof(sNumber) != 'string')
		{
			sNumber = sNumber.toString();
		}
		sNumber = _this.decNormalize(sNumber);
		// encode
		var sCodeStr = decToCode(sNumber);
		// draw bars
		for (var i=0; i < sCodeStr.length; i++)
		{
			drawNext(sCodeStr.charAt(i));
		}
		// fit canvas to code
		hDraw.setWidth((nCurPos + nMarginWidth) + sWidthUnit);
		// draw num as text
		if (bAddNumberText)
		{
			hDraw.bottomText(sNumber);
		}
	};

	/**
		Converts digits string to a code string
		
		@note digits string is normalized (0 is added when necesary and non-digits are removed)
		
		@access private
	*/
	function decToCode(sNum)
	{
		// remove non-digits and add leading 0 if needed
		sNum = _this.decNormalize(sNum);
		
		// create code string
		var sCode = sStart;
		for (var i = 0; i < sNum.length; i += 2)
		{
			sCode += _this.strShuffle(aDigits[sNum.charAt(i)].toUpperCase(), aDigits[sNum.charAt(i+1)].toLowerCase());
		}
		sCode += sStop;
		
		return sCode;
	}

	/**
		Drawing initialization
		
		@access private
	*/
	function drawInit()
	{
		// clear or init drawing region
		if (hDraw==null)
		{
			hDraw = new htmlDraw(sCanvasId);
		}
		else
		{
			hDraw.clear();
		}
		// init variables
		nCurPos = nMarginWidth;	// this is a start margin
		isDrawReady = true;
	}

	/**
		Draw next wide or next short bar
		
		@param sCode An internal code for drawing white/black bars

		@access private
	*/
	function drawNext(sCode)
	{
		if (!isDrawReady)
		{
			drawInit();
		}
		var nWidth = sCode.toLowerCase() == "w" ? nWWidth : nNWidth;
		var sWidth = nWidth + sWidthUnit;
		var sColor = (sCode.toLowerCase() == sCode ? "white" : "black");
		if (sColor != "white")	// ignore white (white background assumed)
			hDraw.vertLine (nCurPos + sWidthUnit, 0, sWidth, sColor);
		nCurPos += nWidth;
	}
}

/**
	General drawing class
*/
function htmlDraw(sCanvasId)
{
	//! variable containing an object of the class
	//! @access private
	var _this = this;

	//! canvas element
	//! @access private
	var elCanvas = null;

	/**
		Init canvas when needed
		
		@access private
	*/
	function init()
	{
		if (elCanvas == null)
		{
			elCanvas = document.getElementById(sCanvasId);
			if (!elCanvas)
			{
				throw ("Drawing region not ready! You must start drawing after loading the page.");
			}
			elCanvas.style.cssText = "position:relative";
		}
	}

	/**
		Clear canvas
		
		@access public
	*/
	this.clear = function ()
	{
		if (elCanvas == null)
		{
			init();
		}
		while (elCanvas.childNodes.length > 0)
			elCanvas.removeChild(elCanvas.firstChild)
		;
	};

	/**
		Draw a vertical line
		
		@access public
	*/
	this.vertLine = function (sLeft, sTop, sWidth, sColor)
	{
		if (elCanvas == null)
		{
			init();
		}
		var nel = document.createElement("div");
		nel.className = "vertline";
		nel.style.cssText = "position:absolute; left:"+sLeft+"; top:"+sTop+"; border-left: "+sWidth+" solid "+sColor;
		
		elCanvas.appendChild(nel);
	};

	/**
		Set width of the canvas
		
		@access public
	*/
	this.setWidth = function (sWidth)
	{
		if (elCanvas == null)
		{
			init();
		}
		elCanvas.style.width = sWidth;
	};

	/**
		Draw text aligned to bottom center
		
		@access public
	*/
	this.bottomText = function (sText)
	{
		if (elCanvas == null)
		{
			init();
		}
		var nel = document.createElement("div");
		nel.className = "bottomtext";
		nel.style.cssText = "text-align:center; position:absolute; bottom:0; left:0; z-index:1; width:100%";
		var sub = document.createElement("span");
		sub.innerHTML = sText;
		sub.style.cssText = "background-color:white; display:inline-block; margin:0 auto;";
		
		nel.appendChild(sub);
		elCanvas.appendChild(nel);
	};
}