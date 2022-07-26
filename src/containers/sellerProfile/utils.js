import * as Yup from 'yup';

export const getInitialValues = (values) => ({
  firstName: values?.firstName || '',
  lastName: values?.lastName || '',
});

export const schema = Yup.object()
  .shape({
    firstName: Yup.string().required('First name required'),
    lastName: Yup.string().required('Last name required'),
  });
