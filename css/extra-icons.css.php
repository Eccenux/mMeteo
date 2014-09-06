<?php

	$pv_tpls = array(
		'svg-white' => '.ui-icon-$1:after {background-image: url("images/extra/$1-white.svg")}',
		'png-white' => '.ui-nosvg .ui-icon-$1:after {background-image: url("images/extra/png/$1-white.png")}',
		'svg-black' => '.ui-alt-icon.ui-icon-$1:after,.ui-alt-icon .ui-icon-$1:after {background-image: url("images/extra/$1-black.svg")}',
		'png-black' => '.ui-nosvg .ui-alt-icon.ui-icon-$1:after,.ui-nosvg .ui-alt-icon .ui-icon-$1:after {background-image: url("images/extra/png/$1-black.png")}',
	);

	$pv_icons = array('book','scanner','stack','facebook','google-plus','twitter');

	foreach($pv_tpls as $k => $t)
	{
		echo "\n\n/* $k */";
		foreach($pv_icons as $i)
		{
			echo "\n" . str_replace("$1", $i, $t);
		}
	}
?>