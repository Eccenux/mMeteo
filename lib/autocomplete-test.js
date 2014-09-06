$( document ).on( "pageinit", "#page-search", function() {
	var LOG = new Logger('autocomplete');
	LOG.info('pageinit');

	var autocomplete = new AutocompleteHelper($,
		$("#page-search .autocomplete"),
		$("#page-search [name=query]"),
		$("#page-search [name=query] + .ui-input-clear"),
		deferredGet
	);
	function deferredGet(text)
	{
		return $.ajax({
			url: "http://gd.geobytes.com/AutoCompleteCity",
			dataType: "jsonp",
			crossDomain: true,
			data: {
				q: text
			}
		});
	}
});