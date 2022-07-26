import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Drawer } from 'components/shared/Drawer';
import { SideDrawer } from 'components/shared/SideDrawer';
import { useDesktop } from 'contexts';
import { Search } from 'phoenix-components';
import { getCountries } from 'utils/countries';
import checkedIcon from 'assets/images/areasServed/checked.svg';
import { Button } from 'phoenix-components';
import { FooterButton } from 'components/common/FooterButton';
import styles from './CountryDrawer.module.css';

export function CountryDrawer({
  onSelect,
  onBack,
  multiSelect,
  countriesList,
  onSave,
  type,
}) {
  const isDesktop = useDesktop();

  const [query, setQuery] = useState('');

  const getFiltered = () => {
    if (query.length > 0) {
      return getCountries().filter(x => x.label.toLowerCase().indexOf(query.toLowerCase()) > -1);
    }
    return getCountries();
  };

  return (
    <>
      {!isDesktop
        && (
          <Drawer title="Select Country" onClose={onBack}>
            <div className={styles.drawer}>
              <div className={styles.search}>
                <Search
                  value={query}
                  placeholder="Search for Country"
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <div className={styles.label}>
                Choose Your Country
              </div>
              <div className={styles.section}>
                {getFiltered().map(x => (
                  <div
                    onClick={() => onSelect({
                      currrency: x.currency,
                      value:
                        (multiSelect ? x.countryName : x.countryName)
                    })}
                    className={styles.country}
                  >
                    {!multiSelect ? `${x.label} (${x.dial}) - ${x.currency}` : `${x.label}`}
                    {multiSelect && (type === 'included' ? countriesList.find(a => !!(a.name === x.countryName))
                      : countriesList.find(a => !!(a === x.countryName))) && (
                      <img src={checkedIcon} alt="checked" />
                    )}
                  </div>
                ))}
              </div>
              {multiSelect && (
                <FooterButton>
                  <Button
                    className={styles.button}
                    label="Save"
                    color="primary"
                    onClick={onSave}
                    fullWidth={true}
                    bordered={false}
                  />
                </FooterButton>
              )}
            </div>
          </Drawer>
        )}
      {isDesktop
        && (
          <SideDrawer
            onClose={onBack}
            closeButton={true}
          >
            <div className={styles.drawer}>
              <div className={styles.search}>
                <Search
                  value={query}
                  placeholder="Search for Country"
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <div className={styles.label1}>
                Choose Your Country
              </div>
              <div className={styles.section}>
                {getFiltered().map(x => (
                  <div
                    onClick={() => onSelect({
                      currrency: x.currency,
                      value:
                        (multiSelect ? x.countryName : x.countryName)
                    })}
                    className={styles.country}
                  >
                    {!multiSelect ? `${x.label} (${x.dial}) - ${x.currency}` : `${x.label}`}
                    {multiSelect && countriesList.find(a => !!(a.name === x.countryName)) && (
                      <img src={checkedIcon} alt="checked" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </SideDrawer>
        )}
    </>
  );
}

CountryDrawer.propTypes = {
  onSelect: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  multiSelect: PropTypes.bool,
  countriesList: PropTypes.array,
  onSave: PropTypes.func,
  type: PropTypes.string,
};

CountryDrawer.defaultProps = {
  multiSelect: false,
  countriesList: [],
  onSave: null,
  type: '',
};
