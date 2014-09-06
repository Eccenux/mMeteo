<?
	/**
	 * @file Attempts to cut nicely formatted HTML into views
	 * 
	 * Any leftovers are put into *.leftovers file.
	 */

	/**
	 * Replace first occurance of a search string.
	 * http://stackoverflow.com/questions/1252693/php-str-replace-that-only-acts-on-the-first-match#answer-2606638
	 */
	function str_replace_first($search, $replace, $subject) {
		$pos = strpos($subject, $search);
		if ($pos !== false) {
			$subject = substr_replace($subject, $replace, $pos, strlen($search));
		}
		return $subject;
	}

	function parseViewMatches($matches) {
		global $viewNumber;
		$commentPrefix = $matches[1];	// might containt more then needed...
		$content = $matches[2];
		$name = $matches[3];
		
		// leave only last comment
		$commentPrefix = preg_replace('#[\s\S]+<!--#', '<!--', $commentPrefix);
		
		// final view content and leftovers
		$content = $commentPrefix.$content;
		$leftovers = str_replace_first($content, '', $matches[0]);
		$viewNumber++;
		$viewFile = "views/".sprintf('%02d', $viewNumber).".$name.html";
		
		// save
		echo "\nFound view with id \"page-$name\". Saving to \"$viewFile\".";
		file_put_contents($viewFile, $content);
		
		return $leftovers;
	}

	//
	// Parse all HTML files in current directory.
	//
	$viewNumber = 0;
	foreach(glob('*.html') as $views) {
		//$viewId = preg_replace('#.+/(.+?)\.html#i', 'page-$1', $view);
		//echo "\n".$view.": ".$viewId;
		$html = file_get_contents($views);
		$html = preg_replace_callback(
			'#((?:<!--[\s\S]+?-->\s*)?)(<div[^<>]+id="page-(.*?)"[^<>]*>[\s\S]+?\n</div>(?:\s*<!--[\s\S]+?-->)?)#',
			'parseViewMatches',
			$html
		);
		file_put_contents($views.".leftovers", $html);
		//
	}
?>