export function getInitialValues(values = {}) {
  return {
    enabled: values.enabled ?? false,
    guestEnabled: values.guestEnabled ?? false
  };
}
