/**
 *	@file mJappisApplication i18n (language) file
 *
 *    Copyright:  ©2012-2014 Maciej "Nux" Jaros
 *	  License:  CC-BY or MIT
 *	            CC-BY: http://creativecommons.org/licenses/by/3.0/
 *	            MIT: http://www.opensource.org/licenses/mit-license 
 *
 * i18n labels, titles, messages and such
 *
 * @note
 *		Building i18n labels for data objects:
 *		\li label-[objectFieldName]...-[objectFieldName]
 *		\li label-[objectFieldName]...-[objectFieldName]-[optionName]
 *		@see mJappisApplication.storage.js
 *
 * @note
 *		<p>This object will be replaced upon setup of the i18n class and stored internally</p>
 *		<p>You should use "get" method like in the example below</p>
 *		<ol>
 *		<li>var yesText = $mJ.i18n.get("_Yes");</li>
 *		<li>var hiText = $mJ.i18n.get("_Hi_username", {username:"Maciej"});</li>
 *		</ol>
 *		<p>Note that the message "_Hi_username" must contain "{$username}" placeholder for the replacement to work.</p>
 */
window.mJappisApplication.i18n.pl = {"":""
	// app basic
	,"title-application" : "Prognoza"
	,"Back" : "Powrót"
	,"Edit" : "Edytuj"
	,"Save" : "Zapisz"
	,"Cancel" : "Anuluj"
	,"Columns..." : "Kolumny..."
	,"Share URL" : "Podziel się linkiem"

	// errors
	,"unexpected error" : "Niespodziewany błąd!"
	// page (or icon) titles
	,"add - title" : "Dodaj"
	,"edit - title" : "Edytuj"
	,"delete - title" : "Usuń"
		// geo errors
		,"could not detect your position"     : "Nie udało się wykryć położenia. Włącz sieć bezprzewodową (WiFi) lub odbiornik GPS."
		,"retrieving your position timed out" : "Nie udało się wykryć położenia w rozsądnym czasie. Spróbuj jeszcze raz."
		// map
		,"button-show-map" : "Pokaż położenie (mini-mapa)"
		,"map" : "mapa"
		// other errors
		,"error: position empty"           : "Błąd! Współrzędne położenia są puste.\n\nOdśwież położenie lub wpisz długość i szerokość ręcznie."
		,"error: position must be decimal" : "Błąd! Współrzędne położenia są nieprawidłowe. Długość i szerokość muszą być wpisane w formie liczb dziesiętnych.\n\nPopraw lub spróbuj odświeżyć położenie."
		// meteo forms
		,"title-um-model" : "Krótka prognoza"
		,"title-coamps-model" : "Długa prognoza"
		,"label-latitude"  : "Szerokość (N)"
		,"label-longitude" : "Długość (E)"
	// settings
	,"label-settings-language"         : "Język"
	,"label-settings-language-pl"      : "Polski"
	,"label-settings-language-en"      : "English"
		,"label-settings-getPositionType"                  : "Pobieranie położenia"
		,"label-settings-getPositionType-automatic"        : "Od razu po uruchomieniu"
		,"label-settings-getPositionType-manual-only"      : "Ręcznie przyciskiem"
		,"label-settings-getPositionType-manual-but-saved" : "Ręcznie z automatycznym zapisem poprzedniej"
	,"group-settings-mainNavi" : "Przyciski nawigacyjne"
	,"label-settings-mainNaviFormat"            : "Format"
	,"label-settings-mainNaviFormat-icons&text" : "Ikony i tekst"
	,"label-settings-mainNaviFormat-icons-only" : "Tylko ikony"
	,"label-settings-mainNaviFormat-text-only"  : "Tylko tekst"
	,"label-settings-mainNaviPosition"               : "Pozycja"
	,"label-settings-mainNaviPosition-bottom-fixed"  : "Przytwierdzone na dole"
	,"label-settings-mainNaviPosition-below-content" : "Pod zawartością"
	,"label-settings-mainNaviPosition-below-header"  : "Pod nagłówkiem"
	,"group-settings-advanced" : "Zaawansowane"
	,"label-settings-pageTransitions"           : "Animacje przy zmianie stron"
	,"label-settings-pageTransitions-none"      : "Brak (wysoka wydajność)"
	,"label-settings-pageTransitions-slide"     : "Przesunięcie"
	,"label-settings-pageTransitions-slideup"   : "Do góry"
	,"label-settings-pageTransitions-slidedown" : "W dół"
	,"label-settings-pageTransitions-pop"       : "Wyskakujące"
	,"label-settings-pageTransitions-fade"      : "Przenikanie"
	,"label-settings-pageTransitions-flip"      : "Obrocik"
	,"label-settings-pageTransitions-turn"      : "Przewróć stronę"
	,"label-settings-pageTransitions-flow"      : "Przepływ"
	,"label-settings-pageTransitions-slidefade" : "Przesunięcie przenikane"
		// other
		,"button-refresh" : "Odśwież położenie"
	// forms basics
	,"form-invalid" : "Proszę poprawić formularz"
	,"submit"       : "Zapisz"
	// Translated default messages for the jQuery validation plugin.
	,"validator-messages" :
	{
		required: "To pole jest wymagane.",
		remote: "Proszę o wypełnienie tego pola.",
		email: "Proszę o podanie prawidłowego adresu email.",
		url: "Proszę o podanie prawidłowego URL.",
		date: "Proszę o podanie prawidłowej daty.",
		dateISO: "Proszę o podanie prawidłowej daty (ISO).",
		number: "Proszę o podanie prawidłowej liczby.",
		digits: "Proszę o podanie samych cyfr.",
		creditcard: "Proszę o podanie prawidłowej karty kredytowej.",
		equalTo: "Proszę o podanie tej samej wartości ponownie.",
		accept: "Proszę o podanie wartości z prawidłowym rozszerzeniem.",
		maxlength: jQuery.validator.format("Proszę o podanie nie więcej niż {0} znaków."),
		minlength: jQuery.validator.format("Proszę o podanie przynajmniej {0} znaków."),
		rangelength: jQuery.validator.format("Proszę o podanie wartości o długości od {0} do {1} znaków."),
		range: jQuery.validator.format("Proszę o podanie wartości z przedziału od {0} do {1}."),
		max: jQuery.validator.format("Proszę o podanie wartości mniejszej bądź równej {0}."),
		min: jQuery.validator.format("Proszę o podanie wartości większej bądź równej {0}.")
	}
};