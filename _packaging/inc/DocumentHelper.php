<?php
require_once dirname(__FILE__).'/ext/html5lib/Parser.php';

/**
 * HTML Document Helper (for jQuery Mobile pages in particular)
 */
class DocumentHelper
{
	protected $document;
	
	function __construct($html)
	{
		// save pre-body content to preserve it
		$bodyStart = stripos ($html, '<body');
		$this->preBody = substr($html, 0, $bodyStart);
		
		// parse
		$document = HTML5_Parser::parse($html);
		$this->document = $document;
	}
	
	/**
	 * Gets a static NodeList-like array of matching elements.
	 * 
	 * @param string $tag Tag name of elements to get.
	 * @param string $attribute Name of attribute to check.
	 * @param string $attributeValueRegExp RegExp match for values (preg_match-compatible).
	 * @param boolean $idIndexed
	 *	If true then node list will be indexed with ids 
	 *	and so will also only return elements that has an id set.
	 * @return array static node list optionally indexed with ids of elements.
	 */
	public function getElementsByAttribute($tag, $attribute, $attributeValueRegExp, 
			$idIndexed = false, DOMElement $parent = null)
	{
		if (is_null($parent)) {
			$parent = $this->document;
		}
		$nodeList = array();
		$elements = $parent->getElementsByTagName($tag);
		for ($i = $elements->length - 1; $i >= 0; $i--) {
			$e = $elements->item($i);
			$a = $e->getAttribute($attribute);
			if (!empty($a) && preg_match($attributeValueRegExp, $a)) {
				$index = $idIndexed ? $e->getAttribute('id') : count($nodeList);
				if (!empty($index) || $index === 0) {
					$nodeList[$index] = $e;
				}
			}
		}
		return $nodeList;
	}

	/**
	 * Gets element that have given role (in terms of jQuery Mobile).
	 * 
	 * @param string $tag Tag name of elements to get.
	 * @param string $role Role of the element to match.
	 * @param boolean $idIndexed
	 *	If true then node list will be indexed with ids 
	 *	and so will also only return elements that has an id set.
	 * @return array static node list optionally indexed with ids of elements.
	 */
	public function getElementsByRole($tag, $role, 
			$idIndexed = false, DOMElement $parent = null)
	{
		return $this->getElementsByAttribute($tag, 'data-role', "#(^|\\s)$role(\\s|$)#", 
				$idIndexed, $parent);
	}
	
	/**
	 * Gets page header.
	 * 
	 * @param DOMElement $page
	 * @return DOMElement or null if no header found.
	 */
	public function getPageHeader(DOMElement $page) {
		$headers = $this->getElementsByRole('div', 'header', false, $page);
		if (empty($headers)) {
			return null;
		}
		return $headers[0];
	}
	
	/**
	 * Render HTML.
	 * 
	 * @note The contents of the document can be changed e.g. after getting and modifing elements.
	 * 
	 * @param bool $restoreHeader If true then byte-perfect header contents will be restored.
	 * @return string
	 */
	public function getHTML($restoreHeader = true)
	{
		$html = $this->document->saveHTML();
		
		if (!$restoreHeader) {
			return $html;
		}
		
		// restore pre-body content
		$bodyStart = stripos ($html, '<body');
		return substr_replace ($html, $this->preBody, 0, $bodyStart);
	}
}

?>