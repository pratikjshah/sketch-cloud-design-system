var that = this;
function __skpm_run (key, context) {
  that.context = context;

var exports =
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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/handler.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/@skpm/fs/index.js":
/*!****************************************!*\
  !*** ./node_modules/@skpm/fs/index.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// TODO: async. Should probably be done with NSFileHandle and some notifications
// TODO: file descriptor. Needs to be done with NSFileHandle
var Buffer = __webpack_require__(/*! buffer */ "buffer").Buffer

var ERRORS = {
  'EPERM': {
    message: 'operation not permitted',
    errno: -1
  },
  'ENOENT': {
    message: 'no such file or directory',
    errno: -2
  },
  'EACCES': {
    message: 'permission denied',
    errno: -13
  },
  'ENOTDIR': {
    message: 'not a directory',
    errno: -20
  },
  'EISDIR': {
    message: 'illegal operation on a directory',
    errno: -21
  }
}

function fsError(code, options) {
  var error = new Error(
    code + ': '
    + ERRORS[code].message + ', '
    + (options.syscall || '')
    + (options.path ? ' \'' + options.path + '\'' : '')
  )

  Object.keys(options).forEach(function (k) {
    error[k] = options[k]
  })

  error.code = code
  error.errno = ERRORS[code].errno

  return error
}

function fsErrorForPath(path, shouldBeDir, err, syscall) {
  var fileManager = NSFileManager.defaultManager()
  var doesExist = fileManager.fileExistsAtPath(path)
  if (!doesExist) {
    return fsError('ENOENT', {
      path: path,
      syscall: syscall || 'open'
    })
  }
  var isReadable = fileManager.isReadableFileAtPath(path)
  if (!isReadable) {
    return fsError('EACCES', {
      path: path,
      syscall: syscall || 'open'
    })
  }
  if (typeof shouldBeDir !== 'undefined') {
    var isDirectory = module.exports.lstatSync(path).isDirectory()
    if (isDirectory && !shouldBeDir) {
      return fsError('EISDIR', {
        path: path,
        syscall: syscall || 'read'
      })
    } else if (!isDirectory && shouldBeDir) {
      return fsError('ENOTDIR', {
        path: path,
        syscall: syscall || 'read'
      })
    }
  }
  return new Error(err || ('Unknown error while manipulating ' + path))
}

function encodingFromOptions(options, defaultValue) {
  return options && options.encoding
    ? String(options.encoding)
    : (
      options
        ? String(options)
        : defaultValue
    )
}

module.exports.constants = {
  F_OK: 0,
  R_OK: 4,
  W_OK: 2,
  X_OK: 1
}

module.exports.accessSync = function(path, mode) {
  mode = mode | 0
  var fileManager = NSFileManager.defaultManager()

  switch (mode) {
    case 0:
      canAccess = module.exports.existsSync(path)
      break
    case 1:
      canAccess = Boolean(Number(fileManager.isExecutableFileAtPath(path)))
      break
    case 2:
      canAccess = Boolean(Number(fileManager.isWritableFileAtPath(path)))
      break
    case 3:
      canAccess = Boolean(Number(fileManager.isExecutableFileAtPath(path))) && Boolean(Number(fileManager.isWritableFileAtPath(path)))
      break
    case 4:
      canAccess = Boolean(Number(fileManager.isReadableFileAtPath(path)))
      break
    case 5:
      canAccess = Boolean(Number(fileManager.isReadableFileAtPath(path))) && Boolean(Number(fileManager.isExecutableFileAtPath(path)))
      break
    case 6:
      canAccess = Boolean(Number(fileManager.isReadableFileAtPath(path))) && Boolean(Number(fileManager.isWritableFileAtPath(path)))
      break
    case 7:
      canAccess = Boolean(Number(fileManager.isReadableFileAtPath(path))) && Boolean(Number(fileManager.isWritableFileAtPath(path))) && Boolean(Number(fileManager.isExecutableFileAtPath(path)))
      break
  }

  if (!canAccess) {
    throw new Error('Can\'t access ' + String(path))
  }
}

module.exports.appendFileSync = function(file, data, options) {
  if (!module.exports.existsSync(file)) {
    return module.exports.writeFileSync(file, data, options)
  }

  var handle = NSFileHandle.fileHandleForWritingAtPath(file)
  handle.seekToEndOfFile()

  var encoding = encodingFromOptions(options, 'utf8')

  var nsdata = Buffer.from(data, encoding === 'NSData' || encoding === 'buffer' ? undefined : encoding).toNSData()

  handle.writeData(nsdata)
}

module.exports.chmodSync = function(path, mode) {
  var err = MOPointer.alloc().init()
  var fileManager = NSFileManager.defaultManager()
  fileManager.setAttributes_ofItemAtPath_error({
    NSFilePosixPermissions: mode
  }, path, err)

  if (err.value() !== null) {
    throw fsErrorForPath(path, undefined, err.value())
  }
}

module.exports.copyFileSync = function(path, dest, flags) {
  var err = MOPointer.alloc().init()
  var fileManager = NSFileManager.defaultManager()
  fileManager.copyItemAtPath_toPath_error(path, dest, err)

  if (err.value() !== null) {
    throw fsErrorForPath(path, false, err.value())
  }
}

module.exports.existsSync = function(path) {
  var fileManager = NSFileManager.defaultManager()
  return Boolean(Number(fileManager.fileExistsAtPath(path)))
}

module.exports.linkSync = function(existingPath, newPath) {
  var err = MOPointer.alloc().init()
  var fileManager = NSFileManager.defaultManager()
  fileManager.linkItemAtPath_toPath_error(existingPath, newPath, err)

  if (err.value() !== null) {
    throw fsErrorForPath(existingPath, undefined, err.value())
  }
}

module.exports.mkdirSync = function(path, options) {
  var mode = 0o777
  var recursive = false
  if (options && options.mode) {
    mode = options.mode
  }
  if (options && options.recursive) {
    recursive = options.recursive
  }
  if (typeof options === "number") {
    mode = options
  }
  var err = MOPointer.alloc().init()
  var fileManager = NSFileManager.defaultManager()
  fileManager.createDirectoryAtPath_withIntermediateDirectories_attributes_error(path, recursive, {
    NSFilePosixPermissions: mode
  }, err)

  if (err.value() !== null) {
    throw new Error(err.value())
  }
}

module.exports.mkdtempSync = function(path) {
  function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 6; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }
  var tempPath = path + makeid()
  module.exports.mkdirSync(tempPath)
  return tempPath
}

module.exports.readdirSync = function(path) {
  var fileManager = NSFileManager.defaultManager()
  var paths = fileManager.subpathsAtPath(path)
  var arr = []
  for (var i = 0; i < paths.length; i++) {
    arr.push(String(paths[i]))
  }
  return arr
}

module.exports.readFileSync = function(path, options) {
  var encoding = encodingFromOptions(options, 'buffer')
  var fileManager = NSFileManager.defaultManager()
  var data = fileManager.contentsAtPath(path)
  if (!data) {
    throw fsErrorForPath(path, false)
  }

  var buffer = Buffer.from(data)

  if (encoding === 'buffer') {
    return buffer
  } else if (encoding === 'NSData') {
    return buffer.toNSData()
  } else {
    return buffer.toString(encoding)
  }
}

module.exports.readlinkSync = function(path) {
  var err = MOPointer.alloc().init()
  var fileManager = NSFileManager.defaultManager()
  var result = fileManager.destinationOfSymbolicLinkAtPath_error(path, err)

  if (err.value() !== null) {
    throw fsErrorForPath(path, undefined, err.value())
  }

  return String(result)
}

module.exports.realpathSync = function(path) {
  return String(NSString.stringByResolvingSymlinksInPath(path))
}

module.exports.renameSync = function(oldPath, newPath) {
  var err = MOPointer.alloc().init()
  var fileManager = NSFileManager.defaultManager()
  fileManager.moveItemAtPath_toPath_error(oldPath, newPath, err)

  var error = err.value()

  if (error !== null) {
    // if there is already a file, we need to overwrite it
    if (String(error.domain()) === 'NSCocoaErrorDomain' && Number(error.code()) === 516) {
      var err2 = MOPointer.alloc().init()
      fileManager.replaceItemAtURL_withItemAtURL_backupItemName_options_resultingItemURL_error(NSURL.fileURLWithPath(newPath), NSURL.fileURLWithPath(oldPath), null, NSFileManagerItemReplacementUsingNewMetadataOnly, null, err2)
      if (err2.value() !== null) {
        throw fsErrorForPath(oldPath, undefined, err2.value())
      }
    } else {
      throw fsErrorForPath(oldPath, undefined, error)
    }
  }
}

module.exports.rmdirSync = function(path) {
  var err = MOPointer.alloc().init()
  var fileManager = NSFileManager.defaultManager()
  var isDirectory = module.exports.lstatSync(path).isDirectory()
  if (!isDirectory) {
    throw fsError('ENOTDIR', {
      path: path,
      syscall: 'rmdir'
    })
  }
  fileManager.removeItemAtPath_error(path, err)

  if (err.value() !== null) {
    throw fsErrorForPath(path, true, err.value(), 'rmdir')
  }
}

function parseStat(result) {
  return {
    dev: String(result.NSFileDeviceIdentifier),
    // ino: 48064969, The file system specific "Inode" number for the file.
    mode: result.NSFileType | result.NSFilePosixPermissions,
    nlink: Number(result.NSFileReferenceCount),
    uid: String(result.NSFileOwnerAccountID),
    gid: String(result.NSFileGroupOwnerAccountID),
    // rdev: 0, A numeric device identifier if the file is considered "special".
    size: Number(result.NSFileSize),
    // blksize: 4096, The file system block size for i/o operations.
    // blocks: 8, The number of blocks allocated for this file.
    atimeMs: Number(result.NSFileModificationDate.timeIntervalSince1970()) * 1000,
    mtimeMs: Number(result.NSFileModificationDate.timeIntervalSince1970()) * 1000,
    ctimeMs: Number(result.NSFileModificationDate.timeIntervalSince1970()) * 1000,
    birthtimeMs: Number(result.NSFileCreationDate.timeIntervalSince1970()) * 1000,
    atime: new Date(Number(result.NSFileModificationDate.timeIntervalSince1970()) * 1000 + 0.5), // the 0.5 comes from the node source. Not sure why it's added but in doubt...
    mtime: new Date(Number(result.NSFileModificationDate.timeIntervalSince1970()) * 1000 + 0.5),
    ctime: new Date(Number(result.NSFileModificationDate.timeIntervalSince1970()) * 1000 + 0.5),
    birthtime: new Date(Number(result.NSFileCreationDate.timeIntervalSince1970()) * 1000 + 0.5),
    isBlockDevice: function() { return result.NSFileType === NSFileTypeBlockSpecial },
    isCharacterDevice: function() { return result.NSFileType === NSFileTypeCharacterSpecial },
    isDirectory: function() { return result.NSFileType === NSFileTypeDirectory },
    isFIFO: function() { return false },
    isFile: function() { return result.NSFileType === NSFileTypeRegular },
    isSocket: function() { return result.NSFileType === NSFileTypeSocket },
    isSymbolicLink: function() { return result.NSFileType === NSFileTypeSymbolicLink },
  }
}

module.exports.lstatSync = function(path) {
  var err = MOPointer.alloc().init()
  var fileManager = NSFileManager.defaultManager()
  var result = fileManager.attributesOfItemAtPath_error(path, err)

  if (err.value() !== null) {
    throw fsErrorForPath(path, undefined, err.value())
  }

  return parseStat(result)
}

// the only difference with lstat is that we resolve symlinks
//
// > lstat() is identical to stat(), except that if pathname is a symbolic
// > link, then it returns information about the link itself, not the file
// > that it refers to.
// http://man7.org/linux/man-pages/man2/lstat.2.html
module.exports.statSync = function(path) {
  return module.exports.lstatSync(module.exports.realpathSync(path))
}

module.exports.symlinkSync = function(target, path) {
  var err = MOPointer.alloc().init()
  var fileManager = NSFileManager.defaultManager()
  var result = fileManager.createSymbolicLinkAtPath_withDestinationPath_error(path, target, err)

  if (err.value() !== null) {
    throw new Error(err.value())
  }
}

module.exports.truncateSync = function(path, len) {
  var hFile = NSFileHandle.fileHandleForUpdatingAtPath(sFilePath)
  hFile.truncateFileAtOffset(len || 0)
  hFile.closeFile()
}

module.exports.unlinkSync = function(path) {
  var err = MOPointer.alloc().init()
  var fileManager = NSFileManager.defaultManager()
  var isDirectory = module.exports.lstatSync(path).isDirectory()
  if (isDirectory) {
    throw fsError('EPERM', {
      path: path,
      syscall: 'unlink'
    })
  }
  var result = fileManager.removeItemAtPath_error(path, err)

  if (err.value() !== null) {
    throw fsErrorForPath(path, false, err.value())
  }
}

module.exports.utimesSync = function(path, aTime, mTime) {
  var err = MOPointer.alloc().init()
  var fileManager = NSFileManager.defaultManager()
  var result = fileManager.setAttributes_ofItemAtPath_error({
    NSFileModificationDate: aTime
  }, path, err)

  if (err.value() !== null) {
    throw fsErrorForPath(path, undefined, err.value())
  }
}

module.exports.writeFileSync = function(path, data, options) {
  var encoding = encodingFromOptions(options, 'utf8')

  var nsdata = Buffer.from(
    data, encoding === 'NSData' || encoding === 'buffer' ? undefined : encoding
  ).toNSData()

  nsdata.writeToFile_atomically(path, true)
}


/***/ }),

/***/ "./node_modules/@skpm/timers/immediate.js":
/*!************************************************!*\
  !*** ./node_modules/@skpm/timers/immediate.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* globals coscript, sketch */
var timeout = __webpack_require__(/*! ./timeout */ "./node_modules/@skpm/timers/timeout.js")

function setImmediate(func, param1, param2, param3, param4, param5, param6, param7, param8, param9, param10) {
  return timeout.setTimeout(func, 0, param1, param2, param3, param4, param5, param6, param7, param8, param9, param10)
}

function clearImmediate(id) {
  return timeout.clearTimeout(id)
}

module.exports = {
  setImmediate: setImmediate,
  clearImmediate: clearImmediate
}


/***/ }),

/***/ "./node_modules/@skpm/timers/index.js":
/*!********************************************!*\
  !*** ./node_modules/@skpm/timers/index.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var timeout = __webpack_require__(/*! ./timeout */ "./node_modules/@skpm/timers/timeout.js")
var interval = __webpack_require__(/*! ./interval */ "./node_modules/@skpm/timers/interval.js")
var immediate = __webpack_require__(/*! ./immediate */ "./node_modules/@skpm/timers/immediate.js")

module.exports = {
  setTimeout: timeout.setTimeout,
  clearTimeout: timeout.clearTimeout,
  setImmediate: immediate.setImmediate,
  clearImmediate: immediate.clearImmediate,
  setInterval: interval.setInterval,
  clearInterval: interval.clearInterval
}


/***/ }),

/***/ "./node_modules/@skpm/timers/interval.js":
/*!***********************************************!*\
  !*** ./node_modules/@skpm/timers/interval.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/* globals coscript, sketch */
var fibers = []

var setInterval = function (func, delay, param1, param2, param3, param4, param5, param6, param7, param8, param9, param10) {
  // fibers takes care of keeping coscript around
  var id = fibers.length
  fibers.push(coscript.scheduleWithRepeatingInterval_jsFunction(
    (delay || 0) / 1000,
    function () {
      func(param1, param2, param3, param4, param5, param6, param7, param8, param9, param10)
    }
  ))
  return id
}

var clearInterval = function (id) {
  var interval = fibers[id]
  if (interval) {
    interval.cancel() // fibers takes care of keeping coscript around
    fibers[id] = undefined // garbage collect the fiber
  }
}

module.exports = {
  setInterval: setInterval,
  clearInterval: clearInterval
}


/***/ }),

/***/ "./node_modules/@skpm/timers/timeout.js":
/*!**********************************************!*\
  !*** ./node_modules/@skpm/timers/timeout.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/* globals coscript */
var fibers = []

var setTimeout = function (func, delay, param1, param2, param3, param4, param5, param6, param7, param8, param9, param10) {
  // fibers takes care of keeping coscript around
  var id = fibers.length
  fibers.push(coscript.scheduleWithInterval_jsFunction(
    (delay || 0) / 1000,
    function () {
      func(param1, param2, param3, param4, param5, param6, param7, param8, param9, param10)
    }
  ))
  return id
}

var clearTimeout = function (id) {
  var timeout = fibers[id]
  if (timeout) {
    timeout.cancel() // fibers takes care of keeping coscript around
    fibers[id] = undefined // garbage collect the fiber
  }
}

module.exports = {
  setTimeout: setTimeout,
  clearTimeout: clearTimeout
}


/***/ }),

/***/ "./node_modules/cocoascript-class/lib/index.js":
/*!*****************************************************!*\
  !*** ./node_modules/cocoascript-class/lib/index.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SuperCall = undefined;
exports.default = ObjCClass;

var _runtime = __webpack_require__(/*! ./runtime.js */ "./node_modules/cocoascript-class/lib/runtime.js");

exports.SuperCall = _runtime.SuperCall;

// super when returnType is id and args are void
// id objc_msgSendSuper(struct objc_super *super, SEL op, void)

const SuperInit = (0, _runtime.SuperCall)(NSStringFromSelector("init"), [], { type: "@" });

// Returns a real ObjC class. No need to use new.
function ObjCClass(defn) {
  const superclass = defn.superclass || NSObject;
  const className = (defn.className || defn.classname || "ObjCClass") + NSUUID.UUID().UUIDString();
  const reserved = new Set(['className', 'classname', 'superclass']);
  var cls = MOClassDescription.allocateDescriptionForClassWithName_superclass_(className, superclass);
  // Add each handler to the class description
  const ivars = [];
  for (var key in defn) {
    const v = defn[key];
    if (typeof v == 'function' && key !== 'init') {
      var selector = NSSelectorFromString(key);
      cls.addInstanceMethodWithSelector_function_(selector, v);
    } else if (!reserved.has(key)) {
      ivars.push(key);
      cls.addInstanceVariableWithName_typeEncoding(key, "@");
    }
  }

  cls.addInstanceMethodWithSelector_function_(NSSelectorFromString('init'), function () {
    const self = SuperInit.call(this);
    ivars.map(name => {
      Object.defineProperty(self, name, {
        get() {
          return getIvar(self, name);
        },
        set(v) {
          (0, _runtime.object_setInstanceVariable)(self, name, v);
        }
      });
      self[name] = defn[name];
    });
    // If there is a passsed-in init funciton, call it now.
    if (typeof defn.init == 'function') defn.init.call(this);
    return self;
  });

  return cls.registerClass();
};

function getIvar(obj, name) {
  const retPtr = MOPointer.new();
  (0, _runtime.object_getInstanceVariable)(obj, name, retPtr);
  return retPtr.value().retain().autorelease();
}

/***/ }),

/***/ "./node_modules/cocoascript-class/lib/runtime.js":
/*!*******************************************************!*\
  !*** ./node_modules/cocoascript-class/lib/runtime.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SuperCall = SuperCall;
exports.CFunc = CFunc;
const objc_super_typeEncoding = '{objc_super="receiver"@"super_class"#}';

// You can store this to call your function. this must be bound to the current instance.
function SuperCall(selector, argTypes, returnType) {
  const func = CFunc("objc_msgSendSuper", [{ type: '^' + objc_super_typeEncoding }, { type: ":" }, ...argTypes], returnType);
  return function (...args) {
    const struct = make_objc_super(this, this.superclass());
    const structPtr = MOPointer.alloc().initWithValue_(struct);
    return func(structPtr, selector, ...args);
  };
}

// Recursively create a MOStruct
function makeStruct(def) {
  if (typeof def !== 'object' || Object.keys(def).length == 0) {
    return def;
  }
  const name = Object.keys(def)[0];
  const values = def[name];

  const structure = MOStruct.structureWithName_memberNames_runtime(name, Object.keys(values), Mocha.sharedRuntime());

  Object.keys(values).map(member => {
    structure[member] = makeStruct(values[member]);
  });

  return structure;
}

function make_objc_super(self, cls) {
  return makeStruct({
    objc_super: {
      receiver: self,
      super_class: cls
    }
  });
}

// Due to particularities of the JS bridge, we can't call into MOBridgeSupport objects directly
// But, we can ask key value coding to do the dirty work for us ;)
function setKeys(o, d) {
  const funcDict = NSMutableDictionary.dictionary();
  funcDict.o = o;
  Object.keys(d).map(k => funcDict.setValue_forKeyPath(d[k], "o." + k));
}

// Use any C function, not just ones with BridgeSupport
function CFunc(name, args, retVal) {
  function makeArgument(a) {
    if (!a) return null;
    const arg = MOBridgeSupportArgument.alloc().init();
    setKeys(arg, {
      type64: a.type
    });
    return arg;
  }
  const func = MOBridgeSupportFunction.alloc().init();
  setKeys(func, {
    name: name,
    arguments: args.map(makeArgument),
    returnValue: makeArgument(retVal)
  });
  return func;
}

/*
@encode(char*) = "*"
@encode(id) = "@"
@encode(Class) = "#"
@encode(void*) = "^v"
@encode(CGRect) = "{CGRect={CGPoint=dd}{CGSize=dd}}"
@encode(SEL) = ":"
*/

function addStructToBridgeSupport(key, structDef) {
  // OK, so this is probably the nastiest hack in this file.
  // We go modify MOBridgeSupportController behind its back and use kvc to add our own definition
  // There isn't another API for this though. So the only other way would be to make a real bridgesupport file.
  const symbols = MOBridgeSupportController.sharedController().valueForKey('symbols');
  if (!symbols) throw Error("Something has changed within bridge support so we can't add our definitions");
  // If someone already added this definition, don't re-register it.
  if (symbols[key] !== null) return;
  const def = MOBridgeSupportStruct.alloc().init();
  setKeys(def, {
    name: key,
    type: structDef.type
  });
  symbols[key] = def;
};

// This assumes the ivar is an object type. Return value is pretty useless.
const object_getInstanceVariable = exports.object_getInstanceVariable = CFunc("object_getInstanceVariable", [{ type: "@" }, { type: '*' }, { type: "^@" }], { type: "^{objc_ivar=}" });
// Again, ivar is of object type
const object_setInstanceVariable = exports.object_setInstanceVariable = CFunc("object_setInstanceVariable", [{ type: "@" }, { type: '*' }, { type: "@" }], { type: "^{objc_ivar=}" });

// We need Mocha to understand what an objc_super is so we can use it as a function argument
addStructToBridgeSupport('objc_super', { type: objc_super_typeEncoding });

/***/ }),

/***/ "./node_modules/process/browser.js":
/*!*****************************************!*\
  !*** ./node_modules/process/browser.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),

/***/ "./node_modules/promise-polyfill/lib/index.js":
/*!****************************************************!*\
  !*** ./node_modules/promise-polyfill/lib/index.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(setImmediate) {

/**
 * @this {Promise}
 */
function finallyConstructor(callback) {
  var constructor = this.constructor;
  return this.then(
    function(value) {
      return constructor.resolve(callback()).then(function() {
        return value;
      });
    },
    function(reason) {
      return constructor.resolve(callback()).then(function() {
        return constructor.reject(reason);
      });
    }
  );
}

// Store setTimeout reference so promise-polyfill will be unaffected by
// other code modifying setTimeout (like sinon.useFakeTimers())
var setTimeoutFunc = setTimeout;

function noop() {}

// Polyfill for Function.prototype.bind
function bind(fn, thisArg) {
  return function() {
    fn.apply(thisArg, arguments);
  };
}

/**
 * @constructor
 * @param {Function} fn
 */
function Promise(fn) {
  if (!(this instanceof Promise))
    throw new TypeError('Promises must be constructed via new');
  if (typeof fn !== 'function') throw new TypeError('not a function');
  /** @type {!number} */
  this._state = 0;
  /** @type {!boolean} */
  this._handled = false;
  /** @type {Promise|undefined} */
  this._value = undefined;
  /** @type {!Array<!Function>} */
  this._deferreds = [];

  doResolve(fn, this);
}

function handle(self, deferred) {
  while (self._state === 3) {
    self = self._value;
  }
  if (self._state === 0) {
    self._deferreds.push(deferred);
    return;
  }
  self._handled = true;
  Promise._immediateFn(function() {
    var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
    if (cb === null) {
      (self._state === 1 ? resolve : reject)(deferred.promise, self._value);
      return;
    }
    var ret;
    try {
      ret = cb(self._value);
    } catch (e) {
      reject(deferred.promise, e);
      return;
    }
    resolve(deferred.promise, ret);
  });
}

function resolve(self, newValue) {
  try {
    // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
    if (newValue === self)
      throw new TypeError('A promise cannot be resolved with itself.');
    if (
      newValue &&
      (typeof newValue === 'object' || typeof newValue === 'function')
    ) {
      var then = newValue.then;
      if (newValue instanceof Promise) {
        self._state = 3;
        self._value = newValue;
        finale(self);
        return;
      } else if (typeof then === 'function') {
        doResolve(bind(then, newValue), self);
        return;
      }
    }
    self._state = 1;
    self._value = newValue;
    finale(self);
  } catch (e) {
    reject(self, e);
  }
}

function reject(self, newValue) {
  self._state = 2;
  self._value = newValue;
  finale(self);
}

function finale(self) {
  if (self._state === 2 && self._deferreds.length === 0) {
    Promise._immediateFn(function() {
      if (!self._handled) {
        Promise._unhandledRejectionFn(self._value);
      }
    });
  }

  for (var i = 0, len = self._deferreds.length; i < len; i++) {
    handle(self, self._deferreds[i]);
  }
  self._deferreds = null;
}

/**
 * @constructor
 */
function Handler(onFulfilled, onRejected, promise) {
  this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
  this.onRejected = typeof onRejected === 'function' ? onRejected : null;
  this.promise = promise;
}

/**
 * Take a potentially misbehaving resolver function and make sure
 * onFulfilled and onRejected are only called once.
 *
 * Makes no guarantees about asynchrony.
 */
function doResolve(fn, self) {
  var done = false;
  try {
    fn(
      function(value) {
        if (done) return;
        done = true;
        resolve(self, value);
      },
      function(reason) {
        if (done) return;
        done = true;
        reject(self, reason);
      }
    );
  } catch (ex) {
    if (done) return;
    done = true;
    reject(self, ex);
  }
}

Promise.prototype['catch'] = function(onRejected) {
  return this.then(null, onRejected);
};

Promise.prototype.then = function(onFulfilled, onRejected) {
  // @ts-ignore
  var prom = new this.constructor(noop);

  handle(this, new Handler(onFulfilled, onRejected, prom));
  return prom;
};

Promise.prototype['finally'] = finallyConstructor;

Promise.all = function(arr) {
  return new Promise(function(resolve, reject) {
    if (!arr || typeof arr.length === 'undefined')
      throw new TypeError('Promise.all accepts an array');
    var args = Array.prototype.slice.call(arr);
    if (args.length === 0) return resolve([]);
    var remaining = args.length;

    function res(i, val) {
      try {
        if (val && (typeof val === 'object' || typeof val === 'function')) {
          var then = val.then;
          if (typeof then === 'function') {
            then.call(
              val,
              function(val) {
                res(i, val);
              },
              reject
            );
            return;
          }
        }
        args[i] = val;
        if (--remaining === 0) {
          resolve(args);
        }
      } catch (ex) {
        reject(ex);
      }
    }

    for (var i = 0; i < args.length; i++) {
      res(i, args[i]);
    }
  });
};

Promise.resolve = function(value) {
  if (value && typeof value === 'object' && value.constructor === Promise) {
    return value;
  }

  return new Promise(function(resolve) {
    resolve(value);
  });
};

Promise.reject = function(value) {
  return new Promise(function(resolve, reject) {
    reject(value);
  });
};

Promise.race = function(values) {
  return new Promise(function(resolve, reject) {
    for (var i = 0, len = values.length; i < len; i++) {
      values[i].then(resolve, reject);
    }
  });
};

// Use polyfill for setImmediate for performance gains
Promise._immediateFn =
  (typeof setImmediate === 'function' &&
    function(fn) {
      setImmediate(fn);
    }) ||
  function(fn) {
    setTimeoutFunc(fn, 0);
  };

Promise._unhandledRejectionFn = function _unhandledRejectionFn(err) {
  if (typeof console !== 'undefined' && console) {
    console.warn('Possible Unhandled Promise Rejection:', err); // eslint-disable-line no-console
  }
};

module.exports = Promise;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../timers-browserify/main.js */ "./node_modules/timers-browserify/main.js").setImmediate))

/***/ }),

/***/ "./node_modules/setimmediate/setImmediate.js":
/*!***************************************************!*\
  !*** ./node_modules/setimmediate/setImmediate.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, process) {(function (global, undefined) {
    "use strict";

    if (global.setImmediate) {
        return;
    }

    var nextHandle = 1; // Spec says greater than zero
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var doc = global.document;
    var registerImmediate;

    function setImmediate(callback) {
      // Callback can either be a function or a string
      if (typeof callback !== "function") {
        callback = new Function("" + callback);
      }
      // Copy function arguments
      var args = new Array(arguments.length - 1);
      for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i + 1];
      }
      // Store and register the task
      var task = { callback: callback, args: args };
      tasksByHandle[nextHandle] = task;
      registerImmediate(nextHandle);
      return nextHandle++;
    }

    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }

    function run(task) {
        var callback = task.callback;
        var args = task.args;
        switch (args.length) {
        case 0:
            callback();
            break;
        case 1:
            callback(args[0]);
            break;
        case 2:
            callback(args[0], args[1]);
            break;
        case 3:
            callback(args[0], args[1], args[2]);
            break;
        default:
            callback.apply(undefined, args);
            break;
        }
    }

    function runIfPresent(handle) {
        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
        // So if we're currently running a task, we'll need to delay this invocation.
        if (currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // "too much recursion" error.
            setTimeout(runIfPresent, 0, handle);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    run(task);
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }

    function installNextTickImplementation() {
        registerImmediate = function(handle) {
            process.nextTick(function () { runIfPresent(handle); });
        };
    }

    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function() {
                postMessageIsAsynchronous = false;
            };
            global.postMessage("", "*");
            global.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
    }

    function installPostMessageImplementation() {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function(event) {
            if (event.source === global &&
                typeof event.data === "string" &&
                event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };

        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }

        registerImmediate = function(handle) {
            global.postMessage(messagePrefix + handle, "*");
        };
    }

    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function(event) {
            var handle = event.data;
            runIfPresent(handle);
        };

        registerImmediate = function(handle) {
            channel.port2.postMessage(handle);
        };
    }

    function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        registerImmediate = function(handle) {
            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
            var script = doc.createElement("script");
            script.onreadystatechange = function () {
                runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
        };
    }

    function installSetTimeoutImplementation() {
        registerImmediate = function(handle) {
            setTimeout(runIfPresent, 0, handle);
        };
    }

    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

    // Don't get fooled by e.g. browserify environments.
    if ({}.toString.call(global.process) === "[object process]") {
        // For Node.js before 0.9
        installNextTickImplementation();

    } else if (canUsePostMessage()) {
        // For non-IE10 modern browsers
        installPostMessageImplementation();

    } else if (global.MessageChannel) {
        // For web workers, where supported
        installMessageChannelImplementation();

    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        // For IE 6–8
        installReadyStateChangeImplementation();

    } else {
        // For older browsers
        installSetTimeoutImplementation();
    }

    attachTo.setImmediate = setImmediate;
    attachTo.clearImmediate = clearImmediate;
}(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self));

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js"), __webpack_require__(/*! ./../process/browser.js */ "./node_modules/process/browser.js")))

/***/ }),

/***/ "./node_modules/sketch-polyfill-fetch/lib/index.js":
/*!*********************************************************!*\
  !*** ./node_modules/sketch-polyfill-fetch/lib/index.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Promise) {/* globals NSJSONSerialization NSJSONWritingPrettyPrinted NSDictionary NSHTTPURLResponse NSString NSASCIIStringEncoding NSUTF8StringEncoding coscript NSURL NSMutableURLRequest NSMutableData NSURLConnection */
var _ObjCClass = __webpack_require__(/*! cocoascript-class */ "./node_modules/cocoascript-class/lib/index.js")

var ObjCClass = _ObjCClass.default
var Buffer
try {
  Buffer = __webpack_require__(/*! buffer */ "buffer").Buffer
} catch (err) {}

function response (httpResponse, data) {
  var keys = []
  var all = []
  var headers = {}
  var header

  for (var i = 0; i < httpResponse.allHeaderFields().allKeys().length; i++) {
    var key = httpResponse.allHeaderFields().allKeys()[i].toLowerCase()
    var value = String(httpResponse.allHeaderFields()[key])
    keys.push(key)
    all.push([key, value])
    header = headers[key]
    headers[key] = header ? (header + ',' + value) : value
  }

  return {
    ok: (httpResponse.statusCode() / 200 | 0) == 1, // 200-399
    status: Number(httpResponse.statusCode()),
    statusText: NSHTTPURLResponse.localizedStringForStatusCode(httpResponse.statusCode()),
    useFinalURL: true,
    url: String(httpResponse.URL().absoluteString()),
    clone: response.bind(this, httpResponse, data),
    text: function () {
      return new Promise(function (resolve, reject) {
        const str = NSString.alloc().initWithData_encoding(data, NSASCIIStringEncoding)
        if (str) {
          resolve(str)
        } else {
          reject(new Error("Couldn't parse body"))
        }
      })
    },
    json: function () {
      return new Promise(function (resolve, reject) {
        var str = NSString.alloc().initWithData_encoding(data, NSUTF8StringEncoding)
        if (str) {
          // parse errors are turned into exceptions, which cause promise to be rejected
          var obj = JSON.parse(str)
          resolve(obj)
        } else {
          reject(new Error('Could not parse JSON because it is not valid UTF-8 data.'))
        }
      })
    },
    blob: function () {
      return Promise.resolve(data)
    },
    arrayBuffer: function() {
      return Promise.resolve(Buffer.from(data))
    },
    headers: {
      keys: function () { return keys },
      entries: function () { return all },
      get: function (n) { return headers[n.toLowerCase()] },
      has: function (n) { return n.toLowerCase() in headers }
    }
  }
}

// We create one ObjC class for ourselves here
var DelegateClass

function fetch (urlString, options) {
  if (typeof urlString === 'object' && (!urlString.isKindOfClass || !urlString.isKindOfClass(NSString))) {
    options = urlString
    urlString = options.url
  }
  options = options || {}
  if (!urlString) {
    return Promise.reject('Missing URL')
  }
  var fiber
  try {
    fiber = coscript.createFiber()
  } catch (err) {
    coscript.shouldKeepAround = true
  }
  return new Promise(function (resolve, reject) {
    var url = NSURL.alloc().initWithString(urlString)
    var request = NSMutableURLRequest.requestWithURL(url)
    request.setHTTPMethod(options.method || 'GET')

    Object.keys(options.headers || {}).forEach(function (i) {
      request.setValue_forHTTPHeaderField(options.headers[i], i)
    })

    if (options.body) {
      var data
      if (typeof options.body === 'string') {
        var str = NSString.alloc().initWithString(options.body)
        data = str.dataUsingEncoding(NSUTF8StringEncoding)
      } else if (Buffer && Buffer.isBuffer(options.body)) {
        data = options.body.toNSData()
      } else if (options.body.isKindOfClass && (options.body.isKindOfClass(NSData) == 1) ) {
        data = options.body
      } else if (options.body._isFormData) {
        var boundary = options.body._boundary
        data = options.body._data
        data.appendData(
          NSString.alloc()
            .initWithString("--" + boundary + "--\r\n")
            .dataUsingEncoding(NSUTF8StringEncoding)
        )
        request.setValue_forHTTPHeaderField('multipart/form-data; boundary=' + boundary, 'Content-Type')
      } else {
        var error
        data = NSJSONSerialization.dataWithJSONObject_options_error(options.body, NSJSONWritingPrettyPrinted, error)
        if (error != null) {
          return reject(error)
        }
        request.setValue_forHTTPHeaderField('' + data.length(), 'Content-Length')
      }
      request.setHTTPBody(data)
    }

    if (options.cache) {
      switch (options.cache) {
        case 'reload':
        case 'no-cache':
        case 'no-store': {
          request.setCachePolicy(1) // NSURLRequestReloadIgnoringLocalCacheData
        }
        case 'force-cache': {
          request.setCachePolicy(2) // NSURLRequestReturnCacheDataElseLoad
        }
        case 'only-if-cached': {
          request.setCachePolicy(3) // NSURLRequestReturnCacheDataElseLoad
        }
      }
    }


    if (!options.credentials) {
      request.setHTTPShouldHandleCookies(false)
    }

    if (!DelegateClass) {
      DelegateClass = ObjCClass({
        classname: 'FetchPolyfillDelegate',
        data: null,
        httpResponse: null,
        fiber: null,
        callbacks: null,

        'connectionDidFinishLoading:': function (connection) {
          this.callbacks.succeed(this.httpResponse, this.data)
          if (this.fiber) {
            this.fiber.cleanup()
          } else {
            coscript.shouldKeepAround = false
          }
        },
        'connection:didReceiveResponse:': function (connection, httpResponse) {
          this.httpResponse = httpResponse
          this.data = NSMutableData.alloc().init()
        },
        'connection:didFailWithError:': function (connection, error) {
          this.callbacks.fail(error)
          if (this.fiber) {
            this.fiber.cleanup()
          } else {
            coscript.shouldKeepAround = false
          }
        },
        'connection:didReceiveData:': function (connection, data) {
          this.data.appendData(data)
        }
      })
    }

    var finished = false

    function succeed(res, data) {
      finished = true
      resolve(response(res, data))
    }

    function fail(err) {
      finished = true
      reject(err)
    }

    var connectionDelegate = DelegateClass.new()
    connectionDelegate.callbacks = NSDictionary.dictionaryWithDictionary({
      succeed: succeed,
      fail: fail,
    })
    connectionDelegate.fiber = fiber;

    var connection = NSURLConnection.alloc().initWithRequest_delegate(
      request,
      connectionDelegate
    )

    if (fiber) {
      fiber.onCleanup(function () {
        if (!finished) {
          connection.cancel()
        }
      })
    }

  })
}

module.exports = fetch

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/promise-polyfill/lib/index.js */ "./node_modules/promise-polyfill/lib/index.js")))

/***/ }),

/***/ "./node_modules/timers-browserify/main.js":
/*!************************************************!*\
  !*** ./node_modules/timers-browserify/main.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var scope = (typeof global !== "undefined" && global) ||
            (typeof self !== "undefined" && self) ||
            window;
var apply = Function.prototype.apply;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, scope, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, scope, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) {
  if (timeout) {
    timeout.close();
  }
};

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(scope, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// setimmediate attaches itself to the global object
__webpack_require__(/*! setimmediate */ "./node_modules/setimmediate/setImmediate.js");
// On some exotic environments, it's not clear which object `setimmediate` was
// able to install onto.  Search each possibility in the same order as the
// `setimmediate` library.
exports.setImmediate = (typeof self !== "undefined" && self.setImmediate) ||
                       (typeof global !== "undefined" && global.setImmediate) ||
                       (this && this.setImmediate);
exports.clearImmediate = (typeof self !== "undefined" && self.clearImmediate) ||
                         (typeof global !== "undefined" && global.clearImmediate) ||
                         (this && this.clearImmediate);

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/webpack/buildin/global.js":
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ "./src/handler.js":
/*!************************!*\
  !*** ./src/handler.js ***!
  \************************/
/*! exports provided: onAction, addGDPLibrary, addDemoLibrary, addLDSLibrary, addSCMLibrary, openGDPTemplate, openDemoTemplate, checkLibraryUpdates, checkForUpdate, setupLibrary, addOrEnableLibrary, addNewLibrary, enableLibraryIfAlreadyAdded, addPalette, loadPalette, setupTemplate, reportIssue, aboutPratikShah, manageDailyUpdateCheck, manageManualUpdate, manageUpdate, init, showMsg, openUrlInBrowser, saveLocalData, readLocalData, networkRequest, trackEvent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(fetch) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "onAction", function() { return onAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addGDPLibrary", function() { return addGDPLibrary; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addDemoLibrary", function() { return addDemoLibrary; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addLDSLibrary", function() { return addLDSLibrary; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addSCMLibrary", function() { return addSCMLibrary; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "openGDPTemplate", function() { return openGDPTemplate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "openDemoTemplate", function() { return openDemoTemplate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "checkLibraryUpdates", function() { return checkLibraryUpdates; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "checkForUpdate", function() { return checkForUpdate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setupLibrary", function() { return setupLibrary; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addOrEnableLibrary", function() { return addOrEnableLibrary; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addNewLibrary", function() { return addNewLibrary; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "enableLibraryIfAlreadyAdded", function() { return enableLibraryIfAlreadyAdded; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addPalette", function() { return addPalette; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "loadPalette", function() { return loadPalette; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setupTemplate", function() { return setupTemplate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "reportIssue", function() { return reportIssue; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "aboutPratikShah", function() { return aboutPratikShah; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "manageDailyUpdateCheck", function() { return manageDailyUpdateCheck; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "manageManualUpdate", function() { return manageManualUpdate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "manageUpdate", function() { return manageUpdate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "init", function() { return init; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "showMsg", function() { return showMsg; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "openUrlInBrowser", function() { return openUrlInBrowser; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "saveLocalData", function() { return saveLocalData; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "readLocalData", function() { return readLocalData; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "networkRequest", function() { return networkRequest; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "trackEvent", function() { return trackEvent; });
/* harmony import */ var sketch__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! sketch */ "sketch");
/* harmony import */ var sketch__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(sketch__WEBPACK_IMPORTED_MODULE_0__);

var globalContext;
var remoteManifestUrl = "https://raw.githubusercontent.com/pratikjshah/sketch-cloud-design-system/master/sketch-cloud-design-system.sketchplugin/Contents/Resources/user.config";
var localDataPath;
var userConfig;
var pluginRoot;
var hasResponseCame = false;

var timeout = __webpack_require__(/*! @skpm/timers */ "./node_modules/@skpm/timers/index.js"); // ===== Menu action handlers ========================


function onAction(context) {
  console.log("Action: " + context.action);
}
function addGDPLibrary(context) {
  init(context); //setupLibrary("basics");

  setupLibrary("gdp");
}
function addDemoLibrary(context) {
  init(context);
  setupLibrary("demo");
}
function addLDSLibrary(context) {
  init(context);
  setupLibrary("lds-beta");
}
function addSCMLibrary(context) {
  init(context); //setupLibrary("basics");

  setupLibrary("scm");
}
function openGDPTemplate(context) {
  init(context);
  var template = userConfig['gdp'].templates[0].fileName;
  var localTemplatePath = pluginRoot + "/Contents/Resources/templates/" + template; //localTemplatePath = NSURL.URLWithString("https://sketch.cloud/s/dDxam");

  NSApp.delegate().openTemplateAtPath(localTemplatePath);
  trackEvent("openTemplate", "gdp", 1);
}
function openDemoTemplate(context) {
  init(context);
  var template = userConfig['demo'].templates[0].fileName;
  var localTemplatePath = pluginRoot + "/Contents/Resources/templates/" + template; //localTemplatePath = NSURL.URLWithString("https://sketch.cloud/s/dDxam");

  NSApp.delegate().openTemplateAtPath(localTemplatePath);
  trackEvent("openTemplate", "demo", 1);
}
function checkLibraryUpdates(context) {
  init(context);
  AppController.sharedInstance().checkForAssetLibraryUpdates();
  trackEvent("checkLibraryUpdates", "manualCheckForUpdate", 1);
}
function checkForUpdate(context) {
  init(context);
  networkRequest(remoteManifestUrl, manageManualUpdate);
  trackEvent("checkForUpdate", "manualCheckForUpdate", 1); //context.document.showMessage("remoteManifest: " + remoteManifest.version);
} // ===== Library functions ========================= 

function setupLibrary(tag) {
  trackEvent("addLibrary", tag, 1); //showMsg("into the setup library: " + tag);

  if (userConfig.hasOwnProperty(tag)) {
    var tagObject = userConfig[tag];
    addOrEnableLibrary(tagObject.libraries); //setupTemplate(tagObject.templates);

    addPalette(tagObject.colors);
  } else {
    showMsg("🤬Something went wrong! Please report the issue.");
  } //documentColors = readJSON(false, );

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
function addOrEnableLibrary(librariesToAdd) {
  for (var i = 0; i < librariesToAdd.length; i++) {
    if (enableLibraryIfAlreadyAdded(librariesToAdd[i].fileName)) {
      showMsg("🤘Yo🤘 " + librariesToAdd[i].displayName + " is already added!");
      trackEvent("enabledAddedLibrary", librariesToAdd[i].displayName, 1);
    } else {
      addNewLibrary(librariesToAdd[i].url);
      trackEvent("addNewLibrary", librariesToAdd[i].displayName, 1);
      showMsg("⬇️ Downloading " + librariesToAdd[i].displayName + " ..");
    }
  }
}
function addNewLibrary(url) {
  var sketchCloudIdentifier = "https://sketch.cloud/s/";
  var libraryId, libraryURL;

  if (url.search(sketchCloudIdentifier) > -1) {
    libraryId = url.split(sketchCloudIdentifier)[1]; //var libraryURL = "sketch://add-library/cloud/" + libraryId;

    libraryURL = "sketch://add-library?url=" + encodeURI("https://client.sketch.cloud/v1/shares/" + libraryId + "/rss");
    NSWorkspace.sharedWorkspace().openURL(NSURL.URLWithString(libraryURL));
  } else {
    var Library = __webpack_require__(/*! sketch/dom */ "sketch/dom").Library;

    Library.getRemoteLibraryWithRSS('' + url, function (err, library) {
      if (err) {// oh no, failed to load the library
        // console.log("Something went wrong! \n" + err);
      } else {// console.log("Done");
        }
    });
  }
}
function enableLibraryIfAlreadyAdded(name) {
  var addedLibraries = __webpack_require__(/*! sketch/dom */ "sketch/dom").getLibraries();

  for (var i = 0; i < addedLibraries.length; i++) {
    if (addedLibraries[i].name === name) {
      if (!addedLibraries[i].enabled) {
        addedLibraries[i].enabled = true;
        return true;
      } else {
        return true;
      }
    }
  }

  return false;
} // ===== Document Colors functions =================

function addPalette(url) {
  //var palette = readJSON(false, url);
  var palette = networkRequest(url, loadPalette);
}
function loadPalette(palette) {
  var app = NSApp.delegate();
  var doc = globalContext.document;
  var colorPalette = palette.colors ? palette.colors : [];
  var colors = [];

  if (colorPalette.length > 0) {
    for (var i = 0; i < colorPalette.length; i++) {
      var colorName = colorPalette[i].name ? colorPalette[i].name : null;
      var mscolor = MSColor.colorWithRed_green_blue_alpha(colorPalette[i].red, colorPalette[i].green, colorPalette[i].blue, colorPalette[i].alpha);
      colors.push(MSColorAsset.alloc().initWithAsset_name(mscolor, colorName));
    }
  } else {
    showMsg("No 🌈Colors found! Please report the issue.");
  }

  var assets = MSPersistentAssetCollection.sharedGlobalAssets(); //var assets = doc.documentData().assets();

  assets.setColorAssets([]);
  if (colors.length > 0) assets.addColorAssets(colors);
  doc.inspectorController().closeAnyColorPopover();
  app.refreshCurrentDocument();
  trackEvent("addLibrary", "loadPalette", 1);
} // ===== Template functions ========================

function setupTemplate(templatesToAdd) {
  var fs = __webpack_require__(/*! @skpm/fs */ "./node_modules/@skpm/fs/index.js");

  var teamName = 'Walmart';
  var template;
  var message;

  for (var i = 0; i < templatesToAdd.length; i++) {
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
} // ===== Other functions ==========================

function reportIssue(context) {
  init(context);
  openUrlInBrowser("https://github.com/pratikjshah/sketch-cloud-design-system/issues");
}
function aboutPratikShah(context) {
  init(context);
  openUrlInBrowser("http://pratikshah.website");
}
function manageDailyUpdateCheck(remoteManifest) {
  var isDailyCheck = true;
  manageUpdate(remoteManifest, isDailyCheck);
}
function manageManualUpdate(remoteManifest) {
  var isDailyCheck = false;
  manageUpdate(remoteManifest, isDailyCheck);
}
function manageUpdate(remoteManifest, isDailyCheck) {
  /*if (userConfig.localVersion != remoteManifest.version) {
  	showMsg(userConfig.name + ": "+ userConfig.localVersion + " is out of date! Please check for updates.");
  }*/
  if (remoteManifest.localVersion) {
    if (userConfig.localVersion == remoteManifest.localVersion) {
      if (!isDailyCheck) {
        showMsg("🤘Yo🤘! You are using the latest version of " + userConfig.name);
      } //setUpdateCheckDayOnTomorrow();

    } else {
      showMsg("Hey👋! New version of " + userConfig.name + " is available!"); //showAvailableUpdateDialog();

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
} // ===== Dialog functions ==========================


function showAvailableUpdateDialog() {
  var window = createDownloadWindow();
  var alert = window[0]; // When “Ok” is clicked

  var response = alert.runModal();

  if (response == "1000") {
    //globalContext.document.showMessage("Go to download");
    openUrlInBrowser("https://github.com/pratikjshah/sketch-cloud-design-system/archive/master.zip");
  } else {
    //globalContext.document.showMessage("Check later");
    setUpdateCheckDayOnTomorrow();
  }
} // ===== Helper functions ==========================


function init(context) {
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
function showMsg(msg) {
  globalContext.document.showMessage(msg);
}
function openUrlInBrowser(url) {
  NSWorkspace.sharedWorkspace().openURL(NSURL.URLWithString(url));
  trackEvent("openUrlInBrowser", url, 1);
}
function saveLocalData(data, path) {
  /*var string = [NSString stringWithFormat: "%@", JSON.stringify(data)];
  [string writeToFile: path atomically: true encoding: NSUTF8StringEncoding error: nil];*/
  data = JSON.stringify(data);
  var text = NSString.stringWithFormat("%@", data);
  var file = NSString.stringWithFormat("%@", path);
  return text.writeToFile_atomically_encoding_error(file, true, NSUTF8StringEncoding, null);
}
function readLocalData(path) {
  if (NSFileManager.defaultManager().fileExistsAtPath(path)) {
    var string = NSString.stringWithContentsOfFile_encoding_error(path, 4, nil);
    string = string.replace(/(\r\n|\n|\r)/gm, "");
    var data = JSON.parse(string);
    return data;
  }
}
function networkRequest(url, callBackFun) {
  // console.log("in networkRequest: \n" + url + " \n " + callBackFun);
  return fetch(url).then(function (response) {
    if (!response.ok) {
      throw Error(response.statusText);
    }

    return response;
  }).then(function (response) {
    return response.json();
  }).then(function (result) {
    // console.log('Response Params: \n url: ' + url + " \n callBackFun: " + callBackFun);
    // console.log(result);
    if (callBackFun !== 'undefined') {
      callBackFun(result);
    }

    return result;
  }).catch(function (error) {// console.log('Params: \n url: ' + url + " \n callBackFun: " + callBackFun);
    // console.log('Looks like there was a problem: \n', error);
  });
}
function trackEvent(action, label, value) {
  var kUUIDKey = 'google.analytics.uuid';
  var uuid = NSUserDefaults.standardUserDefaults().objectForKey(kUUIDKey);

  if (!uuid) {
    uuid = NSUUID.UUID().UUIDString();
    NSUserDefaults.standardUserDefaults().setObject_forKey(uuid, kUUIDKey);
  }

  var tid = "UA-64818389-8";
  var cid = uuid;
  var ds = "Sketch-" + NSBundle.mainBundle().objectForInfoDictionaryKey("CFBundleShortVersionString");
  var baseURL = "https://www.google-analytics.com/debug/collect?v=1&ds=" + ds + "&t=event&tid=" + tid + "&cid=" + cid;
  baseURL = "https://www.google-analytics.com/collect?v=1&ds=" + ds + "&t=event&tid=" + tid + "&cid=" + cid;
  var version = userConfig.localVersion;
  var trackingURL = baseURL + "&ec=SketchCloudDesignSystem-" + version + "&ea=" + action + "&el=" + label + "&ev=" + value;
  networkRequest(trackingURL);
}
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/sketch-polyfill-fetch/lib/index.js */ "./node_modules/sketch-polyfill-fetch/lib/index.js")))

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("buffer");

/***/ }),

/***/ "sketch":
/*!*************************!*\
  !*** external "sketch" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("sketch");

/***/ }),

/***/ "sketch/dom":
/*!*****************************!*\
  !*** external "sketch/dom" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("sketch/dom");

/***/ })

/******/ });
  if (key === 'default' && typeof exports === 'function') {
    exports(context);
  } else {
    exports[key](context);
  }
}
that['addGDPLibrary'] = __skpm_run.bind(this, 'addGDPLibrary');
that['onRun'] = __skpm_run.bind(this, 'default');
that['openGDPTemplate'] = __skpm_run.bind(this, 'openGDPTemplate');
that['addDemoLibrary'] = __skpm_run.bind(this, 'addDemoLibrary');
that['addLDSLibrary'] = __skpm_run.bind(this, 'addLDSLibrary');
that['openDemoTemplate'] = __skpm_run.bind(this, 'openDemoTemplate');
that['checkLibraryUpdates'] = __skpm_run.bind(this, 'checkLibraryUpdates');
that['reportIssue'] = __skpm_run.bind(this, 'reportIssue');
that['checkForUpdate'] = __skpm_run.bind(this, 'checkForUpdate');
that['aboutPratikShah'] = __skpm_run.bind(this, 'aboutPratikShah')

//# sourceMappingURL=handler.js.map