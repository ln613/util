import { tap as _tap, sort as _sort, find, is, isNil, pipe, reduce, prop, differenceWith, anyPass, splitAt, dissoc, lensPath, view, set as _set, over } from 'ramda';

const rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g; // from lodash/fp
const reEscapeChar = /\\(\\)?/g; // from lodash/fp

export const tap = x => _tap(console.log, isNil(x) ? 'null' : x);

// array

export const toSingleArray = arr => is(Array, arr) ? arr : [arr];

export const isIn = arr => val => arr.some(item => val === item);

export const findByProp = p => val => arr => find(x => x[p] == val, arr || []);
export const findById = findByProp('id');
export const findByName = findByProp('name');

export const getPropById = p => id => pipe(findById(id), prop(p));
export const getNameById = getPropById('name')
export const getPropByName = p => name => pipe(findByName(name), prop(p));
export const getPropByProp = (p1, p2, val) => pipe(findByProp(p2)(val), prop(p1));

export const addIndex = p => arr => arr.map((x, i) => ({ [p || 'id']: i + 1, ...dissoc([p || 'id'], x) }));

export const sort = _sort((a, b) => a - b);
export const sortDesc = _sort((a, b) => b - a);

export const split2 = isCeil => arr => splitAt((isCeil ? Math.ceil : Math.floor)(arr.length / 2), arr);

// string

export const toTitleCase = s => s.replace(/\w\S*/g, t => t.charAt(0).toUpperCase() + t.substr(1).toLowerCase());

export const toLowerDash = s => s.toLowerCase().replace(/ /g, '-');

export const replace = (s, params) => params && is(Object, params)
  ? reduce(
    (p, c) => p.replace(new RegExp(`\{${c}\}`, 'g'), params[c]),
    s,
    Object.keys(params)
  )
  : s;

export const escapeRegex = s =>
  s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

export const isStringNumber = s => !isNaN(+s);

export const stringToPath = s => {  // from lodash/fp
  const result = [];
  s.replace(rePropName, (match, number, quote, subString) => {
    const v = quote ? subString.replace(reEscapeChar, '$1') : (number || match);
    result.push(isStringNumber(v) ? +v : v);
  });
  return result;
};

// date

export const toDate = s => {
  const d = new Date(s);
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
}

export const toMonth = s => {
  const d = new Date(s);
  return `${d.getFullYear()}/${d.getMonth() + 1}`;
}

export const toAbsDate = d => new Date(d).toISOString().slice(0, 10);

// object

export const isPrimitiveType = anyPass([is(Number), is(String), is(Boolean)]);

export const diff = p => differenceWith((a, b) => isPrimitiveType(a) ? a === b : a[p || 'id'] === b[p || 'id']);

export const toLensPath = p => lensPath(is(String, p) ? stringToPath(p) : p);

export const get = pipe(toLensPath, view);

export const set = pipe(toLensPath, _set);

// env

export const port = process.env.PORT || 3000;
export const isDev = () => process.env.NODE_ENV && isIn(['development', 'dev'])(process.env.NODE_ENV.toLowerCase());
export const isProd = () => process.env.NODE_ENV || isIn(['production', 'prod'])(process.env.NODE_ENV.toLowerCase());

export const host = isDev() ? `http://localhost:${port}/` : '/';
export const api = host + 'api/';
export const admin = host + 'admin/';
