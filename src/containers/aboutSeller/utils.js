export function getInitialValues(values = {}) {
  return {
    about: values?.about || '',
  };
}

export function getLegalPpInitialValues(values = {}) {
  return {
    legalPrivacyPolicy: values?.legalPrivacyPolicy || '',
  };
}

export function getLegalTncInitialValues(values = {}) {
  return {
    legalTncs: values?.legalTncs || '',
  };
}

export const getValues = (values, type) => {
  if (type === 0) {
    return getInitialValues(values);
  }
  if (type === 1) {
    return getLegalPpInitialValues(values);
  }
  if (type === 2) {
    return getLegalTncInitialValues(values);
  }
};

export const getValue = (values, type) => {
  if (type === 0) {
    return values.about;
  }
  if (type === 1) {
    return values.legalPrivacyPolicy;
  }
  if (type === 2) {
    return values.legalTncs;
  }
};

export const getTitle = (type) => {
  if (type === 0) {
    return 'About Shop';
  }
  if (type === 1) {
    return 'Privacy Policy';
  }
  if (type === 2) {
    return 'Terms & Conditions';
  }
};

export const getPlaceholder = (type) => {
  if (type === 0) {
    return 'Tell customers what sets your shop apart';
  }
  if (type === 1) {
    return 'Add Privacy Policy (Legal)';
  }
  if (type === 2) {
    return 'Add Terms & Conditions (Legal)';
  }
};
