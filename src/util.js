import { anyPass, ascend, both, curry, descend, differenceWith, dissoc, find, is, isEmpty, lensPath, not, pipe, prop, reduce, set as _set, sort as _sort, sortWith, splitAt, view } from 'ramda'

const rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g // from lodash/fp
const reEscapeChar = /\\(\\)?/g; // from lodash/fp
const toLensPath = p => lensPath(is(String, p) ? stringToPath(p) : p)

// misc

export const C = c => () => c
export const T = () => true
export const F = () => false
export const N = p => pipe(p, not)
export const P = Promise.resolve({})
export const noneEmptyArray = both(is(Array), N(isEmpty))
export const noneEmptyObject = both(is(Object), N(isEmpty))
export const use = (...args) => f => f(...args)
export const pickOne = (k, o) => use(o && (o[k] || o['default']))
export const serial = (a, f) => a.reduce((p, c) => p.then(l => f(c).then(r => [...l, r])), Promise.resolve([]))
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
