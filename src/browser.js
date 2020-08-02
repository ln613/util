export * from './util';

// http

export const fetch = url => window.fetch(url).then(r => r.json())
export const post = (url, data, headers = {}) => window.fetch(url, { method: 'post', mode: 'cors', body: JSON.stringify(data), headers }).then(r => r.json())
