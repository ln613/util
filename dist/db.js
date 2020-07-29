(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "mongodb", "ramda"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("mongodb"), require("ramda"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.mongodb, global.ramda);
    global.db = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _mongodb, _ramda) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.removeAll = _exports.remove = _exports.update = _exports.replaceList = _exports.addToList = _exports.replace = _exports.add = _exports.search = _exports.getById = _exports.getIdName = _exports.get = _exports.count = _exports.list = _exports.backup = _exports.initdata = _exports.initdocs = _exports.connectDB = void 0;

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  var db = null;

  var connectDB = function connectDB() {
    return db ? Promise.resolve(db) : _mongodb.MongoClient.connect(process.env.DB_LOCAL || process.env.MONGO.replace('{0}', process.env.DB)).then(function (x) {
      return db = x.db();
    });
  };

  _exports.connectDB = connectDB;

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

  _exports.initdocs = initdocs;

  var initdata = function initdata(d) {
    return d ? Promise.resolve(d).then(function (r) {
      return initdocs(r);
    }) : httpGet("".concat(process.env.GITHUB_DB, "db.json")).then(function (r) {
      return initdocs(r);
    });
  };

  _exports.initdata = initdata;

  var backup = function backup() {
    return Promise.all(allDocs.map(get)).then(function (l) {
      return (0, _ramda.fromPairs)(l.map(function (d, i) {
        return [allDocs[i], d];
      }));
    });
  };

  _exports.backup = backup;

  var list = function list() {
    return Object.keys(db);
  };

  _exports.list = list;

  var count = function count(doc) {
    return db.collection(doc).count();
  };

  _exports.count = count;

  var get = function get(doc) {
    return db.collection(doc).find().project({
      _id: 0
    }).toArray();
  };

  _exports.get = get;

  var getIdName = function getIdName(doc) {
    return db.collection(doc).find().project({
      _id: 0,
      id: 1,
      name: 1
    }).toArray();
  };

  _exports.getIdName = getIdName;

  var getById = function getById(doc, id) {
    return db.collection(doc).findOne({
      id: +id
    }, {
      projection: {
        _id: 0
      }
    });
  };

  _exports.getById = getById;

  var search = function search(doc, prop, val, fields) {
    return db.collection(doc).find(prop ? _defineProperty({}, prop, (0, _ramda.is)(String, val) ? new RegExp(val, 'i') : val) : {}).project((0, _ramda.merge)({
      _id: 0,
      id: 1,
      name: 1
    }, fields ? (0, _ramda.fromPairs)(fields.split(',').map(function (x) {
      return [x, 1];
    })) : {})).toArray();
  };

  _exports.search = search;

  var add = function add(doc, obj) {
    return obj && (0, _ramda.is)(Array, obj) && obj.length > 0 ? db.collection(doc).insertMany(obj) : Promise.resolve({});
  };

  _exports.add = add;

  var replace = function replace(doc, obj) {
    return db.collection(doc).replaceOne({
      id: obj.id
    }, obj, {
      upsert: true
    });
  };

  _exports.replace = replace;

  var addToList = function addToList(doc, id, list, obj) {
    return db.collection(doc).update({
      id: +id
    }, {
      $addToSet: _defineProperty({}, list, obj)
    });
  };

  _exports.addToList = addToList;

  var replaceList = function replaceList(doc, id, list, obj) {
    return db.collection(doc).update(_defineProperty({
      id: +id
    }, list + '.id', obj.id), {
      $set: _defineProperty({}, list + '.$', obj)
    });
  };

  _exports.replaceList = replaceList;

  var update = function update(doc, obj) {
    return db.collection(doc).update({
      id: obj.id
    }, {
      $set: obj
    });
  };

  _exports.update = update;

  var remove = function remove(doc, obj) {
    return db.collection(doc).remove({
      id: obj.id
    });
  };

  _exports.remove = remove;

  var removeAll = function removeAll(doc) {
    return db.collection(doc).deleteMany({});
  };

  _exports.removeAll = removeAll;
});