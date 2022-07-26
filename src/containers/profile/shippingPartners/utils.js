import * as Yup from 'yup';

export const getInitialValues = (values = {}) => {
  const val = {
    name: values?.name || '',
    enabled: values?.enabled ?? true,
    config: {
      email: values[values.name]?.config?.email || '',
      password: values[values.name]?.config?.password || '',
      token: values[values.name]?.config?.token || '',
    }
  };
  return val;
};

export const schema = Yup.object({
  name: Yup.string().required(),
  enabled: Yup.bool(),
  config: Yup.object().when('name', {
    is: 'shiprocket',
    then: Yup.object({
      email: Yup.string().required('Please enter email').email('Please enter a valid email id'),
      password: Yup.string().required('Please enter password'),
    }),
    otherwise: Yup.object({
      token: Yup.string().required('Please enter token')
    }),
  })
});

export const isEmptyPartner = (name, list = {}) => {
  if (list[name]) {
    return false;
  }
  return true;
};
