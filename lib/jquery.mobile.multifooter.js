/**
 * jQuery multipage footer
 * 
 * Copyright:  ©2012 Maciej "Nux" Jaros
 *   License:  MIT License http://www.opensource.org/licenses/mit-license
 *       Web:  http://enux.pl/
 *
 */

(function($,undefined){

	/**
		Clone an array
		
		@param source Object to be cloned
		@return Cloned object (related only by value)
	*/
	var _arrayClone = function(source)
	{
		return $.extend(true, [], source);
	}
	
	//
	// Setup multipage footers (should probably go into jQury Mobile some day)
	//
	$(function()
	{
		var allPages = [];
		$('div[data-role|="page"]').each(function()
		{
			allPages.push(this.id);
		});
		$('div[data-role|="multipagefooter"]').each(function(footerIndex)
		{
			//
			// get and parse attributes
			var excludedPages = $(this).attr('data-footer-pages-exclude');
			var includedPages = $(this).attr('data-footer-pages-include');
			/*
			if (excludedPages && excludedPages.length)
			{
				excludedPages = excludedPages.split(" ");
			}
			else excludedPages = [];
			*/
			if (typeof(excludedPages) != 'string')
			{
				excludedPages = '';
			}
			if (includedPages && includedPages.length)
			{
				includedPages = includedPages.split(" ");
			}
			else includedPages = [];
			
			//
			// get pages list for this footer
			var pages = _arrayClone(includedPages.length ? includedPages : allPages);	// clone to avoid changes in allPages array
			for (var i = 0; i < pages.length; i++)
			{
				var re = new RegExp('(^| )' + pages[i] + '($| )');
				if (excludedPages.search(re) >= 0)
				{
					pages.splice(i, 1);
				}
			}
			
			//
			// assure data-id is given and change data-role
			$(this).attr('data-role', 'footer');
			if (!$(this).attr('data-id'))
			{
				$(this).attr('data-id', 'multipagefooter' + footerIndex.toString());
			}
			
			//
			// move footer to given pages
			for (var i = 0; i < pages.length; i++)
			{
				$(this).clone().appendTo('#'+pages[i]);
			}
			$(this).remove();
		});
	});
})(jQuery);
