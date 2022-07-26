import React, { useState } from 'react';
import { Drawer } from 'components/shared/Drawer';
import PropTypes from 'prop-types';
import { LocationSearch } from 'components/address/LocationSearch';
import { Map } from 'components/address/Map';
import { Grid } from '@material-ui/core';
import { useRefreshShop, useShop } from 'contexts';
import HomeIcon from '@material-ui/icons/Home';
import OthersIcon from '@material-ui/icons/AddToPhotos';
import OfficeIcon from '@material-ui/icons/BusinessCenter';
import { getChipNameForNick } from 'components/address/utils';
import cx from 'classnames';
import { useToggle } from 'hooks/common';
import SnackBar from 'services/snackbar';
import Loader from 'services/loader';
import { Button, ReactInput } from 'phoenix-components';
import { Becca } from 'api';
import { useLocation, useHistory } from 'react-router-dom';
import { FooterButton } from 'components/common/FooterButton';
import EventManager from 'utils/events';
import { useDesktop } from 'contexts';
import { SideDrawer } from 'components/shared/SideDrawer';
import styles from './Form.module.css';

function Form({
  onClose,
  address: initial
}) {
  const shop = useShop();
  const refreshShop = useRefreshShop();
  const edit = !!initial?._id;
  const [openPlace, toggleOpenPlace] = useToggle(!edit);
  const [address, setAddress] = useState(initial);
  const [place, setPlace] = useState(null);
  const location = useLocation();
  const history = useHistory();
  const isDesktop = useDesktop();

  const setNick = (nick) => () => {
    setAddress({
      ...address,
      nick,
    });
  };

  const onSave = async () => {
    Loader.show();
    try {
      if (edit) {
        await Becca.updateAddress(address._id, address);
      } else {
        await Becca.addAddress(address);
        EventManager.emitEvent('address_added');
      }
      refreshShop();
      if (location?.state?.redirectTo) {
        history.replace(location.state.redirectTo);
        return;
      }
      onClose();
    } catch (e) {
      SnackBar.showError(e);
    } finally {
      Loader.hide();
    }
  };

  const setAddressValue = key => e => {
    setAddress({
      ...address,
      [key]: e,
    });
  };

  const onSelect = (place, addr) => {
    setPlace(place);
    setAddress({
      ...(address || {}),
      ...addr,
    });
    toggleOpenPlace();
  };

  const nick = address?.nick?.length >= 0 ? getChipNameForNick(address?.nick) : null;

  const addressLine = place && place?.description
    ? place.description
    : `${address?.addressLine2 || ''} ${address?.city || ''} ${address?.state || ''}`;

  const showErr = address?.addressLine1?.length < 10;

  if (isDesktop) {
    return (
      <SideDrawer
        backButton={true}
        onClick={onSave}
        onClose={onClose}
        title="Add New Address"
      >
        {address && !openPlace && (
          <div className={styles.container}>
            <div>
              <div className={styles.title}>Address Information</div>
              <Map place={address} />
              <div className={styles.formContainer}>
                <ReactInput
                  value={addressLine || 'Change Location'}
                  label="Location"
                  setValue={toggleOpenPlace}
                />
                <ReactInput
                  required
                  value={address?.addressLine1 || ''}
                  label="Door No / Building Name / Flat no"
                  errorInputClass={showErr ? styles.errorInput : ''}
                  errorTextClass={showErr ? styles.errorText : ''}
                  helperText={showErr ? 'Minimum 10 characters' : ''}
                  placeholder="e.g. 201, Maple Tree Suites"
                  setValue={setAddressValue('addressLine1')}
                />
                <ReactInput
                  required
                  value={address?.addressLine2 || ''}
                  label="Area / Locality / Street"
                  placeholder="e.g. Westwood Avenue, Sherman Oaks"
                  setValue={setAddressValue('addressLine2')}
                />
                <div className="flexBetween">
                  <div className={styles.customInput}>
                    <ReactInput
                      required
                      type="number"
                      value={address.pincode}
                      label="Pincode / Zip Code"
                      placeholder="Enter Pincode / Zip Code"
                      setValue={setAddressValue('pincode')}
                    />
                  </div>
                  <div className={styles.customInput}>
                    <ReactInput
                      readonly={true}
                      value={shop.country === 'india' ? 'India' : shop.country}
                      label="Country"
                      disabled
                      placeholder="Country Name"
                      setValue={() => {}}
                    />
                  </div>
                </div>
                <div className="flexBetween">
                  <div className={styles.customInput}>
                    <ReactInput
                      required
                      value={address?.state || ''}
                      label="State"
                      placeholder="Enter State"
                      setValue={setAddressValue('state')}
                    />
                  </div>
                  <div className={styles.customInput}>
                    <ReactInput
                      required
                      value={address?.city || ''}
                      label="City"
                      placeholder="Enter City"
                      setValue={setAddressValue('city')}
                    />
                  </div>
                </div>
                <ReactInput
                  value={address?.name || ''}
                  label="Full Name"
                  placeholder="Enter name"
                  setValue={setAddressValue('name')}
                />
                <ReactInput
                  type="number"
                  value={address?.phone || ''}
                  label="Phone Number"
                  placeholder="Enter Phone Number"
                  setValue={setAddressValue('phone')}
                  helperText={showErr ? 'Phone Number is Required' : ''}
                />
                <ReactInput
                  value={address?.landmark || ''}
                  label="Landmark (optional)"
                  placeholder="Enter Landmark"
                  setValue={setAddressValue('landmark')}
                />
                <div className={styles.title1}>Save address type</div>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <Grid container spacing={1}>
                      <Grid item xs={4}>
                        <div
                          onClick={setNick('Home')}
                          className={cx(styles.chip, { [styles.selected]: nick === 'Home' })}>
                          <HomeIcon />
                          <span>Home</span>
                        </div>
                      </Grid>
                      <Grid item xs={4}>
                        <div
                          onClick={setNick('Shop')}
                          className={cx(styles.chip, { [styles.selected]: nick === 'Shop' })}>
                          <OfficeIcon />
                          <span>Shop</span>
                        </div>
                      </Grid>
                      <Grid item xs={4}>
                        <div
                          onClick={setNick('Warehouse')}
                          className={cx(styles.chip, { [styles.selected]: nick === 'Warehouse' })}>
                          <OfficeIcon />
                          <span>Warehouse</span>
                        </div>
                      </Grid>
                      <Grid item xs={4}>
                        <div
                          onClick={setNick('')}
                          className={cx(styles.chip, { [styles.selected]: nick === 'Others' })}>
                          <OthersIcon />
                          <span>Others</span>
                        </div>
                      </Grid>
                    </Grid>
                  </Grid>
                  {nick === 'Others' && (
                    <ReactInput
                      required={true}
                      value={address?.nick || ''}
                      label="Save address type"
                      placeholder="Enter address type"
                      setValue={setAddressValue('nick')}
                    />
                  )}
                </Grid>
              </div>
            </div>
            <div className={styles.buttonD}>
              <Button
                label={edit ? 'Update' : 'Save'}
                size="large"
                onClick={onSave}
              />
            </div>
          </div>
        )}
        {openPlace && (
          <LocationSearch onSelect={onSelect} />
        )}
      </SideDrawer>
    );
  }

  return (
    <Drawer
      title="Shop Address"
      containerClass={styles.containerClass}
      topBarClass={styles.containerClass}
      onClose={onClose}
    >
      {address && !openPlace && (
        <div className={styles.container}>
          <div className={styles.container1}>
            <div className={styles.title}>Address Information</div>
            <Map place={address} />
            <div className={styles.formContainer}>
              <ReactInput
                value={addressLine || 'Change Location'}
                label="Location"
                setValue={toggleOpenPlace}
              />
              <ReactInput
                required
                value={address?.addressLine1 || ''}
                label="Door No / Building Name / Flat no"
                errorInputClass={showErr ? styles.errorInput : ''}
                errorTextClass={showErr ? styles.errorText : ''}
                helperText={showErr ? 'Minimum 10 characters' : ''}
                placeholder="e.g. 201, Maple Tree Suites"
                setValue={setAddressValue('addressLine1')}
              />
              <ReactInput
                required
                value={address?.addressLine2 || ''}
                label="Area / Locality / Street"
                placeholder="e.g. Westwood Avenue, Sherman Oaks"
                setValue={setAddressValue('addressLine2')}
              />
              <div className="flexBetween">
                <div className={styles.customInput}>
                  <ReactInput
                    required
                    type="number"
                    value={address.pincode}
                    label="Pincode / Zip Code"
                    placeholder="Enter Pincode / Zip Code"
                    setValue={setAddressValue('pincode')}
                  />
                </div>
                <div className={styles.customInput}>
                  <ReactInput
                    readonly={true}
                    value={shop.country === 'india' ? 'India' : shop.country}
                    label="Country"
                    disabled
                    placeholder="Country Name"
                    setValue={() => {}}
                  />
                </div>
              </div>
              <div className="flexBetween">
                <div className={styles.customInput}>
                  <ReactInput
                    required
                    value={address?.state || ''}
                    label="State"
                    placeholder="Enter State"
                    setValue={setAddressValue('state')}
                  />
                </div>
                <div className={styles.customInput}>
                  <ReactInput
                    required
                    value={address?.city || ''}
                    label="City"
                    placeholder="Enter City"
                    setValue={setAddressValue('city')}
                  />
                </div>
              </div>
              <ReactInput
                value={address?.name || ''}
                label="Full Name"
                placeholder="Enter name"
                setValue={setAddressValue('name')}
              />
              <ReactInput
                type="number"
                value={address?.phone || ''}
                label="Phone Number"
                placeholder="Enter Phone Number"
                setValue={setAddressValue('phone')}
              />
              <ReactInput
                value={address?.landmark || ''}
                label="Landmark (optional)"
                placeholder="Enter Landmark"
                setValue={setAddressValue('landmark')}
              />
              <div className={styles.title1}>Save address type</div>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Grid container spacing={1}>
                    <Grid item xs={4}>
                      <div
                        onClick={setNick('Home')}
                        className={cx(styles.chip, { [styles.selected]: nick === 'Home' })}>
                        <HomeIcon />
                        <span>Home</span>
                      </div>
                    </Grid>
                    <Grid item xs={4}>
                      <div
                        onClick={setNick('Shop')}
                        className={cx(styles.chip, { [styles.selected]: nick === 'Shop' })}>
                        <OfficeIcon />
                        <span>Shop</span>
                      </div>
                    </Grid>
                    <Grid item xs={4}>
                      <div
                        onClick={setNick('Warehouse')}
                        className={cx(styles.chip, { [styles.selected]: nick === 'Warehouse' })}>
                        <OfficeIcon />
                        <span>Warehouse</span>
                      </div>
                    </Grid>
                    <Grid item xs={4}>
                      <div
                        onClick={setNick('')}
                        className={cx(styles.chip, { [styles.selected]: nick === 'Others' })}>
                        <OthersIcon />
                        <span>Others</span>
                      </div>
                    </Grid>
                  </Grid>
                </Grid>
                {nick === 'Others' && (
                  <ReactInput
                    required={true}
                    value={address?.nick || ''}
                    label="Save address type"
                    placeholder="Enter address type"
                    setValue={setAddressValue('nick')}
                  />
                )}
              </Grid>
            </div>
          </div>
          <FooterButton>
            <Button
              fullWidth
              bordered={false}
              label={edit ? 'Update' : 'Save'}
              size="large"
              // style={styles.button}
              onClick={onSave}
            />
          </FooterButton>
        </div>
      )}
      {openPlace && (
        <LocationSearch onSelect={onSelect} />
      )}
    </Drawer>
  );
}

Form.propTypes = {
  onClose: PropTypes.func.isRequired,
  address: PropTypes.object,
};

Form.defaultProps = {
  address: null,
};

export default Form;
