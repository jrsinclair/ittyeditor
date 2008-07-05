// $Id: init.js 9 2008-06-22 04:02:32Z fran $

ITTY.namespace('editor');
	//set this now, in case ITTY.editor.ids load before ittyEditor.js --fac 2008-06-19
	
ITTY.editor.ids = {
	textinput             : "ittyMarkdownInput",
	xhtmloutput           : "ittyXhtmlOutput",
	xhtmlinput            : "ittyXhtmlInput",
	editordiv             : "ittyEditor",
	infodiv               : "ittyfooter",
	previewcontainer      : "",
	previewcontainerclass : "",
	logoclass             : "ittyLogo",
	logotitle             : "itty logo"
};
window.onload = setupEditor;
// or something like this with other onloads listed: 
// window.onload = function () {setupEditor(); otherfunc(); otherfunc2(x);};
