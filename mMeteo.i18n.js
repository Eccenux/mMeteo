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

	@todo
		info = "could not detect your position";
		info = "retrieving your position timed out";
	
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
		// settings
		,"label-settings-language"         : "Język"
		,"label-settings-language-pl"      : "polski"
		,"label-settings-language-en"      : "angielski"
	}
	// English
	,'en' : {"":""
		// errors
		,"unexpected error" : "Unexpected error!"
		// page (or icon) titles
		,"add - title" : "Add"
		,"edit - title" : "Edit"
		,"delete - title" : "Delete"
		// settings
		,"label-settings-language"         : "Language"
		,"label-settings-language-pl"      : "Polish"
		,"label-settings-language-en"      : "English"
	}
};