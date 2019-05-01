/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/_stub-sticker-index.json":
/*!**************************************!*\
  !*** ./src/_stub-sticker-index.json ***!
  \**************************************/
/*! exports provided: libraries, default */
/***/ (function(module) {

eval("module.exports = {\"libraries\":[{\"id\":\"1FD28C66-9DA0-4F92-A6CF-9ED13FFCEBB7\",\"sections\":[{\"title\":\"Artboard templates\",\"layout\":\"row\",\"description\":\"Kick starter base pages for your designs.  <br/><br/> <b>Find it here:</b><br/> 📖 Templates ⟶ SIZE ⟶ Artboard <br/><br/> <b>Tags:</b><br/> base page, artboards, container\",\"id\":\"@Templates\",\"items\":[{\"title\":\"Desktop 1336px\",\"id\":\"@Templates.Desktop1336\",\"items\":[{\"type\":\"layer\",\"id\":\"1FD28C66-9DA0-4F92-A6CF-9ED13FFCEBB7.985E80C6-58D5-4429-8C77-9A9E79986856\",\"layer\":{},\"name\":\"Full sidebar\",\"imagePath\":\"/Users/p0s00zi/Library/Caches/net.nurik.roman.sketch.stickers/1FD28C66-9DA0-4F92-A6CF-9ED13FFCEBB7/985E80C6-58D5-4429-8C77-9A9E79986856.png\",\"contentPath\":\"/Users/p0s00zi/Library/Caches/net.nurik.roman.sketch.stickers/1FD28C66-9DA0-4F92-A6CF-9ED13FFCEBB7/985E80C6-58D5-4429-8C77-9A9E79986856.json\",\"width\":1340,\"height\":934},{\"type\":\"layer\",\"id\":\"1FD28C66-9DA0-4F92-A6CF-9ED13FFCEBB7.234B58FA-2572-4792-9236-BBD1636B1C41\",\"layer\":{},\"name\":\"Collapsed sidebar\",\"imagePath\":\"/Users/p0s00zi/Library/Caches/net.nurik.roman.sketch.stickers/1FD28C66-9DA0-4F92-A6CF-9ED13FFCEBB7/234B58FA-2572-4792-9236-BBD1636B1C41.png\",\"contentPath\":\"/Users/p0s00zi/Library/Caches/net.nurik.roman.sketch.stickers/1FD28C66-9DA0-4F92-A6CF-9ED13FFCEBB7/234B58FA-2572-4792-9236-BBD1636B1C41.json\",\"width\":1347,\"height\":939}],\"type\":\"section\",\"libraryId\":\"1FD28C66-9DA0-4F92-A6CF-9ED13FFCEBB7\"},{\"title\":\"Desktop 1440px\",\"id\":\"@Templates.Desktop1440\",\"items\":[{\"type\":\"layer\",\"id\":\"1FD28C66-9DA0-4F92-A6CF-9ED13FFCEBB7.94D171AE-A926-481E-A831-1591433D6504\",\"layer\":{},\"name\":\"Full sidebar\",\"imagePath\":\"/Users/p0s00zi/Library/Caches/net.nurik.roman.sketch.stickers/1FD28C66-9DA0-4F92-A6CF-9ED13FFCEBB7/94D171AE-A926-481E-A831-1591433D6504.png\",\"contentPath\":\"/Users/p0s00zi/Library/Caches/net.nurik.roman.sketch.stickers/1FD28C66-9DA0-4F92-A6CF-9ED13FFCEBB7/94D171AE-A926-481E-A831-1591433D6504.json\",\"width\":1444,\"height\":934},{\"type\":\"layer\",\"id\":\"1FD28C66-9DA0-4F92-A6CF-9ED13FFCEBB7.0808DECA-0B31-4FA3-BB22-2FD5926FCAD7\",\"layer\":{},\"name\":\"Collapsed sidebar\",\"imagePath\":\"/Users/p0s00zi/Library/Caches/net.nurik.roman.sketch.stickers/1FD28C66-9DA0-4F92-A6CF-9ED13FFCEBB7/0808DECA-0B31-4FA3-BB22-2FD5926FCAD7.png\",\"contentPath\":\"/Users/p0s00zi/Library/Caches/net.nurik.roman.sketch.stickers/1FD28C66-9DA0-4F92-A6CF-9ED13FFCEBB7/0808DECA-0B31-4FA3-BB22-2FD5926FCAD7.json\",\"width\":1451,\"height\":939}],\"type\":\"section\",\"libraryId\":\"1FD28C66-9DA0-4F92-A6CF-9ED13FFCEBB7\"},{\"title\":\"Tablet Landscape\",\"id\":\"@Templates.TabletLand\",\"items\":[{\"type\":\"layer\",\"id\":\"1FD28C66-9DA0-4F92-A6CF-9ED13FFCEBB7.39CC3446-AB42-4219-A2A5-C327F2DD6B31\",\"layer\":{},\"name\":\"No sidebar\",\"imagePath\":\"/Users/p0s00zi/Library/Caches/net.nurik.roman.sketch.stickers/1FD28C66-9DA0-4F92-A6CF-9ED13FFCEBB7/39CC3446-AB42-4219-A2A5-C327F2DD6B31.png\",\"contentPath\":\"/Users/p0s00zi/Library/Caches/net.nurik.roman.sketch.stickers/1FD28C66-9DA0-4F92-A6CF-9ED13FFCEBB7/39CC3446-AB42-4219-A2A5-C327F2DD6B31.json\",\"width\":1024,\"height\":768},{\"type\":\"layer\",\"id\":\"1FD28C66-9DA0-4F92-A6CF-9ED13FFCEBB7.1744A3DD-D362-49B1-835B-6265A7B790CD\",\"layer\":{},\"name\":\"Collapsed sidebar\",\"imagePath\":\"/Users/p0s00zi/Library/Caches/net.nurik.roman.sketch.stickers/1FD28C66-9DA0-4F92-A6CF-9ED13FFCEBB7/1744A3DD-D362-49B1-835B-6265A7B790CD.png\",\"contentPath\":\"/Users/p0s00zi/Library/Caches/net.nurik.roman.sketch.stickers/1FD28C66-9DA0-4F92-A6CF-9ED13FFCEBB7/1744A3DD-D362-49B1-835B-6265A7B790CD.json\",\"width\":1035,\"height\":779}],\"type\":\"section\",\"libraryId\":\"1FD28C66-9DA0-4F92-A6CF-9ED13FFCEBB7\"},{\"title\":\"Tablet Portrait\",\"id\":\"@Templates.TabletPort\",\"items\":[{\"type\":\"layer\",\"id\":\"1FD28C66-9DA0-4F92-A6CF-9ED13FFCEBB7.89150732-1844-4D2E-85CE-4F195F3762F1\",\"layer\":{},\"name\":\"No sidebar\",\"imagePath\":\"/Users/p0s00zi/Library/Caches/net.nurik.roman.sketch.stickers/1FD28C66-9DA0-4F92-A6CF-9ED13FFCEBB7/89150732-1844-4D2E-85CE-4F195F3762F1.png\",\"contentPath\":\"/Users/p0s00zi/Library/Caches/net.nurik.roman.sketch.stickers/1FD28C66-9DA0-4F92-A6CF-9ED13FFCEBB7/89150732-1844-4D2E-85CE-4F195F3762F1.json\",\"width\":768,\"height\":1028},{\"type\":\"layer\",\"id\":\"1FD28C66-9DA0-4F92-A6CF-9ED13FFCEBB7.54EE1CAA-24D1-404D-BB32-AD22E2111E60\",\"layer\":{},\"name\":\"Collapsed sidebar\",\"imagePath\":\"/Users/p0s00zi/Library/Caches/net.nurik.roman.sketch.stickers/1FD28C66-9DA0-4F92-A6CF-9ED13FFCEBB7/54EE1CAA-24D1-404D-BB32-AD22E2111E60.png\",\"contentPath\":\"/Users/p0s00zi/Library/Caches/net.nurik.roman.sketch.stickers/1FD28C66-9DA0-4F92-A6CF-9ED13FFCEBB7/54EE1CAA-24D1-404D-BB32-AD22E2111E60.json\",\"width\":779,\"height\":1035}],\"type\":\"section\",\"libraryId\":\"1FD28C66-9DA0-4F92-A6CF-9ED13FFCEBB7\"}],\"type\":\"section\",\"libraryId\":\"1FD28C66-9DA0-4F92-A6CF-9ED13FFCEBB7\"},{\"title\":\"Form elements\",\"layout\":\"flow\",\"description\":\"Everything you need for user inputs.  <br/><br/> <b>Includes:</b><br/> Input/Text-fields, Dropdowns, check box, radio controls, buttons\",\"id\":\"@Form\",\"items\":[{\"title\":\"Inputbox / Text field\",\"backgroundEach\":\"#fff\",\"id\":\"@Form.tf\",\"items\":[{\"type\":\"layer\",\"id\":\"1FD28C66-9DA0-4F92-A6CF-9ED13FFCEBB7.1583854D-0696-4FE6-8525-625AF0428C93\",\"layer\":{},\"name\":\"input textfield-normal\",\"imagePath\":\"/Users/p0s00zi/Library/Caches/net.nurik.roman.sketch.stickers/1FD28C66-9DA0-4F92-A6CF-9ED13FFCEBB7/1583854D-0696-4FE6-8525-625AF0428C93.png\",\"contentPath\":\"/Users/p0s00zi/Library/Caches/net.nurik.roman.sketch.stickers/1FD28C66-9DA0-4F92-A6CF-9ED13FFCEBB7/1583854D-0696-4FE6-8525-625AF0428C93.json\",\"width\":245,\"height\":60},{\"type\":\"layer\",\"id\":\"1FD28C66-9DA0-4F92-A6CF-9ED13FFCEBB7.4FE7F245-C03A-4699-A030-6EB2EA39F936\",\"layer\":{},\"name\":\"input textfield-focused\",\"imagePath\":\"/Users/p0s00zi/Library/Caches/net.nurik.roman.sketch.stickers/1FD28C66-9DA0-4F92-A6CF-9ED13FFCEBB7/4FE7F245-C03A-4699-A030-6EB2EA39F936.png\",\"contentPath\":\"/Users/p0s00zi/Library/Caches/net.nurik.roman.sketch.stickers/1FD28C66-9DA0-4F92-A6CF-9ED13FFCEBB7/4FE7F245-C03A-4699-A030-6EB2EA39F936.json\",\"width\":245,\"height\":60},{\"type\":\"layer\",\"id\":\"1FD28C66-9DA0-4F92-A6CF-9ED13FFCEBB7.A1F88AE5-DD56-4702-8FB4-E81014A63E73\",\"layer\":{},\"name\":\"input textfield-error\",\"imagePath\":\"/Users/p0s00zi/Library/Caches/net.nurik.roman.sketch.stickers/1FD28C66-9DA0-4F92-A6CF-9ED13FFCEBB7/A1F88AE5-DD56-4702-8FB4-E81014A63E73.png\",\"contentPath\":\"/Users/p0s00zi/Library/Caches/net.nurik.roman.sketch.stickers/1FD28C66-9DA0-4F92-A6CF-9ED13FFCEBB7/A1F88AE5-DD56-4702-8FB4-E81014A63E73.json\",\"width\":245,\"height\":78}],\"type\":\"section\",\"libraryId\":\"1FD28C66-9DA0-4F92-A6CF-9ED13FFCEBB7\"}],\"type\":\"section\",\"libraryId\":\"1FD28C66-9DA0-4F92-A6CF-9ED13FFCEBB7\"}],\"title\":\"Experiment library\",\"subtitle\":\"Using GDAP as a base template.\",\"iconPath\":\"/Users/p0s00zi/Library/Caches/net.nurik.roman.sketch.stickers/1FD28C66-9DA0-4F92-A6CF-9ED13FFCEBB7/icon.png\",\"archiveVersion\":118,\"formatVersion\":4,\"fileHash\":\"d71088eb869b7f4b86cb43e09abc1ab61819b1ce\"}]};\n\n//# sourceURL=webpack:///./src/_stub-sticker-index.json?");

/***/ }),

/***/ "./src/plugin-call-stub.js":
/*!*********************************!*\
  !*** ./src/plugin-call-stub.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/*\n * Copyright 2018 Google Inc.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *     http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n\n// This is a stub client used during development.\nconst STUB_STICKER_INDEX = __webpack_require__(/*! ./_stub-sticker-index.json */ \"./src/_stub-sticker-index.json\");\n\nconst ACTIONS = {\n  close() {\n  },\n\n  startDragging(id, rect) {\n  },\n\n  addLibraryColors(libraryId) {\n  },\n\n  requestLayerImageUrl(stickerId, callbackName) {\n    let sticker = __getStickerById(stickerId);\n    let canvas = document.createElement('canvas');\n    canvas.width = sticker.width * 2;\n    canvas.height = sticker.height * 2;\n    let ctx = canvas.getContext('2d');\n    ctx.scale(2, 2);\n    ctx.fillStyle = '#3F51B5';\n    ctx.fillRect(0, 0, sticker.width, sticker.height);\n    ctx.textAlign = 'center';\n    ctx.textBaseline = 'middle';\n    ctx.font = Math.ceil(Math.max(13, Math.min(sticker.width, sticker.height) / 10)) + 'px Menlo';\n    ctx.fillStyle = 'rgba(255,255,255,.6)';\n    ctx.fillText(`${sticker.width}x${sticker.height}`, sticker.width / 2, sticker.height / 2);\n    let url = canvas.toDataURL();\n    // let subPath = sticker.imagePath.replace(/.*net.nurik.roman.sketch.stickers/, '');\n    // let url = '/real-sticker-cache/' + subPath;\n    window[callbackName](stickerId, url);\n  },\n\n  loadStickerIndex(callbackName, progressCallbackName) {\n    // window[progressCallbackName](0);\n    // setTimeout(() => window[progressCallbackName](.3), 100);\n    // setTimeout(() => window[progressCallbackName](.5), 300);\n    // setTimeout(() => window[progressCallbackName](.9), 1000);\n    // setTimeout(() => window[callbackName](STUB_STICKER_INDEX), 1500);\n    setTimeout(() => window[callbackName](STUB_STICKER_INDEX), 0);\n  },\n};\n\nwindow['pluginCall'] = function pluginCall(action, ...args) {\n  console.log(`pluginCall: ${action} with args ${JSON.stringify(args)}`);\n  ACTIONS[action].apply(null, args);\n};\n\n\nfunction __getStickerById(id) {\n  let foundSticker = null;\n  let findInSection = section => {\n    (section.items || []).forEach(item => {\n      if (item.type == 'layer' && item.id == id) {\n        foundSticker = item;\n      } else if (item.type == 'section') {\n        findInSection(item);\n      }\n    });\n  };\n\n  for (let library of STUB_STICKER_INDEX.libraries) {\n    for (let section of library.sections) {\n      findInSection(section);\n    }\n  }\n  return foundSticker;\n}\n\n\n//# sourceURL=webpack:///./src/plugin-call-stub.js?");

/***/ }),

/***/ 0:
/*!***************************************!*\
  !*** multi ./src/plugin-call-stub.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__(/*! ./src/plugin-call-stub.js */\"./src/plugin-call-stub.js\");\n\n\n//# sourceURL=webpack:///multi_./src/plugin-call-stub.js?");

/***/ })

/******/ });