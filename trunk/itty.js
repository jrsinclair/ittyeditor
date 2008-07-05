// $Id: itty.js 3 2008-06-16 23:41:58Z fran $
window.ITTY = window.ITTY || {};
ITTY.namespace = function(ns) {
	if (ns == "" || ns == null) {return;}
	
	var aObj = ns.split('.'), baseobj = ITTY;
	for (var i = 0, l = aObj.length; i < l; i++) {
		if (i == 'ITTY') {continue;}
		baseobj = (baseobj[aObj[i]] = (baseobj[aObj[i]] || {}));
	}
	return baseobj;
};
