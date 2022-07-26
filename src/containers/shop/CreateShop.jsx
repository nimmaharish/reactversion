import React, { useState } from 'react';
import shopIcon from 'assets/v2/onboarding/shop.svg';
// import waIcon from 'assets/v2/onboarding/wa.svg';
import chevron from 'assets/v2/onboarding/chevron.svg';
import {
  ReactInput, Select, Button, Clickable
} from 'phoenix-components';
import { useToggle } from 'hooks/common';
import * as Yup from 'yup';
import SnackBar from 'services/snackbar';
import { FooterButton } from 'components/common/FooterButton';
import { getCountries } from 'utils/countries';
import { useCountryFromIP } from 'hooks/utils';
import { Becca } from 'api';
import { useDesktop, useLanguage, useSetLanguage } from 'contexts';
import { ALL_LANGUAGES } from 'components/global/translateUtils';
import { CountryDrawer } from 'components/common/CountryDrawer';
import { useHistory } from 'react-router-dom';
import EventManager from 'utils/events';
import styles from './CreateShop.module.css';
import CreateShopDesktop from './CreateShopDesktop.jsx';

const schema = Yup.object().shape({
  name: Yup.string().required().label('shop name'),
  slug: Yup.string().required().min(4).label('shop url'),
  country: Yup.string().required().label('country'),
});

const currencies = getCountries().map(x => ({ label: x.currency, value: x.currency }));

function CreateShop() {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  // const [referralCode, setReferralCode] = useState('');
  const [errors, setErrors] = useState({});
  // const [showCode, toggleCode] = useToggle(false);
  const language = useLanguage();
  const [storeLang, setStoreLang] = useState(language || 'en');
  const storeSelected = ALL_LANGUAGES.find(x => x.value === storeLang);
  const [subscribe] = useToggle(true);
  const [openCountryDrawer, toggleCountryDrawer] = useToggle(false);
  const [country, setCountry, currency, setCurrency] = useCountryFromIP('', '', true);
  const history = useHistory();
  const isDesktop = useDesktop();
  const setLanguage = useSetLanguage();

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
      {isDesktop && <CreateShopDesktop />}
      {!isDesktop
        && (
          <>
            <div className={styles.top}>
              <img src={shopIcon} alt="" />
              <div className={styles.heading}>
                Create Your Shop
              </div>
            </div>
            <div className={styles.drawer}>
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
                  You can always connect your custom domain later
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
                {/* <Clickable className={styles.code} onClick={toggleCode}>
                  Have Referral code?
                </Clickable>
                {showCode && (
                  <ReactInput
                    label="Referral Code"
                    placeholder="e.g. 23ABCD"
                    value={referralCode}
                    setValue={setReferralCode}
                  />
                )}
                {errors?.referralCode && (<div className={styles.error}>{errors.referralCode}</div>)} */}
              </div>
              <FooterButton>
                <Button
                  size="large"
                  label="Create Shop"
                  fullWidth
                  bordered={false}
                  onClick={createShop}
                />
              </FooterButton>
            </div>
          </>
        )}
    </div>
  );
}

export default CreateShop;
