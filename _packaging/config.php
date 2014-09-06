<?php
/**
 * Basic configuration file.
 *
 * This file is used both in packaging.php and ../index.php
 */
date_default_timezone_set('Europe/Paris');

//==========================================
// Your paths
//==========================================
// Output path (relative to $strBaseScriptDir)
$strBundleRoot = '_builds/phonegap-build-bundel/';
// PhoneGap widget config file path (relative to $strBaseScriptDir)
$widgetConfigFilePath = 'config.xml';
// Android test build (optional)
//$strTestBuildRoot = '_builds/phonegap-android-project/assets/www/';

//==========================================
// Your packages definitions
//
// 'srcBase' can be both name prefix and common path to source files
// 'dest' is relative to $strBundleRoot
// 'src' is relative to base directory (where index.php is) and prefixed with 'srcBase'
//==========================================
$buildPackages = array(
	// - - - - - - - - - - - - - - - - - - - - -
	// CSS
	// - - - - - - - - - - - - - - - - - - - - -
	'css' => array(
		'srcBase' => 'css/',
		'packages' => array(
			// commons CSS
			'common' => array(
				'debug' => true,	// unpack in browser by default
				'dest' => 'css/package.css',
				'src' => array(
					// mJ core
					'jquery.mobile-min',
					'mJappisApplication',
					// mJ optional
					'extra-icons',
				),
			),
		),
	),

	// - - - - - - - - - - - - - - - - - - - - -
	// app
	// - - - - - - - - - - - - - - - - - - - - -
	'app' => array(
		'srcBase' => 'app/',
		'packages' => array(
			// application build (common including i18n and model)
			'common' => array(
				'debug' => true,	// unpack in browser by default
				'dest' => 'package.app.js',
				'src' => array(
					'i18n/*',
					'*', // note `*` means all JS files (does not include subdirs)
				),
			),
			// application extra for index (e.g. controllers, proxies and other helpers)
			'index' => array(
				'debug' => true,	// unpack in browser by default
				'dest' => 'package.app.index.js',
				'src' => array(
					// other
					'controllers/*',
				),
			),
		),
	),

	// - - - - - - - - - - - - - - - - - - - - -
	// libs
	// - - - - - - - - - - - - - - - - - - - - -
	'libs' => array(
		'srcBase' => 'lib/',
		'packages' => array(
			// common
			'common' => array(
				'dest' => 'package.libs.js',
				'src' => array(
					// mJ core
					'logger',
					'json2',
					'cycle',
					'base/jquery-min',
					'jquery.store',
					'jquery.metadata',
					'jquery.validate',
					'form_cr',
					'I18n',
					'ControllerIgnorance',
					// mJ optional (but advised)
					'share', 'dataBindings',
					'SimpleCssParser', 'polycalc', // 'jquery.ba-resize',
					'jquery.mobile.autocomplete',
					'InnerToggler',
				),
			),
			// extra for index
			'index' => array(
				'dest' => 'package.libs.index.js',
				'src' => array(
					// mJ extras
					'codeScanner',
					'GeoCalc',
					// WebCompass
					'CompassInBrowser',
					'CompassMock',
					'CompassHelper',
					'jQueryRotateCompressed',
				),
			),
			// extra for displayCode
			'displayCode' => array(
				'dest' => 'package.libs.displayCode.js',
				'src' => array(
					'jquery.qrcode',
					'barcode',
				),
			),
		),
	),

	// - - - - - - - - - - - - - - - - - - - - -
	// mJappis
	// - - - - - - - - - - - - - - - - - - - - -
	'mJappis' => array(
		'srcBase' => 'mJappisApplication.',
		'packages' => array(
			// common
			array(
				'dest' => 'package.mj.js',
				'src' => array(
					// mJ core
					'base',
					'utils',
					'storage',
					'forms',
					'setup',
					'controller._base',
					// mJ optional
					'utils.geo',
				),
			),
		),
	),

	// - - - - - - - - - - - - - - - - - - - - -
	// jQuery Mobile
	// - - - - - - - - - - - - - - - - - - - - -
	'jqm' => array(
		'srcBase' => 'lib/',
		'packages' => array(
			// jquery mobile and it's extensions
			array(
				'dest' => 'package.jqm.js',
				'src' => array(
					'base/jquery.mobile-min',
					'jquery.mobile.codeScanner',
				),
			),
		),
	),
);

$strUserConfigDir = rtrim(dirname(dirname(__FILE__)), "/\ ");	// up one dir
include $strUserConfigDir.'/config.packaging.php';
?>