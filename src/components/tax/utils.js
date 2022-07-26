import * as Yup from 'yup';
import { get } from 'lodash';

export const schema = Yup.object({
  title: Yup.string(),
  identifier: Yup.string(),
  value: Yup.number(),
  enabled: Yup.boolean(),
  isDeleted: Yup.boolean(),
});

export function getInitialValues(taxes, index) {
  const data = index === -1 ? {} : taxes[index];

  console.log(data, index);

  return {
    title: data?.title || '',
    identifier: data?.identifier || '',
    value: data?.value || '',
    enabled: get(data, 'enabled', true),
    isDeleted: get(data, 'isDeleted', false),
  };
}
