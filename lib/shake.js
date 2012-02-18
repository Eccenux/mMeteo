/**
	Shake detector for mobile phones and other handheld devices
	
	Copyright (C) 2011 Maciej "Nux" Jaros

	Permission is hereby granted, free of charge, to any person obtaining a copy of
	this software and associated documentation files (the "Software"), to deal in
	the Software without restriction, including without limitation the rights to
	use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
	of the Software, and to permit persons to whom the Software is furnished to do
	so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE.
*/
function shakeDetector(userShakeEventFunction)
{
	/**
		Me
	*/
	var self = this;
	
	/**
		Testing?
	*/
	this.isTesting = true;
	
	/**
		Function to fire when shake occurs
	*/
	this.shakeEventFunction = userShakeEventFunction;

	/**
		class for saving data
	*/
	function timedAcceleration(x)
	{
		this.time = new Date();
		this.x = x;
	}
	
	/**
		config - change this to 
	*/
	this.configuration = {
		negativeTreshold : -3,
		positiveTreshold : 3,
		nextShakeAfter : 1000,		// [miliseconds] time after which a shake could be detected again
		shakeTimeSpan : 3000,		// [miliseconds]
	}
	
	//
	// if no shake function given, then testing assumed
	if (typeof(this.shakeEventFunction) != "function")
	{
		this.isTesting = true;
		$(function(){
			$(document.body).append(''
				+'<pre id="shakeTesting_info" style="border:1px solid black; padding:.5em; margin:1em;">INFO</pre>'
				+'<a href="#" onclick="$(\'#shakeTesting_log\').html(\'\'); shakeCount=0">clear log</a>'
				+'<pre id="shakeTesting_log" style="border:1px solid black; padding:.5em; margin:1em;"></pre>'
			);
		});
		this.shakeEventFunction = function () {};
	}
	
	// prepare base values
	var positiveTimedAccelerationMax = new timedAcceleration (0);
	var negativeTimedAccelerationMax = new timedAcceleration (0);
	var lastShakeTime = new Date ();
	lastShakeTime = new Date (lastShakeTime + self.configuration.nextShakeAfter);	// not waiting at startup
	var shakeCount = 0;	// for testing
	
	$(function(){
		// nie dzia³a
		//$(window).bind("devicemotion", function(event) {self.ondevicemotion(event)});
		//$(window).on("devicemotion", function(event) {self.ondevicemotion(event)});

		// te dzia³aj¹
		if (typeof(window.addEventListener) != 'undefined')
		{
			window.addEventListener("devicemotion", function(event) {self.ondevicemotion(event)}, false);
		}
		else
		{
			window.ondevicemotion = self.ondevicemotion;
		}
	});

	/**
		Shake detection function
	*/
	this.ondevicemotion = function(event)
	{
		var aig = event.accelerationIncludingGravity;
		//$(document.body).html('yo!');
		if (self.isTesting)
		{
			$('#shakeTesting_info').html(''
				+'X: '+aig.x+'\n'
				+'Y: '+aig.y+'\n'
				+'Z: '+aig.z+'\n'
				+'X+: '+positiveTimedAccelerationMax.x+'\n'
				+'X-: '+negativeTimedAccelerationMax.x+'\n'
			);
		}
		
		// wait after a shake
		var curTime = new Date ();
		if (curTime - lastShakeTime < self.configuration.nextShakeAfter)
		{
			//$('#shakeTesting_log').append('Waiting...\n');
			return;
		}
		
		// set variables
		var x = aig.x;
		if (x > 0)
		{
			if (x > positiveTimedAccelerationMax.x)
			{
				positiveTimedAccelerationMax = new timedAcceleration (x);
			}
		}
		else if (x < 0)
		{
			if (x < negativeTimedAccelerationMax.x)
			{
				negativeTimedAccelerationMax = new timedAcceleration (x);
			}
		}
		
		// check treshold
		if (
			   negativeTimedAccelerationMax.x < self.configuration.negativeTreshold
			&& positiveTimedAccelerationMax.x > self.configuration.positiveTreshold
		)
		{
			shakeCount++;
			positiveTimedAccelerationMax = new timedAcceleration (0);
			negativeTimedAccelerationMax = new timedAcceleration (0);
			lastShakeTime = new Date ();
			
			self.shakeEventFunction();
			if (self.isTesting)
			{
				$('#shakeTesting_log').append('' + shakeCount + '. Shaking\n');
			}
		}
		
		// delete old shake data
		if (curTime - positiveTimedAccelerationMax.time < self.configuration.shakeTimeSpan
		 || curTime - negativeTimedAccelerationMax.time < self.configuration.shakeTimeSpan)
		{
			if (self.isTesting)
			{
				$('#shakeTesting_log').append('\n'
					+' cur:'+curTime.ToString()
					+' pos:'+positiveTimedAccelerationMax.time.ToString()
					+' neg:'+positiveTimedAccelerationMax.time.ToString()
				);
			}
			positiveTimedAccelerationMax = new timedAcceleration (0);
			negativeTimedAccelerationMax = new timedAcceleration (0);
		}
	}
}