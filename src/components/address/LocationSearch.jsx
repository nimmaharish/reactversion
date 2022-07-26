import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { ReactInput } from 'phoenix-components';
import SnackBar from 'services/snackbar';
import Loader from 'services/loader';
import Gmaps from 'services/gmaps';
import { countryMap, inverseCountryMap } from 'utils/countries';
import { useShop, useUser } from 'contexts';
import _ from 'lodash';
import searchIcon from 'assets/images/address/search.svg';
import styles from './LocationSearch.module.css';

export function LocationSearch({ onSelect }) {
  const shop = useShop();
  const profile = useUser();
  const [places, setPlaces] = useState([]);
  const [token, setToken] = useState(undefined);

  useEffect(() => {
    (async () => {
      setToken(await Gmaps.getSessionToken());
    })();
  }, []);

  const onSearch = _.debounce(async (value) => {
    if (value.length <= 3) {
      return;
    }
    try {
      const data = await Gmaps.autoSuggest(value, inverseCountryMap[shop.country], token);
      setPlaces(data);
    } catch (e) {
      SnackBar.showError(e);
    }
  }, 500);

  const onPlaceSelect = async (place) => {
    Loader.show();
    try {
      const address = await Gmaps.getPlaceAddress(place.place_id, token);
      if (countryMap[address.country] !== shop.country) {
        throw new Error(`select address is not in ${shop.country}.`);
      }
      onSelect(place, {
        ...address,
        nick: 'home',
        addressLine1: '',
        name: profile.name,
        phone: profile.phone,
      });
    } catch (e) {
      SnackBar.showError(e);
    } finally {
      Loader.hide();
    }
  };

  return (
    <>
      <div className={styles.container}>
        <ReactInput
          startIcon={searchIcon}
          labelClass={styles.inputClass}
          placeholder="Enter Location"
          setValue={e => {
            onSearch(e);
          }}
        />
      </div>
      <br />
      {places.length > 0 && (
        <div>
          <div className={styles.title}>Select Nearby Location</div>
          <div className={styles.places}>
            {places.map(place => (
              <div onClick={() => onPlaceSelect(place)} className={styles.place} key={place.place_id}>
                <div className={styles.placeAddress}>
                  {place.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

LocationSearch.propTypes = {
  onSelect: PropTypes.func.isRequired,
};

LocationSearch.defaultProps = {};
