/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState } from 'react';
import { Avatar } from '@material-ui/core';
import cx from 'classnames';
import { isEmpty } from 'lodash';
import { Becca } from 'api/index';
import { useHistory } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import { Drawer } from 'components/shared/Drawer';
import { useToggle } from 'hooks/common';
import upload from 'assets/images/profile/upload.svg';
import { Loading } from 'components/shared/Loading';
import { getCountries } from 'utils/countries';
import chevron from 'assets/v2/onboarding/chevron.svg';
import SnackBar from 'services/snackbar';
import PropTypes from 'prop-types';
import blacky from 'assets/images/shop.svg';
import {
  Button, Clickable, ReactInput, Select
} from 'phoenix-components';
import { FooterButton } from 'components/common/FooterButton';
import { CountryDrawer } from 'components/common/CountryDrawer';
import { useCountryFromIP } from 'hooks/utils';
import { useCustomDomain, useIsOnCustomDomain, useUserRefresh } from 'contexts';
import Loader from 'services/loader';
import { useRefreshShop } from 'contexts';
import { useDesktop } from 'contexts';
import { SideDrawer } from 'components/shared/SideDrawer';
import styles from './Shop.module.css';

function Shop({ isStart }) {
  // const [category, setCategory] = useState([]);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [description, setDescription] = useState('');
  const [openCountryDrawer, toggleCountryDrawer] = useToggle(false);
  const [icon, setSrc] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [openDescription, toggleDescription] = useToggle(false);
  const [country, setCountry, currency, setCurrency] = useCountryFromIP('', '', isStart);
  const history = useHistory();
  const [openChangeUrl, toggleChangeUrl] = useToggle(false);
  const [showDummy, toggleDummy] = useState(false);
  const isCustomDomain = useIsOnCustomDomain();
  const domain = useCustomDomain();
  const isDesktop = useDesktop();

  useEffect(() => {
    toggleDummy(openDescription);
  }, [openDescription]);

  const regex = /(<([^>]+)>)/ig;
  const plainDescription = description?.replace(regex, '');

  const currencies = getCountries()
    .map(x => ({
      label: x.currency,
      value: x.currency
    }));

  const refreshUser = useUserRefresh();
  const refreshShop = useRefreshShop();

  // const status = defaultVal?.status;

  const handleEditorChange = (content) => {
    setDescription(content);
  };

  const validateSlug = (slg) => {
    let pattern = '^[a-z0-9_]{4,100}$';
    pattern = new RegExp(pattern);
    if (slg?.length < 4) {
      SnackBar.show('Shop URL cannot be less than 4 letters', 'error');
      return false;
    }
    if (slg !== slg.toLowerCase()) {
      SnackBar.show('Capital letters, Special characters not allowed', 'error');
      return false;
    }
    if (!pattern.test(slg)) {
      SnackBar.show('Shop url can have only lowercase alphabets, numbers and _ (underscore)', 'error');
      return false;
    }
    return true;
  };

  const throwShopErrors = () => {
    if (!name || !name?.length) {
      SnackBar.show('Shop name cannot be empty', 'error');
      return;
    }
    if (name.length <= 4) {
      SnackBar.show('Shop name cannot be less than 4 letters', 'error');
      return;
    }
    validateSlug(slug);
  };

  const submit = async (newIcon) => {
    try {
      const payload = {
        name,
        description,
        icon: isStart ? [] : newIcon || icon,
        slug,
        currency,
        country,
      };

      if (!name || name?.length === 0) {
        throwShopErrors();
        return;
      }
      if (country.length === 0) {
        SnackBar.show('Please select country', 'error');
        return;
      }
      let pattern = '^[a-z0-9_]{4,100}$';
      pattern = new RegExp(pattern);
      if (!pattern.test(slug)) {
        throwShopErrors();
        return;
      }
      let response = {};
      if (isNew) {
        response = await Becca.createShop(payload);
      } else {
        response = await Becca.updateShop(payload);
      }
      if (!isEmpty(response?.error)) {
        SnackBar.show(response?.error, 'error');
        return;
      }
      const successMsg = isNew ? 'Shop Created Successfully' : 'Shop Details Updated Successfully';
      SnackBar.show(successMsg);
      refreshUser();
      refreshShop();
      if (isStart) {
        history.go();
        return;
      }
      history.goBack();
    } catch (e) {
      console.log(e);
      const error = e?.response?.data?.message;
      if (error) {
        if (error.toLowerCase() === 'name already taken') {
          SnackBar.show('Shop URL already taken, try a different one.', 'error');
          return;
        }
        SnackBar.show(error, 'error');
        return;
      }
      SnackBar.showError(e);
    }
  };

  useEffect(() => {
    Becca.getShop()
      .then(x => {
        if (x?.response?.status === 404) {
          return;
        }
        setName(x.name);
        setSlug(x.slug);
        setCountry(x?.country?.toLowerCase() || '');
        setCurrency(x.currency);
        setDescription(x.description || '');
        setSrc(x.icon && x.icon[0] ? x.icon[0] : '');
        setIsNew(false);
      })
      .catch((e) => {
        console.error(e);
        setIsNew(true);
      });
  }, []);

  const uploadAsset = async (e) => {
    try {
      const files = e?.target?.files;
      const file = files && files[0];
      const payload = new FormData();
      payload.append('name', file.name);
      payload.append('purpose', 'shop');
      payload.append('type', 'image');
      payload.append('file', file);
      const { url } = await Becca.uploadAsset(payload);
      setSrc([url]);
      SnackBar.show('upload success');
    } catch (e) {
      SnackBar.show('upload failed', 'error');
    }
  };

  const updateSlug = async () => {
    if (!validateSlug(newSlug)) {
      return;
    }
    try {
      Loader.show();
      await Becca.changeUrl(newSlug);
      toggleChangeUrl();
      SnackBar.show('url updated successfully', 'success');
      document.location.reload();
    } catch (e) {
      const error = e?.response?.data?.message;
      if (error) {
        if (error.toLowerCase() === 'name already taken') {
          SnackBar.show('Shop URL already taken, try a different one.', 'error');
          return;
        }
      }
      SnackBar.showError(e);
    } finally {
      Loader.hide();
    }
  };

  const onShopNameChange = () => (name) => {
    setName(name);
  };

  const onCountryChange = ({
    value,
    currrency
  }) => {
    setCountry(value);
    setCurrency(currrency);
    toggleCountryDrawer();
  };

  return (
    <div className={styles.shopSection}>
      {showDummy && <Loading />}
      {!isDesktop && openChangeUrl && (
        <Drawer
          title="Shop URL"
          closeButton={true}
          onClose={() => {
            toggleChangeUrl();
            updateSlug();
          }}
        >
          <div className={styles.editBox}>
            <div className={styles.editUrlHeading}>
              Edit Shop URL
            </div>
            <ReactInput
              placeholder="Enter your URL"
              startLabel="mywindo.shop/"
              value={newSlug}
              labelClass={styles.bottom}
              setValue={setNewSlug}
            />
            {/* <div className={styles.updateUrl}>
              <Button size="large" label="Update" onClick={updateSlug} />
            </div> */}
            <div className={styles.connectDomain}>
              Do you want to connect your own
              {' '}
              <Clickable className={styles.greenLink} onClick={() => history.push('/manage/domain')}>
                Domain?
              </Clickable>
            </div>
            <div className={cx(styles.actionBtn, 'flexCenter')}>
              <Button
                fullWidth
                bordered={false}
                onClick={() => {
                  updateSlug();
                }}
                size="large"
                label="Save"
              />
            </div>
          </div>
        </Drawer>
      )}
      {isDesktop && openChangeUrl && (
        <SideDrawer
          backButton={true}
          title="Shop URL"
          onClose={toggleChangeUrl}
        >
          <div className={styles.editBox}>
            <div className={styles.editUrlHeading}>
              Edit Shop URL
            </div>
            <div className={styles.inputB}>
              <ReactInput
                placeholder="Enter your URL"
                startLabel="mywindo.shop/"
                value={newSlug}
                labelClass={styles.bottom}
                setValue={setNewSlug}
              />
            </div>
            <div className={styles.updateUrl}>
              <Button size="medium" label="Update" onClick={updateSlug} />
            </div>
            <div className={styles.connectDomain}>
              Do you want to connect your own
              {' '}
              <Clickable className={styles.greenLink} onClick={() => history.push('/manage/domain')}>
                Domain?
              </Clickable>
            </div>
          </div>
        </SideDrawer>
      )}
      {isDesktop && openDescription && (
        <SideDrawer
          backButton={true}
          button={true}
          onClick={toggleDescription}
          title="Shop Description"
          onClose={toggleDescription}
        >
          <div className={styles.desktopEditor}>
            <Editor
              value={description}
              apiKey="jk7y6v6dbe2h16qh13q5klle5sz76ddgevc6ph3v1sa4bgu1"
              onInit={() => {
                toggleDummy(false);
              }}
              init={{
                menubar: false,
                toolbar: false,
                height: '75vh',
                width: '100%',
                placeholder: 'Tell us what makes your shop unique',
                statusbar: false,
                branding: false,
                selector: 'textarea', // change this value according to your HTML
                paste_data_images: true,
                plugins: [
                  'paste'
                ],
              }}
              onEditorChange={handleEditorChange}
            />
          </div>
          {/* <div className={cx(styles.actionBtn, 'flexCenter')}>
            <Button
              onClick={toggleDescription}
              size="large"
              label="Save"
            />
          </div> */}
        </SideDrawer>
      )}
      {!isDesktop && isStart === false && (
        <Drawer onBack={() => history.goBack()} title="Profile">
          <div className={isDesktop ? null : styles.padd}>
            <div className={isDesktop ? styles.desktopContainer : null}>
              <div className={cx('textCenter flexCenter relative')}>
                <input
                  accept="image/*"
                  hidden
                  id="icon-button-file"
                  type="file"
                  onChange={(e) => {
                    uploadAsset(e);
                  }} />
                <label htmlFor="icon-button-file">
                  <img src={icon || blacky} className={cx(styles.avatar)} alt="shop icon" />
                  <img
                    alt=""
                    className={styles.upload}
                    src={upload}
                  />
                </label>
              </div>
              {!isDesktop && openDescription && (
                <Drawer
                  onClose={toggleDescription}
                  closeButton
                  title="Shop Description"
                >
                  <div className={styles.rte}>
                    <Editor
                      value={description}
                      apiKey="jk7y6v6dbe2h16qh13q5klle5sz76ddgevc6ph3v1sa4bgu1"
                      onInit={() => {
                        toggleDummy(false);
                      }}
                      init={{
                        menubar: false,
                        toolbar: false,
                        height: '40vh',
                        width: 'calc(100vw - 20px)',
                        placeholder: 'Tell us what makes your shop unique',
                        statusbar: false,
                        branding: false,
                        selector: 'textarea', // change this value according to your HTML
                        paste_data_images: true,
                        plugins: [
                          'paste'
                        ],
                      }}
                      onEditorChange={handleEditorChange}
                    />
                  </div>
                  <FooterButton>
                    <Button
                      fullWidth
                      bordered={false}
                      onClick={toggleDescription}
                      size="large"
                      label="Save"
                    />
                  </FooterButton>
                </Drawer>
              ) }
              {!isDesktop && isStart
        && (
          <div className={cx('textCenter flexCenter')}>
            <Avatar
              className={cx('avatar', 'textCenter', 'flexCenter', styles.avatar)}
              variant="rounded"
              alt="Remy Sharp"
              src={blacky}
            />
          </div>
        )}
              <div className={cx(styles.top)}>
                <ReactInput
                  label="Shop Name"
                  inputClass={styles.height}
                  placeholder="e.g. brilliant boutique"
                  setValue={onShopNameChange()}
                  value={name}
                />
              </div>
              {!(isCustomDomain && domain) && (
                <>
                  <div className={styles.label}>Shop URL</div>
                  <div className={cx(styles.bottom)}>
                    <ReactInput
                      placeholder="Enter your URL"
                      startLabel="mywindo.shop/"
                      startLabelClass={styles.labelStart}
                      value={slug}
                      inputClass={styles.height}
                      labelClass={styles.bottom2}
                      setValue={() => {
                      }}
                    />
                    <div className={styles.changeUrlText}>
                      Want to change your shop URL?
                      {' '}
                      <Clickable
                        onClick={() => {
                          setNewSlug(slug);
                          toggleChangeUrl();
                        }}
                        className={styles.greenLink}>
                        Click Here
                      </Clickable>
                    </div>
                  </div>
                </>
              )}
              <div id="slugField" className={cx(isDesktop ? styles.desktopMarginTop : null, 'flexCenter')}>
                <div className={styles.left}>
                  {openCountryDrawer && (
                    <CountryDrawer onSelect={onCountryChange} onBack={toggleCountryDrawer} />
                  )}
                  <Clickable
                    className={styles.countrySelect}
                    onClick={() => {
                    }}
                  >
                    <div className={styles.cLabel}>
                      Select Country
                    </div>
                    <div className={styles.cValue}>
                      <div className={styles.ellipsis}>
                        {country.toLowerCase() === 'usa' ? 'USA' : country}
                      </div>
                      <img src={chevron} alt="" />
                    </div>
                  </Clickable>
                </div>
                <div className={styles.right}>
                  <Select
                    disabled={true}
                    options={currencies}
                    label="Currency"
                    value={currencies.find(c => c.value === currency)}
                    isDisabled={true}
                    styles={styles.select}
                  />
                </div>
              </div>
              <Clickable onClick={toggleDescription} className={styles.descriptionContainer}>
                <div className={styles.descriptionHeading}>Shop Description</div>
                {plainDescription?.length > 0 ? (
                  <div className={styles.descriptionText}>
                    <span dangerouslySetInnerHTML={{ __html: plainDescription.slice(0, 45) }}></span>
                    {plainDescription.length > 45 && (
                      <span className={styles.descriptionLink}>more...</span>
                    )}
                  </div>
                ) : (
                  <div className={styles.descriptionPlaceholder}>Tell us what makes your shop unique</div>
                )}
              </Clickable>
            </div>
            <div className={styles.actionBtn}>
              <Button
                bordered={false}
                fullWidth
                onClick={() => submit(null)}
                size="large"
                label="Update"
              />
            </div>
          </div>
        </Drawer>
      )}
      {isDesktop && (
        <>
          <div className={cx(styles.top)}>
            <ReactInput
              label="Shop Name"
              inputClass={styles.height}
              placeholder="e.g. brilliant boutique"
              setValue={onShopNameChange()}
              value={name}
            />
          </div>
          {!(isCustomDomain && domain) && (
            <>
              <div className={styles.label}>Shop URL</div>
              <div className={cx(styles.bottom)}>
                <ReactInput
                  placeholder="Enter your URL"
                  startLabel="mywindo.shop/"
                  startLabelClass={styles.labelStart}
                  value={slug}
                  inputClass={styles.height}
                  labelClass={styles.bottom2}
                  setValue={() => {
                  }}
                />
                <div className={styles.changeUrlText}>
                  Want to change your shop URL?
                  {' '}
                  <Clickable
                    onClick={() => {
                      setNewSlug(slug);
                      toggleChangeUrl();
                    }}
                    className={styles.greenLink}>
                    Click Here
                  </Clickable>
                </div>
              </div>
            </>
          )}
          <div id="slugField" className={cx(isDesktop ? styles.desktopMarginTop : null, 'flexCenter')}>
            <div className={styles.left}>
              {openCountryDrawer && (
                <CountryDrawer onSelect={onCountryChange} onBack={toggleCountryDrawer} />
              )}
              <Clickable
                className={styles.countrySelect}
                onClick={() => {
                }}
              >
                <div className={styles.cLabel}>
                  Select Country
                </div>
                <div className={styles.cValue}>
                  <div className={styles.ellipsis}>
                    {country.toLowerCase() === 'usa' ? 'USA' : country}
                  </div>
                  <img src={chevron} alt="" />
                </div>
              </Clickable>
            </div>
            <div className={styles.right}>
              <Select
                disabled={true}
                options={currencies}
                label="Currency"
                value={currencies.find(c => c.value === currency)}
                isDisabled={true}
                styles={styles.select}
              />
            </div>
          </div>
          <Clickable onClick={toggleDescription} className={styles.descriptionContainer}>
            <div className={styles.descriptionHeading}>Shop Description</div>
            {plainDescription?.length > 0 ? (
              <div className={styles.descriptionText}>
                <span dangerouslySetInnerHTML={{ __html: plainDescription.slice(0, 90) }}></span>
                {plainDescription.length > 90 && (
                  <span className={styles.descriptionLink}>more...</span>
                )}
              </div>
            ) : (
              <div className={styles.descriptionPlaceholder}>Tell us what makes your shop unique</div>
            )}
          </Clickable>
          <div className={styles.action}>
            <Button
              bordered={true}
              onClick={() => submit(null)}
              size="large"
              fullWidth
              label="Update"
            />
          </div>
        </>
      )}

    </div>
  );
}

Shop.propTypes = {
  isStart: PropTypes.bool.isRequired,
};

export default Shop;
