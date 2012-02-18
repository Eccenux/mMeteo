/**
 * jQuery multipage
 * 
 * Authors: Maciej Jaros
 * Web: http://enux.pl/
 * 
 * Licensed under:
 *   MIT License http://www.opensource.org/licenses/mit-license
 *
 */

(function($,undefined){

	var arrayClone = function(source)
	{
		var destination = [];
		for (var i = 0; i < source.length; i++)
		{
			destination[i] = source[i];
		}
		return destination;
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
			var pages = arrayClone(includedPages.length ? includedPages : allPages);	// clone to avoid changes in allPages array
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
