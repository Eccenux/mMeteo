<?php
require_once dirname(__FILE__)."/MultiFooterElement.php";
require_once dirname(__FILE__).'/DocumentHelper.php';

/**
 * Multipage footers for jQuery Mobile
 * 
 * This replaces less stable (in terms of JQM updates) JavaScript version.
 * 
 * You can still use lib\jquery.mobile.multifooter.js for development, 
 * but PHP version is recomended for production or in case the footer is unstable.
 * 
 * Minimal expect syntax for main navigation bar:
 * ```html
 * <div data-role="multipagefooter" data-position="fixed" data-id="main-navi">
 * 	<div data-role="navbar">
 *		<ul>
 *			<li><a href="#page-start" data-icon="home" data-i18n-key="title-application">&nbsp;</a></li>
 *			<li><a href="#page-settings" data-icon="gear" data-i18n-key="Settings">&nbsp;</a></li>
 *			<li><a href="#page-about" data-icon="info" data-i18n-key="About">&nbsp;</a></li>
 *		</ul>
 * 	</div>
 * </div>
 * ```
 * 
 * Extra footer attributes:
 *  - data-footer-pages-exclude - Space separated list of page ids on which this footer should not to be copied to.
 *  - data-footer-pages-include - Space separated list of page ids on which this footer is to be copied to. If not used or empty then all pages will have this footer.
 */
class MultiFootersParser
{
	protected $documentHelper;
	
	protected $someFootersDynamic = true;
	protected $someFootersStatic = false;

	function __construct($html)
	{
		$this->documentHelper = new DocumentHelper($html);
	}
	
	const PARSED_FILE_RESULT_NO_MF = 0x00;
	const PARSED_FILE_RESULT_SOME_DYNAMIC_MF = 0x01;
	const PARSED_FILE_RESULT_SOME_STATIC_MF = 0x10;
	
	/**
	 * Parse and save file.
	 * 
	 * @note Output file will be overwritten!
	 * 
	 * @param string $inputFile Input file path.
	 * @param string $outputFile Output file path (if empty then $inputFile will be used).
	 * @return number Binary number that can be bitwise compared to `PARSED_FILE_RESULT_...` constants.
	 */
	public static function parseFile($inputFile, $outputFile='') {
		if (empty($outputFile)) {
			$outputFile = $inputFile;
		}
		$html = file_get_contents($inputFile);
		$p = new MultiFootersParser($html);
		$parsed_html = $p->parseDocument();
		if (!empty($parsed_html)) {
			file_put_contents($outputFile, $parsed_html);
		} else {
			file_put_contents($outputFile, $html);
		}
		$result = self::PARSED_FILE_RESULT_NO_MF;
		if ($p->someFootersDynamic) {
			$result &= self::PARSED_FILE_RESULT_SOME_DYNAMIC_MF;
		}
		if ($p->someFootersStatic) {
			$result &= self::PARSED_FILE_RESULT_SOME_STATIC_MF;
		}
		return $result;
	}
	
	/**
	 * Gets all pages in current document.
	 * @return array static node list indexed with ids of elements.
	 */
	protected function getAllPages()
	{
		return $this->documentHelper->getElementsByRole('div', 'page', true);
	}
	
	/**
	 * Gets all multi footers in current document.
	 * @return array static node list.
	 */
	protected function getMultiFooters()
	{
		return $this->documentHelper->getElementsByRole('div', 'multipagefooter');
	}
	
	/**
	 * Run parsing and render final HTML.
	 * @return string|null Parsed HTML
	 *	or `null` if no static MF found
	 * (if `null` see someFootersDynamic and someFootersStatic fot details)
	 */
	public function parseDocument()
	{
		$this->someFootersDynamic = false;
		$this->someFootersStatic = false;
		
		$footers = $this->getMultiFooters();
		if (empty($footers)) {
			return null;
		}
		
		// prepare and loop over MF
		$allPages = $this->getAllPages();
		$allPagesIds = array_keys($allPages);
		for ($i = count($footers) - 1; $i >= 0; $i--) {
			$footer = new MultiFooterElement($footers[$i], $i);
			if (!$footer->isStaticProcessorActive()) {
				$this->someFootersDynamic = true;
				continue;
			}
			$this->someFootersStatic = true;
			$footer->moveFooter($this->documentHelper, $allPagesIds, $allPages);
		}
		
		if (!$this->someFootersStatic) {
			return null;
		}
		return $this->documentHelper->getHTML();
	}
}

?>