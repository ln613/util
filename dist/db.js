"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeAll = exports.remove = exports.update = exports.replaceList = exports.addToList = exports.replace = exports.add = exports.search = exports.getById = exports.getIdName = exports.get = exports.count = exports.list = exports.backup = exports.initdata = exports.initdocs = exports.connectDB = void 0;

var _mongodb = require("mongodb");

var _ramda = require("ramda");

var _util = require("./util");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var db = null;
var MongoOps = {
  '=': '$eq',
  '<': '$lt',
  '>': '$gt',
  'in': '$in'
};

var connectDB = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(conn) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.t0 = !conn && db;

            if (_context.t0) {
              _context.next = 5;
              break;
            }

            _context.next = 4;
            return _mongodb.MongoClient.connect(conn || process.env.DB_LOCAL || process.env.DB).then(function (x) {
              return x.db();
            });

          case 4:
            _context.t0 = db = _context.sent;

          case 5:
            return _context.abrupt("return", _context.t0);

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function connectDB(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.connectDB = connectDB;

var initdocs = function initdocs(docs) {
  var f = function f(k) {
    return function (r) {
      return db.collection(k).insertMany(docs[k]);
    };
  };

  return Promise.all(Object.keys(docs).map(function (k) {
    return db.collection(k).drop().then(f(k))["catch"](f(k));
  }));
};

exports.initdocs = initdocs;

var initdata = function initdata(d) {
  return d ? Promise.resolve(d).then(function (r) {
    return initdocs(r);
  }) : httpGet("".concat(process.env.GITHUB_DB, "db.json")).then(function (r) {
    return initdocs(r);
  });
};

exports.initdata = initdata;

var backup = function backup() {
  return Promise.all(allDocs.map(get)).then(function (l) {
    return (0, _ramda.fromPairs)(l.map(function (d, i) {
      return [allDocs[i], d];
    }));
  });
};

exports.backup = backup;

var list = function list() {
  return Object.keys(db);
};

exports.list = list;

var count = function count(doc) {
  return db.collection(doc).count();
};

exports.count = count;

var get = function get(doc) {
  return db.collection(doc).find().project({
    _id: 0
  }).toArray();
};

exports.get = get;

var getIdName = function getIdName(doc) {
  return db.collection(doc).find().project({
    _id: 0,
    id: 1,
    name: 1
  }).toArray();
};

exports.getIdName = getIdName;

var getById = function getById(doc, id) {
  return db.collection(doc).findOne({
    id: +id
  }, {
    projection: {
      _id: 0
    }
  });
};

exports.getById = getById;

var search = function search(doc, query, fields) {
  //const v = is(String, value) ? new RegExp(value, 'i') : value
  var fs = (0, _ramda.merge)({
    _id: 0
  }, fields ? (0, _ramda.fromPairs)(fields.split(',').map(function (x) {
    return [x, 1];
  })) : {}); //const s = sortBy ? { [sortBy]: sortOrder } : {}

  return db.collection(doc).find(query || {}).project(fs) //.sort(s)
  .toArray();
};

exports.search = search;

var add = function add(doc, obj) {
  return (0, _ramda.cond)([[_util.noneEmptyArray, function (a) {
    return db.collection(doc).insertMany(a);
  }], [_util.noneEmptyObject, function (o) {
    return db.collection(doc).insert(o);
  }], [_util.T, (0, _util.C)(_util.P)]])(obj);
};

exports.add = add;

var replace = function replace(doc, obj) {
  return (0, _ramda.cond)([[_util.noneEmptyArray, function (a) {
    return Promise.all(a.map(function (o) {
      return replace(doc, o);
    }));
  }], [_util.noneEmptyObject, function (o) {
    return db.collection(doc).replaceOne({
      id: o.id
    }, o, {
      upsert: true
    });
  }], [_util.T, (0, _util.C)(_util.P)]])(obj);
};

exports.replace = replace;

var addToList = function addToList(doc, id, list, obj) {
  return db.collection(doc).updateOne({
    id: +id
  }, {
    $addToSet: _defineProperty({}, list, obj)
  });
};

exports.addToList = addToList;

var replaceList = function replaceList(doc, id, list, obj) {
  return db.collection(doc).updateOne(_defineProperty({
    id: +id
  }, list + '.id', obj.id), {
    $set: _defineProperty({}, list + '.$', obj)
  });
};

exports.replaceList = replaceList;

var update = function update(doc, obj) {
  return db.collection(doc).updateOne({
    id: obj.id
  }, {
    $set: obj
  });
};

exports.update = update;

var remove = function remove(doc, obj) {
  return db.collection(doc).remove({
    id: obj.id
  });
};

exports.remove = remove;

var removeAll = function removeAll(doc) {
  return db.collection(doc).deleteMany({});
};

exports.removeAll = removeAll;