/**
	@file Form creation helper

    Copyright:  ©2011-2013 Maciej Jaros (pl:User:Nux, en:User:EcceNux)
      License:  GNU General Public License v2
                http://opensource.org/licenses/gpl-license.php
*/

/**
	HTML form creator helper function
	
	@param {Array} arrFields Array of fileds of which can look like this:
	{
		type:'[input type]'                               // type of the field similar to HTML types; MUST be given for all types
		,name:'[field_name]'                              // name of the field (from which and id will be created when needed); SHOULD be given for all types
		,maxlen: 123                                      // maximum length of the value; SHOULD be given for: text; CAN be given for: date
		,lbl: '[field label]'                             // label for the field; MUST be given for: text, date, checkbox, submit, textarea, codeScanner
		,title: '[some title]'                            // title for groupped values; MUST be given for: checkbox, radio, select
		,lbls: [lbl:'...', value:'...'],                  // array of lbl (as above), value (that can be read when selected) for options; MUST be given for: radio, select
		,value:'[default value]'                          // startup/default value; CAN be given for all 
		                                                  // (for checkbox this SHOULD be boolean true/false, otherwise this MUST be a string)
		                                                  // (for submit if it is empty then lbl will be used)
		,jsUpdate:'someGlobalVariable = this.value'       // javascript to be run onchange (note that it is run in the input element context); CAN be given for all
		,validationJson:'{required:true, email:true}'     // validation rules for the jQuery.validation plugin
		
		,extraAttributes : [{name:'...',value:'...'}, ...]// any additionals attributes you might need; note quotes are escaped automatically
	}
	
	Implemented types:
		text (number, url, email) - simple, short text with label on the left; url, email and such might have some special behaviour in some browsers.
		codeScanner - similar to text type but with scanner button when scanner is available
		textarea - multi-line text
		(*)date - similar to above but will add a jQuery datepicker where available
		(*)checkbox - title on the left, label on the right of the checkbox (true/false)
		(*)radio - title on the left, all options visible to choose (one of many can be selected)
		select - title on the left, one (default) option visible at startup (one of many can be selected)
		submit - just a submit button
		rawHTML - inserts raw HTML provided in value
		
	*) Types not yet reimplemented to be jQuery Mobile ready
	
	@param {String} strHeader Form header text; if empty no extra header (nor container) will be added
*/
function formCreator(arrFields, strHeader)
{
	//
	// Setup header (and container)
	if (typeof(strHeader)!='string')
	{
		strHeader = '';
	}
	var strRet = '';
	if (strHeader.length)
	{
		strRet += ''
			+ '<h2>'+strHeader+'</h2>'
			+ '<div style="text-align:left; font-size:12px;" class="msgform">'
		;
	}
	
	//
	// parsing fields
	for (var i=0; i<arrFields.length; i++)
	{
		var oF = arrFields[i];
		
		if (typeof(oF.value)=='undefined')
		{
			oF.value = '';
		}
		if (typeof(oF.name)=='undefined')
		{
			var now = new Date();
			oF.name = 'undefined_'+now.getTime();
		}
		var preserveLabel = false;

		// extra attributes
		var strExtraAttributes = "";
		if ('extraAttributes' in oF)
		{
			for (var attr=0; attr<oF.extraAttributes.length; attr++)
			{
				strExtraAttributes += " "
						+ oF.extraAttributes[attr].name
						+ '="' + oF.extraAttributes[attr].value.toString().replace(/"/g, '&quot') + '"';
			}
		}

		switch (oF.type)
		{
			case 'rawHTML':
				strRet += oF.value;
			break;
			
			case 'number':
				preserveLabel = true;
			default:
			case 'text':
			case 'url':
			case 'codeScanner':
			case 'email':
				var strExtra = strExtraAttributes;
				strExtra += oF.jsUpdate ? ' onchange="'+oF.jsUpdate+'" ' : '';
				// strExtra += oF.maxlen ? ' style="width:'+(oF.maxlen*8)+'px" ' : '';
				strExtra += oF.maxlen ? ' maxlength="'+oF.maxlen+'" ' : '';
				strExtra += oF.validationJson ? ' data-validation="'+oF.validationJson+'" ' : '';

				var dt = new Date();
				var strInpId = oF.name+'_'+dt.getTime();
				//var strInpId = oF.name;
				
				var className = (!preserveLabel) ? 'ui-hide-label' : '';

				strRet += ''
					+'<div data-role="fieldcontain" class="'+className+'">'
						+'<label for="'+strInpId+'">'+oF.lbl+':</label>'
						+'<input type="'+oF.type+'" name="'+oF.name+'" id="'+strInpId+'" value="'+oF.value+'" placeholder="'+oF.lbl+'" '+strExtra+'/>'
					+'</div>'
				;
			break;
			case 'textarea':
				var strExtra = strExtraAttributes;
				strExtra += oF.jsUpdate ? ' onchange="'+oF.jsUpdate+'" ' : '';
				strExtra += oF.validationJson ? ' data-validation="'+oF.validationJson+'" ' : '';

				var dt = new Date();
				var strInpId = oF.name+'_'+dt.getTime();
				//var strInpId = oF.name;
				strRet += ''
					+'<div data-role="fieldcontain" class="ui-hide-label">'
						+'<label for="'+strInpId+'">'+oF.lbl+':</label>'
						+'<textarea cols="40" rows="8" name="'+oF.name+'" id="'+strInpId+'" value="" placeholder="'+oF.lbl+'" '+strExtra+'>'+oF.value+'</textarea>'
					+'</div>'
				;
			break;
			case 'submit':
				var strExtra = strExtraAttributes;
				var dt = new Date();
				var strInpId = oF.name+'_'+dt.getTime();
				//var strInpId = oF.name;
				if (oF.value.length == 0)
				{
					strRet += ''
						+'<input data-theme="b" type="'+oF.type+'" name="'+oF.name+'" id="'+strInpId+'" value="'+oF.lbl+'" '+strExtra+'/>'
					;
				}
				else
				{
					strRet += ''
						+'<button data-theme="b" type="'+oF.type+'" name="'+oF.name+'" id="'+strInpId+'" value="'+oF.value+'" '+strExtra+'/>'+oF.lbl+'</button>'
					;
				}
			break;
			case 'select':
			case 'flip':
				var dt = new Date()
				var strInpId = oF.name+'_'+dt.getTime();
				var containerRole = '';
				var strExtra = strExtraAttributes;
				strExtra += oF.jsUpdate ? ' onchange="'+oF.jsUpdate+'" ' : '';
				strExtra += oF.validationJson ? ' data-validation="'+oF.validationJson+'" ' : '';

				if (oF.type == 'flip')
				{
					strExtra += ' data-role="slider" ';
					containerRole = 'data-role="fieldcontain"';
				}
				strRet += '<div '+containerRole+'>'
					+'<label for="'+strInpId+'">'+oF.title+':</label>'
					+'<select id="'+strInpId+'" name="'+oF.name+'" '+strExtra+'>'
				;
				for (var j=0; j<oF.lbls.length; j++)
				{
					var oFL = oF.lbls[j];
					var strSubInpId = strInpId+'_'+oFL.value;
					var strSubExtra ='';//= strExtra;
					strSubExtra += oF.value==oFL.value ? ' selected="selected" ' : '';
					strRet += ''
						+'<option value="'+oFL.value+'" '+strSubExtra+'>'+oFL.lbl+'</option>'
					;
				}
				strRet += '</select></div>';
			break;
			/*
			case 'date':
				var strExtra = '';
				strExtra += oF.jsUpdate ? ' onchange="'+oF.jsUpdate+'" ' : '';
				strExtra += oF.maxlen ? ' maxlength="'+oF.maxlen+'" ' : '';
				strExtra += oF.maxlen ? ' style="width:'+(oF.maxlen*8)+'px" ' : '';
				strRet += '<p>'
					+'<label style="display:inline-block;width:120px;text-align:right;">'+oF.lbl+':</label>'
					+' <input class="datepicker" type="date" name="'+oF.name+'" value="'+oF.value+'" '+strExtra+' />'
					+'</p>'
				;
			break;
			case 'checkbox':
				var dt = new Date()
				var strInpId = oF.name+'_'+dt.getTime();
				var strExtra = '';
				strExtra += oF.jsUpdate ? ' onchange="'+oF.jsUpdate+'" ' : '';
				strExtra += oF.value ? ' checked="checked" ' : '';
				strRet += '<p>'
					+'<span style="display:inline-block;width:120px;text-align:right;">'+oF.title+':</span>'
					+' <input id="'+strInpId+'" type="'+oF.type+'" name="'+oF.name+'" value="1" '+strExtra+' />'
					+'<label for="'+strInpId+'">'+oF.lbl+':</label>'
					+'</p>'
				;
			break;
			case 'radio':
				var dt = new Date()
				var strInpId = oF.name+'_'+dt.getTime();
				var strExtra = '';
				strExtra += oF.jsUpdate ? ' onchange="'+oF.jsUpdate+'" ' : '';
				strRet += '<p>'
					+'<span style="display:inline-block;width:120px;text-align:right;">'+oF.title+':</span>'
				;
				for (var j=0; j<oF.lbls.length; j++)
				{
					var oFL = oF.lbls[j];
					var strSubInpId = strInpId+'_'+oFL.value;
					var strSubExtra = strExtra;
					strSubExtra += oF.value==oFL.value ? ' checked="checked" ' : '';
					strRet += ''
						+' <input id="'+strSubInpId+'" type="'+oF.type+'" name="'+oF.name+'" value="'+oFL.value+'" '+strSubExtra+' />'
						+'<label for="'+strSubInpId+'">'+oFL.lbl+'</label>'
					;
				}
				strRet += '</p>';
			break;
			*/
		}
	}
	
	//
	// End container (if it was added) and return
	if (strHeader.length)
	{
		strRet += ''
			+ '</div>'
		;
	}
	return strRet;
}