"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _chart2music = _interopRequireDefault(require("chart2music"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var calcMedian = function calcMedian(nums) {
  return nums.length % 2 ? nums[Math.floor(nums.length / 2)] : (nums[nums.length / 2] + nums[nums.length / 2 - 1]) / 2;
};
var fiveNumberSummary = function fiveNumberSummary(nums) {
  var sortedNumbers = nums.sort();
  var min, max, q1, q3;
  var datamin = Math.min.apply(Math, _toConsumableArray(sortedNumbers));
  var datamax = Math.max.apply(Math, _toConsumableArray(sortedNumbers));
  var median = calcMedian(sortedNumbers);
  var length = sortedNumbers.length;
  if (length % 2) {
    q1 = calcMedian(sortedNumbers.slice(0, Math.floor(length / 2)));
    q3 = calcMedian(sortedNumbers.slice(Math.ceil(length % 2)));
  } else {
    q1 = calcMedian(sortedNumbers.slice(0, length / 2 - 1));
    q3 = calcMedian(sortedNumbers.slice(length / 2));
  }
  var iqr = q3 - q1;
  if (datamax < q3 + iqr) {
    max = datamax;
  } else {
    var _sortedNumbers$revers;
    max = (_sortedNumbers$revers = sortedNumbers.reverse().find(function (num) {
      return num < datamax;
    })) !== null && _sortedNumbers$revers !== void 0 ? _sortedNumbers$revers : datamax;
  }
  if (datamin < q1 - iqr) {
    min = datamin;
  } else {
    var _sortedNumbers$revers2;
    min = (_sortedNumbers$revers2 = sortedNumbers.reverse().find(function (num) {
      return num < datamin;
    })) !== null && _sortedNumbers$revers2 !== void 0 ? _sortedNumbers$revers2 : datamin;
  }
  var outlier = sortedNumbers.filter(function (num) {
    return num < min || num > max;
  });
  return _objectSpread({
    low: min,
    high: max,
    median: median,
    q1: q1,
    q3: q3
  }, outlier.length > 0 ? {
    outlier: outlier
  } : {});
};
var whichBoxData = function whichBoxData(data) {
  return data.map(function (row, index) {
    if (_typeof(row) === "object" && "min" in row) {
      return _objectSpread(_objectSpread({}, row), {}, {
        low: row.min,
        high: row.max,
        x: index
      }, "outliers" in row ? {
        outlier: row.outliers
      } : {});
    }
    if (Array.isArray(row)) {
      return _objectSpread(_objectSpread({}, fiveNumberSummary(row)), {}, {
        x: index
      });
    }
  });
};
var processBoxData = function processBoxData(data) {
  if (data.datasets.length === 1) {
    return {
      data: whichBoxData(data.datasets[0].data)
    };
  }
  var groups = [];
  var result = {};
  data.datasets.forEach(function (obj, index) {
    var _obj$label;
    var groupName = (_obj$label = obj.label) !== null && _obj$label !== void 0 ? _obj$label : "Group ".concat(index + 1);
    groups.push(groupName);
    result[groupName] = whichBoxData(obj.data);
  });
  return {
    groups: groups,
    data: result
  };
};
var chartStates = new Map();
var chartjs_c2m_converter = {
  bar: "bar",
  line: "line",
  pie: "pie",
  polarArea: "bar",
  doughnut: "pie",
  boxplot: "box",
  radar: "bar",
  wordCloud: "bar",
  scatter: "scatter"
};
var processChartType = function processChartType(chart) {
  var topLevelType = chart.config.type;
  var panelTypes = chart.data.datasets.map(function (_ref) {
    var type = _ref.type;
    return type !== null && type !== void 0 ? type : topLevelType;
  });
  var invalid = panelTypes.find(function (t) {
    return !(t in chartjs_c2m_converter);
  });
  if (invalid) {
    return {
      valid: false,
      invalidType: invalid
    };
  }
  if (_toConsumableArray(new Set(panelTypes)).length === 1) {
    return {
      valid: true,
      c2m_types: chartjs_c2m_converter[panelTypes[0]]
    };
  }
  return {
    valid: true,
    c2m_types: panelTypes.map(function (t) {
      return chartjs_c2m_converter[t];
    })
  };
};
var generateAxisInfo = function generateAxisInfo(chartAxisInfo, chart) {
  var _chartAxisInfo$title;
  var axis = {};
  if (chartAxisInfo !== null && chartAxisInfo !== void 0 && chartAxisInfo.min) {
    if (typeof chartAxisInfo.min === "string") {
      axis.minimum = chart.data.labels.indexOf(chartAxisInfo.min);
    } else {
      axis.minimum = chartAxisInfo.min;
    }
  }
  if (chartAxisInfo !== null && chartAxisInfo !== void 0 && chartAxisInfo.max) {
    if (typeof chartAxisInfo.max === "string") {
      axis.maximum = chart.data.labels.indexOf(chartAxisInfo.max);
    } else {
      axis.maximum = chartAxisInfo.max;
    }
  }
  var label = chartAxisInfo === null || chartAxisInfo === void 0 || (_chartAxisInfo$title = chartAxisInfo.title) === null || _chartAxisInfo$title === void 0 ? void 0 : _chartAxisInfo$title.text;
  if (label) {
    axis.label = label;
  }
  if ((chartAxisInfo === null || chartAxisInfo === void 0 ? void 0 : chartAxisInfo.type) === "logarithmic") {
    axis.type = "log10";
  }
  return axis;
};
var generateAxes = function generateAxes(chart) {
  var _chart$options, _chart$options2;
  var axes = {
    x: _objectSpread(_objectSpread({}, generateAxisInfo((_chart$options = chart.options) === null || _chart$options === void 0 || (_chart$options = _chart$options.scales) === null || _chart$options === void 0 ? void 0 : _chart$options.x, chart)), {}, {
      valueLabels: chart.data.labels.slice(0)
    }),
    y: _objectSpread(_objectSpread({}, generateAxisInfo((_chart$options2 = chart.options) === null || _chart$options2 === void 0 || (_chart$options2 = _chart$options2.scales) === null || _chart$options2 === void 0 ? void 0 : _chart$options2.y, chart)), {}, {
      format: function format(value) {
        return value.toLocaleString();
      }
    })
  };
  return axes;
};
var whichDataStructure = function whichDataStructure(data) {
  if (Array.isArray(data[0])) {
    return data.map(function (arr, x) {
      var _arr$sort = arr.sort(),
        _arr$sort2 = _slicedToArray(_arr$sort, 2),
        low = _arr$sort2[0],
        high = _arr$sort2[1];
      return {
        x: x,
        low: low,
        high: high
      };
    });
  }
  return data;
};
var scrubX = function scrubX(data) {
  var blackboard = JSON.parse(JSON.stringify(data));
  var labels = [];
  if (Array.isArray(data)) {
    // console.log("not grouped");
    // Not grouped
    blackboard.forEach(function (item, x) {
      if (_typeof(item) === "object" && "x" in item) {
        labels.push(item.x);
        item.x = x;
      }
    });
    return {
      labels: labels,
      data: blackboard
    };
  }
};
var processData = function processData(data, c2m_types) {
  if (c2m_types === "box") {
    return processBoxData(data);
  }
  var groups = [];
  if (data.datasets.length === 1) {
    return {
      data: whichDataStructure(data.datasets[0].data)
    };
  }
  var result = {};
  data.datasets.forEach(function (obj, index) {
    var _obj$label2;
    var groupName = (_obj$label2 = obj.label) !== null && _obj$label2 !== void 0 ? _obj$label2 : "Group ".concat(index + 1);
    groups.push(groupName);
    result[groupName] = whichDataStructure(obj.data);
  });
  return {
    groups: groups,
    data: result
  };
};
var determineChartTitle = function determineChartTitle(options) {
  var _options$plugins;
  if ((_options$plugins = options.plugins) !== null && _options$plugins !== void 0 && (_options$plugins = _options$plugins.title) !== null && _options$plugins !== void 0 && _options$plugins.text) {
    if (Array.isArray(options.plugins.title.text)) {
      return options.plugins.title.text.join(", ");
    }
    return options.plugins.title.text;
  }
  return "";
};
var determineCCElement = function determineCCElement(canvas, provided) {
  if (provided) {
    return provided;
  }
  var cc = document.createElement("div");
  canvas.insertAdjacentElement("afterend", cc);
  return cc;
};
var displayPoint = function displayPoint(chart) {
  if (!chartStates.has(chart)) {
    return;
  }
  var _chartStates$get = chartStates.get(chart),
    ref = _chartStates$get.c2m,
    visible_groups = _chartStates$get.visible_groups;
  var _ref$getCurrent = ref.getCurrent(),
    point = _ref$getCurrent.point,
    index = _ref$getCurrent.index;
  try {
    var _chart$tooltip;
    var highlightElements = [];
    if ("custom" in point) {
      highlightElements.push({
        // @ts-ignore
        datasetIndex: point.custom.group,
        // @ts-ignore
        index: point.custom.index
      });
    } else {
      visible_groups.forEach(function (datasetIndex) {
        highlightElements.push({
          datasetIndex: datasetIndex,
          index: index
        });
      });
    }
    chart === null || chart === void 0 || chart.setActiveElements(highlightElements);
    chart === null || chart === void 0 || (_chart$tooltip = chart.tooltip) === null || _chart$tooltip === void 0 || _chart$tooltip.setActiveElements(highlightElements, {});
    chart === null || chart === void 0 || chart.update();
  } catch (e) {
    // console.warn(e);
  }
};
var generateChart = function generateChart(chart, options) {
  var _scrub$labels, _options$axes, _options$axes2, _scrub$data, _chart$config$options, _groups$map;
  var _processChartType = processChartType(chart),
    valid = _processChartType.valid,
    c2m_types = _processChartType.c2m_types,
    invalidType = _processChartType.invalidType;
  if (!valid) {
    var _options$errorCallbac;
    // @ts-ignore
    (_options$errorCallbac = options.errorCallback) === null || _options$errorCallbac === void 0 || _options$errorCallbac.call(options, "Unable to connect chart2music to chart. The chart is of type \"".concat(invalidType, "\", which is not one of the supported chart types for this plugin. This plugin supports: ").concat(Object.keys(chartjs_c2m_converter).join(", ")));
    return;
  }
  var axes = generateAxes(chart);
  if (chart.config.type === "wordCloud") {
    delete axes.x.minimum;
    delete axes.x.maximum;
    delete axes.y.minimum;
    delete axes.y.maximum;
    if (!axes.x.label) {
      axes.x.label = "Word";
    }
    if (!axes.y.label) {
      axes.y.label = "Emphasis";
    }
  }
  // Generate CC element
  var cc = determineCCElement(chart.canvas, options.cc);
  var _processData = processData(chart.data, c2m_types),
    data = _processData.data,
    groups = _processData.groups;
  // lastDataObj = JSON.stringify(data);
  var scrub = scrubX(data);
  if (scrub !== null && scrub !== void 0 && scrub.labels && (scrub === null || scrub === void 0 || (_scrub$labels = scrub.labels) === null || _scrub$labels === void 0 ? void 0 : _scrub$labels.length) > 0) {
    // Something was scrubbed
    if (!chart.data.labels || chart.data.labels.length === 0) {
      axes.x.valueLabels = scrub.labels.slice(0);
    }
  }
  if (c2m_types === "scatter") {
    scrub === null || scrub === void 0 || delete scrub.data;
    delete axes.x.valueLabels;
  }
  axes = _objectSpread(_objectSpread({}, axes), {}, {
    x: _objectSpread(_objectSpread({}, axes.x), (_options$axes = options.axes) === null || _options$axes === void 0 ? void 0 : _options$axes.x),
    y: _objectSpread(_objectSpread({}, axes.y), (_options$axes2 = options.axes) === null || _options$axes2 === void 0 ? void 0 : _options$axes2.y)
  });
  var c2mOptions = {
    cc: cc,
    element: chart.canvas,
    type: c2m_types,
    data: (_scrub$data = scrub === null || scrub === void 0 ? void 0 : scrub.data) !== null && _scrub$data !== void 0 ? _scrub$data : data,
    title: determineChartTitle(chart.options),
    axes: axes,
    options: {
      // @ts-ignore
      onFocusCallback: function onFocusCallback() {
        displayPoint(chart);
      }
    }
  };
  if (Array.isArray(c2mOptions.data)) {
    if (isNaN(c2mOptions.data[0])) {
      c2mOptions.data = c2mOptions.data.map(function (point, index) {
        return _objectSpread(_objectSpread({}, point), {}, {
          custom: {
            group: 0,
            index: index
          }
        });
      });
    } else {
      c2mOptions.data = c2mOptions.data.map(function (num, index) {
        return {
          x: index,
          y: num,
          custom: {
            group: 0,
            index: index
          }
        };
      });
    }
  } else {
    var _groups = Object.keys(c2mOptions.data);
    _groups.forEach(function (groupName, groupNumber) {
      if (!isNaN(c2mOptions.data[groupName][0])) {
        c2mOptions.data[groupName] = c2mOptions.data[groupName].map(function (num, index) {
          return {
            x: index,
            y: num,
            custom: {
              group: groupNumber,
              index: index
            }
          };
        });
      } else {
        c2mOptions.data[groupName] = c2mOptions.data[groupName].map(function (point, index) {
          return _objectSpread(_objectSpread({}, point), {}, {
            custom: {
              group: groupNumber,
              index: index
            }
          });
        });
      }
    });
  }
  // @ts-ignore
  if ((_chart$config$options = chart.config.options) !== null && _chart$config$options !== void 0 && (_chart$config$options = _chart$config$options.scales) !== null && _chart$config$options !== void 0 && (_chart$config$options = _chart$config$options.x) !== null && _chart$config$options !== void 0 && _chart$config$options.stacked) {
    // @ts-ignore
    c2mOptions.options.stack = true;
  }
  // @ts-ignore
  if (options.audioEngine) {
    // @ts-ignore
    c2mOptions.audioEngine = options.audioEngine;
  }
  if (c2mOptions.data.length === 0) {
    return;
  }
  var _c2mChart = (0, _chart2music["default"])(c2mOptions),
    err = _c2mChart.err,
    c2m = _c2mChart.data;
  /* istanbul-ignore-next */
  if (err) {
    var _options$errorCallbac2;
    // @ts-ignore
    (_options$errorCallbac2 = options.errorCallback) === null || _options$errorCallbac2 === void 0 || _options$errorCallbac2.call(options, err);
    return;
  }
  if (!c2m) {
    return;
  }
  chartStates.set(chart, {
    c2m: c2m,
    visible_groups: (_groups$map = groups === null || groups === void 0 ? void 0 : groups.map(function (g, i) {
      return i;
    })) !== null && _groups$map !== void 0 ? _groups$map : []
  });
};
var plugin = exports["default"] = {
  id: "chartjs2music",
  afterInit: function afterInit(chart, args, options) {
    if (!chartStates.has(chart)) {
      generateChart(chart, options);
      // Remove tooltip when the chart blurs
      chart.canvas.addEventListener("blur", function () {
        var _chart$tooltip2;
        chart.setActiveElements([]);
        (_chart$tooltip2 = chart.tooltip) === null || _chart$tooltip2 === void 0 || _chart$tooltip2.setActiveElements([], {});
        try {
          chart.update();
        } catch (e) {
          // console.warn(e);
        }
      });
      // Show tooltip when the chart receives focus
      chart.canvas.addEventListener("focus", function () {
        displayPoint(chart);
      });
    }
  },
  afterDatasetUpdate: function afterDatasetUpdate(chart, args, options) {
    if (!args.mode) {
      return;
    }
    if (!chartStates.has(chart)) {
      generateChart(chart, options);
    }
    var _chartStates$get2 = chartStates.get(chart),
      ref = _chartStates$get2.c2m,
      visible_groups = _chartStates$get2.visible_groups;
    if (!ref) {
      return;
    }
    // @ts-ignore
    var groups = ref._groups.slice(0);
    // @ts-ignore
    if (ref._options.stack) {
      groups.shift();
    }
    if (args.mode === "hide") {
      var err = ref.setCategoryVisibility(groups[args.index], false);
      visible_groups.splice(args.index, 1);
      if (err) {
        console.error(err);
      }
      return;
    }
    if (args.mode === "show") {
      var _err = ref.setCategoryVisibility(groups[args.index], true);
      visible_groups.push(args.index);
      if (_err) {
        console.error(_err);
      }
      return;
    }
  },
  defaults: {
    cc: null,
    audioEngine: null,
    errorCallback: null
  }
};
