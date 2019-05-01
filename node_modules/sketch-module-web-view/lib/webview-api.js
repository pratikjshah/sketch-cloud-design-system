var ObjCClass = require('cocoascript-class').default
var EventEmitter = require('@skpm/events')
var parseWebArguments = require('./parseWebArguments')
var CONSTANTS = require('./constants')

// We create one ObjC class for ourselves here
var NavigationDelegateClass
var WebScriptHandlerClass

// let's try to match https://github.com/electron/electron/blob/master/docs/api/web-contents.md
module.exports = function buildAPI(browserWindow, panel, webview) {
  var webContents = new EventEmitter()

  webContents.loadURL = browserWindow.loadURL
  webContents.getURL = webview.mainFrameURL
  webContents.getTitle = webview.mainFrameTitle
  webContents.isDestroyed = function() {
    // TODO:
  }
  webContents.isLoading = function() {
    return webview.loading()
  }
  webContents.stop = webview.stopLoading
  webContents.reload = webview.reload
  webContents.canGoBack = webview.canGoBack
  webContents.canGoForward = webview.canGoForward
  webContents.goBack = webview.goBack
  webContents.goForward = webview.goForward
  webContents.executeJavaScript = function(script) {
    // TODO: pass result back to caller somehow
    webview.evaluateJavaScript_completionHandler(script, null)
  }
  webContents.undo = function() {
    webview.undoManager().undo()
  }
  webContents.redo = function() {
    webview.undoManager().redo()
  }
  webContents.cut = webview.cut
  webContents.copy = webview.copy
  webContents.paste = webview.paste
  webContents.pasteAndMatchStyle = webview.pasteAsRichText
  webContents.delete = webview.delete
  webContents.replace = webview.replaceSelectionWithText
  webContents.getNativeWebview = function() {
    return webview
  }

  if (!NavigationDelegateClass) {
    NavigationDelegateClass = ObjCClass({
      classname: 'NavigationDelegateClass',
      state: NSMutableDictionary.dictionaryWithDictionary({
        lastQueryId: null,
        wasReady: 0,
      }),
      utils: null,

      // TODO: replacements for
      // 'webView:didChangeLocationWithinPageForFrame:' (emits 'did-navigate-in-page')
      // 'webView:didStartProvisionalLoadForFrame:' (emits 'did-start-loading')
      // 'webView:didFailLoadWithError:forFrame:' (emits 'did-fail-load')
      // 'webView:didReceiveServerRedirectForProvisionalLoadForFrame:' (emits 'did-get-redirect-request')
      // 'webView:didReceiveTitle:forFrame:' (calls this.utils.setTitle and emits 'page-title-updated')
      // 'webView:willPerformClientRedirectToURL:delay:fireDate:forFrame:' (emits 'will-navigate')

      // Called when a page load completes.
      'webView:didFinishNavigation:': function() {
        if (this.state.wasReady == 0) {
          // eslint-disable-line
          this.utils.emitBrowserEvent('ready-to-show')
          this.state.setObject_forKey(1, 'wasReady')
        }
        this.utils.emit('did-finish-load')
        this.utils.emit('did-frame-finish-load')
        this.utils.emit('dom-ready')
      },
    })
  }

  if (!WebScriptHandlerClass) {
    WebScriptHandlerClass = ObjCClass({
      classname: 'WebScriptHandlerClass',
      utils: null,
      'userContentController:didReceiveScriptMessage:': function(_, message) {
        let webArguments = JSON.parse(String(message.body()));
        var args = this.utils.parseWebArguments([JSON.stringify(webArguments)])
        if (!args) {
          return false
        }

        this.utils.emit.apply(this, args)
      },
    });
  }

  var navigationDelegate = NavigationDelegateClass.new()
  navigationDelegate.utils = NSDictionary.dictionaryWithDictionary({
    setTitle: browserWindow.setTitle.bind(browserWindow),
    emitBrowserEvent: browserWindow.emit.bind(browserWindow),
    emit: webContents.emit.bind(webContents),
    parseWebArguments: parseWebArguments,
  })

  var webScriptHandler = WebScriptHandlerClass.new()
  webScriptHandler.utils = NSDictionary.dictionaryWithDictionary({
    emit: webContents.emit.bind(webContents),
    parseWebArguments: parseWebArguments,
  })

  webview.configuration().userContentController().addScriptMessageHandler_name(
    webScriptHandler, CONSTANTS.JS_BRIDGE)

  webview.setNavigationDelegate(navigationDelegate)

  browserWindow.webContents = webContents
}
