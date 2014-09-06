<?php
	header("Content-Type: text/plain");

	//==========================================
	// Basic configuration
	//==========================================
	include_once 'config.php';

	//==========================================
	// Setup
	//==========================================
	require_once "./inc/SimpleJSLoader.php";
	require_once "./inc/SimpleCSSLoader.php";
	require_once "./inc/FileHelper.php";
	require_once "./inc/MultiFootersParser.php";
	$strBaseScriptDir = rtrim(dirname(dirname(__FILE__)), "/\ ");	// up one dir
	$oLoader = new SimpleJSLoader($strBaseScriptDir);
	$oCSSLoader = new SimpleCSSLoader($strBaseScriptDir);
	$oFileHelper = new FileHelper($strBaseScriptDir);

	// go up to main dir (need this for includes to work in index.php and views)
	chdir("../");

	//==========================================
	// Copy files
	//==========================================
	$oFileHelper->copy('css/images', $strBundleRoot.'css/images', array('#\\.lnk$#', '#\\.bat$#'));
	$oFileHelper->copy('logo', $strBundleRoot.'logo');
	if ($oFileHelper->exists('displayCode.html')) {
		$oFileHelper->copy('displayCode.html', $strBundleRoot.'displayCode.html');
	}
	$oFileHelper->copy($widgetConfigFilePath, $strBundleRoot.$widgetConfigFilePath);
	
	//==========================================
	// HTML & widget config
	//==========================================

	// (re)package HTML
	$oFileHelper->overwriteFile('index.php', $strBundleRoot.'index.html', true);
	
	// static MF parsing
	$mfResult = MultiFootersParser::parseFile($strBundleRoot.'index.html');
	
	// when some dynamic MF was found then prepend the dynamic library from to JQM package
	if ($mfResult & MultiFootersParser::PARSED_FILE_RESULT_SOME_DYNAMIC_MF) {
		array_unshift($buildPackages['jqm']['packages'][0]['src'], 'jquery.mobile.multifooter');
	}
	
	// replace bundle path
	if ($oFileHelper->exists('displayCode.html')) {
		$oFileHelper->replaceInFile('#_builds/[^/]+/#', '', $strBundleRoot.'displayCode.html', true);
	}
	// replace version tag
	$widgetConfig = new SimpleXMLElement(file_get_contents($strBaseScriptDir.'/'.$widgetConfigFilePath));
	$oFileHelper->replaceInFile('${mJ.widget.version}', $widgetConfig['version'], $strBundleRoot.'index.html');

	//==========================================
	// CSS
	//==========================================

	// package CSS
	$oCSSLoader->noCache = true;
	$oCSSLoader->isPreserveMultiCommentsWithCopyright = true;
	$oCSSLoader->isIgnoreLineNumbers = true;
	
	$oCSSLoader->buildPackages($strBundleRoot, $buildPackages['css']);
	
	//==========================================
	// JS
	//==========================================

	// - - - - - - - - - - - - - - - - - - - - -
	// app
	// - - - - - - - - - - - - - - - - - - - - -

	$oLoader->noCache = true;
	$oLoader->isPreserveMultiCommentsWithCopyright = false;
	$oLoader->isRemoveInlineComments = true;
	$oLoader->isIgnoreLineNumbers = true;

	$oLoader->buildPackages($strBundleRoot, $buildPackages['app']);

	// - - - - - - - - - - - - - - - - - - - - -
	// libs
	// - - - - - - - - - - - - - - - - - - - - -

	$oLoader->noCache = true;
	$oLoader->isPreserveMultiCommentsWithCopyright = true;
	$oLoader->isRemoveInlineComments = false;
	$oLoader->isIgnoreLineNumbers = true;

	$oLoader->buildPackages($strBundleRoot, $buildPackages['libs']);
	$oLoader->buildPackages($strBundleRoot, $buildPackages['jqm']);

	// - - - - - - - - - - - - - - - - - - - - -
	// mJappis
	// - - - - - - - - - - - - - - - - - - - - -

	$oLoader->noCache = true;
	$oLoader->isPreserveMultiCommentsWithCopyright = false;
	$oLoader->isRemoveInlineComments = true;
	$oLoader->isIgnoreLineNumbers = true;

	$oLoader->buildPackages($strBundleRoot, $buildPackages['mJappis']);

	//==========================================
	// Copy build to test Android build
	//==========================================
	if (isset($strTestBuildRoot) && $oFileHelper->exists($strTestBuildRoot)) {
		$oFileHelper->copy($strBundleRoot, $strTestBuildRoot, array('#\\.lnk#'),
			array(
				'#[\\/\\\\]plugins$#i',
				'#cordova_plugins\.js$#i',
				'#phonegap\.js$#i',
			)
		);
		// replace bundle path
		$oFileHelper->replaceInFile('#(\\s+id\\s*=\\s*"[^"]+)\\.([^".]+)#i', '$1.pgtest.$2', $strTestBuildRoot.'config.xml', true);
	}
?>