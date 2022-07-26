const distanceObj = {
  active: false,
  type: 'included',
  included: {
    distanceMatrix: [],
  },
  excluded: {
    distanceMatrix: [],
  },
};

const regionObj = {
  active: false,
  type: 'included',
  countries: [],
  excluded: []
};
export const getInitialValues = (values) => ({
  region: values?.region || regionObj,
  distance: values?.distance || distanceObj,
  overlap: values?.overlap || '',
});

export function getInitialCountryValues() {
  return {
    enabled: false,
    whole: false,
    name: '',
    regions: [],
  };
}

export function getInitialRegionValues() {
  return {
    enabled: true,
    name: '',
    regionType: 'pincode',
    pincode: {
      type: 'included',
      excluded: [],
      included: []
    },
    polygon: {},
  };
}

export function getInitialPincodeValues() {
  return {
    type: 'included',
    name: '',
    excluded: [],
    included: []
  };
}

export function getInitialExcludedOrIncludedValues() {
  return {
    _id: '',
    name: '',
    enabled: false,
    value: ''
  };
}

export const distanceTypes = [
  {
    label: 'Miles',
    value: 'Miles'
  },
  {
    label: 'Kilometers',
    value: 'Kilometers'
  }
];

export function getIntialValuesForDistanceMatrix() {
  return {
    name: '',
    min: '',
    max: '',
    type: '',
    enabled: true,
  };
}
