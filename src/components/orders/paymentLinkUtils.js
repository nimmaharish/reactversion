import * as Yup from 'yup';

export const marshalData = (values) => ({
  payable: values?.payable,
  modes: values?.modes?.filter(mode => mode?.enabled).map(mode => ({ type: mode?.type, id: mode?.id })),
});

export const getInitialValues = (shop = {}, link) => {
  const modes = [];
  if (shop?.paymentModes?.online?.enabled) {
    const enabled = (shop.accounts || []).filter(x => x.enabled);
    if (enabled?.length) {
      modes.push({
        type: 'online',
        id: enabled[0]._id,
        name: 'Online',
        enabled: link?.payable ? Boolean(link?.modes?.find(mode => mode?.id === enabled[0]._id)) : true,
      });
    }
  }
  if (shop?.paymentModes?.custompayment?.enabled) {
    const enabledModes = (shop.paymentModes.custompayment.configured || [])
      .filter(x => x.status === 'live')
      .map(x => ({
        type: 'custompayment',
        id: x._id,
        name: x.mode,
        enabled: link?.payable ? Boolean(link?.modes?.find(mode => mode?.id === x._id)) : true,
      }));
    modes.push(...enabledModes);
  }
  return {
    payable: link?.payable || '',
    modes,
  };
};

export const schema = Yup.object({
  payable: Yup.number().moreThan(0).required('Payable is required'),
});
