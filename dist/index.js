(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "ramda"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("ramda"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.ramda);
    global.index = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _ramda) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.h = void 0;

  //export * from './util';
  var h = function h(l) {
    return (0, _ramda.head)(l);
  };

  _exports.h = h;
});