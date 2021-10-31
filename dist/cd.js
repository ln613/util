"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.upload = exports.remove = exports.content = exports.find = exports.list = exports.folder = exports.ver = exports.config = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _cloudinary = require("cloudinary");

var _axios = _interopRequireDefault(require("axios"));

var _util = require("./util");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var config = function config(name, key, secret) {
  return (0, _cloudinary.config)({
    cloud_name: name || process.env.CLOUDINARY_NAME,
    api_key: key || process.env.CLOUDINARY_KEY,
    api_secret: secret || process.env.CLOUDINARY_SECRET
  });
};

exports.config = config;
var api = _cloudinary.v2.api,
    uploader = _cloudinary.v2.uploader,
    search = _cloudinary.v2.search;
var max = {
  max_results: 500
};

var prefix = function prefix(f) {
  return _objectSpread(_objectSpread({}, max), {}, {
    prefix: f,
    type: 'upload'
  });
};

var uploadBase64 = function uploadBase64(imgData, public_id) {
  return uploader.upload('data:image/png;base64,' + imgData, {
    public_id: public_id // use_filename: true,
    // unique_filename: false,
    // overwrite: true

  });
};

var ver = function ver() {
  return api.resources(max).then(function (r) {
    return (0, _util.sortBy)({
      version: 1
    }, r.resources);
  }).then(function (r) {
    return r[0].version;
  });
};

exports.ver = ver;

var folder = function folder(f) {
  return (f ? api.sub_folders(f, max) : api.root_folders()).then(function (r) {
    return (0, _util.sortBy)('name', r.folders);
  });
};

exports.folder = folder;

var list = function list(f) {
  return api.resources(f ? prefix(f) : max).then(function (r) {
    return (0, _util.sortBy)('public_id', r.resources);
  });
};

exports.list = list;

var find = function find(e) {
  return search.expression(e).max_results(500).execute().then(function (r) {
    return (0, _util.sortBy)('public_id', r.resources);
  });
};

exports.find = find;

var content = function content(f) {
  return Promise.all([folder(f), find('folder:' + f)]).then(function (r) {
    return r[0].concat(r[1]);
  });
};

exports.content = content;

var remove = function remove(ids) {
  return api.delete_resources(ids);
}; // { base64, pid, folder, name }
// { imgs: { base64, pid }, isLocal: true }
// { imgs } imgs = a list of { url, pid }


exports.remove = remove;

var upload = function upload(_ref) {
  var imgs = _ref.imgs,
      folder = _ref.folder,
      name = _ref.name,
      pid = _ref.pid,
      base64 = _ref.base64,
      isLocal = _ref.isLocal;
  return base64 ? uploadBase64(base64, pid || "".concat(folder, "/").concat(name)) : isLocal ? (0, _util.serial)(imgs, function (m) {
    return uploadBase64(m.base64, m.pid);
  }) : (0, _util.serial)(imgs.map(function (x) {
    return [x.pid, new URL(x.url)];
  }), function (m) {
    return _axios["default"].get(m[1].href, {
      responseType: 'arraybuffer',
      headers: {
        Referer: m[1].origin
      }
    }).then(function (r) {
      return Buffer.from(r.data, 'binary').toString('base64');
    }).then(function (r) {
      return uploadBase64(r, m[0]);
    });
  });
};

exports.upload = upload;