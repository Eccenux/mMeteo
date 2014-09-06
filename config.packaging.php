<?php
/**
 * This application extra configuration file.
 *
 * This file is included after basic configuration found in _packaging/config.php
 * If empty default packaging config will be used.
 */

//==========================================
// Your paths
//==========================================
// Android test build (optional)
//$strTestBuildRoot = '_builds/phonegap-android-project/assets/www/';

$strBundleRoot = '_builds/static-bundel/';

//==========================================
// Your packages definitions
//
// Note! Replace only things you wish to change in default configuration.
//==========================================
unset($buildPackages['app']['packages']['index']);
$buildPackages['app']['packages']['common']['src'][] = 'controllers/*';

unset($buildPackages['libs']['packages']['index']);
unset($buildPackages['libs']['packages']['displayCode']);

/*
	Some examples

// append extra source css (`colors.css`) to common css package
$buildPackages['css']['packages']['common']['src'][] = 'colors';

// add extra package named `calc` to CSS packages with output name `package.calc.css` (`css` folder).
// CSS with calc and/or any other poly-senstivie stuff
$buildPackages['css']['packages']['calc'] = array(
	'debug' => true,	// unpack in browser by default
	'dest' => 'css/package.calc.css',
	'src' => array(
		'calc-senstive-rules',
	),
);

// replace source files configuration for `index` package
$buildPackages['app']['packages']['index']['src'] = array(
	// classes and helpers
	'external-libraries/*',
	// session management
	'session/libraries/*',
	'session/controllers/*',
	// other
	'controllers/*',
	'proxies/*',
);
/**/
?>