import { MongoClient } from 'mongodb';
import { fromPairs, is, merge, cond } from 'ramda';
import { C, N, T, P, noneEmptyArray, noneEmptyObject, tap } from './util';

let db = null;
const MongoOps = {
  '=': '$eq',
  '<': '$lt',
  '>': '$gt',
  'in': '$in',
}

export const connectDB = async conn => (!conn && db) ||
  (db = await MongoClient.connect(conn || process.env.DB_LOCAL || process.env.DB).then(x => x.db()));

export const initdocs = docs => {
  const f = k => r => db.collection(k).insertMany(docs[k]);
  return Promise.all(
    Object.keys(docs).map(k => db.collection(k).drop().then(f(k)).catch(f(k)))
  );
}

export const initdata = d => d ? Promise.resolve(d).then(r => initdocs(r)) :
  httpGet(`${process.env.GITHUB_DB}db.json`).then(r => initdocs(r))

export const backup = () => Promise.all(allDocs.map(get)).then(l => fromPairs(l.map((d, i) => [allDocs[i], d])))

export const list = () => Object.keys(db)

export const count = doc => db.collection(doc).count()

export const get = doc => db.collection(doc).find().project({ _id: 0 }).toArray()

export const getIdName = doc => db.collection(doc).find().project({ _id: 0, id: 1, name: 1 }).toArray()

export const getById = (doc, id) => db.collection(doc).findOne({ id: +id }, { projection: { _id: 0 }})

export const search = (doc, query, fields) => {
  //const v = is(String, value) ? new RegExp(value, 'i') : value
  const fs = merge({ _id: 0 }, fields ? fromPairs(fields.split(',').map(x => [x, 1])) : {})
  //const s = sortBy ? { [sortBy]: sortOrder } : {}

  return db.collection(doc)
  .find(query || {})
  .project(fs)
  //.sort(s)
  .toArray()
}

export const add = (doc, obj) => cond([
  [noneEmptyArray, a => db.collection(doc).insertMany(a)],
  [noneEmptyObject, o => db.collection(doc).insert(o)],
  [T, C(P)],
])(obj)

export const replace = (doc, obj) => cond([
  [noneEmptyArray, a => Promise.all(a.map(o => replace(doc, o)))],
  [noneEmptyObject, o => db.collection(doc).replaceOne({ id: o.id }, o, { upsert: true })],
  [T, C(P)],
])(obj)

export const addToList = (doc, id, list, obj) => db.collection(doc).updateOne({ id: +id }, { $addToSet: { [list]: obj } })

export const replaceList = (doc, id, list, obj) => db.collection(doc).updateOne({ id: +id, [list + '.id']: obj.id }, { $set: { [list + '.$']:obj } })

export const update = (doc, obj) => db.collection(doc).updateOne({ id: obj.id }, { $set: obj })

export const remove = (doc, obj) => db.collection(doc).remove({ id: obj.id })

export const removeAll = doc => db.collection(doc).deleteMany({})
