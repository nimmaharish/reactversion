import { cloneDeep } from 'lodash';

export const filterVariants = (variants = []) => {
  const filtered = variants.map(x => {
    const { details } = cloneDeep(x);
    const empValues = Object.entries(details || {}).filter(([a, b]) => a.length === 0 || b.length === 0);
    empValues.map(([u]) => delete details[u]);
    x.details = details;
    return x;
  });
  return filtered;
};
