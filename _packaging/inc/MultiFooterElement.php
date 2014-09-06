<?php
/**
 * Multipage footer element helper class.
 */
class MultiFooterElement
{
	/**
	 * Index of the multi-footer (anything unique within document scope).
	 * @var int
	 */
	protected $index;
	
	/**
	 * DOM element of the multi-footer.
	 * @var DOMElement
	 */
	protected $element;
	
	/**
	 * Space separated list of page ids on which this footer should not to be copied to.
	 * @var string
	 */
	protected $excludedPagesList;
	/**
	 * Array of page ids on which the footer is to be copied to.
	 * 
	 * @note If empty then all pages should have this footer.
	 * 
	 * @var array
	 */
	protected $includedPages;
	
	/**
	 * Parser type which can be JS or PHP (PHP is default).
	 * 
	 * JS is fully dynamic but can break with new JQM,
	 * PHP is partially static, but less reliant on JQM versions.
	 * 
	 * @var string
	 */
	protected $dataParser = 'PHP';
	
	/**
	 * If true then move to header instead of appending to page.
	 * @var bool
	 */
	protected $moveToHeader = false;

	/**
	 * Constructor.
	 * 
	 * @param DOMElement $domElement DOM element of the multi-footer.
	 * @param int $index Index of the multi-footer (anything unique within document scope).
	 */
	function __construct($domElement, $index)
	{
		$this->element = $domElement;
		$this->index = $index;
		$this->setupOptions();
	}
	
	/**
	 * Get trimmed list.
	 * 
	 * @param string $attributeName
	 * @return string
	 */
	protected function getListFromAttribute($attributeName)
	{
		return trim($this->element->getAttribute($attributeName));
	}
	
	/**
	 * Setup options.
	 */
	protected function setupOptions()
	{
		$this->includedPages = array();
		$this->excludedPagesList = ' ' . $this->getListFromAttribute('data-footer-pages-exclude') . ' ';
		$includedPagesList = $this->getListFromAttribute('data-footer-pages-include');
		if (!empty($includedPagesList)) {
			$this->includedPages = explode(' ', $includedPagesList);
		}
		if (strtoupper(trim($this->element->getAttribute('dataParser'))) === 'JS') {
			$this->dataParser = 'JS';
		}
	}
	
	/**
	 * True if parser option for this footer is set to use PHP proccessor.
	 * 
	 * @return bool
	 */
	public function isStaticProcessorActive() {
		return ($this->dataParser === 'PHP');
	}
	
	/**
	 * Get pages list for this footer.
	 */
	protected function filterPages($allPagesIds)
	{
		$allIncludedIds = !empty($this->includedPages) ? $this->includedPages : $allPagesIds;
		$pagesIds = array();
		for ($i = 0; $i < count($allIncludedIds); $i++) {
			$spacedId = ' ' . $allIncludedIds[$i] . ' ';
			if (strpos($this->excludedPagesList, $spacedId) === FALSE) {
				$pagesIds[] = $allIncludedIds[$i];
			}
		}
		
		return $pagesIds;
	}
	
	/**
	 * Adds class to the footer.
	 * @param string $className Class to be appended or replaced.
	 */
	protected function addClass($className) {
		$oldClass = $this->element->getAttribute('class');
		$cleanClass = preg_replace("#(^| )$className(?= |$)#", '', $oldClass);
		$newClass = empty($cleanClass) ? $className : $cleanClass . ' ' . $className;
		$this->element->setAttribute('class', $newClass);
	}
	
	/**
	 * Prepares footer element before insertation.
	 * 
	 * @note This should only be done once and.
	 */
	protected function prepareElement() {
		// add info. that element is staticly prepared
		// (and so dynamic postion setup must be done differently)
		$this->element->setAttribute('data-position-setup', 'static');
		
		// assure data-id is given and change data-role
		$this->element->setAttribute('data-role', 'footer');
		if (!$this->element->hasAttribute('data-id')) {
			$this->element->setAttribute('data-id', 'multipagefooter' . strval($this->index));
		}
		
		// support for exta position types
		$this->moveToHeader = false;
		switch ($this->element->getAttribute('data-position'))
		{
			case 'below-content':
				$this->addClass('ui-body-a');
				$this->element->removeAttribute('data-role');
				$this->element->removeAttribute('data-position');
			break;
			case 'below-header':
				$this->element->removeAttribute('data-role');
				$this->element->removeAttribute('data-position');
				$this->moveToHeader = true;
			break;
		}
		
		return $this->element;
	}
	
	/**
	 * Appends footer clone to page.
	 * 
	 * Based on:
	 * http://stackoverflow.com/questions/4400980/how-to-insert-html-to-php-domnode
	 * 
	 * @param DOMElement $page
	 */
	protected function appendCloneTo($page) {
		$clone = $this->element->cloneNode(true);
		$page->ownerDocument->importNode($clone);
		$page->appendChild($clone);
	}
	
	/**
	 * Move footer from original document to appropriate pages.
	 * 
	 * @param array $allPages Node list indexed with ids of the pages.
	 */
	public function moveFooter(DocumentHelper $documentHelper, $allPagesIds, &$allPages) {
		$pagesIds = $this->filterPages($allPagesIds);
		$this->prepareElement();
		for ($i = count($pagesIds) - 1; $i >= 0; $i--) {
			$id = $pagesIds[$i];
			if (isset($allPages[$id])) {
				$page = $allPages[$id];
				if ($this->moveToHeader) {
					$parent = $documentHelper->getPageHeader($page);
				} else {
					$parent = $page;
				}
				$this->appendCloneTo($parent);
			}
		}
		
		$this->element->parentNode->removeChild($this->element);
	}
}

?>