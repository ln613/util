import { get, set } from '../src';

const o1 = { 'a': [{ 'b': { 'c': 3 } }] };
const p1 = 'a[0].b.c';

test('get/set', () => {
  expect(get(p1)(o1)).toEqual(3);
  expect(set(p1)(6)(o1)).toMatchObject({ 'a': [{ 'b': { 'c': 6 } }] });
});
