const MongoClient = require('mongodb').MongoClient;
const { fromPairs, merge, is } = require('ramda');
const { escapeRegex } = require('.');

let db = null;
const e = {};

e.connectDB = () => db ? Promise.resolve(db) : MongoClient.connect(
  process.env.DB_LOCAL || process.env.MONGO.replace('{0}', process.env.DB)
)
.then(x => db = x.db());

e.initdocs = docs => {
  const f = k => r => db.collection(k).insertMany(docs[k]);
  return Promise.all(
    Object.keys(docs).map(k => db.collection(k).drop().then(f(k)).catch(f(k)))
  );
}

e.initdata = d => d ? Promise.resolve(d).then(r => e.initdocs(r)) :
  httpGet(`${process.env.GITHUB_DB}db.json`).then(r => e.initdocs(r))

e.backup = () => Promise.all(allDocs.map(e.get)).then(l => fromPairs(l.map((d, i) => [allDocs[i], d])))

e.list = () => Object.keys(db)

e.count = doc => db.collection(doc).count()

e.get = doc => db.collection(doc).find().project({ _id: 0 }).toArray()

e.getIdName = doc => db.collection(doc).find().project({ _id: 0, id: 1, name: 1 }).toArray()

e.getById = (doc, id) => db.collection(doc).findOne({ id: +id }, { projection: { _id: 0 }})

e.search = (doc, prop, val, fields) => db.collection(doc)
  .find(prop ? { [prop]: isNaN(+val) ? new RegExp(escapeRegex(val), 'i') : +val } : {})
  .project(merge({ _id: 0, id: 1, name: 1 }, fields ? fromPairs(fields.split(',').map(x => [x, 1])) : {}))
  .toArray()

e.add = (doc, obj) => obj && is(Array, obj) && obj.length > 0
  ? db.collection(doc).insertMany(obj)
  : Promise.resolve({});

e.replace = (doc, obj) => db.collection(doc).replaceOne({ id: obj.id }, obj, { upsert: true })

e.addToList = (doc, id, list, obj) => db.collection(doc).update({ id: +id }, { $addToSet: { [list]: obj } })

e.replaceList = (doc, id, list, obj) => db.collection(doc).update({ id: +id, [list + '.id']: obj.id }, { $set: { [list + '.$']:obj } })

e.update = (doc, obj) => db.collection(doc).update({ id: obj.id }, { $set: obj })

e.delete = (doc, obj) => db.collection(doc).remove({ id: obj.id })

e.deleteAll = doc => db.collection(doc).deleteMany({})

module.exports = e;
