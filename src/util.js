import { anyPass, ascend, curry, descend, differenceWith, dissoc, find, fromPairs, is, isNil, lensPath, pipe, prop, reduce, set as _set, sort as _sort, sortWith, splitAt, view } from 'ramda'
import cheerio from 'cheerio'
import axios from 'axios'

process && (process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0')

const rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g // from lodash/fp
const reEscapeChar = /\\(\\)?/g; // from lodash/fp
const toLensPath = p => lensPath(is(String, p) ? stringToPath(p) : p)
const findzz = (r, z) => {
  const zz = z.split(':');
  const o = r.find(zz[0]);
  if (o.length > 1 && zz.length > 1)
    return o.eq(zz[1]);
  return o;
}

// misc

export const use = (...args) => f => f(...args)
export const serial = (a, f) => a.reduce((p, c) => p.then(l => f(c).then(r => [...l, r])), Promise.resolve([]));
export const tap = (x, title = '', f = t => t, pred = true) => {
  if (is(Function, pred) ? pred(x) : pred) {
    if (title) console.log(`${title} - `, f(x))
    else console.log(f(x))
  }
  return x
}

// array

export const findByProp = curry((p, val, arr) => find(x => x[p] == val, arr || []));
export const findById = findByProp('id');
export const findByName = findByProp('name');
export const getPropById = curry((p, id) => pipe(findById(id), prop(p)));
export const getNameById = getPropById('name')
export const getPropByName = curry((p, name) => pipe(findByName(name), prop(p)));
export const getPropByProp = (p1, p2, val) => pipe(findByProp(p2)(val), prop(p1));

export const sort = _sort((a, b) => a - b);
export const sortDesc = _sort((a, b) => b - a);
export const sortBy = curry((o, arr) => sortWith(is(String, o) ? [ascend(prop(o))] : Object.entries(o).map(([k, v]) => (v ? descend : ascend)(prop(k))), arr));

export const toSingleArray = arr => is(Array, arr) ? arr : [arr];
export const isIn = arr => val => arr.some(item => val === item);
export const split2 = isCeil => arr => splitAt((isCeil ? Math.ceil : Math.floor)(arr.length / 2), arr);
export const addIndex = p => arr => arr.map((x, i) => ({ [p || 'id']: i + 1, ...dissoc([p || 'id'], x) }));

export const swap = curry((i1, i2, arr) => { const t = arr[i1]; arr[i1] = arr[i2]; arr[i2] = t; });
export const shuffle = arr => {
  let i1 = arr.length;
  while (i1 !== 0) {
    i1--;
    const i2 = Math.floor(Math.random() * i1);
    swap(i1, i2, arr);
  }
  return arr;
};

// string

export const toTitleCase = s => s.replace(/\w\S*/g, t => t.charAt(0).toUpperCase() + t.substr(1).toLowerCase());
export const toLowerDash = s => s.toLowerCase().replace(/ /g, '-');
export const escapeRegex = s => s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
export const isStringNumber = s => !isNaN(+s);

export const replace = (s, params) => params && is(Object, params)
  ? reduce(
    (p, c) => p.replace(new RegExp(`\{${c}\}`, 'g'), params[c]),
    s,
    Object.keys(params)
  )
  : s;

export const stringToPath = s => {  // from lodash/fp
  const result = [];
  s.replace(rePropName, (match, number, quote, subString) => {
    const v = quote ? subString.replace(reEscapeChar, '$1') : (number || match);
    result.push(isStringNumber(v) ? +v : v);
  });
  return result;
};

// date

export const toDate = s => use(new Date(s))(d => `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`)
export const toMonth = s => use(new Date(s))(d => `${d.getFullYear()}/${d.getMonth() + 1}`)
export const toAbsDate = d => new Date(d).toISOString().slice(0, 10);

// object

export const get = pipe(toLensPath, view);
export const set = pipe(toLensPath, _set);
export const isPrimitiveType = anyPass([is(Number), is(String), is(Boolean)]);
export const diff = p => differenceWith((a, b) => isPrimitiveType(a) ? a === b : a[p || 'id'] === b[p || 'id']);

// env

export const port = process?.env.PORT || 3000;
export const isDev = () => process?.env.NODE_ENV && isIn(['development', 'dev'])(process.env.NODE_ENV.toLowerCase());
export const isProd = () => process?.env.NODE_ENV ? true : isIn(['production', 'prod'])(process.env.NODE_ENV.toLowerCase());
export const host = isDev() ? `http://localhost:${port}/` : '/';
export const api = host + 'api/';
export const admin = host + 'admin/';

// http

export const fetch = url => window
  ? window.fetch(url).then(r => r.json())
  : axios.get(url).then(r => r.data);
export const post = (url, data, headers = {}) => window
  ? window.fetch(url, { method: 'post', mode: 'cors', body: JSON.stringify(data), headers }).then(r => r.json())
  : axios.post(url, data, headers).then(r => r.data);

// html

export const extractHtml = (html, opt) => {
  const o = {};
  const r = cheerio.load(html);
  opt.forEach(x => {
    o[x[1]] = r(x[0]).map((i, y) => { // x[0] - root element(s), x[1] - output root object name
      const o1 = {};
      const r1 = r(r(x[0])[i]);
      x[2].forEach(z => { // z[0] - child element(s), z[1] - output property name, 
        const z0 = z[0] ? (is(String, z[0]) ? findzz(r1, z[0]) : z[0](r1)) : r1; // child element(s) can be a cheerio func expecting root element
        const a1 = z0.length > 1; // is child element(s) an array?
        const a2 = is(Array, z[2]); // is attr(s) an array?
        o1[z[1]] = a2 ?
          (a1 ? z0.map((j, u) => fromPairs(z[2].map(w => [w[0], r(u).attr(w[1])]))).toArray() : fromPairs(z[2].map(w => [w[0], z0.attr(w[1])]))) :
          (a1 ? z0.map((j, u) => z[2] ? r(u).attr(z[2]) : r(u).text()).toArray() : (z[2] ? z0.attr(z[2]) : z0.text()));
      });
      return o1;
    }).toArray();
  });
  return o;
}

export const extractUrl = (url, opt) => axios.get(url).then(r => extractHtml(r.data, opt))
