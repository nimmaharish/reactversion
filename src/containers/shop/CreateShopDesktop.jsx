import React, { useState } from 'react';
import createYourShopIcon from 'assets/v2/onboarding/createYourShopDesk.svg';
import chevron from 'assets/v2/onboarding/chevronDown.svg';
import {
  ReactInput, Select, Button, Clickable
} from 'phoenix-components';
import * as Yup from 'yup';
import {
  Grid,
} from '@material-ui/core';
import SnackBar from 'services/snackbar';
import { useToggle } from 'hooks/common';
import { getCountries } from 'utils/countries';
import EventManager from 'utils/events';
import { useCountryFromIP } from 'hooks/utils';
import { CountryDrawer } from 'components/common/CountryDrawer';
import { Becca } from 'api';
import { useLanguage, useSetLanguage } from 'contexts';
import { ALL_LANGUAGES } from 'components/global/translateUtils';
import { useHistory } from 'react-router-dom';
import styles from './CreateShopDesktop.module.css';

const schema = Yup.object().shape({
  name: Yup.string().required().label('shop name'),
  slug: Yup.string().required().min(4).label('shop url'),
  country: Yup.string().required().label('country'),
});

const currencies = getCountries().map(x => ({ label: x.currency, value: x.currency }));

function CreateShop() {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [errors, setErrors] = useState({});
  const language = useLanguage();
  const [storeLang, setStoreLang] = useState(language || 'en');
  const storeSelected = ALL_LANGUAGES.find(x => x.value === storeLang);
  const [subscribe] = useToggle(true);
  const setLanguage = useSetLanguage();
  const [openCountryDrawer, toggleCountryDrawer] = useToggle(false);
  const [country, setCountry, currency, setCurrency] = useCountryFromIP('', '', true);
  const history = useHistory();

  const createShop = async () => {
    try {
      setErrors({});
      const obj = {
        name, slug, country, currency, tos: { whatsapp: { subscribed: subscribe } }
      };
      await schema.validate(obj, {
        abortEarly: false
      });
      if (!obj.config) {
        obj.config = {};
      }
      obj.config.lang = storeLang;
      await Becca.createShop(obj);
      EventManager.emitEvent('shop_created', {
        name, slug, country,
      });
      setLanguage(storeLang);
      history.go();
    } catch (e) {
      if (e.name === 'ValidationError') {
        setErrors(e.inner.reduce((acc, err) => {
          acc[err.path] = err.message;
          return acc;
        }, {}));
        return;
      }
      const error = e?.response?.data?.message;
      if (error) {
        if (error.toLowerCase() === 'shop url already taken') {
          setErrors({ slug: 'URL already exists' });
          SnackBar.show('URL already exists', 'error');
          return;
        }
        SnackBar.show(error, 'error');
        return;
      }
      SnackBar.show('shop creation failed', 'error');
    }
  };

  const onShopNameChange = () => (name) => {
    const slug = name.replace(/[^A-Za-z0-9_]/g, '')
      .replace(/_+/g, '').toLowerCase();
    setName(name);
    setSlug(slug);
  };

  const onSetSlug = () => (slug) => {
    setSlug(slug.toLowerCase());
  };

  const onCountryChange = ({ value, currrency }) => {
    setCountry(value);
    setCurrency(currrency);
    toggleCountryDrawer();
  };
  const onCurrencyChange = (currrency) => {
    setCurrency(currrency.value);
  };

  return (
    <div className={styles.container}>
      <Grid item xs={6} className={styles.leftGrid}>
        <div className={styles.containerItems}>
          <img src={createYourShopIcon} alt="" />
          <div className={styles.containerText}>
          </div>
        </div>
      </Grid>
      <Grid item xs={6} className={styles.rightGrid}>
        <div className={styles.drawer}>
          <div className={styles.header}>
            Create Your Shop
          </div>
          <div className={styles.overflow}>
            <ReactInput
              label="Enter Shop Name"
              placeholder="e.g. brilliant boutique"
              setValue={onShopNameChange()}
              value={name}
            />
            {errors?.name && (<div className={styles.error}>{errors.name}</div>)}
            <div className={styles.shopUrl}>Shop URL</div>
            <ReactInput
              placeholder="e.g. brilliantboutique"
              startLabel="mywindo.shop/"
              value={slug}
              setValue={onSetSlug()}
            />
            {errors?.slug && (<div className={styles.error}>{errors.slug}</div>)}
            <div className={styles.helperText}>
              {/* You can always connect your custom domain later */}
              Create your custom shop link to share shop and products with your customer
            </div>
            <div className={styles.country}>
              {openCountryDrawer && (
                <CountryDrawer onSelect={onCountryChange} onBack={toggleCountryDrawer} />
              )}
              <div>
                <Clickable
                  className={styles.countrySelect}
                  onClick={toggleCountryDrawer}
                >
                  <div className={styles.cLabel}>
                    Select Country
                  </div>
                  <div className={styles.cValue}>
                    <div className={styles.ellipsis}>
                      {country.toLowerCase() === 'usa' ? 'USA' : country }
                    </div>
                    <img src={chevron} alt="" />
                  </div>
                  {/* <Select
                        options={countries}
                        label="Select Country"
                        disabled
                        onChange={onCountryChange}
                        value={countries.find(c => c.value === country)}
                      /> */}
                </Clickable>
                {errors?.country && (<div className={styles.error}>{errors.country}</div>)}
              </div>
              <div>
                <Select
                  options={currencies}
                  label="Currency"
                  value={currencies.find(c => c.value === currency)}
                  onChange={(e) => onCurrencyChange(e)}
                  isDisabled={false}
                />
              </div>
            </div>
            <div translate="no">
              <Select
                options={ALL_LANGUAGES}
                label="Select Language"
                onChange={(val) => setStoreLang(val.value)}
                value={storeSelected}
              />
              <div className={styles.helperTextD}>
                You can always change your language later in settings
              </div>
            </div>
            {/* <ReactInput
              startLabelMain="Phone"
              startLabel={getLabel()}
              placeholder="Phone number"
              value={phone}
              setValue={(e) => {
                setPhone(e);
              }}
            /> */}
            {/* {errors?.phone && (<div className={styles.error}>{errors.phone}</div>)} */}
            {/* {!showCode && (
              <Clickable className={styles.code} onClick={toggleCode}>
                Have Referral code?
              </Clickable>
            )}
            {showCode && (
              <div className={styles.referralCode}>
                <ReactInput
                  label="Referral Code"
                  placeholder="e.g. 23ABCD"
                  value={referralCode}
                  setValue={setReferralCode}
                />
              </div>
            )}
            {errors?.referralCode && (<div className={styles.error}>{errors.referralCode}</div>)} */}
            {/* <div className={styles.card}>
              <img src={waIcon} alt="" />
              <div className={styles.cardLabel}>
                Opt in for Whatsapp updates
              </div>
              <Switch2
                active={subscribe}
                onChange={setSubscribe}
                value={subscribe}
              />
            </div> */}
          </div>
          <Button
            className={styles.submitButton}
            size="large"
            label="Create Shop"
            onClick={createShop}
          />
        </div>
      </Grid>
    </div>
  );
}

CreateShop.propTypes = {};

CreateShop.defaultProps = {};

export default CreateShop;
