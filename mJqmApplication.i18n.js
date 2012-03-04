/**
	@file mJqmApplication i18n (language) file

    Copyright:  ©2012 Maciej "Nux" Jaros
	  License:  CC-BY-SA
	            http://creativecommons.org/licenses/by-sa/3.0/
*/

/**
	i18n labels, titles, messages and such
	
	@note
		Building i18n labels for data objects:
		\li label-[objectFieldName]...-[objectFieldName]
		\li label-[objectFieldName]...-[objectFieldName]-[optionName]
		@see mJqmApplication.storage.js
	
	@note
		<p>This object will be replaced upon setup of the i18n class and stored internally</p>
		<p>You should use "get" method like in the example below</p>
		<ol>
		<li>var yesText = _self.i18n.get("_Yes");</li>
		<li>var hiText = _self.i18n.get("_Hi_username", {username:"Maciej"});</li>
		<li>{i18n.get("_Yes")}</li>
		</ol>
		<p>Pierwszy i drugi przykład przypisuje wartość do zmiennej. Drugi do razu ją wyświetla.</p>
		<p>Należy zwrócić uwagę, że w message "_Hi_username" musi być zawarty tekst "{$username}".</p>	
*/
window.mJqmApplication.i18n = {"":""
	// Polski
	,'pl' : {"":""
		// errors
		,"unexpected error" : "Niespodziewany błąd!"
		// page (or icon) titles
		,"add - title" : "Dodaj"
		,"edit - title" : "Edytuj"
		,"delete - title" : "Usuń"
		// geo errors
		,"could not detect your position"     : "Nie udało się wykryć położenia. Włącz sieć bezprzewodową (WiFi) lub odbiornik GPS."
		,"retrieving your position timed out" : "Nie udało się wykryć położenia w rozsądnym czasie. Spróbuj jeszcze raz."
		// other errors
		,"error: position empty"           : "Błąd! Współrzędne położenia są puste.\n\nOdśwież położenie lub wpisz długość i szerokość ręcznie."
		,"error: position must be decimal" : "Błąd! Współrzędne położenia są nieprawidłowe. Długość i szerokość muszą być wpisane w formie liczb dziesiętnych.\n\nPopraw lub spróbuj odświeżyć położenie."
		// meteo forms
		,"title-forecast" : "Prognoza"
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
		,"label-settings-mainNaviFormat"            : "Przyciski nawigacyjne"
		,"label-settings-mainNaviFormat-icons&text" : "Ikony i tekst"
		,"label-settings-mainNaviFormat-icons-only" : "Tylko ikony"
		,"label-settings-mainNaviFormat-text-only"  : "Tylko tekst"
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

	}
	// English
	,'en' : {"":""
		// errors
		,"unexpected error" : "Unexpected error!"
		// page (or icon) titles
		,"add - title" : "Add"
		,"edit - title" : "Edit"
		,"delete - title" : "Delete"
		// geo errors
		,"could not detect your position"     : "Could not detect your position. Turn on your wireless network (WiFi) or GPS."
		,"retrieving your position timed out" : "Retrieving your position timed out. You can try again."
		// other errors
		,"error: position empty"           : "Error! Geo. position is empty.\n\nPlease refresh position or type in latitude and longitude yourself."
		,"error: position must be decimal" : "Error! Geo. position is incorrect. Latitude and longitude must be decimal.\n\nCorrect thoose values or try to refresh the position."
		// meteo forms
		,"title-forecast" : "Forecast"
		,"title-um-model" : "Short forecast"
		,"title-coamps-model" : "Long forecast"
		,"label-latitude"  : "Latitude (N)"
		,"label-longitude" : "Longitude (E)"
		// settings
		,"label-settings-language"         : "Language"
		,"label-settings-language-pl"      : "Polski"
		,"label-settings-language-en"      : "English"
		,"label-settings-getPositionType"                  : "Position acquiry"
		,"label-settings-getPositionType-automatic"        : "Automatic (at startup)"
		,"label-settings-getPositionType-manual-only"      : "Manual (refresh for automatic)"
		,"label-settings-getPositionType-manual-but-saved" : "Manual with saving previous"
		,"label-settings-mainNaviFormat"            : "Navigation buttons"
		,"label-settings-mainNaviFormat-icons&text" : "Icons & text"
		,"label-settings-mainNaviFormat-icons-only" : "Icons only"
		,"label-settings-mainNaviFormat-text-only"  : "Text only"
		// other
		,"button-refresh" : "Refresh position"
		// forms basics
		,"form-invalid" : "Please correct the form"
		,"submit"       : "Save"
		// Translated default messages for the jQuery validation plugin.
		,"validator-messages" :
		{
			required: "This field is required.",
			remote: "Please fix this field.",
			email: "Please enter a valid email address.",
			url: "Please enter a valid URL.",
			date: "Please enter a valid date.",
			dateISO: "Please enter a valid date (ISO).",
			number: "Please enter a valid number.",
			digits: "Please enter only digits.",
			creditcard: "Please enter a valid credit card number.",
			equalTo: "Please enter the same value again.",
			accept: "Please enter a value with a valid extension.",
			maxlength: jQuery.validator.format("Please enter no more than {0} characters."),
			minlength: jQuery.validator.format("Please enter at least {0} characters."),
			rangelength: jQuery.validator.format("Please enter a value between {0} and {1} characters long."),
			range: jQuery.validator.format("Please enter a value between {0} and {1}."),
			max: jQuery.validator.format("Please enter a value less than or equal to {0}."),
			min: jQuery.validator.format("Please enter a value greater than or equal to {0}.")
		}
	}
};