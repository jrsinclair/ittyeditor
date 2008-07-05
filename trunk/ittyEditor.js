/*
$Id: ittyEditor.js 12 2008-06-23 05:35:37Z fran $

@name         : Itty Editor
@Author       : Fran Corpier [famc @ mac . com]
@Contributors : 
@Copyright    : Copyright (c) 2008, Fran Corpier; All rights reserved.
@License      : Simple BSD
@Synopsis     : 
		<script type="text/javascript" src="itty.js"></script>
		<script type="text/javascript" src="ittyEditor.js"></script>
		... rest of JS needed shown below  :
		
		ITTY.editor.ids = {
			textinput               : "ittyMarkdownInput",
			xhtmloutput             : "ittyXhtmlOutput",
			xhtmlinput              : "ittyXhtmlInput",
			editordiv               : "ittyEditor",
			infodiv                 : "ittyfooter",
    		previewcontainer        : "",
    		previewcontainerclass   : "",
    		logoclass               : "ittyLogo",
    		logotitle               : "itty logo"
		};
		window.onload = function () {
			...your other onload functions here...
			setupEditor();
			...or here...
		};		
		// or, if we're the only one, then this works  :
		// window.onload = setupEditor;
		

@Summary      : WSYIWYG Editor and 2-way converter from Markdown to xhtml 
             and from xhtml to Markdown. Features automatic xhtml  
             preview below the editor, unlimited undo and redo, 
             logo-rebranding, clean interface, ability to add buttons 
             and expand the editor object. Button images and CSS included.           

@Language     : English, JavaScript, JSOP (JavaScript Object Programming), CSS

@Prior Work   : * Markdown.pl 
              Copyright (c) 2004-2005 John Gruber 
              (http  ://daringfireball.net/projects/markdown/) 
              Simple BSD
              
              * showdown.js, a JavaScript port of Markdown.pl, and 
              showdown-gui.js - displays showdown conversion during input
              Copyright (c) 2007 John Fraser 
              (http  ://www.attacklab.net) 
              specificially  : (http  ://www.attacklab.net/showdown-v0.9.zip)
              Simple BSD
              
              (see [--jf] in code, denoting prior work)
              
              * Make.text (Make.js) 1.5, JavaScript bookmarklet that 
              converts an entire web page to Markdown text.
              Copyright (c) Trevor Jim. 
              (www.fsf.org/copyleft/gpl.html)
              License  : GPL v2 
              
              (see [--jt] in code, denoting prior work)
              
              * Toolbar inspired by widgEdit.js, Mozilla-style 
              wysiwyg HTML editor that uses iframes (not textarea) 
              to manipulate input.
    		  Copyright (c), 2005 Cameron Adams 
    		  (http  ://www.themaninblue.com/)
    		  GNU General Public License, v.2
    		  
    		  (see [--ca] in code, denoting prior work)
    		  
    		  Where such initials --jf, --jt, or --ca are shown, 
    		  with_out_ an accompanying --fac, prior works was merely 
    		  tranlated to JSOP code, with some hooks added.


@Defn.        : JSOP, my accronym for JavaScript Object Programming.
              (JSOOP just sounds too much like the denigrated tag SOUP. 
              So I opted for the shorter JSOP. --Fran Corpier)
              
              : --fac, Fran Corpier initials, denotes comments, 
              modifications, additions, or deletions. Might be 
              accompanied by ADDED, DELETED, or MOD designation 
              to distinguish from mostly straight translations of 
              Prior Work.
              
              : [+--fac], Fran Corpier authored and added to the  
              base of code.

@Setup        : Fill in the various ids for the textareas, containers, 
             and logo. setupEditor script looks for the ITTY.editor.ids 
             object. A sample CSS and html file are included with the 
             download. The html structure should be the same as the 
             sample. And for best results, so should the CSS.
             
             WARNING  : IF YOU CHANGE THE CSS, AND THINGS BREAK, DO NOT 
             COME CRYING TO ME, PLEASE. OR, ARE YOU LOOKING TO BE 
             SPANKED?   :>
              
@Tech Notes   : [2008-06-12] Fran Corpier, Itty author, developer

			  * An instance of ITTY.editor.toolbar is imported into   
              a new instance of ITTY.editor.converter. It is passed 
              into the ITTY.editor.converter's make method.
               
              * The toolbar buttons take it from there.
              
              * Add buttons or logo in the start-up script. 
              Currently, I don't have a second tier bar. But 
              you could make the editor and toolbar wider to 
              fit custom buttons. insertbutton and insertselect 
              handle button insertion including registerng the 
              change and click events.
              
              * The code mostly uses DOM creation methods. 
              This makes the current version incompatible with 
              most level 4 browsers. (It's on my todo but not 
              my todone.)
              
              * Because code is translated in increments-- a brilliant 
              concept from John Fraser, xhtml is accumulated as a string. 
              Therefore the browsers' existing parsing agents are used 
              to parse the string as proper DOM nodes. 
              
              Structure
              ----------
              * ITTY is exported to the global namespace, by default.
              itty.js is required.
              
              * myevents property is added to each toolbar button or 
              select menu idget (spelled correctly, as they are not 
              full-blown widgets ;). myevents is an object with total 
              recall of all registered listeners in the active or 
              removed stack. Very useful here.          

              * ITTY.editor.toolbar and ITTY.editor.converter are 
              instantiated objects. converter imports the toolbar and 
              handles the conversion buttons and mode selector.
              
              * ITTY.editor.common and ITTY.editor.utility are static  
              objects holding useful functions. 

              * I am using _class_, _parent_, and _version_ to indicate 
              special keys. They are "special" in that I believe all 
              objects should expose their class, parent class, and 
              version. My future application objects will have these keys.
              
              * Each method has an isa variable, inspired by Perl's ISA, 
              though not identical. The isa variable exposes the static 
              object to which the function belongs. This is most useful in 
              the ITTY.editor.utilities and ITTY.editor.common, two static 
              classes, where the functions commonly call each other with 
              something like  : isa.escape_chars .
              
@Tested       Win: IE 6.02, Firefox 2.0, Opera 9.23, Opera 8.5, 
              Netscape 9, Netscape 8
			  
			  Mac: Safari 3.1, Safari 1.3, Firefox 2.0, Opera 9.23, 
			  Opera 8.5, Netscape 9, Netscape 7.2

@Todo         : Opera compatibility. I'm sure it's something minor, but...
              [Priority level  : A]
              Opera 9.23/Mac: working, but processing time for conversion 
              is 25ms versus, say, 3ms for Safari. 
              
              Opera Scrolling Bug: Click the scrollbar, only part of a 
              long conversion shows. A subsequent click into the page 
              background (anywhere outside the textarea) scrolls the rest 
              of the text in view. What is shown inside the box, after the 
              click outside the box is totally in sync with what you would 
              expect to see when scrolling to the scrollbar's then-position. 
              Maybe an onscroll-type event could workaround, in case it's 
              not something inherently wrong with the code.
              --fac 2008-06-17
              
              Opera Form Element Redraw Bug: When the Block select menu 
              is re-enabled, after being disabled, it is smaller, in a 
              higher position, and with smaller text than normal.
              --fac 2008--06-19
              
              : Firefox Scroll Sync Bug. When you convert a long text and 
              Firefox is returned to the text input screen, it jumps, and 
              doesn't scroll to the base of the text. 
              Scrollbars stay up top. --fac, 2008-06-19
              
              
              
              : Watch for additions to Markdown.pl. Note, a (<sup>) button 
              is included in the first distribution, even though not 
              currently supported.
              [Priority level  : A - always]
              
              : Language editions of the Markdown Help. These can be in 
              deferred script files added to the DOM, on call.
              [Priority level  : B+]
            
              : Spiff title/explanation of the editor itself
              [Priority level  : B]
              
              : See if we can make compatible with at least IE 5.x Win/Mac 
              [Priority level  : C+]
              
              : Create a fallback for browsers incapable of DOM mods
              [Priority level  : C]
              
              : Maybe allow html editing with the same buttons or more, 
              while in xhtml mode. Seems like a natural extension. 
              Who would use it? Maybe admins on the fence about 
              Markdown, who would normally use TinyMce or widgEdit. 
              Feedback?
              [Priority level  : D]
              
@Mods         : * This area is for you and others to log Modifications made,
              especially patches or enhancements. Let them take the 
              following form  :
              
              * [yyyy-mm-dd] Your Name, Company, and contact
              MOD[ADDED,DELETED]  : object name 
              Brief Description of addition, modification, or deletion. 
              

@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ */

// itty.js required preceding this, sets up ITTY namespace --fac


ITTY.namespace('editor.markdownhelp');
ITTY.namespace('editor.tutorial');
		// create editor, markdownhelp, and tutorial objects

ITTY.editorProcessTimer;

//|<=================== Editor Common ===============>|
ITTY.editor.common = {
	_class_   : "common",
	_parent_  : ITTY.editor,
	_version_ : "0.1",
	
	//-----------------------------------------------
	// seednode [+--fac]
	// self-executes upon page request
	// sets up window.Node and x-browser function(s)
	//-----------------------------------------------
	seednode : function () {
		if (!window.Node) {Node = {};}
	 	if (!Node.ELEMENT_NODE) {Node.ELEMENT_NODE = 1;}
	 	if (!Node.TEXT_NODE) {Node.TEXT_NODE = 3;}
	 	
	 	if (!document.getElementById && document.all) {document.getElementById = function (id) {return document.all[id];};}
	 	
	}(), //ADDED: self executing; sets window.Node, if it does not exist in browser --fac, 2008-06-11
	
	//-----------------------------------------------
	// textboxSelection [+--fac]
	// gets selected range data for a text area
	// returns an object with the data
	//-----------------------------------------------
	textboxSelection : function (el) {
		/*Fran Corpier's textbox (textarea) selection object returns 
		an object with the following keys: 
		el         (reference to the textbox/textarea object, itself) 
		startpos,  (integer: index of the start of the selection)
		endpos,    (integer: index of the start of the selection)
		startstr,  (string : everything _before_ startpos)
		endstr,    (string : everything _after_ endpos)
		text,      (string : just the selection)
		*/
		var isa = ITTY.editor.common;
		if (!el || el.nodeType != Node.ELEMENT_NODE || (el.tagName && el.tagName != "TEXTAREA")) {return;}
		el.focus();
		var s  = el.selectionStart;
		var e  = el.selectionEnd;
		var text = null;
		if (s == null || typeof s == "undefined") {
			//test null first in case browser doesn't support typeof or try-catch
			
			if (!document.selection) {return;}
			var range = document.selection.createRange();
				//for ie, etc.
			
			if (!range) {return;}
			var stored_range = range.duplicate();
			stored_range.moveToElementText(el);
			stored_range.setEndPoint('EndToEnd', range);
			s    = stored_range.text.length - range.text.length;
			e    = s + range.text.length;
			text = range.text.replace(/[ ]$/, ""); 
				// IE can pick up a trailing space on a double click. Nix it. --fac 2008-06-21
			
			if (s == null || typeof s == "undefined") {return;}
				//one last test, in case of an unforseen problem
		}
		var selObj = {
			el       : el,
			startpos : parseInt(s),
			endpos   : parseInt(e),
			startstr : el.value.substr(0,s),
			endstr   : el.value.substr(e),
			text     : text || el.value.substring(s,e)
				// text: IE || (Safari, Firefox, Netscape, Opera, et al)
		
		}; // selObj is cross-browser-compatible
		
		if (selObj.startpos == 0) {selObj.startstr == "";}
		else {selObj.startstr = selObj.startstr.replace(/[\r\n\t]+$/, "").replace(/[ ]+$/, " ");}
		
		if (selObj.endpos == 0) {selObj.endstr == "";}
		else {selObj.endstr = selObj.endstr.replace(/\s+$/, "");}
			//trim space and line endings off the end of the endstr facilitates cursor placement at the end of the visible text --fac

		return selObj;
	}, // ADDED: my textboxSelection utility method --fac, 2008-05-28
	
	//-----------------------------------------------
	// addStringToDOM [+--fac]
	// Tries the Range.createContextualFragment 
	// method before innerHTML. Uses browser internal
	// parsing algorithms to turn an html string 
	// into nodes. Relies on window.Node
	//-----------------------------------------------
	addStringToDOM : function(obj, text) {
		var isa = ITTY.editor.common, rangeok = 0;
		if (obj && obj.nodeType == Node.ELEMENT_NODE && text != "" && typeof text == "string") {
			var rangeok = 0;
			if (typeof window.Range != "undefined" && typeof Range.prototype != "undefined" && typeof Range.prototype.createContextualFragment != "undefined" && typeof Range.prototype.selectNode != "undefined" && document.createRange) {
					//MOD: modified conditional to if != "undefined" --fac 2008-06-19; added test for Range.prototype required by Safari 1.3.x, which must use innerHTML. --fac, 2008-06-23 12:43 am
				var range = document.createRange();
				if (range) {
					range.selectNode(obj);
					var parsedHTML = range.createContextualFragment(text);
					while(obj.childNodes.length > 0) {
						obj.removeChild(obj.firstChild);
					} // critical to prevent ranges from piling on top of each other
					
					if (obj.appendChild(parsedHTML)) {
						rangeok = 1;
					}
				}
			} //add the parsed html as child nodes on the object
			if (!rangeok) {
				obj.innerHTML = text; 
					/*the inventor of innerHTML for Microsoft, Eric Vasilik, 
				says that innerHTML "takes a string, parses it as HTML and  
				replaces the contents of that element with the new HTML" 
				[http://www.ericvasilik.com/2006/07/code-karma.html]. So it is 
				the same thing (in x/html docs) as calling a DOM function to 
				parse it. But quite a bit cleaner, I think. 
				Either way, the browser is parsing the HTML string 
				for us. Neither of these methods is "standard", but should be. 
				Range is a w3c org recommendation. Mozilla and at least 
				Safari 3.x support it (Safari 1.3/Mac doesn't get Range.prototype).
				--fac */
			} // fallback method to: add the parsed html as child nodes to an element
		}
	}, // ADDED: my addstringtodom utility method --fac, 2008-06-05
	
	//-----------------------------------------------
	// encodeEmail [--MW, mods--jf]
	// obscures emails from spambots
	//-----------------------------------------------
	encodeEmail : function (addr) {
  		/* Based on a filter by Matthew Wickline (see BBEdit mail list post)
  			Input:   "foo@example.com"
    		Output:  mailto link, with each character encoded randomly as a decimal or hex entity.
			Example: <a href="&#x6D;&#97;&#105;&#108;&#x74;&#111;:&#102;&#111;&#111;&#64;&#101;x&#x61;&#109;&#x70;&#108;&#x65;&#x2E;&#99;&#111;&#109;">&#102;&#111;&#111;&#64;&#101;x&#x61;&#109;&#x70;&#108;&#x65;&#x2E;&#99;&#111;&#109;</a>
   		*/
   		var isa = ITTY.editor.common;
		var char2hex = function (ch) {
			var hexDigits = '0123456789ABCDEF';
			var dec = ch.charCodeAt(0);
			return(hexDigits.charAt(dec>>4) + hexDigits.charAt(dec&15));
		};
		var encode = [
			function(ch){return "&#"+ch.charCodeAt(0)+";";},
			function(ch){return "&#x"+char2hex(ch)+";";},
			function(ch){return ch;}
		];
		addr = "mailto:" + addr;
		addr = addr.replace(/./g, function(ch) {
			if (ch == "@") {
				ch = encode[Math.floor(Math.random()*2)](ch);
			} else if (ch !=":") {
				var r = Math.random();
				ch =  (r > .9  ? encode[2](ch) : (r > .45 ?	encode[1](ch) : encode[0](ch))); 
				// roughly 10% raw, 45% hex, 45% dec
			}
			return ch;
		});
		addr = "<a href=\"" + addr + "\">" + addr + "</a>";
		addr = addr.replace(/">.+:/g, "\">"); // strip the mailto: from the visible part
		return addr;
	},
	
	//-----------------------------------------------
	// encodeAmpsAngles [--NI, mods--jf]
	// ampersand-encoding based entirely on 
	// Nat Irons's Amputator MT plugin:
	// http://bumppo.net/projects/amputator/
	// called by runspans
	//-----------------------------------------------
	encodeAmpsAngles : function (text) {
		var isa = ITTY.editor.common;
		text = text.replace(/&(?!#?[xX]?(?:[0-9a-fA-F]+|\w+);)/g,"&amp;");
		text = text.replace(/<(?![a-z\/?\$!])/gi,"&lt;");
		return text;
	},
	
	//-----------------------------------------------
	// surgicallyInsertNode [+--fac]
	// DOM insertion by the knife (see notes)
	// called by insertbuttons, insertselect
	// calls nothing
	// modifies toolbar button placement
	//-----------------------------------------------
	surgicallyInsertNode : function (o_pere, o_item, s_flag) {
		/*
		Fran Corpier's convenience function for DOM insertions.
		Arguments:
		o_pere is the object into which we are inserting a new child, o_item.
		s_flag indicates exactly where the item should be insert, 
		relative to other children of the parent object.
		s_flag takes the form of 1.A, 1.Z, 1.{a number}, 
		2.A, 2.Z, or 2.{a number} .
		
		Key:
		0 = return 0,
		1 = insertBefore, 
		2 = insertAfter
		A = firstChild, 
		Z = lastChild
		*****************************
		
		Flags:
		1.A = insertBefore firstChild
		1.Z = insertBefore lastChild
		2.A = insertAfter  firstChild
		2.Z = insertAfter  lastChild //same as appendChild()
		
		Nodes start from 0, so 0 is the 1st node, 
		  1 is the 2nd node, 2 is the 3rd, etc.
		1.0 = 1.A  these are equal (both = insertBefore firstChild)
		2.0 = 2.A  these are equal (both = insertAfter firstChild)
		1.1 = insertBefore 2nd child
		2.1 = insertAfter  2nd child
		1.2 = insertBefore 3rd child
		2.2 = insertAfter  3rd child
		...etc....
		*/
		var isa = ITTY.editor.common, inserted = 0;
		if (typeof o_pere == "object" && typeof o_item == "object" && typeof s_flag == "string") {
			var aDigi = s_flag.toString().split('.');
			if (aDigi[0] == 1) {
				//insertBefore
				switch(aDigi[1]) {
				case "A": o_pere.insertBefore(o_item,o_pere.firstChild); inserted = 1; break;
				case "Z": o_pere.insertBefore(o_item,o_pere.lastChild); inserted = 1; break;
				default: 
					if (/^\d+$/.test(aDigi[1])) {
						o_pere.insertBefore(o_item, o_pere.childNodes[aDigi[1]]);
						inserted = 1;
					}
				}
			} else if (aDigi[0] == 2) {
				// insertAfter, for JS 1.5, we kludge this non-existent, convenience function --fac
				switch(aDigi[1]) {
				case "A": 
					var targetNode = o_pere.childNodes[1];
					if (o_pere.insertBefore(o_item,targetNode)) {
						inserted = 1; break;
					}
				case "Z": 
					if (o_pere.appendChild(o_item)) {
						inserted = 1; 
						break;
					}
				default:  
					if (/^\d+$/.test(aDigi[1])) {
						var mynode = o_pere.childNodes[aDigi[1]];
						var mynodeparent = o_pere.childNodes[aDigi[1]].parentNode;
						if (typeof mynode == "object") {
							if (mynodeparent.insertBefore(o_item, mynode.nextSibling)) {
									inserted = 1;
							}
						}
					}
					break;
				}
			}
		
		}
		return inserted;
	}, // ADDED: surgicallyInsertNode --fac
	
	//-----------------------------------------------
	// xaddEventListener [+--fac]
	// registers and tracks multiple listeners 
	// for each event, even for IE5/Mac and NS4.
	// called by insertbuttons, insertselect, 
	//    disable, enable, converter.make
	//-----------------------------------------------
	xaddEventListener : function (obj,evt,fnc,useCapture) {
		/* Fran Corpier's x-browser event capture 
		  registers and tracks multiple listeners for 
		  each event, even for IE5/Mac and NS4.
		*/
		var isa = ITTY.editor.common;
		useCapture = useCapture || false;		
		
		//--------------------------------
		// myEvents registers each 
		// handler to an array for 
		// the specified event.
		//--------------------------------
		obj.myEvents = obj.myEvents || {};
		
		if (!obj.myEvents[evt] || obj.myEvents[evt] == null) {
			obj.myEvents[evt] = [{f_function : fnc, s_usecapture : useCapture}];
		} else {
			obj.myEvents[evt][obj.myEvents[evt].length] = {f_function : fnc, s_usecapture : useCapture};
		} 
		
		//--------------------------------
		// getEventListeners returns 
		// the specified event array.
		//--------------------------------
		obj.getEventListeners = function (evt) {
			return obj.myEvents[evt];
		};
			
		if (obj.addEventListener){
			obj.addEventListener(evt, fnc, useCapture);
			return true;
				// w3c standards compliant
		} else if (obj.attachEvent) {
			return obj.attachEvent("on"+evt,fnc);
				// ie 5.5, 6, 7
		} else{
			obj['on'+evt] = function () {
				if (!obj || !obj.myEvents || !obj.myEvents[evt]) {return;}
				var evts = obj.myEvents[evt];
				for (var i=0, len=evts.length; i < len; i++) {evts[i]();}
			}; // DOM 0 hybrid
		}
	}, // ADDED: xaddEventListener --fac
	
	//-----------------------------------------------
	// xremoveEventListener [+--fac]
	// registers and tracks removal of multiple  
	// listeners for each event, even for IE5/Mac 
	// and NS4.
	// called by disable, enable
	//-----------------------------------------------
	xremoveEventListener : function (obj,evt,fnc,useCapture) {
		/* Fran Corpier's x-browser event removal 
		   removes one or multiple listeners for each 
		   event, even for IE5/Mac and NS4.
		*/
		var isa = ITTY.editor.common;
		if (!useCapture) useCapture=false;
		
		//--------------------------------
		// Remove the specified event 
		// handler from myEvents' custom 
		// list of registered handlers 
		// for this object, this event.
		//--------------------------------
		var evts = obj.myEvents[evt];
		var dndx,evt_removed;
		for (var i=0, len=evts.length; i < len; i++) {
			if (evts[i].f_function == fnc) {
				evts[i].f_function = null;
				dndx = i;
				break;
			}
		}
		if (typeof dndx != "undefined" && evts.length) {evt_removed = evts.splice(dndx, 1);}
		
		//--------------------------------
		// Wrap up with Browser methods.
		//--------------------------------
		if (obj.removeEventListener) {
			obj.removeEventListener(evt, fnc, useCapture);
			return true;
				// w3c standards compliant
		} else if (obj.attachEvent) {
			return obj.detachEvent("on"+evt, fnc);
				// ie 5.5, 6, 7
		} else{
			obj['on'+evt] = null;
				// DOM 0
		}
	}, // ADDED: xremoveEventListener --fac
	
	//-----------------------------------------------
	// xpreventDefault [+--fac]
	// x-browser preventDefault
	// called by toolbar.edit, converter.changemodes, 
	//   converter.undoredo, converter.convertM2xHTML
	//-----------------------------------------------
	xpreventDefault : function (evt) { 
		if (evt) { 
			if (typeof evt.preventDefault != 'undefined') { 
				evt.preventDefault(); 
					// W3C 
			} else { 
				evt.returnValue = false; 
					// IE 
			} 
		} 
		return false;
			// DOM Level 0 
	}, // ADDED: xpreventDefault --fac
	
	//-----------------------------------------------
	// xsetAttribute [+--fac]
	// x-browser setAttribute
	// called by toolbar.insertbutton, insertselect,
	//   converter.changemodes, toolbar disable and 
	//   enable, converter.make, html2markdown, 
	//   converter.markdownhelp
    // calls xgetAttribute
	//-----------------------------------------------
	xsetAttribute : function (o_obj, s_attr, s_setto) {
		if (o_obj.nodeType != Node.ELEMENT_NODE || typeof s_attr != "string" || typeof s_setto != "string") {return;}
		var isa = ITTY.editor.common, issetable = document.body.setAttribute;
		
		if (issetable && s_attr != "value" && s_setto != "" && s_setto != null) {
			switch(s_attr) {
			case "class" : 
			case "className" : 
				o_obj.setAttribute("class", s_setto);
				o_obj.className = s_setto;
					// set class/className both ways due to browser differences
					
				if (isa.xgetAttribute(o_obj, "class") == s_setto) {return true;}
				break; // in case not set
			case "style" : 
				o_obj.removeAttribute("style");
				o_obj.setAttribute("style", s_setto);
				o_obj.style.cssText = s_setto;
					// set css style string both ways due to browser differences
						
				if (isa.xgetAttribute(o_obj, "style") == s_setto) {return true;}
				break;
			default: 
				o_obj.setAttribute(s_attr, s_setto);
				if (isa.xgetAttribute(o_obj, s_attr) == s_setto) {return true;}
			}
		} else if (s_attr == "value") {
			o_obj.value = s_setto;
			return true;
		}  else if (issetable && (s_setto == null || s_setto == "")) {
			o_obj.removeAttribute(s_attr);
			if (!isa.xgetAttribute(s_attr)) {return true;}
			
			/* setAttribute is not an option for the following:
			   warning: the following are not tested, so could generate a 
			   false-positive return --fac
			*/
		} else if (s_attr == "class" || s_attr == "className") {
			o_obj.className = s_setto;
			return true; 
		} else if (s_attr == "style") {
			o_obj.style.cssText = s_setto;
			return true;
		} else {
			o_obj[s_attr] = s_setto;
			return true;
		}
		return false;
	}, // ADDED: xsetAttribute--fac
	
	//-----------------------------------------------
	// xgetAttribute [+--fac]
	// x-browser getAttribute
	// called by toolbar disable, enable, edit
	//   xsetAttribute, converter.markdownhelp
	//   converter.undoredo, converter.convertM2xHTML
	//   converter.html2markdown,
	//   converter.changemodes
    // calls nothing
	//-----------------------------------------------
	xgetAttribute : function (o_obj, s_attr) {
		if (o_obj.nodeType != Node.ELEMENT_NODE || typeof s_attr != "string") {return;}
		var r, isgetable = document.body.getAttribute;
		if (isgetable && s_attr != "value") {
			switch(s_attr) {
			case "class" : 
			case "className" : 
				r = o_obj.getAttribute("class") || o_obj.className;
				return r;
			case "style" : 
				r = o_obj.getAttribute("style") || o_obj.style.cssText;
				return r;
			default: 
				r = o_obj.getAttribute(s_attr);
				return r;
			}
		} else if (s_attr == "value") {
			r = o_obj.value;
			return r;
			
			/* getAttribute is not an option for the following:
			   warning: the following are not tested, so could generate a 
			   false-positive return --fac
			*/
		} else if (s_attr == "class" || s_attr == "className") {
			r = o_obj.className;
			return r;
		} else if (s_attr == "style") {
			r = o_obj.style.cssText
			return r;
		} else {
			r = o_obj[s_attr];
			return r;
		}
		return null;
	}
}; // ADDED: xgetAttribute--fac

//|<=================== Editor Utility (utilities) ===============>|

/* ADDED: most functions in the converter lacking a 'this' 
reference reside here in ITTY.editor.utility. Some utility 
functions safely reference others in their 'isa' class. 

All utility functions are used by the converter object in its 
conversion of Markdown syntax to xhtml.

Functions ported from showdown, which is ported from Markdown. 
   --fac 
*/

ITTY.editor.utility = {		
	//-----------------------------------------------
	// autolinks [--jf]
	// called by runspans
	// calls com.encodeemail, 
	//    isa.unescapespecialchars
	//-----------------------------------------------	
	autolinks : function (text) {	
		var isa = ITTY.editor.utility;
		text = text.replace(/<((https?|ftp|dict):[^'">\s]+)>/gi, "<a href=\"$1\">$1</a>");

		// Email addresses: <address@domain.foo>, see desc. in com.encodeemail
		text = text.replace(/<(?:mailto:)?([-.\w]+\@[-a-z0-9]+(\.[-a-z0-9]+)*\.[a-z]+)>/gi, function(wholeMatch,m1) {
			return ITTY.editor.common.encodeemail(isa.unescapespecialchars(m1));
		});
		return text;
	},
	
	//-----------------------------------------------
	// codespans [--jf]
	// converts backticked to code span
	// called by runspans
	// calls isa.encodecode
	//-----------------------------------------------
	codespans : function (text) {
		/* can use multiple backticks as the delimiters; just add one more surrounding backtick pair to create the code span
		   ex: ``foo `bar` baz`` translate to: <code>foo `bar` baz</code> 
		*/
		var isa = ITTY.editor.utility;
		text = text.replace(/(^|[^\\])(`+)([^\r]*?[^`])\2(?!`)/gm, function(wholeMatch,m1,m2,m3,m4) {
			var c = m3;
			c = c.replace(/^[ \t]*(.*?)[ \t]*$/g,"$1"); //trim MOD: consolidated regex --fac
			c = isa.encodecode(c);
			return m1+"<code>"+c+"</code>";
		});
		return text;
	},
	
	//-----------------------------------------------
	// unescapespecialchars [--jf]
	// called by convert, isa.autolinks
	// calls isa.encodecode
	//-----------------------------------------------
	unescapespecialchars : function (text) {
		var isa = ITTY.editor.utility;
		text = text.replace(/~E(\d+)E/g, function(wholeMatch,m1) {
				var charCodeToReplace = parseInt(m1);
				return String.fromCharCode(charCodeToReplace);
		}); // swap out the special symbols used by showdown, with the special characters that they stood in for
		
		return text;
	},
	
	//-----------------------------------------------
	// outdent [--jf]
	// remove 1 level of line-leading 
	// called by processlistitems, 
	//    docodeblocks
	// calls nothing
	//-----------------------------------------------
	outdent : function (text) {
		// attacklab: hack around Konqueror 3.5.4 bug: "----------bug".replace(/^-/g,"") == "bug" :
		var isa = ITTY.editor.utility;
		text = text.replace(/^(\t|[ ]{1,4})/gm,"~0"); 
		text = text.replace(/~0/g,""); 
			//remove ~0 sybmol = global tab width
		
		return text;
	},
	
	//-----------------------------------------------
	// escapechars_callback [--jf]
	// flags chars to escape
	// called by isa.encodebackslashes, 
	//    isa.escapecharacters
	// calls nothing
	//-----------------------------------------------
	escapechars_callback : function (wholeMatch,m1) {
		var isa = ITTY.editor.utility;
		var charCodeToEscape = m1.charCodeAt(0);
		return "~E"+charCodeToEscape+"E";
	},
	
	//-----------------------------------------------
	// escapecharacters [--jf]
	// escapes escape-chars
	// called by isa.encode, 
	//    isa.escapetagattributes, 
	//    writeanchortag, writeimagetag
	// calls isa.escapechars_callback
	//-----------------------------------------------
	escapecharacters : function (text, charsToEscape, afterBackslash) {
		var isa = ITTY.editor.utility;
		var regexString = "([" + charsToEscape.replace(/([\[\]\\])/g,"\\$1") + "])";
		regexString = (afterBackslash && "\\\\" + regexString) || regexString;
		var regex = new RegExp(regexString,"g");
		text = (typeof this.escapechars_callback == "undefined" && text.replace(regex, isa.escapechars_callback)) || text.replace(regex,this.escapechars_callback);
		return text;
	},
	
	//-----------------------------------------------
	// bolditalics [--jf]
	// converts to (<strong>) or (<em>)
	// called by runspans
	// calls nothing
	//-----------------------------------------------
	bolditalics : function (text) {
		//called by runspans
		var isa = ITTY.editor.utility;
		text = text.replace(/(\*\*|__)(?=\S)([^\r]*?\S[*_]*)\1/g,"<strong>$2</strong>");
		text = text.replace(/(\*|_)(?=\S)([^\r]*?\S)\1/g, "<em>$2</em>");
		return text;
	},
	
	//-----------------------------------------------
	// escapetagattributes [--jf]
	// escapes tag attributes
	// called by runspans
	// calls isa.escapecharacters
	//-----------------------------------------------
	escapetagattributes : function (text) {
		/* Within tags -- meaning between < and > -- encode [\ ` * _] so they
		   don't conflict with their use in Markdown for code, italics and 
		   strong. [showdown notes]
		*/
		var isa = ITTY.editor.utility;
		var regex = /(<[a-z\/!$]("[^"]*"|'[^']*'|[^'">])*>|<!(--.*?--\s*)+>)/gi;
			//find HTML tags and comments.  see Friedl's "Mastering Regular Expressions", 2nd Ed., pp. 200-201
			
		text = text.replace(regex, function(wholeMatch) {
			var tag = wholeMatch.replace(/(.)<\/?code>(?=.)/g,"$1`");
			tag = (typeof this.escapecharacters == "undefined" && isa.escapecharacters(tag,"\\`*_")) || this.escapecharacters(tag,"\\`*_");
			return tag;
		});
		return text;
	},
	
	//-----------------------------------------------
	// encodebackslashes [--jf]
	// encodes escaping backslashes
	// called by runspans
	// calls isa.escapechars_callback
	//-----------------------------------------------
	encodebackslashes : function (text) {
		var isa = ITTY.editor.utility;
		if (typeof this.escapechars_callback == "undefined") {
			text = text.replace(/\\(\\)/g, isa.escapechars_callback);
			text = text.replace(/\\([`*_{}\[\]()>#+-.!])/g, isa.escapechars_callback);
		} else {
			text = text.replace(/\\(\\)/g, this.escapechars_callback);
			text = text.replace(/\\([`*_{}\[\]()>#+-.!])/g, this.escapechars_callback);
		} // String param, returns String with backslash escape sequences
		
		return text;
	},
	
	//-----------------------------------------------
	// encodecode [--jf]
	// escape Markdown reserved chars 
	//    and encode angles and amps
	// called by docodeblocks, codespans
	// calls isa.escapecharacters
	//-----------------------------------------------
	encodecode : function (text) {
		var isa = ITTY.editor.utility;
		text = text.replace(/&/g,"&amp;");
		text = text.replace(/</g,"&lt;");
		text = text.replace(/>/g,"&gt;");
			//escape literals or entitites inside of code blocks or spans
		
		text = (typeof this.escapecharacters == "undefined" && isa.escapecharacters(text,"\*_{}[]\\",false)) || this.escapecharacters(text,"\*_{}[]\\",false);
			// escape Markdown's reserved characters
		
		return text;
	},
	
	//-----------------------------------------------
	// detab [--jf]
	// flags and turns tabs to spaces 
	// called by convert, decodeblocks
	// calls nothing
	//-----------------------------------------------
	detab : function (text) {
		//called by convert, decodeblocks
		var isa = ITTY.editor.utility;
		text = text.replace(/\t(?=\t)/g,"    "); // our static tab width is 4 spaces
			// expand first n-1 tabs
		
		text = text.replace(/\t/g,"~A~B");
			// replace the nth with two sentinels
		
		text = text.replace(/~B(.+?)~A/g, function(wholeMatch,m1,m2) {
			var leadingText = m1;
			var numSpaces = 4 - leadingText.length % 4;  // modulus static tab width of 4 spaces

			for (var i=0; i < numSpaces; i++) {leadingText+=" ";}
			return leadingText;
		}); // use the sentinel to anchor our regex so it doesn't explode
		
		text = text.replace(/~A/g,"    ");
		text = text.replace(/~B/g,"");
			// clean up sentinels
		
		return text;
	}
};

//|<=================== Toolbar ===============>|

ITTY.editor.toolbar = {	
	_class_   : "toolbar",
	_parent_  : ITTY.editor,
	_version_ : "0.1",
	
	//-----------------------------------------------
	// make [--ca, mods--fac]
	// creates an instance of the toolbar
	// called by setupEditor, onload
	// calls  insertbutton, insertselect
	// modifies toolbar, sets up wysiwyg button 
	//    actions and disables/enables btn groups
	//-----------------------------------------------
	make      : function (oEditor) {
		var tools = ["bold","italic","hr","link","unorderedlist","orderedlist","image","block"];
		// selopts: option text : option value
		var selopts = {
			"Block" : "",
			"H1"  : "#",
			"H2"  : "##",
			"H3"  : "###",
			"H4"  : "####",
			"H5"  : "#####",
			"H6"  : "######",
			'\u00B6'   : "\n\n",
			'\u21E5'    : ">",
			"\u21E5\u21E5"   : ">>",
			"Pre" : "        "
		};
		// btnopts: actionkeyword : before||after
		var btnopts = {
			"bold"          : "**||**",
			"italic"        : "*||*",
			"hr"            : "****||\\n",
			"unorderedlist" : "- ||\\n",
			"orderedlist"   : " ||\\n"
		};
		
		var modeopts = {
		"text"  : "markdown",
		"xhtml" : "xhtml"
		};
		
		var registerdbtns    = {};
		var registeredEvents = {};
		
		var self                 = this;
		
		this.selectionOptions    = selopts;
		this.buttonOptions       = btnopts;
		this.modeOptions         = modeopts;
		this.registeredButtonIds = registerdbtns;
		this.registeredEvents    = registeredEvents;
		
		this.Editor              = oEditor;
		this.Editor.wysiwyg      = true;
		this.Editor._class_      = this._class_;
		this.Editor._parent_     = this;
		
		this.toolset             = document.createElement('ul');
		this.toolset.id          = this.Editor.id + "Toolbar";
		this.toolset.className   = "ittyToolbar";
		
		this.toolset._parent_ = this;
		
		var tl = tools.length;
		for (var i = 0; i < tl; i++) {
			switch (tools[i]) {
				case "bold"         : this.insertbutton(this.toolset.id + "BtBold", "ittyToolbarBold", "Bold Selection", "bold", 1, this.edit, 0); break;
				case "italic"       : this.insertbutton(this.toolset.id + "BtItalic", "ittyToolbarItalic", "Italicize Selection", "italic", 1, this.edit, 0); break;
				case "hr"           : this.insertbutton(this.toolset.id + "BtHr", "ittyToolbarHR", "Create a Horizontal Rule", "hr", 1, this.edit, 0); break;
				case "link"         : this.insertbutton(this.toolset.id + "BtLink", "ittyToolbarLink", "Make Selection a Link", "link", 1, this.edit, 0); break;
				case "unorderedlist": this.insertbutton(this.toolset.id + "BtUnordered", "ittyToolbarUnordered", "Make Selection an Unordered List", "unorderedlist", 1, this.edit, 0); break;
				case "orderedlist"  : this.insertbutton(this.toolset.id + "BtOrdered", "ittyToolbarOrdered", "Make Selection an Ordered List", "orderedlist", 1, this.edit, 0); break;
				case "image"        : this.insertbutton(this.toolset.id + "BtImage", "ittyToolbarImage", "Insert an Image", "image", 1, this.edit, 0); break;
				case "block"        : this.insertselect(this.toolset.id + "SmBlock", "ittyToolbarSelectBlock", selopts, "block", 1, this.edit, 0); break;
			}
		}
		
		this.reset = function(oNewEditor) {
			this.Editor                  = oNewEditor;
			this.Editor.wysiwyg          = true;
			this.Editor._class_          = this._class_;
			this.Editor._parent_         = this;
			//this.toolset.id            = this.Editor.id + "Toolbar";
		}; //ADDED: Converter calls this when it recreates a new textarea editor, in order to prevent Firefox redraw problems. Without this call the edit function fails  --fac 2008-06-18
		
		return self;
	},
	
	//-----------------------------------------------
	// insertbutton [--ca, mod--fac]
	// inserts buttons to the toolbar; may be 
	// inserted with surgical precision
	// called by toolbar.make and converter.make
	// calls  com.xaddEventListener, 
	//    com.surgicallyInsertNode, com.xsetAttribute
	// modifies button properties
	//-----------------------------------------------
	insertbutton : function (sId, sClass, sTitle, sAction, sGroupDisable, eOnclick, sInsertBeforeAfterNode) {
		/*sInsertBeforeAfterNode should begin with either be 0, 1, or 2. 
		0=none-applicable 1=insertBefore 2=insertAfter
		Following only 1 or 2 should be a DOT. 1., or 2.
		After the dot, add A, Z, or a number representing the 
		node before or after which they should be added.
		
		A=firstChild, Z=lastChild
		1.A=insertBefore(firstChild);
		1.Z=insertBefore(lastChild);
		2.A=insertAfter(firstChild);
		2.Z=insertAfter(lastChild); //same as append()
		Nodes start from 0
		1.0=1.A //these are equal
		2.0=2.A //these are equal
		1.1 //insertBefore second child
		2.1 //insertAfter second child
		
		Default if sInsertBeforeAfterNode isn't set, or set to 0: 
		the buttons are simply appended, in turn, to the toolbar
		*/
		var self = this;
		var isa = ITTY.editor.toolbar;
		var com = ITTY.editor.common;
		var sText         = document.createTextNode(sTitle);
		var eLink         = document.createElement("a");
		com.xsetAttribute(eLink, "href", "#");
		com.xsetAttribute(eLink, "title", sTitle);
		com.xsetAttribute(eLink, "class", sClass);
		com.xsetAttribute(eLink, "actionkeyword", sAction);
			// MOD: Changed from "action" to "actionkeyword" for Opera. Opera considers the "action" on a link to be the href. Kind of like the "action" of a form, I guess. --fac, 2008-06-16
		
		var oc = eOnclick || this.edit;
		com.xaddEventListener(eLink,"click",oc,false);
		com.xaddEventListener(eLink,"mouseover",function() {window.status=""; return true;},false);
		
		eLink.appendChild(sText);

 		var eItem = document.createElement("li");
		eItem.id = sId;
		if (sGroupDisable) {
			eItem.className = "ittyToolbarButton";
				// sGroupDisable=1 : select menu group will be disabled in xhtml mode. --fac ADDED: 2008-06-05
		} else {
			eItem.className = "ittyToolbarButtonND";
		}
		eItem.appendChild(eLink);
		var inserted = 0;
		if (sInsertBeforeAfterNode) {
			inserted = com.surgicallyInsertNode(self.toolset, eItem, sInsertBeforeAfterNode);
		}
		if (!inserted) {
			this.toolset.appendChild(eItem);
		}
		
		this.registeredButtonIds[sAction] = sId;
			// register the button id keyed to the "actionkeyword", since the "actionkeyword" is a simple, single word; like sAction:sId (sAction=>sId)
		
		return eLink;
			// return the link object, in case the caller wants to add more event listeners
	},
	
	//-----------------------------------------------
	// insertselect [--ca, mod--fac]
	// inserts select menus to the toolbar; may be 
	// inserted with surgical precision
	// called by toolbar.make and converter.make
	// calls  com.xaddEventListener, 
	//    com.surgicallyInsertNode, com.xsetAttribute
	// modifies button properties
	//-----------------------------------------------
	insertselect : function (sId, sClass, aOptions, sAction, sGroupDisable, sOnchange, sInsertBeforeAfterNode) {
		var self = this, 
			isa      = ITTY.editor.toolbar, 
			com      = ITTY.editor.common, 
			inserted = 0, 
			docfrag  = document.createDocumentFragment();
		
		docfrag.appendChild(document.createElement("select"));
		var eSelect = docfrag.firstChild;
		
		for (var key in aOptions) {
			var eText = document.createTextNode(key);
			
			var eOption = document.createElement("option");
			eOption.value = aOptions[key];
			eOption.appendChild(eText);
			eOption.text = key;
			eSelect.appendChild(eOption);
		}
		
		com.xsetAttribute(eSelect, "id", sId);
		com.xsetAttribute(eSelect, "name", sId);
		com.xsetAttribute(eSelect, "class", sClass);
		com.xsetAttribute(eSelect, "actionkeyword", sAction);
		var oc = sOnchange || this.edit;
		com.xaddEventListener(eSelect,"change", oc, false);		
		
		var eItem = document.createElement("li");
		if (sGroupDisable) {
			com.xsetAttribute(eItem, "class", "ittyToolbarSelectMenu");
				//if sGroupDisable==1 this select menu group will be disabled in xhtml mode. --fac ADDED: 2008-06-05
		}
		eItem.appendChild(docfrag);
		if (sInsertBeforeAfterNode) {
			inserted = com.surgicallyInsertNode(self.toolset, eItem, sInsertBeforeAfterNode);
		}
		if (!inserted) {
			this.toolset.appendChild(eItem);
				// Fallback whether sInsertBeforeAfterNode was 0 or null, or the surgicallyInsertNode function did not work as planned
		}
		this.registeredButtonIds[sAction] = sId;

		return eSelect;
			// return the select object, in case the caller wants to add more event listeners
	},
	
	/* use enable and disable to turn html source code view on or off --fac */
	
	//-----------------------------------------------
	// disable [--ca, mods--fac]
	// disables specific button groups
	// called by converter.changemode, 
	//    converter.convertM2xHTML
	// calls  com.xaddEventListener, 
	//    com.xgetAttribute, com.xsetAttribute
	// modifies button classNames and actions
	//-----------------------------------------------
	disable : function () {
		var isa = ITTY.editor.toolbar;
		var com = ITTY.editor.common;
		var self = this,
			tlen = this.toolset.childNodes.length, 
			i = 0,
			c, clen, elen, 
			k = 0,
			s = 0;
		for (i=0; i < tlen; i++) {
			c    = this.toolset.childNodes[i];
			clen = c.childNodes.length;
			if (c.nodeName.toLowerCase() == "li") {
				//they should all be li...
				if (c.className == "ittyToolbarSelectMenu") {
					//-------------------------
					// For the single toolbar, 
					// this only applies to the 
					// Block menu. Disable it.
					//-------------------------
					for (k = 0; k < clen; k++) {
						if (c.childNodes[k].nodeName.toLowerCase() == "select") {
							com.xsetAttribute(c.childNodes[k], "disabled", "disabled");
							var cl = com.xgetAttribute(c.childNodes[k], "class");
							cl += " Disabled";
							com.xsetAttribute(c.childNodes[k], "class", cl);
							break;
						}
					}
				} else {
					for (s = 0; s < clen; s++) {
						if (c.childNodes[s].nodeName.toLowerCase() == "a") {
							if (c.childNodes[s].className.indexOf('HTML') == -1 && c.childNodes[s].className.indexOf('Mode') == -1) {
								//-------------------------
								// Neither the Converter 
								// button nor the Mode menu 
								// get disabled 
								// --fac 2008-06-05
								//-------------------------
								var cl = com.xgetAttribute(c.childNodes[s], "class");
								cl += " Disabled";
								com.xsetAttribute(c.childNodes[s], "class", cl);
								//test.......
								var a_evts = c.childNodes[s].getEventListeners("click");
								for (var j=0, elen = a_evts.length; j < elen; j++) {
									//-------------------------
									// Save back the original 
									// 'click' event listeners 
									// to 'originalclick', 
									// before removing them.
									// [+--fac]
									//-------------------------
									var ocfnc = a_evts[j].f_function;
									var occptr = a_evts[j].s_usecapture;
									com.xaddEventListener(c.childNodes[s], "originalonclick", ocfnc, occptr);
									com.xremoveEventListener(c.childNodes[s], "click", ocfnc);
								}
							} else {
								//-------------------------
								// Handle the Mode menu and
								// Converter bttn. Reset
								// title and actionkeyword.
								//-------------------------
								var ca =  com.xgetAttribute(c.childNodes[s], "actionkeyword");
								if (ca.indexOf("ON") == -1) {
									ca += 'ON';
									com.xsetAttribute(c.childNodes[s], "actionkeyword", ca);
										/* hook to actionkeyword to differentiate this state for conditional testing, avoid actionkeyword + "ONON"; */
								} 
								var origTitle = com.xgetAttribute(c.childNodes[s], "title");
								com.xsetAttribute(c.childNodes[s], "originalTitle", origTitle);
									// MOD: Save back the original title. --fac
								
								if (c.childNodes[s].className.indexOf('HTML') != -1) {
									com.xsetAttribute(c.childNodes[s], "title", "toggle text input");
								} // MOD: change the titles for better UI; the converter script also changes input area captions --fac
							}
						}
					}
				}
			}
		}
		return true;
	},
	
	//-----------------------------------------------
	// enable [--ca, mods--fac]
	// re-enables specific button groups
	// called by converter.changemode, 
	//    converter.convertM2xHTML
	// calls  com.xaddEventListener, 
	//    com.xgetAttribute, com.xsetAttribute, 
	//    com.xremoveEventListener
	// modifies button classNames and actions
	//-----------------------------------------------
	enable : function () {
		var isa = ITTY.editor.toolbar;
		var com = ITTY.editor.common;
		var self = this,
			tlen = this.toolset.childNodes.length, 
			i = 0,
			c, clen, elen, 
			k = 0,
			s = 0;
		for (i=0; i < tlen; i++) {
			c = this.toolset.childNodes[i];
			clen = c.childNodes.length;
			if (c.nodeName.toLowerCase() == "li") {
				//they should all be li...
				if (c.className == "ittyToolbarSelectMenu") {
					//-------------------------
					// For the single toolbar, 
					// this only applies to the 
					// Block menu. Enable it.
					//-------------------------
					for (k = 0; k < clen; k++) {
						if (c.childNodes[k].nodeName.toLowerCase() == "select") {
							com.xsetAttribute(c.childNodes[k], "disabled", "");
							var cl = com.xgetAttribute(c.childNodes[k], "class").replace(/ Disabled/g, "");
							com.xsetAttribute(c.childNodes[k], "class", cl);
							break;
						}
					}
				} else {
					for (s = 0; s < clen; s++) {
						if (c.childNodes[s].nodeName.toLowerCase() == "a") {
							if (c.childNodes[s].className.indexOf('HTML') == -1 && c.childNodes[s].className.indexOf('Mode') == -1) {
								//-------------------------
								// Re-enable all buttons 
								// except the Converter 
								// button and Mode menu,  
								// which were not disabled.
								// --fac 2008-06-05
								//-------------------------
								var cl = com.xgetAttribute(c.childNodes[s], "class").replace(/ Disabled/g, "");
								com.xsetAttribute(c.childNodes[s], "class", cl);
								//-------------------------
								// Set the click event back  
								// to original, as saved in
								// 'originalonclick'. 
								// [+--fac]
								//-------------------------
								var a_evts = c.childNodes[s].getEventListeners("originalonclick");
									
								for (var j=0, elen = a_evts.length; j < elen; j++) {
									var ocfnc = a_evts[j].f_function;
									var occptr = a_evts[j].s_usecapture;
									if (com.xaddEventListener(c.childNodes[s], "click", ocfnc, occptr)) {
										// xaddEventListener returns true or false, even though ``addEventListener`` returns nothing in JS1.5. There could be false positives but no false negatives. --fac
										
										com.xremoveEventListener(c.childNodes[s], "originalonclick", ocfnc);
									}
								}
								// all buttons other than the xhtml (or html) and mode buttons had been disabled and were just re-enabled --fac
							} else {
								//-------------------------
								// Handle the Mode menu and
								// Converter bttn. Reset
								// title and actionkeyword.
								// [+--fac]
								//-------------------------
								var ac =  com.xgetAttribute(c.childNodes[s], "actionkeyword").replace(/ON/, "");
								var ot =  com.xgetAttribute(c.childNodes[s], "originalTitle");
								com.xsetAttribute(c.childNodes[s], "actionkeyword", ac);
								com.xsetAttribute(c.childNodes[s], "title", ot);
							}
						}
					}
				}
			}
		}
		return true;
	},
	
	//-----------------------------------------------
	// edit [--ca, mods--fac]
	// runs all but conversion, mode, and help btns.
	// called by button and menu handlers set by 
	//    insertbutton and insertselect
	// calls  com.textboxSelection, 
	//    com.xgetAttribute, com.preventDefault 
	// modifies text editor values
	//-----------------------------------------------
	edit : function (e) {
		var isa = ITTY.editor.toolbar;
		var com = ITTY.editor.common;
		var self = this;
		var myToolbar = (this.parentNode && this.parentNode.parentNode._parent_) || (e.srcElement && e.srcElement.parentElement.parentElement._parent_);
			// MOD: IE support added. The button link was not yet attached to a DOM node when its event was defined. I think that is why IE doesn't associate a "parentNode" attribute with it. --fac 2008-06-20
			// "this" refers to the toolbar button or select menu that fired off a click or change
		
		var myEditor = myToolbar.Editor;
		
		//-------------------------
		// SL holds the TextArea 
		// user selected text
		// coordinates and data.
		// [+--fac]
		//-------------------------
		var SL = com.textboxSelection(myEditor);
		SL.endstr = (SL.endstr && SL.endstr.replace(/(\r\n+|\r+|\n+)$/, "")) || "";

		//-------------------------
		// Text manipulation is 
		// based on the 
		// actionkeyword property.
		//-------------------------
		var actionkeyword = com.xgetAttribute(self, "actionkeyword") || (!this.parentNode && e.srcElement && com.xgetAttribute(e.srcElement, "actionkeyword"));
			// MOD: IE support added. --fac 2008-06-20
			
		if (!myEditor.wysiwyg && (actionkeyword != "html" || actionkeyword != "xhtml")) {return false;}
		
		switch (actionkeyword) {
		//-------------------------
		// Apply formatting to the
		// selected text.
		//-------------------------
		case "bold": 
				var mkdwn = myToolbar.buttonOptions.bold.split(/\|\|/);
				var bf = mkdwn[0]; var af = mkdwn[1];
				SL.startstr = (SL.startpos > 0 && ((/\s+$/.test(SL.startstr) && SL.startstr) || (SL.startstr += ' '))) || "";
					// Use /regex/.test(string) format, rather than /regex/(string) shortcut, for opera 9.x and IE --fac 2008-06-17
				
				myEditor.value = SL.startstr + bf + SL.text + af + SL.endstr; 
				break;
		case "italic": 
				var mkdwn = myToolbar.buttonOptions.italic.split(/\|\|/);
				var bf = mkdwn[0]; var af = mkdwn[1];
				SL.startstr = (SL.startpos > 0 && ((/\s+$/.test(SL.startstr) && SL.startstr) || (SL.startstr += ' '))) || "";
					// Use /regex/.test(string) format, rather than /regex/(string) shortcut, for opera 9.x and IE --fac 2008-06-17
				
				myEditor.value = SL.startstr + bf + SL.text + af + SL.endstr;
				break;
		case "hr":  
				var mkdwn = myToolbar.buttonOptions.hr.split(/\|\|/);
				var bf = mkdwn[0]; var af = mkdwn[1];
				myEditor.value = SL.startstr + SL.text + '\n' + bf + '\n' + SL.endstr; 
					// Equation is different for hz.rule; it goes after any selected text. --fac
				
				break;
		case "unorderedlist":  
				var mkdwn = myToolbar.buttonOptions.unorderedlist.split(/\|\|/);
				var bf = mkdwn[0]; var af = mkdwn[1];
				var ourlines = SL.text.split(/\r\n|\r|\n/);
				SL.text = "";
				for (var k in ourlines) {
					ourlines[k] = ourlines[k].replace(/[ ]*$/, '  ');
						// ADDED: 2 spaces at end of each line clue Markdown to put items on a separate lines --fac 2008-06-17
				
					SL.text += bf + ourlines[k] + "\n";
				}
				myEditor.value = SL.startstr + '\n\n' + SL.text + '\n' + SL.endstr;
					// ADDED: 2 returns required after the startstr or we get br tags rather than  ol/ul li --fac 2008-06-17
				
				break;
		case "orderedlist":  
				var mkdwn = myToolbar.buttonOptions.orderedlist.split(/\|\|/);
				var bf = mkdwn[0]; var af = mkdwn[1];
				var ourlines = SL.text.split(/\r\n|\r|\n/);
				SL.text = "";
				for (var k in ourlines) {
					var x = parseInt(k) + 1;
					bf = x + '. ';
					ourlines[k] = ourlines[k].replace(/[ ]*$/, '  ');
						// ADDED: 2 spaces at end of each line clue Markdown to put items on a separate lines --fac 2008-06-17
					
					SL.text += bf + ourlines[k] + "\n";
				}
				myEditor.value = SL.startstr + '\n\n' + SL.text + '\n' + SL.endstr;
					// ADDED: 2 returns required after the startstr or we get br tags rather than  ol/ul li --fac 2008-06-17
				break;
		case "link": 
				var theURL = prompt("Enter the URL for this link:", "http://");
				var tooltip = prompt("Enter the \"tooltip\" for this link:", "");
				if (theURL != null) {	
					var label = '[' + SL.text + '][]';
					var rfstr = '[' + SL.text + ']: ' + encodeURI(theURL);
					if (tooltip != "") { rfstr += ' "' + tooltip + '"'; }
					SL.endstr.replace(/\s+$/, ""); //dump all trailing line endings
					myEditor.value = SL.startstr + label + SL.endstr + '\n' + rfstr + '\n'; 
				} break;
		case "image": 
				var theURL = prompt("Enter the URL for this image:", "http://");
				var alt = prompt("Enter the \"alt\" text for this image:", "");
				if (theURL != null) {
					var words = alt.split(/ /);
					var label = '![' + alt + '][' + words[0] + ']';
					var rfstr = '[' + words[0] + ']: ' + encodeURI(theURL);
					SL.endstr = SL.endstr.replace(/\s+$/, ""); //dump all trailing line endings
					SL.endstr = SL.endstr.replace(/^(\S)/, " $1");
					SL.startstr = SL.startstr.replace(/(\S)$/, "$1 ");
					myEditor.value = SL.startstr + label + SL.endstr + '\n' + rfstr + '\n'; 
				} break;
		case "block": 
				var formatMenu = document.getElementById(myToolbar.toolset.id+"SmBlock");
				var f = formatMenu.options;
				if (f.selectedIndex == 0) {break;} 
					//otherwise a needless repeat of this action
				
				var ourLabel = f[f.selectedIndex].text;
				var multilineBlocks = ["\u21E5", "\u21E5\u21E5", "Pre"];
				var done = 0;
				for (i in multilineBlocks) {
					if (ourLabel == multilineBlocks[i]) {
						var ourlines = SL.text.split(/\r\n|\r|\n/);
						SL.text = "";
						for (var k in ourlines) {
							if (this.parentNode) {
								SL.text += this.value + ourlines[k] + "  \n"; 
									//2 spaces must precede the newline for multiline blocks
							} else if (e.srcElement) {
								SL.text += e.srcElement.value + ourlines[k] + "  \n"; 
									//2 spaces must precede the newline for multiline blocks
							}
							if (ourLabel.indexOf("quote") != -1) {
								SL.text += "\n"; //double line break
							}
						}
						myEditor.value = SL.startstr + '\n\n' + SL.text + '\n' + SL.endstr;
							// ADDED: 2 returns required after the startstr or we get br tags rather than  ol/ul li --fac 2008-06-17

						done = 1;
						break; //just out of the multiline loop
					}
				}
				if (!done) {
					// Probably not a multiline block...
					SL.startstr = (SL.startpos > 0 && ((/[\r\n]+$/.test(SL.startstr) && SL.startstr) || (SL.startstr += '\n'))) || "";
						// Use /regex/.test(string) format, rather than /regex/(string) shortcut, for opera 9.x and IE --fac 2008-06-17
					
					if (this.parentNode) {
						myEditor.value = SL.startstr + this.value + SL.text + '\n' + SL.endstr.replace(/^\s+/, "");
					} else if (e.srcElement) {
						// IE support
						myEditor.value = SL.startstr + e.srcElement.value + SL.text + '\n' + SL.endstr.replace(/^\s+/, "");
					}
				}
				f.selectedIndex = 0; 
				break;
		default: 
				/* xhtml, mode, undo, and redo buttons are controlled from the 
				conversion object, which imports an instance of this object --fac*/
		}
		return com.xpreventDefault(e);
		return false;
	}
};

//|<=================== Converter ===============>|

ITTY.editor.converter = {
	_class_   : "converter",
	_parent_  : ITTY.editor,
	_version_ : "0.1",
	com       : ITTY.editor.common,
	
	//-----------------------------------------------
	// make [+--fac]
	// creates an instance of the converter
	// called by setupEditor, onload
	// calls  com.xsetAttribute, com.xaddEventListener, 
	//    ontextinput, (toolbar).insertselect,
	//    (toolbar).insertbutton, onxhtmlinput
	// modifies toolbar, help, and preview nodes
	//-----------------------------------------------
	make     : function (oMarkdown, oOutbox, oCodeInput, oEmpty) {
		// imports instance of ITTY.editor.toolbar
		/* calls com.xsetAttribute, com.xaddEventListener, ontextinput, 
		   onxhtmlinput, (toolbar instance).insertbutton, 
		   (toolbar instance).insertselect,
		*/
		if (!oMarkdown || !oMarkdown._class_ || oMarkdown._class_ != "toolbar" || !oMarkdown.Editor) {return;}
		//------------------------------
		// Settings and Hooks for 
		// Methods and Buttons
		//------------------------------
		var self = this;
		var com = ITTY.editor.common;
		this.outputarea = oOutbox || undefined;
		this.xhtmlinputarea = oCodeInput;
		this.Markdown = oMarkdown;
		this.Markdown.tablet  = oMarkdown.Editor;
		this.Markdown.tablet.value = "";
			//import "ittyToolbar" instance and the output DOM object
		
		this.currentView = oMarkdown.Editor;
		this.Markdown.infoelement = oEmpty || undefined;
		this.processingTime;
		this.lastText = " ";
		this.lastXHTML = " ";
		this.lastOutput = " ";
		this.maxDelay = 300;
		this.mode = "text";
		this.modeisvalid = function (sMode) {
			if (sMode == "text" || sMode == "xhtml") {
				return true;
			}	return false;
		};
		
		//------------------------------
		// History for undo/redo
		// of text (for now)
		//------------------------------	
		this.currentView = "o_TextIn",
		this.view = { 
			self     : this,
			o_TextIn : {
				domnode : function () {return self.Markdown.tablet;},
				history : [""],
				removed : []
			},
				// only converted text will be recorded in history, otherwise undo/redo is not meaningful and becomes tedious --fac
	
			o_CodeOut : {
				domnode : function () {return self.outputarea;}
					// neither history nor undo/redo functions are desired here, as this is not an input area --fac
			},
	
			o_CodeIn : {
				domnode : function () {return self.xhtmlinputarea;},
				history : [""],
				removed : []
			}
			// only converted xhtml will be recorded in history, otherwise undo/redo is not meaningful and becomes tedious --fac
		};	
		
		//------------------------------
		// Pro-create Preview Area
		// Default: append to body 
		//------------------------------
		this.oPreviewEl = document.getElementById("ittyeditorpreview") || null;
		this.oPreviewElContainer;
			// parent div for ittyeditorpreview (if there is one)
		
		var previewarea = this.oPreviewEl || null;
		if (!previewarea && document.createElement) {
			previewarea = document.createElement('div');
			com.xsetAttribute(previewarea, 'id', 'ittyEditorPreview');
				// create it if one wasn't provided
		}
		if (this.oPreviewElContainer && typeof this.oPreviewElContainer == "object") {
			this.oPreviewElContainer.appendChild(previewarea);
				// if a parent-div was provided for the preview, use that			
		} else {
			var bodyRef = document.getElementsByTagName("body").item(0);
			bodyRef.appendChild(previewarea);
				// default: append preview to doc. body
		}
		this.previewarea = previewarea;
		
		//------------------------------
		// Arrays for special handling
		// in Markdown 2 xhtml process
		//------------------------------
		this.aURLs       = [];   //MOD: was g_urls (new Array) --fac
		this.aTitles     = [];   //MOD: was g_titles (new Array) --fac
		this.aHTMLBlocks = [];   //MOD: was g_html_blocks (new Array) --fac
		this.nListLevel  = 0;    //MOD: was g_list_level; track inside lists --fac
		this.nTabWidth   = 4;    //ADDED: but never used; referenced in showdown notes as g_tab_width --fac
		this.convert2codebtnclass  = "";
		this.Markdown.xmlconverter = this; 
			/* reference to all of "this", for benefit of converter button handlers to reach the converter object instance from where they sit, in the toolbar --fac */
		
		//------------------------------
		// Special Buttons: xhtml, undo
		// redo, mode menu, help
		//------------------------------
		var oXHtmlBtn = oMarkdown.insertbutton(oMarkdown.toolset.id + "BtxHTML", "ittyToolbarxHTML", "View xHTML Source", "xhtml", 0, self.convertM2xHTML, 0);
			// add xhtml button click-listener via a cross-browser function --fac
			
		this.convert2codebtnclass  = oXHtmlBtn.className;
			// oXHtmlBtn's className changes in xhtml mode. convert2codebtnclass is a holder for the last className registered. --fac, 2008-06-20
				
		var oUndoBtn = oMarkdown.insertbutton(oMarkdown.toolset.id + "BtUndo", "ittyToolbarUndo", "Undo", "undo", 1, self.undoredo, 0);
		var oRedoBtn = oMarkdown.insertbutton(oMarkdown.toolset.id + "BtRedo", "ittyToolbarRedo", "Redo", "redo", 1, self.undoredo, 0);
	
		var oModesSel = oMarkdown.insertselect(oMarkdown.toolset.id + "SmMode", "ittyToolbarSelectMode", oMarkdown.modeOptions, "mode", 0, self.changemodes, 0);
			/* add the mode selection to the toolbar; it toggles text and xhtml mode.
		   	default value is text. If xhtml is selected, someone can paste in html to the
		   	field and convert it to Markdown text.*/
		
		var oHelpBtn = oMarkdown.insertbutton(oMarkdown.toolset.id + "BtHelp", "ittyToolbarHelp", "Help", "help", 1, self.markdownhelp, 0);
		
		//------------------------------
		// text input and 
		// paste events [--jf, mod--fac]
		//------------------------------	
		var markdownInputPasteCheck;
		inputPastePolling = window.setInterval(function(){if (self.Markdown.tablet.value != self.lastText) {self.ontextinput("", self);}}, 2000);
			// Polls for uncaptured paste events [adapted from showdown-gui]. 
			/* 	At a lower setting (every 1000 ms), I think that ontexinput's 
				cancellation of its timed event was colliding with the frequent 
				requests; and that they kept getting cancelled. At 2000 ms this 
				is running smoother. Once polling is off (if onpaste works), 
				then we're off to the races. Everything gets smooth pretty fast.
				--fac */

		this.Markdown.tablet.onpaste = function(e) {
			if (markdownInputPasteCheck != null || markdownInputPasteCheck != undefined) {
				window.clearInterval(markdownInputPasteCheck);
				markdownInputPasteCheck = undefined;
			} // onpaste works, clear paste-check interval....
		
			self.ontextinput(e, self);
		}; // Converts after text is pasted, rather than typed; and displays live preview [from showdown-gui--jf]
	
	
		this.Markdown.tablet.oku = function(e) {
			self.ontextinput(e, self);
		}; // onkeyup handler, converts typed input on the fly and displays live preview [from showdown-gui]

		com.xaddEventListener(self.Markdown.tablet, "input", self.Markdown.tablet.onpaste, false);
		com.xaddEventListener(self.Markdown.tablet, "keyup", self.Markdown.tablet.oku, false);
			// add onpaste and onkeyup listeners to text input textarea, via a cross-browser function --fac
			// xaddEventListener is not instance-dependent, its object is first arg. --fac
		
		//------------------------------
		// xhtml input and 
		// paste events (based on text 
		// input and paste routines)
		//------------------------------
		var codeInputPasteCheck;
		codeInputPasteCheck = window.setInterval(function(){if (self.xhtmlinputarea.value != self.lastXHTML) {self.onxhtmlinput("", self);}}, 2000);
			// Polls for uncaptured paste events [a la showdown-gui--jf]. 
			/* 	At a lower setting (every 1000 ms), I think that ontexinput's 
				cancellation of its timed event was colliding with the frequent 
				requests; and that they kept getting cancelled. At 2000 ms this 
				is running smoother. Once polling is off (if onpaste works), 
				then we're off to the races. Everything gets smooth pretty fast.
				--fac */
		this.xhtmlinputarea.onpaste = function(e) {
			if (codeInputPasteCheck != null || codeInputPasteCheck != undefined) {
				window.clearInterval(codeInputPasteCheck);
				codeInputPasteCheck = undefined;
			} // onpaste works, clear paste-check interval....
		
			self.onxhtmlinput(e, self);
		}; // Converts after text is pasted, rather than typed; and displays live preview [adapted from showdown-gui]
	
	
		this.xhtmlinputarea.oku = function(e) {
			self.onxhtmlinput(e, self);
		}; // onkeyup handler, converts typed input on the fly and displays live preview [from showdown-gui]

		com.xaddEventListener(self.xhtmlinputarea, "input", self.xhtmlinputarea.onpaste, false);
		com.xaddEventListener(self.xhtmlinputarea, "keyup", self.xhtmlinputarea.oku, false);
			// add onpaste and onkeyup listeners to xhtml input textarea, via a cross-browser function --fac
			// xaddEventListener is not instance-dependent, its object is the first argument --fac
		
		//------------------------------
		// Pro-create HELP NODE
		// keep it handy 
		//------------------------------
		var helptxt = ITTY.editor.markdownhelp.en;
			// html markup
		
		var helpdiv = document.createElement("div");
		com.xsetAttribute(helpdiv, "id", "markdownhelp"); 
		com.xsetAttribute(helpdiv, "style", "background-color: #FFE5C4; width: 450px; height: 250px; overflow: auto; position: relative; z-index: 1000; border: 1px dotted red;");
		com.xsetAttribute(helpdiv, "cssText", "background-color: #FFE5C4; width: 450px; height: 250px; overflow: auto; position: relative; z-index: 1000; border: 1px dotted red;");
			// IE
		
		helpdiv.innerHTML = helptxt;
			// range throws invalid node error, when used here, probably because helpdiv isn't a valid document node yet --fac

		this.helpnode = helpdiv;
			/* the help button will add this into the document, when clicked.
			   maintain reference to this.helpnode when node is removed! --fac */	
			   
		//------------------------------
		// Pro-create TOOLBAR TUTORIAL NODE
		// keep it handy 
		//------------------------------
		this.tutorialtxt = ITTY.editor.tutorial.en;
			// tutorial consists of a concatenated string of html markup 

		return self;
	}, //make the converter object
	
	//------------------------------
	// getmodes [+--fac]
	// convenience function
	// not called internally
	//------------------------------
	getmodes : function () {
		return ["markdown", "xhtml"];
	},
	
	//------------------------------
	// setvars [+--fac]
	// user convenience function
	// not called internally.
	// Change defaults or extends 
	// the object
	//------------------------------
	setvars : function (oVars) {
		if (!this._class_ || this._class_ != "converter" || this._parent_ != ITTY.editor || !oVars) {return;}

		var c = this;
		for (var key in oVars) {
			if (/^\d+$/.test(key)) {break;} 
				// numerical keys not allowed in this {object}
				// Use /regex/.test(string) format, rather than /regex/(string) shortcut, for opera 9.x and IE --fac 2008-06-17
				
			c[key] = oVars[key];
				//choose wisely
		}
	},
	
	//------------------------------
	// markdownhelp [+--fac]
	// oHelpBtn click handler
	// calls  com.xpreventDefault
	//------------------------------
	markdownhelp : function(e) {
		var isa = ITTY.editor.converter;
		var com = ITTY.editor.common;
		var myToolbar = (this.parentNode && this.parentNode.parentNode._parent_) || (e.srcElement && e.srcElement.parentElement.parentElement._parent_);
			// MOD: IE support. The button link was not yet attached to a DOM node when its event was defined. I think that is why IE doesn't associate a "parentNode" attribute with it. --fac 2008-06-20

		var currvtag    = myToolbar.xmlconverter.currentView;
			// we'll flip back to this view when clicked again...I don't know that the script currently uses currentView as intended, if at all? --fac

		var Cnv = myToolbar.xmlconverter;	
		var actionkeyword = (this.parentNode && com.xgetAttribute(this, 'actionkeyword')) || (e.srcElement && com.xgetAttribute(e.srcElement, 'actionkeyword'));
			// IE support added --fac, 2008-06-20
		
		if (actionkeyword == "help") {
			//-------------------------
			// Insert the helpnode--  
			// created in make and just
			// hanging loose, before 
			// the preview section.
			//-------------------------
			if (Cnv.helpnode && Cnv.helpnode.nodeType == Node.ELEMENT_NODE) {
				if (myToolbar.infoelement && myToolbar.infoelement.nodeType == Node.ELEMENT_NODE) {
					myToolbar.infoelement.appendChild(Cnv.helpnode);
						// try adding to the info/footer first --fac
				
				} else {
					Cnv.previewarea.parentNode.insertBefore(Cnv.helpnode, Cnv.previewarea);
						// add help just before the preview area. 
						//todo: what if preview is on the side? oops. ---fac
				
				}
			}
			//-------------------------
			// The actionkeyword change 
			// flags the current status
			// of help as 'ON'.
			//-------------------------
			if (this.parentNode) {
				com.xsetAttribute(this, "actionkeyword", "helpON");
				// change the actionkeyword to indicate the current status --fac
			} else if (e.srcElement) {
				com.xsetAttribute(e.srcElement, 'actionkeyword', "helpON");
			}
		
		} else {
			//-------------------------
			// Remove the help node and 
			// set the actionkeyword 
			// back to normal.
			//-------------------------
			var myhelp = document.getElementById("markdownhelp");
			Cnv.helpnode = myhelp.parentNode.removeChild(myhelp);
				// remove it, but save it back to use again next time --fac
			if (this.parentNode) {
				com.xsetAttribute(this, "actionkeyword", "help");
					// change the actionkeyword back to normal status --fac 
			} else if (e.srcElement) {
				com.xsetAttribute(e.srcElement, 'actionkeyword', "help");
			}
		}
		return com.xpreventDefault(e);
		return false;
	},
	
	//-----------------------------------------------
	// undoredo [+--fac]
	// oUndoBtn, oRedoBtn handler
	// calls  com.xgetAttribute, com.xpreventDefault
	// modifies view object, Markdown.tablet.value
	//-----------------------------------------------
	undoredo : function (e) {
		var isa = ITTY.editor.converter;
		var com = ITTY.editor.common;
		var myToolbar = (this.parentNode && this.parentNode.parentNode._parent_) || (e.srcElement && e.srcElement.parentElement.parentElement._parent_);
			// MOD: IE support added. The button link was not yet attached to a DOM node when its event was defined. I think that is why IE doesn't associate a "parentNode" attribute with it. --fac 2008-06-20

		var currvtag    = myToolbar.xmlconverter.currentView;
		var a_history   = myToolbar.xmlconverter.view[currvtag].history;
		var o_CVObj     = myToolbar.xmlconverter.view[currvtag].domnode();
		var a_rmhistory = myToolbar.xmlconverter.view[currvtag].removed;
		var i_hlen      = a_history.length;
		if (currvtag.indexOf('In') == -1) {return;}
		var actionkeyword = (this.parentNode && com.xgetAttribute(this, 'actionkeyword')) || (e.srcElement && com.xgetAttribute(e.srcElement, 'actionkeyword'));
			// IE support added. --fac, 2008-06-20
		
		//-------------------------
		// Undo & Redo manipulate 
		// and use the view.history
		// object created in make.
		//-------------------------
		if (actionkeyword == "undo") {
			if (i_hlen >= 2) {
					//hlen - 2 = first possible level of undo, because (hlen - 1) = the current state --fac
				
				var n = i_hlen - 1;
				o_CVObj.value = a_history[n-1];
				var s_removed = a_history.splice(n, 1);
				a_rmhistory.push(s_removed);
					//unlimited level of undo's --fac
			
			}
		} else if (actionkeyword == "redo") {
			var s_lastremoved = a_rmhistory.pop() || null;
			o_CVObj.value = s_lastremoved || o_CVObj.value;
			if (s_lastremoved) {
				a_history.push(s_lastremoved);
			}
		}
		return com.xpreventDefault(e);
		return false;
	},
	
	//-----------------------------------------------
	// changemodes [+--fac]
	// oModesSel (mode select menu) onchange handler
	// calls  com.xgetAttribute, com.xpreventDefault
	//     (toolbar).enable, (toolbar).disable, 
	// modifies (sub)header, textarea classNames,
	//     xhtmlinputarea.value currentView
	//-----------------------------------------------
	changemodes : function (e) {
		var isa = ITTY.editor.converter;
		var com = ITTY.editor.common;
		var actionkeyword = (this.parentNode && com.xgetAttribute(this, 'actionkeyword')) || (e.srcElement && com.xgetAttribute(e.srcElement, 'actionkeyword'));
			// IE support added. --fac, 2008-06-20
			
		if (actionkeyword.indexOf("mode") != -1) {
			//-------------------------
			// No converter button has
			// been clicked here. Only
			// the mode selection has 
			// changed. Set up the 
			// definitions first.
			//-------------------------
			var myvalue = (this.options && this.options[this.options.selectedIndex].value) || (e.srcElement && e.srcElement.options[e.srcElement.options.selectedIndex].value);
			var myToolbar = (this.parentNode && this.parentNode.parentNode._parent_) || (e.srcElement && e.srcElement.parentElement.parentElement._parent_);
				// MOD: IE support added. The button link was not yet attached to a DOM node when its event was defined. I think that is why IE doesn't associate a "parentNode" attribute with it. --fac 2008-06-20

			var oCodebtn = document.getElementById(myToolbar.registeredButtonIds.xhtml) || document.getElementById(myToolbar.registeredButtonIds.html);
			
			if (!myToolbar) return;
			var oHdr = document.getElementById(myToolbar.Editor.id + 'Header') || undefined;
			
			//-------------------------
			// Test for mode.
			//-------------------------
			if (myvalue == "text" || myvalue == "markdown") {
				//-------------------------
				// The visitor has just 
				// flipped from xhtml mode 
				// to text, without making
				// a conversion.
				//-------------------------
				myToolbar.xmlconverter.mode = "text";	
				//-------------------------
				// Change converter btn.
				// back to original class.
				//-------------------------
				if (oCodebtn) {
					if (oCodebtn.firstChild.className == "ittyToolbarCode2text") {
						oCodebtn.firstChild.className = myToolbar.xmlconverter.convert2codebtnclass;
					}
				}
				//-------------------------
				// Only then re-enable the 
				// toolbar buttons. Enable 
				// also resets the title.
				//-------------------------
				myToolbar.enable();
				//-------------------------
				// Change the subheader.
				// Tell visitor what to do 
				// with this screen.
				//-------------------------
				if (oHdr) {
					oHdr.innerHTML = oHdr.innerHTML.replace(/(?:x\/HTML \(paste code to field\))|(?:Source Code \(read only\))/, "Input");
				}
				//-------------------------
				// Bring Text Editor to 
				// front; make _visible_.
				//
				// Firefox redraw curse 
				// is broken! Invisibility 
				// of underlying z-stacked 
				// TextAreas fixes Firefox
				// top TextArea redraw bug!
				// --fac, 2008-06-19
				//-------------------------
				myToolbar.xmlconverter.currentView = "o_TextIn";
				myToolbar.xmlconverter.outputarea.className="ittyEditorBackpane";
				myToolbar.xmlconverter.xhtmlinputarea.className="ittyEditorBackpane";
				myToolbar.Editor.className="ittyEditorFrontpane";
			} else if (myvalue == "xhtml") {
				//-------------------------
				// The visitor has just 
				// flipped from text mode 
				// to xhtml, without making
				// a conversion.
				//-------------------------
				myToolbar.xmlconverter.mode = "xhtml";
				//-------------------------
				// In this case, disable 
				// toolbar buttons first.
				// --fac, 2008-06-07
				//-------------------------
				myToolbar.disable();
				//-------------------------
				// Only then, change the 
				// Converter btn. to 
				// "to-Text". If it was 
				// changed first, then it 
				// would be disabled with 
				// the rest of the buttons.
				//-------------------------
				var sCodebtnTitle = com.xgetAttribute(oCodebtn.firstChild, 'title');
				if (oCodebtn) {
					myToolbar.xmlconverter.convert2codebtnclass = oCodebtn.firstChild.className;
						// Save back the original className to convert2codebtnclass. 
					
					oCodebtn.firstChild.className = "ittyToolbarCode2text";
						// Then, change the className of the button. This switches out the converter button image. --fac
					
					com.xsetAttribute(oCodebtn.firstChild, "title", "Convert Code to Markdown Text"); 
						// +--fac, 2008-06-13, Friday!
				}
				//-------------------------
				// Bring XHTML Editor to 
				// front; make _visible_.
				//-------------------------
				myToolbar.xmlconverter.outputarea.className = "ittyEditorBackpane";
				myToolbar.Editor.className = "ittyEditorBackpane";
				myToolbar.xmlconverter.xhtmlinputarea.className = "ittyEditorFrontpane";
				//-------------------------
				// Use converted SourceCode 
				// for the  XHTML editor's  
				// starting value, if 
				// there's nothing but 
				// maybe white-space in the
				// XHTML editor, initially.
				//-------------------------
				if (/^\s*$/.test(myToolbar.xmlconverter.xhtmlinputarea.value) && !/^\s*$/.test(myToolbar.xmlconverter.outputarea.value)) {
					myToolbar.xmlconverter.xhtmlinputarea.value = myToolbar.xmlconverter.outputarea.value;
				}
				//-------------------------
				// Change the subheader.
				// Tell visitor what to do 
				// with this screen.
				//-------------------------
				if (oHdr) {
					oHdr.innerHTML = oHdr.innerHTML.replace(/Input|(?:Source Code \(read only\))/, "x\/HTML \(paste code to field\)");
				}
				myToolbar.xmlconverter.currentView = "o_CodeIn"; // Is this really used? --fac
			}
		}
		return com.xpreventDefault(e);
		return false;
	},
	
	//-------------------------------------------------------------------
	// convertM2xHTML [--fac]
	// oXHtmlBtn, oCodebtn button click handler
	// starts and finishes the 2-way conversion procedure
	// calls  com.xgetAttribute, com.xpreventDefault, com.addStringToDOM, 
	//    html2markdown, convert, (toolbar).enable, (toolbar).disable, 
	// modifies (sub)header, textarea classNames, xhtmloutput.value, 
	//    currentView, mode, (these button) actions, view.history, 
	//	  processingTime, infoelement
	//-------------------------------------------------------------------
	convertM2xHTML : function (e) {
		var text, startTime, endTime, docfrag, myEditor, thisaction, 
			isa = ITTY.editor.converter, 
			com = ITTY.editor.common, 
			myToolbar = (this.parentNode && this.parentNode.parentNode._parent_) || (e.srcElement && e.srcElement.parentElement.parentElement._parent_);
				// MOD: IE support added. The button link was not yet attached to a DOM node when its event was defined. I think that is why IE doesn't associate a "parentNode" attribute with it. --fac 2008-06-20
				// "this" now refers to the toolbar button that fired off the click --fac

		if (!myToolbar) return;
		//-------------------------
		// Continue setup....
		//-------------------------
		var oHdr = document.getElementById(myToolbar.Editor.id + 'Header') || undefined, 
			oModebtn = document.getElementById(myToolbar.registeredButtonIds.mode), 
			actionkeyword = (this.parentNode && com.xgetAttribute(this, 'actionkeyword')) || (e.srcElement && com.xgetAttribute(e.srcElement, 'actionkeyword')), 
			modeaction = com.xgetAttribute(oModebtn, 'actionkeyword'), 
			previewarea = myToolbar.xmlconverter.previewarea, 
			a_History = myToolbar.xmlconverter.view.o_TextIn.history;
		
		if (actionkeyword.indexOf('ON') != -1) {
			//-------------------------
			// Markdown-to-xHTML 
			// Conversion just 
			// occurred. Only 2 paths
			// exist from here: flip 
			// view to text input, or 
			// convert xhtml to 
			// Markdown.
			//-------------------------	
			if (myToolbar.xmlconverter.mode == "text") {
				//-------------------------
				// Switch views only, 
				// from xHTML conversion 
				// to text input.
				//-------------------------
				thisaction = "change viewport from xhtml conversion to markdown";
				//-------------------------
				// Change the subheader.
				// Tell visitor what to do 
				// with this screen.
				//-------------------------
				if (oHdr) {
					oHdr.innerHTML = oHdr.innerHTML.replace(/Source Code \(read only\)/, "Input");
				}
				myToolbar.xmlconverter.currentView = "o_TextIn"; // meaningless, now? --fac
				//-------------------------
				// Set variable, text, to  
				// the last text input 
				// item in history.
				//-------------------------
				text = a_History[a_History.length-1];
			} else if (oHdr) {
				//-------------------------
				// Mode is 'xhtml' and 
				// The converter btn. was 
				// clicked. Convert from 
				// pasted or typed code
				// to Markdown.
				// [+--fac, 2008-05-28]
				//-------------------------
				thisaction = "convert xhtml input to markdown";
				//-------------------------
				// Reset the Converter 
				// btn and Mode menu
				// actionkeyword's.
				//-------------------------
				actionkeyword.replace(/ON/, "");
				modeaction.replace(/ON/, "");
				//-------------------------
				// Reset the Mode menu 
				// selection to 'text'.
				//-------------------------
				for (var i=0, l=oModebtn.options.length; i < l; i++) {
					if (oModebtn.options[i].text == "text") {
						oModebtn.options.selectedIndex = i;
						break;
					}
					// Note: IE doesn't equate for (i in oModebtn.options) with the options numerical index; so a straight for-loop is necessary. --fac
				} 
				//-------------------------
				// Push xHTML input/paste
				// to Code history first.
				//-------------------------
				myToolbar.xmlconverter.view.o_CodeIn.history.push(myToolbar.xmlconverter.xhtmlinputarea.value);
				
				startTime = new Date().getTime();				
				//-------------------------
				// Convert xHTML input to
				// Markdown and push to 
				// Text history in _one_ 
				// _step_, so as not to
				// trigger incremental
				// conversion. (mod)
				// [--fac 2008-06-20]
				//-------------------------
				myToolbar.xmlconverter.view.o_TextIn.history.push(myToolbar.xmlconverter.html2markdown(myToolbar.xmlconverter.xhtmlinputarea.value, myToolbar.Editor, 0));								
				
				endTime = new Date().getTime();
				myToolbar.xmlconverter.processingTime = (endTime - startTime);
				
				//-------------------------
				// Change the subheader.
				// Tell visitor about this
				// screen.
				// [+--fac, 2009-06-05]	
				//-------------------------
				oHdr.innerHTML = oHdr.innerHTML.replace(/(?:x\/HTML \(paste code to field\))|Iput/, "Your code converted to Markdown text");
				
				myToolbar.xmlconverter.mode = "text";
				//-------------------------
				// Change Converter btn.
				// back to XHTML.
				// [+--fac, 2009-06-05]	
				//-------------------------
				var xmlbtn = document.getElementById(myToolbar.registeredButtonIds.xhtml) || document.getElementById(myToolbar.registeredButtonIds.html);
				if (xmlbtn.firstChild.className == "ittyToolbarCode2text") {
					xmlbtn.firstChild.className = myToolbar.xmlconverter.convert2codebtnclass;
				}				
				//-------------------------
				// Grab recent text-input
				// history, because it 
				// just got updated with 
				// the xhtml-to-text 
				// conversion.
				//-------------------------
				a_History = myToolbar.xmlconverter.view.o_TextIn.history;				
				//-------------------------
				// Set text to the last 
				// item in text-input 
				// history.
				//-------------------------
				text = a_History[a_History.length - 1]; 
			}
			myToolbar.xmlconverter.currentView = "o_TextIn"; // Is this necessary? --fac
			//-------------------------
			// Bring Markdown Editor to 
			// front; make _visible_.
			//-------------------------
			myToolbar.Editor.className = "ittyEditorFrontpane";
			myToolbar.xmlconverter.outputarea.className = "ittyEditorBackpane";
			myToolbar.xmlconverter.xhtmlinputarea.className = "ittyEditorBackpane";			
			//-------------------------
			// Only now Enable the 
			// grayed-out toolbar btns.
			// The Converter btn.'s 
			// className has already 
			// been changed back to
			// its /XHTML/ class.
			//-------------------------
			var tbEnabled = myToolbar.enable(); 
				// Important: let the variable accept the return from the function. --fac
		} else {
			//-------------------------
			// The Markdown-to-XHTML 
			// Converter btn. was 
			// just used. Setup for 
			// conversion process.
			// This is all just 
			// preparation, history, 
			// and viewport control.
			//-------------------------
			thisaction = "convert markdown input to xhtml";
			//-------------------------
			// Disable toolbar buttons.
			// Set actionkeyword status
			// flags.
			//-------------------------
			myToolbar.disable();				
			//-------------------------
			// Set lastText to value 
			// before conversion.
			// lastText is used by
			// incremental conversion
			// and onpaste only.
			// --fac 2008-06-17
			//-------------------------
			myToolbar.xmlconverter.lastText = myToolbar.Editor.value;
			//-------------------------
			// Add pre-converted text 
			// to Text input history.
			// [+--fac, 2008-06-17]
			//-------------------------
			myToolbar.xmlconverter.view.o_TextIn.history.push(myToolbar.Editor.value);
			//-------------------------
			// Bring xHTML output to
			// front; make _visible_.
			//-------------------------		
			myToolbar.Editor.className = "ittyEditorBackpane";
			myToolbar.xmlconverter.xhtmlinputarea.className="ittyEditorBackpane";
			myToolbar.xmlconverter.outputarea.className="ittyEditorFrontpane";
			//-------------------------
			// Change the subheader.
			// Tell visitor about this
			// screen.
			// [+--fac, 2009-06-05]	
			//-------------------------
			if (oHdr) {
				oHdr.innerHTML = oHdr.innerHTML.replace(/Input|(?:Your code converted to Markdown text)/, "Source Code \(read only\)");
			}
			myToolbar.xmlconverter.currentView = "o_CodeOut"; //is this necessary?
		}
		//-------------------------
		// Follow-through. 
		// Everything ends up here. 
		//-------------------------
		myEditor = myToolbar.Editor;
		if (!docfrag) {
			docfrag = document.createDocumentFragment();
		} // Otherwise, just use the old docfrag shell. --fac, 2008-06-18
		//-------------------------
		// Prepare the preview area 
		// for a new preview.
		//-------------------------
		while (previewarea && previewarea.childNodes.length > 0) {
			var rchprev = previewarea.removeChild(previewarea.childNodes[0]);
				// Note: removeChild dynamically changes the childNodes array order (like shift/unshift). Thus a while loop plus static childNodes[0] --fac
		}
		if (thisaction == "convert markdown input to xhtml") {
			//-------------------------
			// Convert Markdown to
			// xHTML. Assign to common 
			// variable, text.
			//-------------------------
			startTime = new Date().getTime();		
			
			text = myToolbar.xmlconverter.convert(myEditor.value);
			
			endTime = new Date().getTime();
			myToolbar.xmlconverter.processingTime = (endTime - startTime);
			
			//-------------------------
			// lastOutput is used to   
			// fill preview when the 
			// viewport is simply 
			// switched from xhtml 
			// output to text input.
			//
			// Converted code isn't 
			// recorded in history.
			// --fac, 2008-06-18
			//-------------------------
			myToolbar.xmlconverter.lastOutput = text;
		}
				
		processingTime = myToolbar.xmlconverter.processingTime;
		if (docfrag) {
			if (docfrag.firstChild) {
				docfrag.insertBefore(document.createTextNode(processingTime + ' ms'), docfrag.firstChild);
			} else {
				docfrag.appendChild(document.createTextNode(processingTime + ' ms'));
			}
		}
		//-------------------------
		// Grab actionkeyword to 
		// test for ON-status.
		// It was reset in the 
		// if-else blocks, above.
		//-------------------------
		actionkeyword = (this.parentNode && com.xgetAttribute(this, 'actionkeyword')) || (e.srcElement && com.xgetAttribute(e.srcElement, 'actionkeyword'));
			// MOD: Modified to support IE. --fac

		if (myToolbar.xmlconverter.outputarea && actionkeyword.indexOf('ON') != -1 || thisaction == "convert markdown input to xhtml") {
			//-------------------------
			// Set output view to the 
			// Markdown-to-xHTML
			// conversion code.
			// Add the same html 
			// to preview.
			//-------------------------
			myToolbar.xmlconverter.outputarea.value = text + '\n';
			com.addStringToDOM(previewarea, text);
		} else {
			//-------------------------
			// Set Text Input value and 
			// preview.
			//-------------------------
			myEditor.value = text;
			if (thisaction == "convert xhtml input to markdown") {
				//-------------------------
				// Just converted xHTML to
				// Markdown. Change preview 
				// to the code converted 
				// and saved to history.
				//-------------------------
				var last_CodeIn = myToolbar.xmlconverter.view.o_CodeIn.history[myToolbar.xmlconverter.view.o_CodeIn.history.length -1];
				com.addStringToDOM(previewarea, last_CodeIn);
			} else {
				//-------------------------
				// Just flipped from text- 
				// to-xHTML conversion view
				// back to text. Preview 
				// gets the saved xHTML.
				//-------------------------
				com.addStringToDOM(previewarea, myToolbar.xmlconverter.lastOutput);
			}
		}
		//-------------------------
		// Add ProcessTime ms
		// Before the Preview
		// Node
		//-------------------------
		if (typeof myToolbar.infoelement != "undefined") {
			var nfo = myToolbar.infoelement;
			if (nfo.childNodes.length) {
				///-------------------------
				// Remove Help/Tutorial
				//-------------------------
				var helpWasRemoved;
				while (nfo.childNodes.length > 1) {
					var rch = nfo.removeChild(nfo.childNodes[1]);
						//removeChild dynamically changes the childNodes array order (like shift/unshift). Thus a while loop plus static childNodes[index#] --fac
					
					if (rch && rch.id == "markdownhelp") {
						myToolbar.xmlconverter.helpnode = rch;
						helpWasRemoved  = 1;
					}
				}

				nfo.appendChild(docfrag);
				if (helpWasRemoved) {
					nfo.appendChild(myToolbar.xmlconverter.helpnode);
				}
			} else {
				//-------------------------
				// Replace the infoelement
				// and get a new Reference 
				// to the Node.
				//-------------------------
				 if (nfo.replaceChild) {
				 	var pp = nfo.parentNode;
				 	var docfragAdoptedChild = docfrag.firstChild;
				 	if (nfo.parentNode.replaceChild(docfrag, nfo)) {
				 		for (var z = 0, prevlen = pp.childNodes.length; z < prevlen; z++) {
							if (pp.childNodes[z] == docfragAdoptedChild) {
								myToolbar.infoelement = pp.childNodes[z];
								break;
							}
						}
					}
				}
			}
		} else {
			//-------------------------
			// Create the infoelement  
			// and get a Reference to 
			// the Node.
			//-------------------------
			var pp = previewarea.parentNode;
			if (previewarea.parentNode.childNodes.length > 1) {
				for (var z = 0, prevlen = pp.childNodes.length; z < prevlen; z++) {
					if (pp.childNodes[z] == previewarea) {
						if (pp.insertBefore(docfrag, pp.childNodes[z])) {
							myToolbar.infoelement = pp.childNodes[z];
						}
						break;
					}
				}
			} else {
				if (pp.insertBefore(docfrag, previewarea)) {
					myToolbar.infoelement = pp.childNodes[0];
				} 
			} //previewarea was an only child, at childNodes[0], prior to this insertion --fac
		}
		return com.xpreventDefault(e);
		return false;
		
	},
	
	//------------------------------------------
	// incrementalconversion [--jf, mod--fac]
	// converts text during typing (delayed)
	// called by ontextinput
	// calls  convert, com.addStringToDOM
	// modifies time and preview displays
	//------------------------------------------
	incrementalconversion : function () {
		var isa = ITTY.editor.converter;
		var com = ITTY.editor.common;
		var self = this;
		var text = this.Markdown.tablet.value;
		if (text == this.lastText) {
			//return;
		} else {
			this.lastText = text;
		
		var startTime = new Date().getTime();
		text = self.convert(text);
		var endTime = new Date().getTime();
		var processingTime = this.processingTime = (endTime - startTime);
		com.addStringToDOM(self.previewarea, text);
		}
	},
	
	//--------------------------------------------
	// ontextinput [--jf, mod--fac]
	// listener for text input (paste) and keyup
	// called by "input" and "keyup" listeners
	// calls  incrementalconversion
	// modifies ITTY.editorProcessTimer
	//--------------------------------------------
	ontextinput : function (e, o) {
		//WARNING: don't call an alert here, or you'll have to ForceQuit the browser :-o --fac
		var isa = ITTY.editor.converter;
		var self = o;
		if (ITTY.editorProcessTimer) {
			window.clearTimeout(ITTY.editorProcessTimer);
			ITTY.editorProcessTimer = undefined;
		} // cancel prescheduled
		
		if (!o) {return;}
		var pt = o.processingTime || 0;
		var max = o.maxDelay || 2000;
		var nexttime = (pt <= max && pt) || max;
		
		ITTY.editorProcessTimer = window.setTimeout(function(){self.incrementalconversion();}, nexttime);
	}, 
	
	//-----------------------------------------------
	// onxhtmlinput [+--fac]
	// listener for xhtmlinputarea input and keyup
	// called by "input" and "keyup" listeners
	// calls  nothing
	// modifies lastXHTML
	//-----------------------------------------------
	onxhtmlinput : function (e, o) {
		var isa = ITTY.editor.converter;
		var self = o;
		if (!o) {return;}
		var s = this.xhtmlinputarea.value;
		o.lastXHTML = s;
	}, // This doesn't do much now. If we started using the buttons for html editing, too, then this would be important. --fac
	
	//-----------------------------------------------
	// convert [--jf, mod--fac]
	// runs conversion sequence for markdown->xhtml
	// called by convertM2xHTML,incrementalconversion
	// calls  utl.detab, utl.unescapespecialchars,
	//    com.encodeAmpsAngles, dohtmlblocks, 
	//    runblocks  
	// modifies outputarea.value, aTitles
	//-----------------------------------------------
	convert : function (text) {
		/* markdown 2 xhmtl. The order for sub calls is essential. 
		   For example, link and image substitutions must happen before 
		   [ed. utl.escapetagattributes()], so that any 
		   *'s or _'s in the <a>and <img> tags get encoded. 
		*/	
		var isa = ITTY.editor.converter;
		var com = ITTY.editor.common;
		var utl = ITTY.editor.utility;
		
		this.aURLs       = [];
		this.aTitles     = [];
		this.aHTMLBlocks = [];
		this.nListLevel  =  0;
			//reset globals
		var self = this;
		text = text.replace(/~/g,"~T");
			//showdown: uses ~T for ~ to avoid md5 hashes

		text = text.replace(/\$/g,"~D");
			//showdown: uses ~D for $ during regex manipulation

		text = text.replace(/\r\n|\r/g,"\n");
			// MOD: consolidated regex --fac

		text = "\n\n" + text + "\n\n";
			//add a couple of newlines to start and end of text block
				
		text = utl.detab(text);
		text = text.replace(/^\s+$/mg,"");
			// strip lines consisting solely of spaces and tabs
		text = self.dohtmlblocks(text);
		text = text.replace(/^[ ]{0,3}\[(.+)\]:[ \t]*\n?[ \t]*<?(\S+?)>?[ \t]*\n?[ \t]*(?:(\n*)["(](.+?)[")][ \t]*)?(?:\n+|\Z)/gm, function (wholeMatch,m1,m2,m3,m4) {
			// strip link definitions; store in hashes
			
			m1 = m1.toLowerCase();
			self.aURLs[m1] = com.encodeAmpsAngles(m2);  
				// link IDs are case-insensitive
				
			if (m3) {
				self.outputarea.value += 'we have m3:'+ m3 + '\n';
				return m3 + m4;
					// blank lines indicate it's not a title; so put back the parenthetical statement
			} else if (m4) {
				self.aTitles[m1] = m4.replace(/"/g,"&quot;");
			}
			return "";
				// Completely remove the definition from the text
		});
		text = self.runblocks(text);
		
		text = utl.unescapespecialchars(text);
		
		text = text.replace(/~D/g, "$$");
			//showdown, restore dollar sign
			
		text = text.replace(/~T/g, "~");
			//showdown, restore tilde
		
		//......... con't............
		text = text.replace(/^\s*(.*?)\s*(\n?)$/, "$1$2");
		return text;
	}, 
	
	//---------------------------------
	// hashelement [--jf]
	// block text helper
	// called by dohtmlblocks
	// calls  nothing
	// modifies aHTMLBlocks
	//---------------------------------
	hashelement: function (wholeMatch,m1) {
		var isa = ITTY.editor.converter;
		var com = ITTY.editor.common;
		var blockText = m1;
		
		blockText = blockText.replace(/\n\n/g,"\n");
			// undo double lines
			
		blockText = blockText.replace(/^\n/,"");
		blockText = blockText.replace(/\n+$/g,"");
		blockText = "\n\n~K" + (this.aHTMLBlocks.push(blockText)-1) + "K\n\n";
			// replace element text with a marker ("~KxK" where x is its key)

		return blockText;
	},
	
	//---------------------------------
	// dohtmlblocks [--jf]
	// block html 
	// called by convert, runblocks
	// calls  hashelement
	// modifies text
	//---------------------------------
	dohtmlblocks : function (text) {
		var isa = ITTY.editor.converter;
		var self=this;
		text = text.replace(/\n/g,"\n\n");
			//showdown: double up blank lines to reduce lookaround
		
		var block_tags_a = "p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math|ins|del";
		var block_tags_b = "p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math";
			// handle hard-coded block-level html

		text = text.replace(/^(<(p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math|ins|del)\b[^\r]*?\n<\/\2>[ \t]*(?=\n+))/gm, function(wholeMatch,m1) {return self.hashelement(wholeMatch,m1);});
			// handle nested blocks (indentions) first; showdown note: "This regex can be expensive when it fails."

		text = text.replace(/^(<(p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math)\b[^\r]*?.*<\/\2>[ \t]*(?=\n+)\n)/gm, function(wholeMatch,m1) {return self.hashelement(wholeMatch,m1);});
			// match more liberally, from `\n<tag>` to `</tag>\n`

		text = text.replace(/(\n[ ]{0,3}(<(hr)\b([^<>])*?\/?>)[ \t]*(?=\n{2,}))/g, function(wholeMatch,m1) {return self.hashelement(wholeMatch,m1);});
			// handle <hr />

		text = text.replace(/(\n\n[ ]{0,3}<!(--[^\r]*?--\s*)+>[ \t]*(?=\n{2,}))/g, function(wholeMatch,m1) {return self.hashelement(wholeMatch,m1);});
			// standalone HTML comments:

		text = text.replace(/(?:\n\n)([ ]{0,3}(?:<([?%])[^\r]*?\2>)[ \t]*(?=\n{2,}))/g, function(wholeMatch,m1) {return self.hashelement(wholeMatch,m1);});
			// handle PHP and ASP-style processor instructions (<?...?> and <%...%>)

		text = text.replace(/\n\n/g,"\n");
			//undo doublelines created earlier in function

		return text;
	},

	//---------------------------------
	// writeanchortag [--jf]
	// link helper
	// called by doanchors
	// calls  utl.escapecharacters
	// modifies aURLs, aTitles
	//---------------------------------
	writeanchortag : function (wholeMatch,m1,m2,m3,m4,m5,m6,m7) {
		var isa = ITTY.editor.converter;
		var utl = ITTY.editor.utility;
		
		if (m7 == undefined) {m7 = "";}
		var whole_match = m1;
		var link_text   = m2;
		var link_id	    = m3.toLowerCase();
		var url		    = m4;
		var title	    = m7;
	
		if (url == "") {
			if (link_id == "") {
				link_id = link_text.toLowerCase().replace(/ ?\n/g," ");
					// lower-case and turn embedded newlines into spaces
			}
			url = "#"+link_id;
			if (this.aURLs[link_id] != undefined) {
				url = this.aURLs[link_id];
				if (this.aTitles[link_id] != undefined) {
					title = this.aTitles[link_id];
				}
			} else {
				if (whole_match.search(/\(\s*\)$/m)>-1) {
					url = "";
						// for explicit empty url
				} else {
					return whole_match;
				}
			}
		}		
		url = utl.escapecharacters(url,"*_");
		var result = "<a href=\"" + url + "\"";
	
		if (title != "") {
			title = title.replace(/"/g,"&quot;");
			title = utl.escapecharacters(title,"*_");
			result +=  " title=\"" + title + "\"";
		}
		result += ">" + link_text + "</a>";
		return result;
	},
	
	//---------------------------------
	// doanchors [--jf]
	// Markdown link shortcuts to <a>
	// called by runspans
	// calls  writeanchortag
	// modifies text
	//---------------------------------
	doanchors : function (text) {
		var isa = ITTY.editor.converter;
		var self = this;
		//var wat = function (wholeMatch,m1,m2,m3,m4,m5,m6,m7) {self.writeanchortag(wholeMatch,m1,m2,m3,m4,m5,m6,m7);};
		text = text.replace(/(\[((?:\[[^\]]*\]|[^\[\]])*)\][ ]?(?:\n[ ]*)?\[(.*?)\])()()()()/g, function(wholeMatch,m1,m2,m3,m4,m5,m6,m7) {return self.writeanchortag(wholeMatch,m1,m2,m3,m4,m5,m6,m7);});
			// reference-style links: [link text] [id]

		text = text.replace(/(\[((?:\[[^\]]*\]|[^\[\]])*)\]\([ \t]*()<?(.*?)>?[ \t]*((['"])(.*?)\6[ \t]*)?\))/g, function(wholeMatch,m1,m2,m3,m4,m5,m6,m7) {return self.writeanchortag(wholeMatch,m1,m2,m3,m4,m5,m6,m7);});
			// inline-style links: [link text](url "optional title")

		text = text.replace(/(\[([^\[\]]+)\])()()()()()/g, function(wholeMatch,m1,m2,m3,m4,m5,m6,m7) {return self.writeanchortag(wholeMatch,m1,m2,m3,m4,m5,m6,m7);});
			// handle reference-style shortcuts: [link text]. These must come last in case you've also got [link test][1] or [link test](/foo)

		return text;
	},
	
	//---------------------------------
	// writeimagetag [--jf, mods--fac]
	// image helper
	// called by doimages
	// calls  utl.escapecharacters
	// modifies aURLs, aTitles
	//---------------------------------
	writeimagetag : function (wholeMatch,m1,m2,m3,m4,m5,m6,m7) {
		var isa = ITTY.editor.converter;
		var utl = ITTY.editor.utility;
		var whole_match = m1;
		var alt_text    = m2;
		var link_id	    = m3.toLowerCase();
		var url		    = m4;
		var title	    = m7;
		
			//DELETED: if !title, title=""
	
		if (url == "") {
			if (link_id == "") {
				// lower-case and turn embedded newlines into spaces
				link_id = alt_text.toLowerCase().replace(/ ?\n/g," ");
			}
			url = "#"+link_id;
		
			if (this.aURLs[link_id] != undefined) {
				url = this.aURLs[link_id];
				if (this.aTitles[link_id] != undefined) {
					title = this.aTitles[link_id];
				}
			} else {
				return whole_match;
			}
		}	
		alt_text = alt_text.replace(/"/g,"&quot;");
		url = utl.escapecharacters(url,"*_");
		var result = "<img src=\"" + url + "\" alt=\"" + alt_text + "\"";

		//MOD: added conditional so as not to replicate Markdown.pl's feature of blank title attribute. --fac
		if (title) {
			title = title.replace(/"/g,"&quot;");
			title = utl.escapecharacters(title,"*_");
			result +=  " title=\"" + title + "\"";
		}
		result += " />";
		return result;
	},
	
	//-----------------------
	// doimages [--jf]
	// image matching
	// called by runspans
	// calls  writeimagetag
	// modifies text
	//-----------------------
	doimages : function (text) {
		var isa = ITTY.editor.converter;
		var self = this;
			// reference-style labeled images: ![alt text][id]
		
		//var wit = function (wholeMatch,m1,m2,m3,m4,m5,m6,m7) {return self.writeimagetag(wholeMatch,m1,m2,m3,m4,m5,m6,m7);});
		var wit = function (wholeMatch,m1,m2,m3,m4,m5,m6,m7) {return self.writeimagetag(wholeMatch,m1,m2,m3,m4,m5,m6,m7);};
		text = text.replace(/(!\[(.*?)\][ ]?(?:\n[ ]*)?\[(.*?)\])()()()()/g, function(wholeMatch,m1,m2,m3,m4,m5,m6,m7) {return self.writeimagetag(wholeMatch,m1,m2,m3,m4,m5,m6,m7);});
			// inline images:  ![alt text](url "optional title"); encode * and _
		
		text = text.replace(/(!\[(.*?)\]\s?\([ \t]*()<?(\S+?)>?[ \t]*((['"])(.*?)\6[ \t]*)?\))/g, function(wholeMatch,m1,m2,m3,m4,m5,m6,m7) {return self.writeimagetag(wholeMatch,m1,m2,m3,m4,m5,m6,m7);});
		return text;
	},
	
	//--------------------------------------------------------------
	// runspans [--jf]
	// handles text inside block level tags
	// called by doheaders, processlistitems, formatparagraphs
	// calls  utl.codespans, utl.bolditalics, utl.autolinks, 
	//    utl.escapetagattributes, utl.encodebackslashes,
	//    ITTY.editor.common.encodeAmpsAngles, doimages, doanchors
	// modifies text
	//--------------------------------------------------------------
	runspans : function (text) {
		var isa = ITTY.editor.converter;
		var utl = ITTY.editor.utility
		var self = this;
		text = utl.codespans(text);
		text = utl.escapetagattributes(text);
		text = utl.encodebackslashes(text);
		text = self.doimages(text);
		text = self.doanchors(text);
			// doimages first; because ![foo][f] could fool doanchors
		
		text = utl.autolinks(text);
			/* make links from constructs like `<http://example.com/>`. Must 
			come after doanchors(), because you can use < and > delimiters in 
			inline links like [this](<url>). */

		text = ITTY.editor.common.encodeAmpsAngles(text);
		text = utl.bolditalics(text);
		text = text.replace(/  +\n/g,"<br />\n"); // MOD: deleted the space before break tag; because the (space + <br />) ruins the seemless look of images separated only by a break.  --fac, 2008-06-13 (yeah, it was Friday, too)
			//hard breaks

		return text;
	},

	//-----------------------------------
	// hashblock [--jf]
	// text block helper
	// called by doheaders, docodeblocks, 
	//    doblockquotes, runblocks
	// calls  nothing
	// modifies aHTMLBlocks
	//-----------------------------------
	hashblock : function (text) {
		var isa = ITTY.editor.converter;
		text = text.replace(/(^\n+|\n+$)/g,"");
		return "\n\n~K" + (this.aHTMLBlocks.push(text)-1) + "K\n\n";
	},
	
	//-----------------------------------
	// doheaders [--jf]
	// header levels 1-6
	// called by runblocks
	// calls  runspans, hashblock
	// modifies text
	//-----------------------------------
	doheaders : function (text) {
		var isa = ITTY.editor.converter;
		var self = this;
		text = text.replace(/^(.+)[ \t]*\n=+[ \t]*\n+/gm, function(wholeMatch,m1) {
			return self.hashblock("<h1>" + self.runspans(m1) + "</h1>");
		});
		text = text.replace(/^(.+)[ \t]*\n-+[ \t]*\n+/gm, function(wholeMatch,m1) {
			return self.hashblock("<h2>" + self.runspans(m1) + "</h2>");
		});
				/*setext-style headers, e.g., header 1, header 2
				                              ========  -------- */
				
		text = text.replace(/^(\#{1,6})[ \t]*(.+?)[ \t]*\#*\n+/gm, function(wholeMatch,m1,m2) {
			var h_level = m1.length;
			return self.hashblock("<h" + h_level + ">" + self.runspans(m2) + "</h" + h_level + ">");
		});
			//atx-style headers, e.g., # header 1, ## header 2, etc.

		return text;
	},

	//-----------------------------------
	// dolists [--jf]
	// unordered, ordered lists
	// called by runblocks, 
	//     processlistitems (recursion)
	// calls  processlistitems
	// modifies text
	//-----------------------------------
	dolists : function (text) {
		var isa = ITTY.editor.converter;
		var self = this; 
		var processlistitems;
		text += "~0";
			// showdown sentinel to hack around khtml/safari bug (note: which was patched Nov 2007 per http://bugs.webkit.org/show_bug.cgi?id=11231 --fac):
		
		var whole_list = /^(([ ]{0,3}([*+-]|\d+[.])[ \t]+)[^\r]+?(~0|\n{2,}(?=\S)(?![ \t]*(?:[*+-]|\d+[.])[ \t]+)))/gm;
			//match any entirel ul or ol list
		
		if (this.nListLevel) {
			text = text.replace(whole_list, function(wholeMatch,m1,m2) {
				var list = m1;
				var list_type = (m2.search(/[*+-]/g)>-1) ? "ul" : "ol";
				list = list.replace(/\n{2,}/g,"\n\n\n");;
					// make double returns into triple returns, to allow paragraph for the last item in a list
				
				var result = self.processlistitems(list);
				result = result.replace(/\s+$/,"");
					// trim trailing whitespace, to put the closing `</$list_type>` on the preceding line; HTML Block parser hack
				
				result = "<"+list_type+">" + result + "</"+list_type+">\n";
				return result;
			});
		} else {
			whole_list = /(\n\n|^\n?)(([ ]{0,3}([*+-]|\d+[.])[ \t]+)[^\r]+?(~0|\n{2,}(?=\S)(?![ \t]*(?:[*+-]|\d+[.])[ \t]+)))/g;
			text = text.replace(whole_list, function(wholeMatch,m1,m2,m3) {
				var runup = m1;
				var list = m2;
				var list_type = (m3.search(/[*+-]/g)>-1) ? "ul" : "ol";
				var list = list.replace(/\n{2,}/g,"\n\n\n");;
					// make double returns into triple returns, to allow paragraph for the last item in a list

				var result = self.processlistitems(list);
				result = runup + "<"+list_type+">\n" + result + "</"+list_type+">\n";
				return result;
			});
		}
		text = text.replace(/~0/,"");
		return text;
	},
	
	//-----------------------------------
	// processlistitems [--jf]
	// list items, indentation, etc.
	// called by dolists 
	// calls  dolists (recursion), 
	//   runblocks, runspans, utl.outdent
	// modifies nListLevel
	//-----------------------------------
	processlistitems : function (list_str) {
		var isa = ITTY.editor.converter;
		var utl = ITTY.editor.utility;
		var self = this;
		this.nListLevel++;
		
		list_str = list_str.replace(/\n{2,}$/,"\n");
			// trim trailing blank lines
		
		list_str += "~0";
			// emulate \z
		
		list_str = list_str.replace(/(\n)?(^[ \t]*)([*+-]|\d+[.])[ \t]+([^\r]+?(\n{1,2}))(?=\n*(~0|\2([*+-]|\d+[.])[ \t]+))/gm, function(wholeMatch,m1,m2,m3,m4) {
			var item = m4;
			var leading_line = m1;
			var leading_space = m2;

			if (leading_line || (item.search(/\n{2,}/)>-1)) {
				item = self.runblocks(utl.outdent(item));
			} else {
				item = self.dolists(utl.outdent(item));
				item = item.replace(/\n$/,""); // chomp(item)
				item = self.runspans(item);
					// recursion for sub-lists
			}
			return  "<li>" + item + "</li>\n";
		});
		list_str = list_str.replace(/~0/g,"");
		this.nListLevel--;
		return list_str;
	},

	//-----------------------------------
	// docodeblocks [--jf]
	// code blocks for devs like you
	// called by runblocks 
	// calls  utl.outdent, utl.encodecode, 
	//    utl.detab, hashblock
	// modifies text (<pre><code>); 
	//    includes showdown workaround 
	//    for no \A or \Z, safari/khtml
	//-----------------------------------
	docodeblocks : function (text) {
		var isa = ITTY.editor.converter;
		var utl = ITTY.editor.utility;
		var self = this;
		text += "~0";
	
		text = text.replace(/(?:\n\n|^)((?:(?:[ ]{4}|\t).*\n+)+)(\n*[ ]{0,3}[^ \t\n]|(?=~0))/g, function(wholeMatch,m1,m2) {
			var codeblock = m1;
			var nextChar  = m2;
			codeblock = utl.encodecode(utl.outdent(codeblock));
			codeblock = utl.detab(codeblock);
			codeblock = codeblock.replace(/^\n+/g,""); // trim leading newlines
			codeblock = codeblock.replace(/\n+$/g,""); // trim trailing whitespace
			codeblock = "<pre><code>" + codeblock + "\n</code></pre>";
			return self.hashblock(codeblock) + nextChar;
		});
		
		text = text.replace(/~0/,""); //cleanup
		return text;
	},
	
	//------------------------------
	// doblockquotes [--jf]
	// processes blockquotes
	// called by runblocks 
	// calls  hashblock, 
	//    runblocks (recursion)
	// modifies text (<blockquote>)
	//-------------------------------
	doblockquotes : function (text) {
		var isa = ITTY.editor.converter;
		var self = this;
		text = text.replace(/((^[ \t]*>[ \t]?.+\n(.+\n)*\n*)+)/gm, function(wholeMatch,m1) {
			var bq = m1;
				/* attacklab: hack around Konqueror 3.5.4 bug: "----------bug".replace(/^-/g,"") == "bug" */
			bq = bq.replace(/^[ \t]*>[ \t]?/gm,"~0");	
			bq = bq.replace(/~0/g,"");
				// trim one level of quoting and clean up

			bq = bq.replace(/^[ \t]+$/gm,""); // trim whitespace-only lines
			bq = self.runblocks(bq); // recurse
			
			bq = bq.replace(/(^|\n)/g,"$1  ");
				// fix leading spaces that mess up <pre> content
				
			bq = bq.replace( /(\s*<pre>[^\r]+?<\/pre>)/gm, function(wholeMatch,m1) {
					var pre = m1;
					
					// attacklab: hack around Konqueror 3.5.4 bug:
					pre = pre.replace(/^  /mg,"~0");
					pre = pre.replace(/~0/g,"");
					return pre;
				});
			return self.hashblock("<blockquote>\n" + bq + "\n</blockquote>");
		});
		return text;
	},
	
	//-----------------------------------
	// formatparagraphs [--jf, mods--fac]
	// processes paragraphs
	// called by runblocks 
	// calls  runspans
	// modifies aHTMLBlocks, (<p>)
	//-----------------------------------
	formatparagraphs : function (text) {
		var isa = ITTY.editor.converter;
		var self = this;
		text = text.replace(/^\n*(.*?)\n*$/g,"$1"); //trim, MOD: consolidated regex --fac
		var grafs = text.split(/\n{2,}/g);
		var grafsOut = []; 
			//MOD: nix new Array() constructor --fac

		// Wrap <p> tags. MOD: minor --fac
		var end = grafs.length;
		for (var i in grafs) {
			var str = grafs[i];
			if (str.search(/~K(\d+)K/g) >= 0) {
				grafsOut.push(str);
					// if this is an HTML marker, copy it
			} else if (str.search(/\S/) >= 0) {
				str = self.runspans(str);
				str = str.replace(/^([ \t]*)/g,"<p>");
				str += "</p>"
				grafsOut.push(str);
			}
		}
		end = grafsOut.length;
		for (var i=0; i<end; i++) {
			while (grafsOut[i].search(/~K(\d+)K/) >= 0) {
				var blockText = this.aHTMLBlocks[RegExp.$1]; //MOD: was [RegExp.$1] --fac
				blockText = blockText.replace(/\$/g,"$$$$"); // Escape any dollar signs
				grafsOut[i] = grafsOut[i].replace(/~K\d+K/, blockText);
			} // if this is a marker for an html block...
		} // de-reference html blocks hash unhashify HTML blocks
		return grafsOut.join("\n\n");
	},
	
	//-----------------------------------
	// runblocks [--jf]
	// controller for block text process
	// called by doblockquotes (recursive)
	//    convert, processlistitems
	// calls doheaders, hashblock, 
	//    dolists, docodeblocks, 
	//    doblockquotes, dohtmlblocks, 
	//    formatparagraphs, 
	// modifies text (block-level tags)
	//-----------------------------------
	runblocks : function (text) {
		var isa = ITTY.editor.converter;
		var self=this;
		
		text = self.doheaders(text);
		var key = self.hashblock("<hr />");
		text = text.replace(/^[ ]{0,2}([ ]?\*[ ]?){3,}[ \t]*$/gm, key);
		text = text.replace(/^[ ]{0,2}([ ]?\-[ ]?){3,}[ \t]*$/gm, key);
		text = text.replace(/^[ ]{0,2}([ ]?\_[ ]?){3,}[ \t]*$/gm, key);
			// horizontal rules:

		text = self.dolists(text);
		text = self.docodeblocks(text);
		text = self.doblockquotes(text);

		text = self.dohtmlblocks(text);
			/* dohtmlblocks() was run before, to escape raw HTML in the source. 
			   Here, the markup just created is escaped. Prevents <p> tags 
			   around block-level tags.*/

		text = self.formatparagraphs(text);
		return text;
	},
	
	//-----------------------------------
	// html2markdown [--jt, mods--fac]
	// converts x/html 2 markdown
	// called by convertM2xHTML
	// calls com.xgetAttribute, 
	//    com.addStringToDOM
	// modifies editor tablet values, 
	//    view [history]
	//-----------------------------------
	html2markdown : function (tSource, oTarget, debug) {
		/* MOD: added arguments (original assumed input=document.body; output=new window) --fac */
		var isa = ITTY.editor.converter;
		var com = ITTY.editor.common;
		var self = this;
		var logging = debug || false;
	 	var logString = '';
	 	var unhandled = {};
	 	var textString = ''; //fran added for textarea
	 	var targetIsTextArea = true; //fran changed from false
	 	var dfsTries = 0;
	 	var sourceObj = tSource;
	 	var targetObj = oTarget || null;
	 	var last = null;
	 	var links      =[];
	  	var rlinks     = {};
	 	var linkTitles = [];
	 	var atP        = true;
	 	var atLeft     = true;
	 	var atNoWS     = true;
		var left       = '\n';	 
	 	var inPRE = false;
	 	var inCODE = false;
	 	var inOL = false; 
	 	var replacements = {
		 '\\\\': '\\\\', '\\[': '\\[', '\\]': '\\]', '>': '\\>', '_': '\\_', '\\*': '\\*', '`': '\\`', '#': '\\#', '([0-9])\\.(\\s|$)': '$1\\.$2',  '\u00a9': '(c)', '\u00ae': '(r)', '\u2122': '(tm)', '\u00a0': ' ',    '\u00b7': '\\*',  '\u2002': ' ',  '\u2003': ' ',  '\u2009': ' ',  '\u2018': "'", '\u2019': "'", '\u201c': '"', '\u201d': '"', '\u2026': '...', '\u2013': '--',  '\u2014': '---'  };	 
	 	var regex = {};
	 	for (var key in replacements) {
			regex[key] = new RegExp(key, 'g');
		}	
		var urlBase = location.href;
		var urlDir = urlBase.replace(/\/[^\/]*$/,'/');
		var urlPage = urlBase.replace(/#[^\/#]*$/,'');
		var urlSite = urlBase;
		if (isAbsolute(urlBase)) {
			urlSite = urlBase.replace(/^([a-zA-Z]([a-zA-Z0-9+-.])*:\/\/[^\/]*).*/,'$1');
		}
		
		
		function log(exn,msg) {
			if (!logging) {return;}
			logString += msg + ': ' + exn + '\n';
		}
		function addText(s) {
			if (last != null) {textString += last;}
	 		last = s;
		}		 
		function llapLast(s) {
			if (last) {last = last.replace(/    $/,s);}
		}	 
		function finishOutput() {
			addText("");
		}		
		function pushLeft(s) {
			var oldLeft = left;
			left += s;
			if (atP) {addText(s);}
			else {p();}
	 
			function r() {
		 		left = oldLeft;
				atP = atLeft = false;
				p();
			}
			return r; 
				// Safari 1.3.x requires this syntax rather than return function r(){...}; syntax --fac 2008-06-22
		}	 
		function p() {
			if (atP)  {return;}
			if (!atLeft) {
				addText(left);
				atLeft = true;
			}
			addText(left);
			atP = atNoWS = true;
		}	 
		function llap(s) {
			if (!atLeft) {
				addText(left.replace(/    $/,s));
				atLeft = atP = atNoWS = true;
				return;
			} else {
				llapLast(s);
				return;
			}
		}	 
		function br(s) {
			addText('  ' + left);
			atLeft = atNoWS = true;
		}	 
		function o(s) {
			if (!s) return;
			if (!inPRE) {
				if (atNoWS) {s = s.replace(/^[ \t\n]+/,'');}
				else if (/^[ \t]*\n/.test(s)) {s = s.replace(/^[ \t\n]+/,'\n');}
				else {s = s.replace(/^[ \t]+/,' ');}
			}
			if (s == '') {return;}
			atP = /\n\n$/.test(s);
			atLeft = /\n$/.test(s);
			atNoWS = /[ \t\n]$/.test(s);
			addText(s.replace(/\n/g,left));
		}	 
		function oThunk(s) {
			function r() {
		 		o(s);
	 		}
	 		return r; 
				// Safari 1.3.x requires this syntax rather than return function r(){...}; syntax --fac 2008-06-22

		} 
		function pre() {
			var old = inPRE;
			inPRE = true;
	 
			function r() {
				inPRE = old;
			}
			return r; 
				// Safari 1.3.x requires this syntax rather than return function r(){...}; syntax --fac 2008-06-22

		}
		function code() {
			var old = inCODE;
			inCODE = true;
	 
			function r() {
				inCODE = old;
			}
			return r; 
				// Safari 1.3.x requires this syntax rather than return function r(){...}; syntax --fac 2008-06-22

		}
		function ol() {
			var old = inOL;
			inOL = true;
	 
			function r() {
				inOL = old;
			}
			return r; 
				// Safari 1.3.x requires this syntax rather than return function r(){...}; syntax --fac 2008-06-22

		}
		function ul() {
			var old = inOL;
	 		inOL = false;
	 
			function r() {
				inOL = old;
			}
			return r; 
				// Safari 1.3.x requires this syntax rather than return function r(){...}; syntax --fac 2008-06-22

		}
		function nonPREproc(s) {
			s = s.replace(/\n([ \t]*\n)+/g,'\n');
			s = s.replace(/\n[ \t]+/g,'\n');
			s = s.replace(/[ \t]+/g,' ');
			for (var key in replacements) {
				s = s.replace(regex[key], replacements[key]);
			}
			return s;
	 	}	 
		function inCODEproc(s) {
			s = s.replace(/`/g,'\\`');
			return s;
		}	 
		function isAbsolute(s) {
			return /^[a-zA-Z]([a-zA-Z0-9+-.])*:/.test(s);
		}	 
		function isSiteRelative(s) {
			return /^\x2f/.test(s);
		}
 
		function isPageRelative(s) {
			return /^#/.test(s);
		}
		function makeAbsolute(s) {
			if (isAbsolute(s)) {return s;}
			else if (isSiteRelative(s)) {return urlSite + s;}
			else if (isPageRelative(s)) {return urlPage + s;}
			else {return urlDir + s;}
		}	 
		function urlEscape(s) {
			s = makeAbsolute(s);
			s = s.replace(/\x22/g,'%22');
			s = s.replace(/\x27/g,'%27');
			s = s.replace(/\x20/g,'%20');
	  		s = s.replace(/\x09/g,'%09');
	  		s = s.replace(/\x0a/g,'%0a');
	  		s = s.replace(/\x0d/g,'%0d');
	  		s = s.replace(/\x28/g,'%28');
	  		s = s.replace(/\x29/g,'%29');
	  		s = s.replace(/\x5b/g,'%5b');
	  		s = s.replace(/\x5d/g,'%5d');
	  		s = s.replace(/\x5c/g,'%5c');
	  		return s;
	 	}
	 	function dfs(e) {
			if (e.nodeType == Node.ELEMENT_NODE) {
				var after = null;
				var skipChildren = false;
				try {
					switch (e.tagName) {
						case 'HEAD':   case 'STYLE': case 'SCRIPT': case 'SELECT': case 'OPTION': case 'NOSCRIPT': case 'NOFRAMES': case 'INPUT':    case 'BUTTON':   case 'SELECT':   case 'TEXTAREA': case 'LABEL': skipChildren = true; break;
						case 'BODY':   case 'FORM':  break;
	 					case 'H1':     p(); o('# '); break;
	  					case 'H2':     p(); o('## '); break;
	 					case 'H3':     p(); o('### '); break;
	 					case 'H4':     p(); o('#### '); break;
	 					case 'H5':     p(); o('##### '); break;
	 					case 'H6':     p(); o('###### '); break;
	 					case 'P':      p(); break;
	 					case 'DIV':    p(); break;
	 					case 'BR':     br(); break;
						case 'HR':     p(); o('--------------------------------'); p(); break;
	 					case 'EM':     case 'I': case 'U': o('_'); atNoWS = true; after = oThunk('_'); break;
						case 'DT':     p();
						case 'STRONG': case 'B': o('**'); atNoWS = true; after = oThunk('**'); break;
						case 'OL':     var r1 = pushLeft('    '); var r2 = ol(); after = function () { r1(); r2(); }; break;
						case 'UL':     var r1 = pushLeft('    '); var r2 = ul(); after = function () { r1(); r2(); }; break;
						case 'LI':     if (inOL) { llap('1.  '); } else { llap('*   '); } break;
						case 'PRE':    var r1 = pushLeft('    '); var r2 = pre(); after = function () { r1(); r2(); }; break;
	 					case 'CODE':   if (!inPRE) { o('`'); var r1 = code(); var r2 = oThunk('`'); after = function () {r1();r2(); };} break;
	 					case 'DD':     case 'BLOCKQUOTE': after = pushLeft('> '); break;
	 					case 'A':      var href = com.xgetAttribute(e, 'href');
	 						if (!href) {break;}
	 						
	 						href = urlEscape(href);
	 						var n;
	 						if (rlinks[href]) {
		 						n = rlinks[href];
							} else {
								n = links.length;
								links[n] = href;
								rlinks[href] = n;
								if (com.xgetAttribute(e, 'title')) {
									linkTitles[n] = com.xgetAttribute(e, 'title');
								}
							}
							o('[');
							atNoWS = true;
							after = oThunk('][' + n + ']');
							break;
	 					case 'IMG':    skipChildren = true;
							var src = com.xgetAttribute(e, 'src');
							if (!src) {break;}
							src = urlEscape(src);
							var alt = com.xgetAttribute(e, 'alt');
							if (!alt) {alt = '';}
							o('![' + alt + '](' + src + ')');
							break;
	 					case 'IFRAME': case 'FRAME': skipChildren = true;
							try {
								if (e.contentDocument && e.contentDocument.documentElement) {
									dfs(e.contentDocument.documentElement);
								}
							} catch (exn) {
								log(exn,'contentDocument');
							}
							break;
	 					case 'TR':     after = p; break;
						default: if (logging) unhandled[e.tagName] = null; break;
					}
				} catch (exn) {
					log(exn,e.tagName);
				}
	 			if (!skipChildren) {
					var c = e.childNodes;
					for (var i = 0, clen = c.length; i < clen; i++) {
						//MOD: minor: added clen var  --fac 2008-06-13
						dfs(c[i]);
					}
				}
				if (after) after();
			} else if (e.nodeType == Node.TEXT_NODE) {
				if (inPRE) {o(e.nodeValue);}
				else if (inCODE) {o(inCODEproc(e.nodeValue));}
				else {o(nonPREproc(e.nodeValue));}
			} else if (typeof sourceObj == "string") {
				dfsTries++;
				var newdiv  = document.createElement("DIV");
				//com.addStringToDOM(newdiv, sourceObj); //throws an error, possibly because new Div or no id --fac
				
				newdiv.innerHTML = sourceObj; // but this works here
					// browser internals parse string to DOM nodes --fac
				
				if (dfsTries == 1) {
						dfs(newdiv);
						//prevent endless loop of this default!
				}
			} //ADDED: block to handle strings from textarea input --fac
		}
		
	 	addText('<pre>\n'); 
	 		// MOD: added the newline --fac, 2008-06-05
	 		// DELETED: link[0] to document stuff  --fac, 2008-06-05
	 	
	 	dfs(sourceObj); 
	 		// MOD: parse the source element instead of the document body --fac, 2008-05-28
	 		// DELETED: addText('\n\n') --fac, 2008-06-05
		
		for (var i = 0;  i < links.length;  i++) {
			var title = '\n';
			if (linkTitles[i]) {title = ' "' + linkTitles[i] + '"\n';}
			if (links[i]) {addText('[' + i + ']: ' + links[i] + title);}
		}
		if (logging) {
			addText('\n\n&lt;!-- Make.text debugging:\n');
			for (var i in unhandled) {addText('Not handled: ' + i + '\n');}
			addText('\n');
			addText(logString);
			addText('--&gt;\n');
		}
		textString = textString.replace(/(?:\r\n|\n){2,}$/, '\n'); 
			// MOD: get rid of excess line endings at the end --fac, 2008-06-05
		
		textString = textString.replace(/[ ]{2,}$/, ' '); 
			// MOD: get rid of excess spaces at the end --fac, 2008-06-05

		addText('\n</pre>'); // MOD: added the newline --fac, 2008-06-05
		finishOutput();
		
		// ADDED: the following conditional output blocks --fac, 2008-05-28
		if (targetObj && typeof targetObj == "object" && targetObj.tagName == "TEXTAREA") {
			textString = textString.replace(/&lt;/g, "<");
			textString = textString.replace(/&gt;/g, ">");
			textString = textString.replace(/<pre>\n*/g, "");
			textString = textString.replace(/(\n*)<\/pre>/g, "$1"); 
				// MOD to maintain line endings --fac, 2008-06-18
				
			textString = textString.replace(/^(?:\r\n|\n)/, ''); 
				// MOD: trim off beginning space --fac, 2008-06-11; corrected: --fac, 2008-06-18
				
			textString = textString.replace(/^\s+/, '');;  
				// MOD: trim off beginning space --fac, 2008-06-05; corrected: --fac, 2008-06-18
				
			textString = textString.replace(/[ ]{2,}$/, " "); 
				// MOD: trim ending space, allow one space --fac, 2008-06-05
				
			return textString;
				// ADDED, send back rather than filling value directly --fac, 2008-06-18
		}
	}
};

/*
markdownhelp is the id of the div
markdownhelp.innerHTML = ?
ITTY.editor.common.addStringToDOM(ITTY.editor.tutorial.en, document.getElementById('markdownhelp'));

*/


//|<=================== Markdown Help Text ===============>|
// format of text in this var needs to be maintained, please. --fac
// todo: non-English language versions

ITTY.editor.markdownhelp.en = '';
ITTY.editor.markdownhelp.en += '<ul>\n';
ITTY.editor.markdownhelp.en += '<li><h1><em>Markdown</em> Text Format Help <span style="font-size:10px;float:right;"><a href="#" onClick="ITTY.editor.common.addStringToDOM(document.getElementById(\'markdownhelp\'), ITTY.editor.tutorial.en);return false" title="switch to toolbar tutorial">toolbar tutorial</a></span></h1></li>\n';
ITTY.editor.markdownhelp.en += '<li><h3><em>Markdown is so easy. Think Email text and you have it!</em></h3></li>\n';
ITTY.editor.markdownhelp.en += '<li><h2>Bold, Italics, Horizontal Rules</h2></li>\n';
ITTY.editor.markdownhelp.en += '<li> **bold text** becomes: <strong>bold text</strong>\n';
ITTY.editor.markdownhelp.en += '<br /><span class="tip">TIP: highlight your text, click the bold button</span></li>\n';
ITTY.editor.markdownhelp.en += '<li> *italicized text* becomes: <em>italicized text</em>\n';
ITTY.editor.markdownhelp.en += '<br /><span class="tip">TIP: highlight your text, click the italics button</span></li>\n';
ITTY.editor.markdownhelp.en += '<li> *** three or more asterisks become: a horizontal rule<hr />\n';
ITTY.editor.markdownhelp.en += '<br /><span class="hrtip">TIP: enter/return after your text, click the horizontal rules button</span></li>\n';
ITTY.editor.markdownhelp.en += '<li><h2>Links</h2></li>\n';
ITTY.editor.markdownhelp.en += '<li> [This is linked text](http://www.example.com/) . Note: no space between ] and (.</li>\n';
ITTY.editor.markdownhelp.en += '<li> [This is linked text](http://www.example.com/ "Title-tooltip in quotes")\n';
ITTY.editor.markdownhelp.en += '<br />becomes: <a href="http://www.example.com/" title="Title-tooltip in quotes">This is linked text</a> (using the tooltip)\n';
ITTY.editor.markdownhelp.en += '<br /><span class="tip">TIP: highlight the words to link, click the link button.</span></li>\n';
ITTY.editor.markdownhelp.en += '<li><h2>Lists</h2></li>\n';
ITTY.editor.markdownhelp.en += '<li><h3>Unordered List - <small>use an asterisk or a dash</small></h3></li>\n';
ITTY.editor.markdownhelp.en += '<li> * This is an unordered list (ul) item. Add 2 spaces after each item!</li>\n';
ITTY.editor.markdownhelp.en += '<li> - So is this. In xhtml, it becomes:\n';
ITTY.editor.markdownhelp.en += '<br /><ul style="list-style-type:disc;padding-left:20px;"><li>This is an unordered list (ul) item.</li><li>So is this.</li>\n';
ITTY.editor.markdownhelp.en += '<span class="tip">TIP: highlight your text, click the unordered list button.</span></ul></li>\n';
ITTY.editor.markdownhelp.en += '<li><h3>Ordered List - <small>use numbers</small></h3></li>\n';
ITTY.editor.markdownhelp.en += '<li> 1. This is an ordered list (ol) item. Add 2 spaces after each item!\n';
ITTY.editor.markdownhelp.en += '<li> 2. This is the second item in the ordered list (ol). It becomes:\n';
ITTY.editor.markdownhelp.en += '<br /><ul style="list-style-type:decimal;padding-left:20px;"><li>This is an ordered list (ol) item.</li><li>This is the second item in the ordered list (ol).</li>\n';
ITTY.editor.markdownhelp.en += '<span class="tip">TIP: highlight your list and click the ordered list button.</span></ul></li>\n';
ITTY.editor.markdownhelp.en += '<li><h2>Images - <small>start with an exclamation! and look like links</small></h2></li>\n';
ITTY.editor.markdownhelp.en += '<li> ![Image Alt text](/path/to/img.jpg "Optional title in quotes") \n';
ITTY.editor.markdownhelp.en += '<br /><span class="tip">TIP: click where the image will go, then click the image button.</span></li>\n';
ITTY.editor.markdownhelp.en += '<li><h2>Inline Code</h2></li>\n';
ITTY.editor.markdownhelp.en += '<li> `<code>code item</code>` backticks around inline code.</li>\n';
ITTY.editor.markdownhelp.en += '<li><h2>Blocks of text</h2></li>\n';
ITTY.editor.markdownhelp.en += '<li><h3>Header Levels</h3></li>\n';
ITTY.editor.markdownhelp.en += '<li><h2>## header 2</h2></li>\n';
ITTY.editor.markdownhelp.en += '<li><h3>### header 3</h3></li>\n';
ITTY.editor.markdownhelp.en += '<li><h4>#### header 4</h4>\n';
ITTY.editor.markdownhelp.en += '<br /><span class="hrtip">TIP: highlight your text, select H1..H6 in the Block menu.</span></li>\n';
ITTY.editor.markdownhelp.en += '<li><h3>Paragraphs</h3></li>\n';
ITTY.editor.markdownhelp.en += '<li>Just separate your paragraphs with a blank line.</li>\n';
ITTY.editor.markdownhelp.en += '<li><h3>BlockQuotes</h3></li>\n';
ITTY.editor.markdownhelp.en += '<li> &gt;This text is blockquoted. It will look like this as xhtml:\n';
ITTY.editor.markdownhelp.en += '<br />  &nbsp;  &nbsp; &nbsp; &nbsp; This text is blockquoted.</pre>\n';
ITTY.editor.markdownhelp.en += '<br /><span class="tip">TIP: highlight your text, select \u21E5 in the Block menu.</span><br /></li>\n';
ITTY.editor.markdownhelp.en += '<li> &gt;&gt;This text is a nested blockquote. It will look like this as xhtml:\n';
ITTY.editor.markdownhelp.en += '<br />  &nbsp;  &nbsp; &nbsp; &nbsp; &nbsp;  &nbsp; &nbsp; &nbsp; This text is a nested blockquote. </pre>\n';
ITTY.editor.markdownhelp.en += '<br /><span class="tip">TIP: highlight your text, select \u21E5\u21E5 in the Block menu.</span></li>\n';
ITTY.editor.markdownhelp.en += '<li><h3>Preformatted text (or Code Blocks)</h3></li>\n';
ITTY.editor.markdownhelp.en += '<li> <pre><code>    This is a code block. Each line of the block \n';
ITTY.editor.markdownhelp.en += '   must be indented 4 or more spaces. \n';
ITTY.editor.markdownhelp.en += '   It can go for several lines, be nested\n   and include code:\n';
ITTY.editor.markdownhelp.en += '      &lt;div&gt;like this\n';
ITTY.editor.markdownhelp.en += '          &lt;p&gt;and this&lt;/p&gt;\n';
ITTY.editor.markdownhelp.en += '      &lt;/div&gt; \n';
ITTY.editor.markdownhelp.en += '     </code></pre>\n';
ITTY.editor.markdownhelp.en += '     <span class="tip">TIP: highlight your code, select &lt;pre&gt; in the Block menu.</span></li>\n';
ITTY.editor.markdownhelp.en += '<li> To use * or _ , escape them with backslashes: \\* and \\_ <br /> </li>\n';
ITTY.editor.markdownhelp.en += '<li><h2>The Buttons and Block Menu on the Toolbar<br />do the Formatting for you! <span style="font-size:10px;float:right;"><a href="#" onClick="ITTY.editor.common.addStringToDOM(document.getElementById(\'markdownhelp\'), ITTY.editor.tutorial.en);return false" title="switch to toolbar tutorial">toolbar tutorial</a></span></h2><br /> <br /> <br /> </li>\n';
ITTY.editor.markdownhelp.en += '</ul>\n';

//|<=================== itty Editor Tutorial ===============>|
// format of text in this var needs to be maintained, please. --fac
// todo: non-English language versions

ITTY.editor.tutorial.en = '';
ITTY.editor.tutorial.en += '<div style="margin:0;padding:0;background-color:#CDF2D1";position:relative;top:-40px;"><span style="color:#CDF2D1";>.</span>\n';
ITTY.editor.tutorial.en += '<ul style="list-style-type:none;color:maroon;font-weight:bold;font-style:oblique;">\n';
ITTY.editor.tutorial.en += '	<li><h2>Editor Buttons Overview <span style="font-size:10px;float:right;"><a href="#" onClick="ITTY.editor.common.addStringToDOM(document.getElementById(\'markdownhelp\'), ITTY.editor.markdownhelp.en);return false" title="switch to markdown tutorial">markdown tutorial</a></span></h2></li>\n';
ITTY.editor.tutorial.en += '	<li><img src="images/tutorial/itty-editor-overlay350104.gif" width="350" height="104" alt="itty editor button overview"></li>\n';
ITTY.editor.tutorial.en += '	<li><h3 style="text-decoration:underline;"><br />Text Mode</h3></li>\n';
ITTY.editor.tutorial.en += '	<li><p>Type text in the editor in easy Markdown syntax, or...</p></li>\n';
ITTY.editor.tutorial.en += '	<li><p>Highlight your text, and use the toolbar</p></li>\n';
ITTY.editor.tutorial.en += '	<li><img src="images/tutorial/ittyeditor-tutorial001.gif" width="350" height="135" alt="highlight some text"></li>\n';
ITTY.editor.tutorial.en += '	<li><p>Select a header level in the Block menu...</p></li>\n';
ITTY.editor.tutorial.en += '	<li><img src="images/tutorial/ittyeditor-tutorial002.gif" width="350" height="135" alt="select h2 in the block menu"></li>\n';
ITTY.editor.tutorial.en += '	<li><p>That creates a header in Markdown syntax.</p></li>\n';
ITTY.editor.tutorial.en += '	<li><img src="images/tutorial/ittyeditor-tutorial003.gif" width="350" height="135" alt="creates automatic header in Markdown syntax"></li>\n';
ITTY.editor.tutorial.en += '	<li><p>Let\'s do another. Highlight some text...</p></li>\n';
ITTY.editor.tutorial.en += '	<li><img src="images/tutorial/ittyeditor-tutorial004.gif" width="350" height="135" alt="highlight some text to italicize"></li>\n';
ITTY.editor.tutorial.en += '	<li><p>Then click the Italics button...</p></li>\n';
ITTY.editor.tutorial.en += '	<li><img src="images/tutorial/ittyeditor-tutorial005.gif" width="350" height="135" alt="highlight some text to italicize"></li>\n';
ITTY.editor.tutorial.en += '	<li><p>Look closely to see the change. The text is in Markdown syntax.</p></li>\n';
ITTY.editor.tutorial.en += '	<li><img src="images/tutorial/ittyeditor-tutorial006.gif" width="350" height="135" alt="text now in Markdown format"></li>\n';
ITTY.editor.tutorial.en += '	<li><p>To insert a picture, click your cursor where you want the picture...</p></li>\n';
ITTY.editor.tutorial.en += '	<li><img src="images/tutorial/ittyeditor-tutorial007.gif" width="350" height="135" alt="click at the point you want a picture"></li>\n';
ITTY.editor.tutorial.en += '	<li><p>Then click the Image button. You will be prompted for the web address of the image... </p></li>\n';
ITTY.editor.tutorial.en += '	<li><img src="images/tutorial/ittyeditor-tutorial008.gif" width="350" height="135" alt="prompt for url..."></li>\n';
ITTY.editor.tutorial.en += '	<li><p>...and, next, prompted for the image tag\'s alternate text. Alternate text shows when visitors have images turned off. It hints at what an image is about.</p></li>\n';
ITTY.editor.tutorial.en += '	<li><img src="images/tutorial/ittyeditor-tutorial009.gif" width="350" height="135" alt="prompt for url..."></li>\n';
ITTY.editor.tutorial.en += '	<li><p>Markdown text for images is just like markdown for links, but with an exclamation point in front.</p></li>\n';
ITTY.editor.tutorial.en += '	<li><img src="images/tutorial/ittyeditor-tutorial010.gif" width="350" height="161" alt="inline image reference"></li>\n';
ITTY.editor.tutorial.en += '	<li><p>The Preview is updated as you type. Here\'s the latest...</p></li>\n';
ITTY.editor.tutorial.en += '	<li><img src="images/tutorial/ittyeditor-tutorial011.gif" width="350" height="200" alt="preview"></li>\n';
ITTY.editor.tutorial.en += '	<li><p>Just for grins, let\'s save this and see what the xhtml code looks like...</p></li>\n';
ITTY.editor.tutorial.en += '	<li><img src="images/tutorial/ittyeditor-tutorial012.gif" width="350" height="131" alt="click the converter button"></li>\n';
ITTY.editor.tutorial.en += '	<li><p>Now you see the html code. It\'s read-only. You can copy it if you want...</p></li>\n';
ITTY.editor.tutorial.en += '	<li><img src="images/tutorial/ittyeditor-tutorial013.gif" width="350" height="153" alt="here is the html code"></li>\n';
ITTY.editor.tutorial.en += '	<li><p>Clicking it again, brings you back to the text. Clicking the conversion button saves your text in history.</p></li>\n';
ITTY.editor.tutorial.en += '	<li><img src="images/tutorial/ittyeditor-tutorial012.gif" width="350" height="131" alt="click the converter button"></li>\n';
ITTY.editor.tutorial.en += '	<li><h3 style="text-decoration:underline;"><br />XHTML Mode</h3></li>\n';
ITTY.editor.tutorial.en += '	<li><p>If you want to convert some html code to markdown text, change the mode to xhtml.</p></li>\n';
ITTY.editor.tutorial.en += '	<li><img src="images/tutorial/ittyeditor-tutorial014.gif" width="350" height="153" alt="change modes by selecting xhtml in the mode menu"></li>\n';
ITTY.editor.tutorial.en += '	<li><p>If you haven\'t pasted anything, yet, It contains the html conversion of your text.</p></li>\n';
ITTY.editor.tutorial.en += '	<li><img src="images/tutorial/ittyeditor-tutorial015.gif" width="350" height="153" alt="the html to markdown input screen"></li>\n';
ITTY.editor.tutorial.en += '	<li><p>The illustration shows that I have pasted in different html code. Click the converter button to convert your code to markdown.</p></li>\n';
ITTY.editor.tutorial.en += '	<li><img src="images/tutorial/ittyeditor-tutorial016.gif" width="350" height="145" alt="paste the html code and click the converter button"></li>\n';
ITTY.editor.tutorial.en += '	<li><p>It brings you immediately back to the main screen, showing the conversion to text. The converter button changes it face back to code conversion.</p></li>\n';
ITTY.editor.tutorial.en += '	<li><img src="images/tutorial/ittyeditor-tutorial017.gif" width="350" height="145" alt="the html code is converted to text"></li>\n';
ITTY.editor.tutorial.en += '	<li><h3 style="text-decoration:underline;"><br />Helpful Buttons</h3></li>\n';
ITTY.editor.tutorial.en += '	<li><p>The question mark button is for Help. </p></li>\n';
ITTY.editor.tutorial.en += '	<li><img src="images/tutorial/ittyeditor-tutorial018.gif" width="350" height="124" alt="Help button"></li>\n';
ITTY.editor.tutorial.en += '	<li><p>Help shows the markdown syntax. The TIP below each description suggests how to use the toolbar to add that syntax easily.</p></li>\n';
ITTY.editor.tutorial.en += '	<li><img src="images/tutorial/ittyeditor-tutorial019.gif" width="350" height="172" alt="Help widget"></li>\n';
ITTY.editor.tutorial.en += '	<li><p>The Undo and Redo buttons are also handy tools. Here\'s the Undo button.</p></li>\n';
ITTY.editor.tutorial.en += '	<li><img src="images/tutorial/ittyeditor-tutorial020.gif" width="350" height="165" alt="the Undo button"></li>\n';
ITTY.editor.tutorial.en += '	<li><p>It takes you back one "saved" step per click. (Text is saved each time the convert button is used.)</p></li>\n';
ITTY.editor.tutorial.en += '	<li><img src="images/tutorial/ittyeditor-tutorial021.gif" width="350" height="165" alt="Undo takes you back one saved step at a time"></li>\n';
ITTY.editor.tutorial.en += '	<li><p>When you get a blank screen, that\'s as far back as you can go. Blank text existed before your first save!</p></li>\n';
ITTY.editor.tutorial.en += '	<li><img src="images/tutorial/ittyeditor-tutorial022.gif" width="350" height="165" alt="Undo will step back until there is a blank screen"></li>\n';
ITTY.editor.tutorial.en += '	<li><p>Now let\'s use the Redo button to get back to the last save.</p></li>\n';
ITTY.editor.tutorial.en += '	<li><img src="images/tutorial/ittyeditor-tutorial023.gif" width="350" height="165" alt="the Redo button"></li>\n';
ITTY.editor.tutorial.en += '	<li><p>Redo also steps us through, one screen at a time....</p></li>\n';
ITTY.editor.tutorial.en += '	<li><img src="images/tutorial/ittyeditor-tutorial024.gif" width="350" height="165" alt="Redo steps us to the next saved"></li>\n';
ITTY.editor.tutorial.en += '	<li><p>One more click of Redo gets us back to our last saved text....</p></li>\n';
ITTY.editor.tutorial.en += '	<li><img src="images/tutorial/ittyeditor-tutorial025.gif" width="350" height="165" alt="Redo steps us through to the last saved text"></li>\n';
ITTY.editor.tutorial.en += '	<li><h3>Now you know all about the easy Two-Way Markdown-xhtml Editor. Enjoy it! <span style="font-size:10px;float:right;"><a href="#" onClick="ITTY.editor.common.addStringToDOM(document.getElementById(\'markdownhelp\'), ITTY.editor.markdownhelp.en);return false" title="switch to markdown tutorial">markdown tutorial</a></span></h3></li>\n';
ITTY.editor.tutorial.en += '	<li><h6>Copyright 2008, Fran Corpier, Itty.org, all rights reserved. Used by permission.</h6></li>\n';
ITTY.editor.tutorial.en += '</ul>\n';
ITTY.editor.tutorial.en += '</div>\n';

//|<=================== The Setup, called onload ===============>|
// ADDED: setupEditor --fac, 2008-05-28
function setupEditor() {
	if (!ITTY || !ITTY.editor || !ITTY.editor.ids || typeof ITTY.editor.ids != "object") {
		return;
	}
	var oInputPane = document.getElementById(ITTY.editor.ids.textinput) || document.getElementById("ittyMarkdownInput");
	var oOutputPane =  document.getElementById(ITTY.editor.ids.xhtmloutput) || document.getElementById("ittyXhtmlOutput");
	var oCodeInputPane =  document.getElementById(ITTY.editor.ids.xhtmlinput) || document.getElementById("ittyXhtmlInput");
	var oLeftContainer =  document.getElementById(ITTY.editor.ids.editordiv) || document.getElementById("ittyEditor");
	var oInfoContainer =  document.getElementById(ITTY.editor.ids.infodiv) || document.getElementById("ittyfooter");
	
	/* oPreviewPaneContainer is optional and not particularly desirable! 
	   Don't set unless you want side by side and accomodate it in your CSS.
	   When not set, the preview goes below the TA, just after the footer/info. --fac 
	*/	   
	var oPreviewPaneContainer = document.getElementById(ITTY.editor.ids.previewcontainer);
	if (oPreviewPaneContainer) {
		oPreviewPaneContainer.className = ITTY.editor.ids.previewcontainerclass || "";
	} // define the preview pane if you want, otherwise it's appended below the editor
	
	if (!oInputPane || !oOutputPane || !oCodeInputPane || !oLeftContainer) {
		return;
	} //check for presence of required
	
	var oContainer = document.createElement("div");
	
	var oToolbar = ITTY.editor.toolbar.make(oInputPane);
		/* make a toolbar object: Arguments
		[0] oInputPane (object): the input textarea element*/
	
	if (!oToolbar) {return;}
	
	if (oContainer.appendChild(oToolbar.toolset)) {
		oContainer.setAttribute('class', 'ittyToolbar');
			// matches internal expectations of ittyToolbar's className
		
		if (oInputPane.parentNode.insertBefore(oContainer,oInputPane)) {
			// put the toolbar above the input pane	
	
			oLogo = document.createElement("span");
			var tlogoSpace = (ITTY.editor.ids.logotitle && document.createTextNode(ITTY.editor.ids.logotitle)) || document.createTextNode("itty logo");
			if (oLogo) {
				oLogo.appendChild(tlogoSpace);
				if (ITTY.editor.ids.logoclass) {
					ITTY.editor.common.xsetAttribute(oLogo, 'class', ITTY.editor.ids.logoclass);
				} else {
					ITTY.editor.common.xsetAttribute(oLogo, 'class', 'ittyLogo');
				}
				oContainer.insertBefore(oLogo, oContainer.lastChild);
					// brand the toolbar: add a logo (example is a 52 x 60 px alpha png)
			}
	
			var oC = ITTY.editor.converter.make(oToolbar, oOutputPane, oCodeInputPane, oInfoContainer); //, oInfoContainer optional
				/* set up Markdown2xhtml converter: Arguments: 
				[0] oToolbar (object): import toolbar instance;
				[1] oOutputPane (object): viewSource textarea element; and 
				[2] oInfoContainer (object): the empty, extra info container.*/
				// make a converter object
	
				// may reset some variables to coordinate with our page, like shorter or longer delay for auto-conversion
		}
	}	
}
