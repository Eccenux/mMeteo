<?php
	header("Content-Type: text/plain");
	
	@require_once "./_packaging.class.php";
	$strThisDir = rtrim(dirname(__FILE__), "/\ ");
	$oLoader = new ecSimpleJSLoader($strThisDir);
	
	// package app
	$oLoader->noCache = true;
	$oLoader->isLeaveMultiCommentsWithCopyright = true;
	$oLoader->strBaseModulesName = 'mJqmApplication.';
	$oLoader->strMiniModulesName = 'mJqmApp.mini.js';
	$strMiniFileName = $oLoader->createMiniModules(array(
		 'base'
		,'utils'
		,'utils.geo'
		,'i18n'
		,'storage'
		,'model'
		,'controller'
		,'setup'
		,'forms'
	));
	
	// package libs
	$oLoader->noCache = true;
	$oLoader->isLeaveMultiCommentsWithCopyright = false;
	$oLoader->isRemoveInlineComments = false;
	$oLoader->strBaseModulesName = 'lib\\';
	$oLoader->strMiniModulesName = 'lib\\libs.comb.js';
	$strMiniFileName = $oLoader->createMiniModules(array(
		 'jquery.store'
		,'jquery.metadata'
		,'jquery.validate'
		,'form_cr'
		,'I18n'
	));
?>