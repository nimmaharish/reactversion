export function inSeries(list, fn) {
  return list.reduce(async (acc, ...rest) => {
    const results = await acc;
    try {
      results.push({
        status: true,
        result: await fn(...rest),
      });
    } catch (error) {
      results.push({
        status: false,
        result: error,
      });
    }
    return results;
  }, Promise.resolve([]));
}
