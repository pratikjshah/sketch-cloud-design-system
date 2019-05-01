import sketch from 'sketch'

var globalContext;
var remoteManifestUrl = "https://raw.githubusercontent.com/pratikjshah/sketch-cloud-library/master/cloud-sketch-library.sketchplugin/Contents/Sketch/manifest.json";
var localDataPath;
var userConfig;
var pluginRoot;
var hasResponseCame = false;
const timeout = require('@skpm/timers');

// ===== Menu action handlers ========================

export function onAction(context) {
	console.log("Action: " + context.action);
}

export function addGDPLibrary(context) {
	init(context);
	setupLibrary("basics");
	setupLibrary("gdp");
}

export function addDemoLibrary(context) {
	init(context);
	setupLibrary("demo");
}

export function addSCMLibrary(context) {
	init(context);
	setupLibrary("basics");
  	setupLibrary("scm");
}

export function openGDPTemplate(context) {
	init(context);
	var template = userConfig['gdp'].templates[0].fileName;

	var localTemplatePath = pluginRoot + "/Contents/Resources/templates/" + template;

	//localTemplatePath = NSURL.URLWithString("https://sketch.cloud/s/dDxam");

	NSApp.delegate().openTemplateAtPath(localTemplatePath);
	trackEvent("openTemplate", "gdp", 1);
}

export function openDemoTemplate(context) {
	init(context);
	var template = userConfig['demo'].templates[0].fileName;

	var localTemplatePath = pluginRoot + "/Contents/Resources/templates/" + template;

	//localTemplatePath = NSURL.URLWithString("https://sketch.cloud/s/dDxam");

	NSApp.delegate().openTemplateAtPath(localTemplatePath);
	trackEvent("openTemplate", "demo", 1);
}

export function checkLibraryUpdates(context) {
	init(context);
  	AppController.sharedInstance().checkForAssetLibraryUpdates();
  	trackEvent("checkLibraryUpdates", "manualCheckForUpdate", 1);
}

export function checkForUpdate(context) {
	init(context);
    networkRequest(remoteManifestUrl, manageManualUpdate);
    trackEvent("checkForUpdate", "manualCheckForUpdate", 1);
    //context.document.showMessage("remoteManifest: " + remoteManifest.version);
}


// ===== Library functions ========================= 

export function setupLibrary(tag) {
	trackEvent("addLibrary", tag, 1);

	//showMsg("into the setup library: " + tag);
	if(userConfig.hasOwnProperty(tag)) {
		var tagObject = userConfig[tag];
		addOrEnableLibrary(tagObject.libraries);
		//setupTemplate(tagObject.templates);
		addPalette(tagObject.colors);
	} else {
		showMsg ("🤬Something went wrong! Please report the issue.");
	}
	//documentColors = readJSON(false, );

	/*var sketch = require('sketch');
	//var sketch = context.api();
	var Library = require('sketch/dom').Library;

	var localSourceFile = "libraries/colors.sketch";
	var localSourcePath = context.plugin.urlForResourceNamed(localSourceFile).path();

	if(localSourcePath) {

		// -- Add local file as a library
	var libURL = NSURL.fileURLWithPath(localSourcePath);
	var library = Library.getLibraryForDocumentAtPath(libURL);

	sketch.UI.message("Library installed!");
	}*/
}

export function addOrEnableLibrary(librariesToAdd) {
	for (var i=0; i < librariesToAdd.length; i++) {
		if(enableLibraryIfAlreadyAdded(librariesToAdd[i].fileName)) {
			showMsg ("🤘Yo🤘 " + librariesToAdd[i].displayName + " is already added!");
			trackEvent("enabledAddedLibrary", librariesToAdd[i].displayName, 1);
		} else {
			addNewLibrary(librariesToAdd[i].url);
			trackEvent("addNewLibrary", librariesToAdd[i].displayName, 1);
			showMsg ("⬇️ Downloading " + librariesToAdd[i].displayName + " ..");
		}
	}
}

export function addNewLibrary(url) {

	var sketchCloudIdentifier = "https://sketch.cloud/s/";

	var libraryId, libraryURL;
	if(url.search(sketchCloudIdentifier) > -1) {
		libraryId = url.split(sketchCloudIdentifier)[1];
		//var libraryURL = "sketch://add-library/cloud/" + libraryId;
		libraryURL = "sketch://add-library?url=" + encodeURI("https://client.sketch.cloud/v1/shares/" + libraryId + "/rss");

		NSWorkspace.sharedWorkspace().openURL(NSURL.URLWithString(libraryURL));

	} else {
		var Library = require('sketch/dom').Library;
		Library.getRemoteLibraryWithRSS(
		  '' + url,
		  (err, library) => {
		    if (err) {
		      // oh no, failed to load the library
		      console.log("Something went wrong! \n" + err);
		    } else {
		      console.log("Done");
		    }
		  }
		);
	}
}

export function enableLibraryIfAlreadyAdded(name) {
	var addedLibraries = require('sketch/dom').getLibraries();
	for (var i=0; i < addedLibraries.length; i++) {
		if(addedLibraries[i].name === name) {
			if(!addedLibraries[i].enabled) {
				addedLibraries[i].enabled = true;
				return true;
			} else {
				return true;
			}
		}
	}
	return false;
}


// ===== Document Colors functions =================

export function addPalette(url) {
	//var palette = readJSON(false, url);
	var palette = networkRequest(url, loadPalette);
}

export function loadPalette(palette) {
	var app = NSApp.delegate();
	var doc = globalContext.document;
	var colorPalette = palette.colors ? palette.colors : [];
	var colors = [];
	if (colorPalette.length > 0) {
		for (var i = 0; i < colorPalette.length; i++) {
			var colorName = colorPalette[i].name ? colorPalette[i].name : null;
			var mscolor = MSColor.colorWithRed_green_blue_alpha(
				colorPalette[i].red,
				colorPalette[i].green,
				colorPalette[i].blue,
				colorPalette[i].alpha
			);
			colors.push(MSColorAsset.alloc().initWithAsset_name(mscolor, colorName));
		}
	} else {
		showMsg ("No 🌈Colors found! Please report the issue.");
	}
	var assets = MSPersistentAssetCollection.sharedGlobalAssets();
	//var assets = doc.documentData().assets();
	assets.setColorAssets([]);
	if (colors.length > 0) assets.addColorAssets(colors)
	doc.inspectorController().closeAnyColorPopover();
	app.refreshCurrentDocument();
	trackEvent("addLibrary", "loadPalette", 1);
}



// ===== Template functions ========================



export function setupTemplate(templatesToAdd) {

	const fs = require('@skpm/fs');

	var teamName = 'Walmart';
	var template;
	var message;

	for (var i=0; i < templatesToAdd.length; i++) {
		template = templatesToAdd[i].fileName;

		var pluginRoot = globalContext.scriptPath.stringByDeletingLastPathComponent().stringByDeletingLastPathComponent().stringByDeletingLastPathComponent();
		var localSourceFile = pluginRoot + "/Contents/Resources/" + template;
		var localSourcePath = globalContext.plugin.urlForResourceNamed(template).path();

		var sketchPath = '~/Library/Application Support/com.bohemiancoding.sketch3/Templates/' + teamName + "/" + templatesToAdd[i].fileName;

		if (fs.existsSync(sketchPath)) {
			message = "Templates are already installed!";
		} else {
			fs.copyFileSync(localSourcePath, sketchPath);
			message = "⭐️New⭐️ Templates added!";
		}
	}

	showMsg(message);
}


// ===== Other functions ==========================

export function reportIssue(context) {
	init(context);
    openUrlInBrowser("https://github.com/pratikjshah/sketch-cloud-library/issues");
}

export function aboutPratikShah(context) {
	init(context);
	openUrlInBrowser("http://pratikshah.website");
}

export function manageDailyUpdateCheck(remoteManifest) {
	var isDailyCheck = true;
	manageUpdate (remoteManifest, isDailyCheck);
}

export function manageManualUpdate(remoteManifest) {
	var isDailyCheck = false;
	manageUpdate (remoteManifest, isDailyCheck);
}

export function manageUpdate(remoteManifest, isDailyCheck) {

	/*if (userConfig.localVersion != remoteManifest.version) {
		showMsg(userConfig.name + ": "+ userConfig.localVersion + " is out of date! Please check for updates.");
	}*/

    if (remoteManifest.version) {
        if (userConfig.localVersion == remoteManifest.version) {
        	if(!isDailyCheck) {
        		showMsg("🤘Yo🤘! You are using the latest version of " + userConfig.name);
        	}
          //setUpdateCheckDayOnTomorrow();
        } else {
          showMsg("Hey👋! New version of " + userConfig.name + " is available!");
          //showAvailableUpdateDialog();
          setUpdateCheckDayOnTomorrow();
        }
    } else {
      //showMsg("can not check:");
      //showAvailableUpdateDialog();
      setUpdateCheckDayOnTomorrow();
    }
}

function setUpdateCheckDayOnTomorrow() {
  var newTime = new Date();
  newTime.setDate(newTime.getDate() + 1);
  userConfig.localUpdateTime = newTime.getTime();
  saveLocalData(userConfig, localDataPath);
}

// ===== Dialog functions ==========================

function showAvailableUpdateDialog() {
  var window = createDownloadWindow();
  var alert = window[0];
  // When “Ok” is clicked
  var response = alert.runModal();
  if (response == "1000") {
    //globalContext.document.showMessage("Go to download");
    openUrlInBrowser("https://github.com/pratikjshah/sketch-cloud-library/archive/master.zip");
  } else {
    //globalContext.document.showMessage("Check later");
    setUpdateCheckDayOnTomorrow();
  }
}

// ===== Helper functions ==========================

export function init(context) {
	globalContext = context;
	pluginRoot = globalContext.scriptPath.stringByDeletingLastPathComponent().stringByDeletingLastPathComponent().stringByDeletingLastPathComponent();
	localDataPath = pluginRoot + "/Contents/Resources/user.config";
	userConfig = readLocalData(localDataPath);

	var newTime = new Date();
	if (userConfig.localUpdateTime < newTime.getTime()) {
		trackEvent("checkForUpdate", "dailyCheckForUpdate", 1);
		networkRequest(remoteManifestUrl, manageDailyUpdateCheck);
	}
	/*var remoteManifest = getRemoteJson(remoteManifestUrl);
	if (userConfig.localVersion != remoteManifest.version) {
	showMsg(userConfig.name + ": "+ userConfig.localVersion + " is out of date! Please check for updates.");
	}
	setUpdateCheckDayOnTomorrow();*/
}

export function showMsg(msg) {
	globalContext.document.showMessage(msg);
}

export function openUrlInBrowser(url) {
    NSWorkspace.sharedWorkspace().openURL(NSURL.URLWithString(url));
    trackEvent("openUrlInBrowser", url, 1);
}

export function saveLocalData(data, path) {
	/*var string = [NSString stringWithFormat: "%@", JSON.stringify(data)];
	[string writeToFile: path atomically: true encoding: NSUTF8StringEncoding error: nil];*/
	data = JSON.stringify(data);
	var text = NSString.stringWithFormat("%@", data);
	var file = NSString.stringWithFormat("%@", path);
	return text.writeToFile_atomically_encoding_error(file, true, NSUTF8StringEncoding, null);
}

export function readLocalData(path) {
  if(NSFileManager.defaultManager().fileExistsAtPath(path)){
    var string = NSString.stringWithContentsOfFile_encoding_error(path,4, nil);
    string = string.replace(/(\r\n|\n|\r)/gm,"");
    var data = JSON.parse(string);
    return data;
  }
}

export function networkRequest(url, callBackFun) {

	console.log("in networkRequest: \n" + url + " \n " + callBackFun);

	return fetch(url)
	  .then(function (response) {
			  if (!response.ok) {
			    throw Error(response.statusText);
			  }
			  return response;
			})
	  .then(function (response) {
			  return response.json();
			})
	  .then(function (result) {
			  console.log('Response Params: \n url: ' + url + " \n callBackFun: " + callBackFun);
			  console.log(result);
			  if(callBackFun !== 'undefined') {
			  	callBackFun(result);
			  }
			  return result;
			})
	  .catch(function (error) {
			  console.log('Params: \n url: ' + url + " \n callBackFun: " + callBackFun);
			  console.log('Looks like there was a problem: \n', error);
			});
}

export function trackEvent(action, label, value) {
    var kUUIDKey = 'google.analytics.uuid'
    var uuid = NSUserDefaults.standardUserDefaults().objectForKey(kUUIDKey)
    if (!uuid) {
      uuid = NSUUID.UUID().UUIDString()
      NSUserDefaults.standardUserDefaults().setObject_forKey(uuid, kUUIDKey)
    }

    var tid = "UA-64818389-8";
    var cid = uuid;
    var ds = "Sketch-" + NSBundle.mainBundle().objectForInfoDictionaryKey("CFBundleShortVersionString");
    var baseURL = "https://www.google-analytics.com/debug/collect?v=1&ds=" + ds + "&t=event&tid=" + tid + "&cid=" + cid;
    baseURL = "https://www.google-analytics.com/collect?v=1&ds=" + ds + "&t=event&tid=" + tid + "&cid=" + cid;
    var version = userConfig.localVersion;

    var trackingURL = baseURL + "&ec=SketchCloudLibrary-" + version + "&ea=" + action + "&el=" + label + "&ev=" + value;
    networkRequest(trackingURL);

}