(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./util"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./util"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.U);
    global.index = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _util) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.keys(_util).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function get() {
        return _util[key];
      }
    });
  });
});