<?php
	require_once '../inc/ext/html5lib/Parser.php';
	
	function mini_html_equal() {
		$inputFile = 'test-files/index.mini.html';
		$outputFile = 'test-files/index.out.H5L.html';

		$html = file_get_contents($inputFile);
		
		$document = HTML5_Parser::parse($html);
		$parsed_html = $document->saveXML();
		
		file_put_contents($outputFile, $parsed_html);
		echo substr($parsed_html, 0, 5000);
	}
	
	function mjappis_html_equal() {
		$inputFile = '../../_builds/phonegap-build-bundel/index.html';
		$outputFile = 'test-files/index.mjappis.out.H5L.html';

		$html = file_get_contents($inputFile);
		
		$document = HTML5_Parser::parse($html);
		$parsed_html = $document->saveXML();
		
		file_put_contents($outputFile, $parsed_html);
		echo substr($parsed_html, 0, 5000);
	}

	function mjappis_html_footers_check() {
		$inputFile = '../../_builds/phonegap-build-bundel/index.html';
		$outputFile = 'test-files/index.mjappis.out.H5L.html';

		$html = file_get_contents($inputFile);
		
		$document = new simple_html_dom();
		$document->load($html, false, false);
		$footer = $document->find('div[data-role="multipagefooter"]', 0);
		$pages = $document->find('div[data-role="page"]');
		/*
		foreach ($pages as $page) {
			$page
	}
		*/
		$parsed_html = $document->save($outputFile);
		echo substr($parsed_html, 0, 5000);
	}
	
	mini_html_equal();
	//mjappis_html_equal();
	//mjappis_html_footers_check();
?>