export function getInitialValues(values = {}) {
  return {
    fb: {
      enabled: true,
      id: '',
      ...values.fb,
    },
    ga: {
      enabled: true,
      id: '',
      ...values.ga,
    }
  };
}
