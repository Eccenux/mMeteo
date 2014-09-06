/**
 * jQuery multipage footer
 * 
 * Please add/run this BEFORE running JQM.
 * 
 * Copyright:  ©2012-2013 Maciej "Nux" Jaros
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
	};
	
	//
	// Setup multipage footers (should probably go into jQuery Mobile some day)
	// @note must be run before preparing footer so binding to same thing foot is bound
	$( document ).bind( "pagecreate create", function()
	//$(function()
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
			var allIncluded = includedPages.length ? includedPages : allPages;
			var pages = new Array();
			for (var i = 0; i < allIncluded.length; i++)
			{
				var re = new RegExp('(^| )' + allIncluded[i] + '($| )');
				if (excludedPages.search(re) < 0)
				{
					pages.push(allIncluded[i]);
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
			// Support for exta position types
			var isToBeMovedToBottom = true;
			switch ($(this).attr('data-position'))
			{
				case 'below-content':
					$(this).addClass('ui-body-a');
					$(this).removeAttr('data-role');
					$(this).removeAttr('data-position');
				break;
				case 'below-header':
					//$(this).addClass('ui-body-a');
					$(this).removeAttr('data-role');
					$(this).removeAttr('data-position');
					isToBeMovedToBottom = false;
				break;
			}
			
			//
			// move footer to given pages
			for (var i = 0; i < pages.length; i++)
			{
				if (isToBeMovedToBottom)
				{
					$(this).clone().appendTo('#'+pages[i]);
				}
				else
				{
					$(this).clone().appendTo('#'+pages[i]+' div[data-role|="header"]');
					
				}
			}
			$(this).remove();
		});
	});
})(jQuery);
