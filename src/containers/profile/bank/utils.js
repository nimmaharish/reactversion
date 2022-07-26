import * as Yup from 'yup';

export function getInitialValues(bank = {}) {
  return {
    accountNumber: bank.accountNumber || '',
    repeatAccountNumber: bank.accountNumber || '',
    ifsc: bank.ifsc || '',
    accountName: bank.name || '',
    status: 'created',
  };
}

export const bankSchema = Yup.object()
  .shape({
    accountNumber: Yup.string()
      .required()
      .label('account number'),
    repeatAccountNumber: Yup.string()
      .oneOf([Yup.ref('accountNumber')], 'account number didn\'t match')
      .required()
      .label('confirm account number'),
    ifsc: Yup.string()
      .required()
      .min(11)
      .max(11)
      .label('IFSC'),
    accountName: Yup.string()
      .required()
      .label('account name')
      .min(3),
    status: Yup.string()
      .required(),
  });
