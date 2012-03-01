/**
	@file Form creation helper

    Copyright:  ©2011-2012 Maciej Jaros (pl:User:Nux, en:User:EcceNux)
      License:  GNU General Public License v2
                http://opensource.org/licenses/gpl-license.php
*/

/**
	HTML form creator helper function
	
	@arrFields Array of fileds of which can look like this:
	{
		type:'[input type]'                               // type of the field similar to HTML types; MUST be given for all types
		,name:'[field_name]'                              // name of the field (from which and id will be created when needed); SHOULD be given for all types
		,maxlen: 123                                      // maximum length of the value; SHOULD be given for: text; CAN be given for: date
		,lbl: '[field label]'                             // label for the field; MUST be given for: text, date, checkbox
		,title: '[some title]'                            // title for groupped values; MUST be given for: checkbox, radio, select
		,lbls: [lbl:'...', value:'...'],                  // array of lbl (as above), value (that can be read when selected) for options; MUST be given for: radio, select
		,value:'[default value]'                          // startup/default value; CAN be given for all (for checkbox this SHOULD be boolean true/false, otherwise this MUST be a string)
		,jsUpdate:'someGlobalVariable = this.value'       // javascript to be run onchange (note that it is run in the input element context); CAN be given for all
	}
	
	Implemented types:
		text - simple, short text with label on the left
		date - similar to above but will add a jQuery datepicker where available
		checkbox - title on the left, label on the right of the checkbox (true/false)
		radio - title on the left, all options visible to choose (one of many can be selected)
		select - title on the left, one (default) option visible at startup (one of many can be selected)


	@param strHeader Form header text; if empty no extra header (nor container) will be added
*/
function formCreator(arrFields, strHeader)
{
	//
	// Setup header (and container)
	if (typeof(strHeader)!='string')
	{
		strHeader = '';
	}
	if (strHeader.length)
	{
		var strRet = ''
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
		switch (oF.type)
		{
			default:
			case 'text':
				var strExtra = '';
				strExtra += oF.jsUpdate ? ' onchange="'+oF.jsUpdate+'" ' : '';
				strExtra += oF.maxlen ? ' maxlength="'+oF.maxlen+'" ' : '';
				strExtra += oF.maxlen ? ' style="width:'+(oF.maxlen*8)+'px" ' : '';
				strRet += '<p>'
					+'<label style="display:inline-block;width:120px;text-align:right;">'+oF.lbl+':</label>'
					+' <input  type="'+oF.type+'" name="'+oF.name+'" value="'+oF.value+'" '+strExtra+' />'
					+'</p>'
				;
			break;
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
			case 'select':
				var dt = new Date()
				var strInpId = oF.name+'_'+dt.getTime();
				var strExtra = '';
				strExtra += oF.jsUpdate ? ' onchange="'+oF.jsUpdate+'" ' : '';
				strRet += '<p>'
					+'<span style="display:inline-block;width:120px;text-align:right;">'+oF.title+':</span>'
					+'<select name="'+oF.name+'" '+strExtra+'>'
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
				strRet += '</select></p>';
			break;
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