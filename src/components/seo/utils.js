import * as Yup from 'yup';

export const schema = Yup.object({
  title: Yup.string(),
  description: Yup.string(),
  keywords: Yup.string(),
});

export function getInitialValues(data = {}) {
  return {
    title: data?.title || '',
    description: data?.description || '',
    keywords: data?.keywords || '',
  };
}
