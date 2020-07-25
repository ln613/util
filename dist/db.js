"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeAll = exports.remove = exports.update = exports.replaceList = exports.addToList = exports.replace = exports.add = exports.search = exports.getById = exports.getIdName = exports.get = exports.count = exports.list = exports.backup = exports.initdata = exports.initdocs = exports.connectDB = void 0;

var _mongodb = require("mongodb");

var _ramda = require("ramda");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var db = null;

var connectDB = function connectDB() {
  return db ? Promise.resolve(db) : _mongodb.MongoClient.connect(process.env.DB_LOCAL || process.env.MONGO.replace('{0}', process.env.DB)).then(function (x) {
    return db = x.db();
  });
};

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

var search = function search(doc, prop, val, fields) {
  return db.collection(doc).find(prop ? _defineProperty({}, prop, (0, _ramda.is)(String, val) ? new RegExp(val, 'i') : +val) : {}).project((0, _ramda.merge)({
    _id: 0,
    id: 1,
    name: 1
  }, fields ? (0, _ramda.fromPairs)(fields.split(',').map(function (x) {
    return [x, 1];
  })) : {})).toArray();
};

exports.search = search;

var add = function add(doc, obj) {
  return obj && (0, _ramda.is)(Array, obj) && obj.length > 0 ? db.collection(doc).insertMany(obj) : Promise.resolve({});
};

exports.add = add;

var replace = function replace(doc, obj) {
  return db.collection(doc).replaceOne({
    id: obj.id
  }, obj, {
    upsert: true
  });
};

exports.replace = replace;

var addToList = function addToList(doc, id, list, obj) {
  return db.collection(doc).update({
    id: +id
  }, {
    $addToSet: _defineProperty({}, list, obj)
  });
};

exports.addToList = addToList;

var replaceList = function replaceList(doc, id, list, obj) {
  return db.collection(doc).update(_defineProperty({
    id: +id
  }, list + '.id', obj.id), {
    $set: _defineProperty({}, list + '.$', obj)
  });
};

exports.replaceList = replaceList;

var update = function update(doc, obj) {
  return db.collection(doc).update({
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