export const unMarshalData = (values) => [
    values?.delivery,
    values?.pickup,
    ...(values?.custom || [])?.map(x => ({ ...x, key: 'custom' }))
].map(mode => {
  mode.orderValue.min = mode?.orderValue?.min ?? 0;
  mode.orderValue.max = mode?.orderValue?.max ?? 0;
  mode.charge = mode?.charge ?? 0;
  mode.chargeEnabled = mode?.chargeEnabled ?? false;
  return mode;
});

export const marhsalData = (values) => ({
  delivery: values?.find((mode) => mode?.type === 'delivery'),
  pickup: values?.find((mode) => mode?.type === 'pickup'),
  custom: values?.filter((mode) => mode?.key === 'custom'),
});

export function getInitialValues(values = {}) {
  return unMarshalData(values);
}
