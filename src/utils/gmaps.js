export function getAddressFromComponents(addressComponents, geometry) {
  const shouldBeComponent = {
    pincode: ['postal_code'],
    addressLine2: ['street_address', 'route'],
    state: [
      'administrative_area_level_1',
      'administrative_area_level_2',
      'administrative_area_level_3',
      'administrative_area_level_4',
      'administrative_area_level_5'
    ],
    city: [
      'locality',
      'sublocality',
      'sublocality_level_1',
      'sublocality_level_2',
      'sublocality_level_3',
      'sublocality_level_4'
    ],
    country: ['country']
  };

  const address = {
    addressLine2: '',
    pincode: '',
    state: '',
    city: '',
    country: '',
    coords: {
      lat: geometry.location.lat(),
      long: geometry.location.lng(),
    },
  };
  addressComponents.forEach(component => {
    // eslint-disable-next-line no-restricted-syntax
    for (const shouldBe in shouldBeComponent) {
      if (shouldBeComponent[shouldBe].indexOf(component.types[0]) !== -1) {
        if (shouldBe === 'country') {
          address[shouldBe] = component.short_name;
        } else {
          address[shouldBe] = component.long_name;
        }
      }
    }
  });
  return address;
}
