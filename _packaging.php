<?php
	header("Content-Type: text/plain");
	
	@require_once "./_packaging.class.php";
	$strThisDir = rtrim(dirname(__FILE__), "/\ ");
	$oLoader = new ecSimpleJSLoader($strThisDir);
	
	// package app
	$oLoader->noCache = true;
	$oLoader->isPreserveMultiCommentsWithCopyright = false;
	$oLoader->strBaseModulesName = 'mJqmApplication.';
	$oLoader->strMiniModulesName = 'mJqmApp.mini.js';
	$strMiniFileName = $oLoader->createMiniModules(array(
		'base',
		'utils',
		'storage',
		'forms',
		'utils.geo',
		'i18n',
		'model',
		'controller',
		'setup',
	));
	
	// package libs
	$oLoader->noCache = true;
	$oLoader->isPreserveMultiCommentsWithCopyright = true;
	$oLoader->isRemoveInlineComments = false;
	$oLoader->strBaseModulesName = 'lib\\';
	$oLoader->strMiniModulesName = 'lib\\libs.comb.js';
	$strMiniFileName = $oLoader->createMiniModules(array(
		'jquery.store',
		'jquery.metadata',
		'jquery.validate',
		'form_cr',
		'I18n',
	));
?>