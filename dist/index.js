"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  connectDB: true
};
Object.defineProperty(exports, "connectDB", {
  enumerable: true,
  get: function get() {
    return _db.connectDB;
  }
});

var _util = require("./util");

Object.keys(_util).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _util[key];
    }
  });
});

var _db = require("./db");