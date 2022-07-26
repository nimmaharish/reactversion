import * as Yup from 'yup';

export const typeOptions = [
  {
    label: 'Minutes',
    value: 'minutes'
  },
  {
    label: 'Hours',
    value: 'hours'
  },
  {
    label: 'Days',
    value: 'days'
  },
  {
    label: 'Weeks',
    value: 'weeks'
  }
];

export const getInitialValues = (values) => ({
  fromItemValue: values?.from?.value || '',
  itemType: values?.from?.type || 'days',
  toItemValue: values?.to?.value || '',
});

export const schema = Yup.object()
  .shape({
    itemType: Yup.string().required('Days/Hours Required'),
    fromItemValue: Yup.number()
      .required('Min Days/Hours Required')
      .positive()
      .integer(),
    toItemValue: Yup.number()
      .required('Max Days/Hours Required')
      .positive()
      .moreThan(Yup.ref('fromItemValue'), 'Max Days/Hours should be greater than Min Days/Hours')
      .integer()
  });
