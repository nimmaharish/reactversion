import { chunk } from 'lodash';
/**
 * @param {Array<*>} array
 * @param {Function} fn
 * @param {*} thisArg
 * @param {Array<*>} args
 * @return {Promise<*>}
 */
export async function inParallel(array, fn, thisArg = null, args = []) {
  const promises = array.map(item => fn.apply(thisArg, [item, ...args]));
  return Promise.all(promises);
}

/**
 * @param {Array<*>} array
 * @param {Function} fn
 * @param {*} thisArg
 * @param {Array<*>} args
 * @return {Promise<*>}
 */
export async function inSeries(array, fn, thisArg = null, args = []) {
  return array.reduce(async (acc, item) => {
    const list = await acc;
    const result = await fn.apply(thisArg, [item, ...args]);
    list.push(result);
    return list;
  }, Promise.resolve([]));
}

export async function inParallelWithLimit(list, concurrency, fn) {
  const batches = chunk(list, concurrency);

  const data = await inSeries(batches, async items => inParallel(items, fn));
  return data.reduce((acc, items) => [...acc, ...items], []);
}
