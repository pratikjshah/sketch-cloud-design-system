var CONSTANTS = require('./lib/constants')

module.exports = function(actionName) {
  if (!actionName) {
    throw new Error('missing action name')
  }
  window.webkit.messageHandlers[CONSTANTS.JS_BRIDGE].postMessage(
    JSON.stringify([].slice.call(arguments)))
}
