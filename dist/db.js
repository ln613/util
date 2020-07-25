"use strict";

var _mongodb = require("mongodb");

var _ramda = require("ramda");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var db = null;

e.connectDB = function () {
  return db ? Promise.resolve(db) : _mongodb.MongoClient.connect(process.env.DB_LOCAL || process.env.MONGO.replace('{0}', process.env.DB)).then(function (x) {
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
    return initdocs(r);
  }) : httpGet("".concat(process.env.GITHUB_DB, "db.json")).then(function (r) {
    return initdocs(r);
  });
};

e.backup = function () {
  return Promise.all(allDocs.map(get)).then(function (l) {
    return (0, _ramda.fromPairs)(l.map(function (d, i) {
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
  return db.collection(doc).find(prop ? _defineProperty({}, prop, (0, _ramda.is)(String, val) ? new RegExp(val, 'i') : +val) : {}).project((0, _ramda.merge)({
    _id: 0,
    id: 1,
    name: 1
  }, fields ? (0, _ramda.fromPairs)(fields.split(',').map(function (x) {
    return [x, 1];
  })) : {})).toArray();
};

e.add = function (doc, obj) {
  return obj && (0, _ramda.is)(Array, obj) && obj.length > 0 ? db.collection(doc).insertMany(obj) : Promise.resolve({});
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

e.remove = function (doc, obj) {
  return db.collection(doc).remove({
    id: obj.id
  });
};

e.removeAll = function (doc) {
  return db.collection(doc).deleteMany({});
};