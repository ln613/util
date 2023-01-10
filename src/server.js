// import cheerio from 'cheerio'
import axios from 'axios'
// import { fromPairs, is, isNil } from 'ramda'
import { tap, isIn, get, trynull } from './util'
import { connectDB } from './db'

process && (process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0')

// const findzz = (r, z) => {
//   const zz = z.split(':');
//   const o = r.find(zz[0]);
//   if (o.length > 1 && zz.length > 1)
//     return o.eq(zz[1]);
//   return o;
// }

// env

export const port = process?.env.PORT || 3000;
export const isDev = () => process?.env.NODE_ENV && isIn(['development', 'dev'])(process.env.NODE_ENV.toLowerCase());
export const isProd = () => process?.env.NODE_ENV ? true : isIn(['production', 'prod'])(process.env.NODE_ENV.toLowerCase());
export const host = isDev() ? `http://localhost:${port}/` : '/';
export const api = host + 'api/';
export const admin = host + 'admin/';

// http

export const fetch = url => axios.get(url).then(r => r.data);
export const post = (url, data, headers = {}) => axios.post(url, data, headers).then(r => r.data);

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  'Access-Control-Allow-Methods': 'GET,OPTIONS,POST,PUT,PATCH,DELETE,COPY,PURGE'
};

export const res = (body, code) => ({
  statusCode: code || 200,
  headers: {
    ...cors,
    //...(isDev ? cors : {}),
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(body)
});

export const makeApi = opt => async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const q = event.queryStringParameters;
  const body = trynull(_ => JSON.parse(event.body));
  const method = event.httpMethod.toLowerCase();
  let r = {};

  try {
    if (q.db == 1) await connectDB();

    const t = get(`${method}.${q.type}`)(opt);
    t && (r = await t(q, body));

    return res(r);
  }
  catch (e) {
    tap(e);
    return res(e, 500);
  }
};

// html

// export const parseHtml = html => cheerio.load(html);

// export const extractHtml = (html, opt) => {
//   const o = {};
//   const r = cheerio.load(html);
//   opt.forEach(x => {
//     o[x[1]] = r(x[0]).map((i, y) => { // x[0] - root element(s), x[1] - output root object name
//       const o1 = {};
//       const r1 = r(r(x[0])[i]);
//       x[2].forEach(z => { // z[0] - child element(s), z[1] - output property name, 
//         const z0 = z[0] ? (is(String, z[0]) ? findzz(r1, z[0]) : z[0](r1)) : r1; // child element(s) can be a cheerio func expecting root element
//         const a1 = z0.length > 1; // is child element(s) an array?
//         const a2 = is(Array, z[2]); // is attr(s) an array?
//         o1[z[1]] = a2 ?
//           (a1 ? z0.map((j, u) => fromPairs(z[2].map(w => [w[0], r(u).attr(w[1])]))).toArray() : fromPairs(z[2].map(w => [w[0], z0.attr(w[1])]))) :
//           (a1 ? z0.map((j, u) => z[2] ? r(u).attr(z[2]) : r(u).text()).toArray() : (z[2] ? z0.attr(z[2]) : z0.text()));
//       });
//       return o1;
//     }).toArray();
//   });
//   return o;
// }

// export const extractUrl = (url, opt) => axios.get(url).then(r => extractHtml(r.data, opt))
