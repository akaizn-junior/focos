window["Focos"] =
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
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/*!
 * Focos
 * Add focus to elements on the screen referenced by coordinates
 * (c) 2019 Verdexdesign
 */
var globals = {
  globalPoint: [0, 0],
  ops: ['up', 'down', 'left', 'right'],
  // focos operations
  callback: function callback() {}
};

function nextPoint(point, origin, width, height) {
  var step = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;
  // x: horizontal position, y: vertical position
  var x = point[0];
  var y = point[1]; // origin coords

  var x0 = origin[0];
  var y0 = origin[1]; // the distance to move from a point to the next

  var s = step || 1;
  return {
    up: function up(includeFirst) {
      var top = height - 1;

      if (y >= y0 && y + s <= top) {
        return includeFirst ? point : [x, y + s];
      }

      if (y >= top || y + s >= top) {
        return point;
      }

      if (y < y0) {
        return origin;
      }
    },
    down: function down(includeFirst) {
      if (y - s >= y0) {
        return includeFirst ? [x0, height - 1] : [x, y - s];
      }

      if (y <= y0 || y - s <= y0) {
        return includeFirst ? [x0, height - 1] : point;
      }
    },
    left: function left(includeFirst) {
      if (x - s >= x0) {
        return includeFirst ? [width - 1, y0] : [x - s, y];
      }

      if (x <= x0 || x - s <= x0) {
        return includeFirst ? [width - 1, y0] : point;
      }
    },
    right: function right(includeFirst) {
      if (x >= x0 && x + s <= width - 1) {
        return includeFirst ? origin : [x + s, y];
      }

      if (x >= width - 1 || x + s >= width - 1) {
        return point;
      }

      if (x < x0) {
        return origin;
      }
    }
  };
}

function clearFocus() {
  var currFocus = document.getElementsByClassName('focused')[0];

  if (currFocus) {
    currFocus.classList.remove('focused');
    currFocus.removeAttribute('tabindex');
  }
}

function getCellValue(grid, point) {
  var x = Math.abs(point[0]);
  var y = Math.abs(point[1]);
  return grid[y] && grid[y][x] ? grid[y][x] : grid[0][0];
}

function validFocosDataset(dataset) {
  if (dataset) {
    var x = parseInt(dataset.split(',')[0], 10);
    var y = parseInt(dataset.split(',')[1], 10);
    return {
      cell: [x, y],
      "class": 'cell'.concat(x, y)
    };
  }

  return {
    cell: [],
    "class": ''
  };
}

function focusTarget(element) {
  if (element && element.focus) {
    element.setAttribute('tabindex', '0');
    element.focus();
    element.classList.add('focused');
  }
}

function focusCell(grid, point) {
  var cell = getCellValue(grid, point);
  focusTarget(cell);
  return globals.callback(cell, point);
}

function buildGrid(height, elems) {
  // initialize the grid with empty arrays
  var grid = Array.from({
    length: height
  }, function () {
    return [];
  });

  for (var i = 0; i < elems.length; i++) {
    var elem = elems[i];

    if (elem.dataset.focosCell) {
      elem.classList.add('focusable');
      var data = validFocosDataset(elem.dataset.focosCell);
      elem.classList.add(data["class"]);
      grid[data.cell[1]] && grid[data.cell[1]].push(elem);
    }
  }

  return grid;
}

function focusFirst(initial, grid, point) {
  if (initial && initial.length && point[0] === initial[0] && point[1] === initial[1]) {
    focusCell(grid, point);
  }
}

function validOpts(opts) {
  var defaultKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  }; // user inputs

  var keys = opts.keys,
      initialFocus = opts.initialFocus,
      step = opts.step,
      gridSize = opts.gridSize,
      focusOnClick = opts.focusOnClick; // validate size

  var Size = RegExp(/^[0-9]+x[0-9]+$/gm);
  !Size.test(gridSize) && (gridSize = '1x1');
  var rows = parseInt(gridSize.split('x')[0], 10);
  var cols = parseInt(gridSize.split('x')[1], 10); // replace inputs with defaults for not required fields

  keys = keys || defaultKeys; // validate the step to move from point to point

  step = Math.floor(Math.abs(step)) || 1;
  return {
    keys: keys,
    initialFocus: initialFocus,
    step: step,
    size: {
      rows: rows,
      cols: cols
    },
    focusOnClick: focusOnClick
  };
}

function focosInner(opts, callback) {
  var _validOpts = validOpts(opts),
      keys = _validOpts.keys,
      initialFocus = _validOpts.initialFocus,
      step = _validOpts.step,
      size = _validOpts.size,
      focusOnClick = _validOpts.focusOnClick;

  callback && (globals.callback = callback); // read all relevant elements

  var elems = document.querySelectorAll('[data-focos-cell]'); // grid with and height

  var width = size.cols;
  var height = size.rows; // build a grid out of the relevant elements

  var grid = buildGrid(height, elems); // editable global entry point, will be focused first if enabled

  initialFocus && (globals.globalPoint = initialFocus); // origin point

  var origin = [0, 0]; // add initial focus to a cell if enabled

  focusFirst(initialFocus, grid, globals.globalPoint); // track key presses

  var keyPressCount = 0; // lose focus on document mouse click

  document.onmousedown = function (e) {
    var t = e.target;
    var isCell = t.dataset.focosCell;
    !isCell && clearFocus();

    if (isCell && focusOnClick) {
      globals.globalPoint = validFocosDataset(t.dataset.focosCell).cell;
      clearFocus();
      focusCell(grid, globals.globalPoint);
    }
  };

  document.addEventListener('keyup', function (e) {
    e.preventDefault();
    var key = e.key;
    var keyCode = e.keyCode;

    if (keys && (keys[key] || keys[keyCode])) {
      var op = keys[key] || keys[keyCode];
      var includeFirst = keyPressCount === 0 && !initialFocus;

      if (globals.ops.indexOf(op) !== -1) {
        globals.globalPoint = nextPoint(globals.globalPoint, origin, width, height, step)[op](includeFirst);
        clearFocus();
        focusCell(grid, globals.globalPoint);
        keyPressCount = 1;
      }
    }
  });
}

module.exports = focosInner;

/***/ })
/******/ ]);
//# sourceMappingURL=focos.js.map