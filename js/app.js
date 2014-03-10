/*
 * This JS file is intent to replace some other global js files.
 * It adds namespace, so we will be sure there will no javascript variable name conflict.
 * 
 * It will eventually contain all our utility functions/objects. Please feel free to add your stuff. 
 * 
 */

// Define console for IE
window.console = window.console || (function() {
    var c = {}; c.log = c.warn = c.debug = c.info = c.error = c.time = c.dir = c.profile = c.clear = c.exception = c.trace = c.assert = function(){};
    return c;
})();


/* ***************************************************************************
 * USAGE:  GathrNamespace (objectPath)
 * 
 * objectPath is a string separated by ".", please always begin with "Gathr."
 * 
 * For each page, It would be nice to have its only name space. 
 * For example, for compare packge page, what you can do is:
 *
 *     var findPackagePage = GathrNamespace("Gathr.ComparePackagePage");
 *
 *	   It begins with "Gathr" oject, then your page specific object (in this case is "ComparePackagePage")
 *
 *		Now you have the ComparePackagePage object under Gathr, and it is used in your page only, 
 *		all your page global variables shall be put in this object.
 *		(for example, findPackagePage.myGlobalVar = 33;)
 *		
 * ************************************************************************** */
var GathrNamespace = function (objectPath) {
	if(!objectPath || typeof objectPath != "string") {
		alert("It's a bug.");
		return null;
	}
    var elementArr = objectPath.split('.'),
        parent = window,
        currentElement = '';    
    for(var i = 0; i < elementArr.length; i++) {
    	currentElement = elementArr[i];
    	parent[currentElement] = parent[currentElement] || {};
    	parent = parent[currentElement];
    	if(parent && (typeof parent != "object" || $.isArray(parent) )) {
    		alert("It's also a bug.");
    		return null;
    	}
    }
    return parent;
};



/* ************************************************************************************
 * Please put all utility functions here except omniture, modal, survey etc, which will 
 * be in its separated namespace. When you use the utility functions, please keep the whole path,
 * 
 * 		GathrNamespace("Gathr.UTIL").getFormattedPrice(...);
 * 
 * if you don't like using the whole path, you can use as your local variable.
 * 		var myLocalUtil = GathrNamespace("Gathr.UTIL");
 * 		myLocalUtil.getFormattedPrice(...);
 * 		myLocalUtil.getQueryParam(...);
 * 
 * Method: getCookieOptions(option)
 * 		This method is used as one of $.removeCookie() parameters, because, we need to
 * remove cookie at .gathr.com level. (some mBox stuff set cookie at .gathr.com).
 * *********************************************************************************** */
_.extend(GathrNamespace("Gathr.UTIL"), {
	getFormattedPrice: function(price){
		try {
		    var displayPrice = parseInt(price);
		    if(displayPrice==price)
		    	price = displayPrice;
		    else
		    	price = parseFloat(price).toFixed(2);
		} catch (e) {;}
		
		return price;
	},
	getQueryParam: function(name){
		if(typeof name !== 'string')
			return "";
		name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
		var regexS = "[\\?&]" + name + "=([^&#]*)";
		var regex = new RegExp(regexS);
		var results = regex.exec(window.location.search);
		if(results == null)
			return "";
		return decodeURIComponent(results[1].replace(/\+/g, " "));	
	},
	getCdnPrefix: function(){
		var cdnUrls = {
			"dev": 	"",
			"qa": "https://s.aolcdn.com/os/gtr/qa",
			"qh": "https://s.aolcdn.com/os/gtr/qh",
			"qt": "",
			"staging": "https://s.aolcdn.com/os/gtr/stage",
			"prod": "https://s.aolcdn.com/os/gtr/prod"
		};
		return cdnUrls[this.getEnvDetail()];
	},
	getEnv: function(){
		var url = (window.location+"").toLowerCase();
		if(url.indexOf("dev.gathr.com") > -1)
			return "d";
		if(url.indexOf("qa.gathr.com") > -1 || url.indexOf("qh.gathr.com") > -1 || url.indexOf("qt.gathr.com") > -1)
			return "q";
		if(url.indexOf("gathr.com") > -1 || url.indexOf("www.stage.gathr.com") > -1)
			return "p";
		return "d";
	},
	getEnvDetail: function(){
		var utils = GathrNamespace("Gathr.UTIL");
		if(utils.isEnvDev())
			return "dev";
		if(utils.isEnvQa())
			return "qa";
		if(utils.isEnvQh())
			return "qh";
		if(utils.isEnvQt())
			return "qt";
		if(utils.isEnvStaging())
			return "staging";
		if(utils.isEnvProd())
			return "prod";
		return "dev";
	},
	isEnvStaging: function(){
		var url = (window.location+"").toLowerCase();
		return url.indexOf("www.stage.gathr.com") > -1;
	},
	isEnvQa: function(){
		var url = (window.location+"").toLowerCase();
		return url.indexOf("qa.gathr.com") > -1;
	},
	isEnvQh: function(){
		var url = (window.location+"").toLowerCase();
		return url.indexOf("qh.gathr.com") > -1;
	},
	isEnvQt: function(){
		var url = (window.location+"").toLowerCase();
		return url.indexOf("qt.gathr.com") > -1;
	},
	isEnvDev: function(){
		var url = (window.location+"").toLowerCase();
		return url.indexOf("dev.gathr.com") > -1;
	},
	isEnvProd: function(){
		var url = (window.location+"").toLowerCase();
		return url.indexOf("www.gathr.com") > -1;
	},
	getCookieOptions: function(option) {
		var url = (window.location+"").toLowerCase();
		option = option || {};
		if(url.indexOf(".gathr.com")>-1)
			return $.extend({path: '/', domain: '.gathr.com'}, option);
		return $.extend({path: '/'}, option);
	},
	normalizeVariable: function(v) {
		if(!v)
			return v;
		return v.replace(/\-/g, "_");
	},
	getSnsBaseUrl: function() {
		var env = GathrNamespace("Gathr.UTIL").getEnv();
		return (env!="p") ? 'https://my.screenname.qa.aol.com' : 'https://my.screenname.aol.com';
	},
	getSiteDomain: function() {
		var siteDomains = {
				"dev" : "dev.gathr.com",
				"qa" : "qa.gathr.com",
				"qh" : "qh.gathr.com",
				"qt" : "qt.gathr.com",
				"staging" : "www.stage.gathr.com",
				"prod" : "www.gathr.com"	
		};
		try {
			var envDetail = GathrNamespace("Gathr.UTIL").getEnvDetail();
			return siteDomains[envDetail];
		} catch (e) {
			return "www.gathr.com";
		}
	},
	getResetAsqLink: function() {
		var utils = GathrNamespace("Gathr.UTIL");
		return utils.getSnsBaseUrl() + '/_cqr/login/login.psp?authLev=S&asqResetOnChal=1&locale=us&lang=en' 
				+ '&sitedomain=' + utils.getSiteDomain() 
				+ '&siteState=' + encodeURIComponent("OrigUrl="+window.location);
	},
	getLogoutLink: function(path) {
		var utils = GathrNamespace("Gathr.UTIL");
		var url = utils.getSnsBaseUrl() + "/_cqr/logout/mcLogout.psp?sitedomain=" + utils.getSiteDomain();
		if(path!=null) {
			if (!window.location.origin)
			     window.location.origin = window.location.protocol+"//"+window.location.host;
			url = url + "&siteState=" + encodeURIComponent("OrigUrl="+window.location.origin+path);
		}
		return url;
	},
	getSNSSignInUrl: function(controllerPath, offerId){
		var utils = GathrNamespace("Gathr.UTIL");
		var offerIdStr = "";
		var destinationUrl = window.location+"";
		if(controllerPath){
			var index =  (window.location+"").indexOf("/", 10);
			destinationUrl = (window.location+"").substring(0, index)+controllerPath;
		}
		//destinationUrl = destinationUrl.split("?")[0];
		if (destinationUrl.indexOf('?') > -1){
			destinationUrl += '&gathr=true';
		} else {
			destinationUrl += '?gathr=true';
		}
		
		if(offerId)
			offerIdStr = "&offerId=" + offerId;
		return utils.getSnsBaseUrl() + "/_cqr/login/login.psp?authLev=1&lang=en&locale=us"+offerIdStr+"&sitedomain="+utils.getSiteDomain()+"&siteState="+encodeURIComponent("OrigUrl="+encodeURIComponent(destinationUrl));		
	},
	getManageMyAccountUrl: function(){
		var env = GathrNamespace("Gathr.UTIL").getEnv();
		return (env!="p") ? 'https://bill.qa.aol.com' : 'https://bill.aol.com';
	},
	getVideoSiteKey:function(){
		var VIDEO_CONFIG={
			prSiteKey: 257, // 257 prod site key
			qhSiteKey: 271, // 271 qh site key
			qaSiteKey: 270, // 270 qa site key
			hpSiteKey: 291, // 291 help site key
			gtSiteKey: 290, // 290 get site key
			stSiteKey: 293  // 293 stage site key
		};
		var env = GathrNamespace("Gathr.UTIL").getEnv();
		if (env == "qa") {
			siteKey = VIDEO_CONFIG.qaSiteKey;
		}
		else if (env == "qh") {
			siteKey = VIDEO_CONFIG.qhSiteKey;
		}
		else if (env == "qa") {
			siteKey = VIDEO_CONFIG.hpSiteKey;
		}
		else if (env == "qt") {
			siteKey = VIDEO_CONFIG.gtSiteKey;
		}
		else if (env == "staging") {
			siteKey = VIDEO_CONFIG.stSiteKey;
		}
		else {
			siteKey = VIDEO_CONFIG.prSiteKey;
		}
		return siteKey;
	},
	getParallaxSupport:function(){
		var uAgent = navigator.userAgent,elements=2;
		var support=false;
		var bInfo = GathrNamespace("Gathr.UTIL").getIdentifyBrowser(uAgent,elements),
			bInfoPart='';
		//console.log(bInfo);
		if(bInfo) {
			bInfoPart = bInfo.split("-");
			// We're dropping parallax support for Chrome due to its poor
			// performance when using the mouse wheel. We'll pay attention
			// to Chrome updates and if smoother scrolling is implemented
			// we'll reenable parallax for that version and above.
			/*
			if(bInfoPart[0].indexOf('chrome') !=-1){
				if(bInfoPart[1] >= 17) support=true;
			}
			*/
			if(bInfoPart[0].indexOf('msie') != -1){
				if(bInfoPart[1] >= 10) support=true;
			}
			if(bInfoPart[0].indexOf('firefox') != -1){
				if(bInfoPart[1] >= 10) support=true;
			}
			if(bInfoPart[0].indexOf('opera') != -1){
				if(bInfoPart[1] >= 11) support=true;
			}
			if(bInfoPart[0].indexOf('safari') != -1){
				if(bInfoPart[1] >= 5.1) support=true;
			}
		}
		
	    if(Modernizr.touch) support = false;
		
		return support;
		
	},
	getIdentifyBrowser:function(userAgent, elements) {
	    var regexps = {
	            'Chrome': [ /Chrome\/(\S+)/ ],
	            'Firefox': [ /Firefox\/(\S+)/ ],
	            'MSIE': [ /MSIE (\S+);/ ],
	            'Opera': [
	                /Opera\/.*?Version\/(\S+)/,     /* Opera 10 */
	                /Opera\/(\S+)/                  /* Opera 9 and older */
	            ],
	            'Safari': [ /Version\/(\S+).*?Safari\// ]
	        },
	        re, m, browser, version,bInfo='';
	 
	    if (userAgent === undefined)
	        userAgent = navigator.userAgent;
	 
	    if (elements === undefined)
	        elements = 2;
	    else if (elements === 0)
	        elements = 1337;
	 
	    for (browser in regexps)
	        while (re = regexps[browser].shift())
	            if (m = userAgent.match(re)) {
	                version = (m[1].match(new RegExp('[^.]+(?:\.[^.]+){0,' + --elements + '}')))[0];
	                bInfo = browser + '-'+version;
	                return bInfo.toLowerCase();
	            }
	 
	    return null;
	},
	setAolClientClass: function(){
		if(navigator.userAgent.toLowerCase().indexOf("aol")>-1)
			$("html").addClass("aolclient");
	},
	viewRenderEventTriggered: function(viewName){
		//for T&T use
		$(window).trigger('tt_trigger', viewName);
	}
});
