import * as Yup from 'yup';
import { get } from 'lodash';

export const schema = Yup.object({
  enabled: Yup.bool(),
  type: Yup.string(),
  minQuantity: Yup.number(),
  maxQuantity: Yup.number().nullable(),
  group: Yup.number(),
});

export function getInitialValues(data = {}) {
  return {
    enabled: get(data, 'enabled', true),
    type: data?.type === 'limited' ? 'limited' : 'unlimited',
    minQuantity: data?.minQuantity || 1,
    maxQuantity: data?.maxQuantity || '',
    group: data?.group || 1,
  };
}
