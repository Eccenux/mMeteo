/**
	@file mMeteo i18n (language) file

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
		@see window.mMeteo.storage.schema
	
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
window.mMeteo.i18n = {"":""
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
		// meteo forms
		,"title-um-model" : "Prognoza krótka"
		,"title-coamps-model" : "Prognoza długa"
		,"label-latitude"  : "Szerokość (N)"
		,"label-longitude" : "Długość (E)"
		// settings
		,"label-settings-language"         : "Język"
		,"label-settings-language-pl"      : "polski"
		,"label-settings-language-en"      : "English"
		// other
		,"button-refresh" : "odśwież położenie"
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
		// meteo forms
		,"title-um-model" : "Short forecast"
		,"title-coamps-model" : "Long forecast"
		,"label-latitude"  : "Latitude (N)"
		,"label-longitude" : "Longitude (E)"
		// settings
		,"label-settings-language"         : "Language"
		,"label-settings-language-pl"      : "polski"
		,"label-settings-language-en"      : "English"
		// other
		,"button-refresh" : "refresh position"
	}
};