"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var MongoClient = require('mongodb').MongoClient;

var _require = require('ramda'),
    fromPairs = _require.fromPairs,
    merge = _require.merge,
    is = _require.is;

var _require2 = require('.'),
    escapeRegex = _require2.escapeRegex;

var db = null;
var e = {};

e.connectDB = function () {
  return db ? Promise.resolve(db) : MongoClient.connect(process.env.DB_LOCAL || process.env.MONGO.replace('{0}', process.env.DB)).then(function (x) {
    return db = x.db();
  });
};

e.initdocs = function (docs) {
  var f = function f(k) {
    return function (r) {
      return db.collection(k).insertMany(docs[k]);
    };
  };

  return Promise.all(Object.keys(docs).map(function (k) {
    return db.collection(k).drop().then(f(k))["catch"](f(k));
  }));
};

e.initdata = function (d) {
  return d ? Promise.resolve(d).then(function (r) {
    return e.initdocs(r);
  }) : httpGet("".concat(process.env.GITHUB_DB, "db.json")).then(function (r) {
    return e.initdocs(r);
  });
};

e.backup = function () {
  return Promise.all(allDocs.map(e.get)).then(function (l) {
    return fromPairs(l.map(function (d, i) {
      return [allDocs[i], d];
    }));
  });
};

e.list = function () {
  return Object.keys(db);
};

e.count = function (doc) {
  return db.collection(doc).count();
};

e.get = function (doc) {
  return db.collection(doc).find().project({
    _id: 0
  }).toArray();
};

e.getIdName = function (doc) {
  return db.collection(doc).find().project({
    _id: 0,
    id: 1,
    name: 1
  }).toArray();
};

e.getById = function (doc, id) {
  return db.collection(doc).findOne({
    id: +id
  }, {
    projection: {
      _id: 0
    }
  });
};

e.search = function (doc, prop, val, fields) {
  return db.collection(doc).find(prop ? _defineProperty({}, prop, isNaN(+val) ? new RegExp(escapeRegex(val), 'i') : +val) : {}).project(merge({
    _id: 0,
    id: 1,
    name: 1
  }, fields ? fromPairs(fields.split(',').map(function (x) {
    return [x, 1];
  })) : {})).toArray();
};

e.add = function (doc, obj) {
  return obj && is(Array, obj) && obj.length > 0 ? db.collection(doc).insertMany(obj) : Promise.resolve({});
};

e.replace = function (doc, obj) {
  return db.collection(doc).replaceOne({
    id: obj.id
  }, obj, {
    upsert: true
  });
};

e.addToList = function (doc, id, list, obj) {
  return db.collection(doc).update({
    id: +id
  }, {
    $addToSet: _defineProperty({}, list, obj)
  });
};

e.replaceList = function (doc, id, list, obj) {
  return db.collection(doc).update(_defineProperty({
    id: +id
  }, list + '.id', obj.id), {
    $set: _defineProperty({}, list + '.$', obj)
  });
};

e.update = function (doc, obj) {
  return db.collection(doc).update({
    id: obj.id
  }, {
    $set: obj
  });
};

e["delete"] = function (doc, obj) {
  return db.collection(doc).remove({
    id: obj.id
  });
};

e.deleteAll = function (doc) {
  return db.collection(doc).deleteMany({});
};

module.exports = e;