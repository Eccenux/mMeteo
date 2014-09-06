<?php
	require_once '../inc/MultiFootersParser.php';
	
	$inputFile = '../../_builds/phonegap-build-bundel/index.html';
	$outputFile = '../../_builds/phonegap-build-bundel/index.test.html';
	$html = file_get_contents($inputFile);
	
	$p = new MultiFootersParser($html);
	$parsed_html = $p->parseDocument();
	file_put_contents($outputFile, $parsed_html);
	
	echo substr($parsed_html, 0, 500);
?>
