import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import timelineIcon from 'assets/overview/timeline.svg';
import chargesIcon from 'assets/overview/charges.svg';
import partnersIcon from 'assets/overview/partners.svg';
import shippingModesIcon from 'assets/overview/shippingModes.svg';
import { Clickable } from 'phoenix-components';
import { useQueryParams } from 'hooks';
import {
  Grid, Button
} from '@material-ui/core';
import { Drawer } from 'components/shared/Drawer';
import Input from 'components/common/Input';
import { Becca } from 'api/index';
import Snackbar from 'services/snackbar';
import { get } from 'lodash';
import cx from 'classnames';
import {
  isIND,
  useShop,
} from 'contexts/userContext';
import Info from 'components/info/Info';
import Header from 'containers/products/Header';
import { allowedCountries } from 'constants/shop';
import areasServedIcon from 'assets/desktop/shipping/areasServed.svg';
import {
  useIsConditionalChargesEnabled
} from 'contexts/userContext';
import featureIcon from 'assets/desktop/feature.svg';
import Kbc from 'components/knowBaseCards/KnowBaseCards';
import styles from './Profile.module.css';

function ShippingDelivery() {
  const history = useHistory();
  const params = useQueryParams();
  const openDeliveryCharges = params.has('openDC');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [price, setPrice] = useState('');
  const [dc, setDc] = useState('0');
  const shoppe = useShop();
  const { currency } = shoppe;
  const isCountryEnabled = allowedCountries.includes(shoppe?.country?.toLowerCase());
  const isConditionalChargesEnabled = useIsConditionalChargesEnabled();

  const isInd = isIND();

  // eslint-disable-next-line react/no-multi-comp
  const getTile = (primary, icon, param, to, showFeature) => (
    <Clickable
      className={styles.tile}
      onClick={() => {
        if (param === 'openDC') {
          params.set(param, 'true');
          history.push({
            pathname: '/manage',
            search: 'openDC=true',
          });
          return;
        }
        if (param) {
          params.set(param, 'true');
          history.push({
            search: params.toString(),
          });
          return;
        }
        history.push(to);
      }}
    >
      {showFeature && <img className={styles.iconF} src={featureIcon} alt="" />}
      <div classes={{ root: styles.minW }}>
        <img
          alt=""
          src={icon}
        />
      </div>
      <div
        className={styles.tileText1}
      >
        {primary}
      </div>
    </Clickable>
  );

  return (
    <Drawer
      className={styles.section}
      title="Shipping And Delivery"
      onClose={() => history.push({
        pathname: '/manage',
      })}
    >
      {/* <div className={styles.navBar} onClick={() => { history.goBack(); }}>
        <img className={styles.icon3} src={backButtonIcon} alt="" />
      </div> */}
      <div id="scroll" className={styles.sdContent}>
        <div className={styles.shopSetting}>
          {isInd && (
            <Grid container spacing={1}>
              <Grid item xs={12} className={styles.grid}>
                {getTile('Shipping Timeline', timelineIcon, null, '/shipping/shippingTime')}
                {getTile('Delivery Charges', chargesIcon, null, '/manage/delivery')}
              </Grid>
              <Grid item xs={12} className={styles.grid}>
                {getTile('Shipping Modes', shippingModesIcon, null, '/manage/shippingModes')}
                {isCountryEnabled && getTile('Shipping Partners', partnersIcon, null, '/manage/shippingPartners')}
                {/* {getTile('Areas Served', servedIcon, null, '/shippingAndDelivery')} */}
              </Grid>
              <Grid item xs={12} className={styles.grid}>
                {/* {getTile('Shipping Partners', partnersIcon, null, '/shippingAndDelivery')} */}
                {getTile('Areas Served', areasServedIcon, null, '/manage/areasServed', !isConditionalChargesEnabled)}
                <Grid item xs={4}>
                </Grid>
              </Grid>
            </Grid>
          )}
          {!isInd && (
            <Grid container spacing={1}>
              <Grid item xs={12} className={styles.grid}>
                {getTile('Shipping Timeline', timelineIcon, null, '/shipping/shippingTime')}
                {getTile('Delivery Charges', chargesIcon, null, '/manage/delivery')}
                {getTile('Shipping Modes', shippingModesIcon, null, '/manage/shippingModes')}
              </Grid>
              <Grid item xs={12} className={styles.grid}>
                {isCountryEnabled && (
                  <Grid item xs={12} className="">
                    {getTile('Shipping Partners', partnersIcon, null, '/manage/shippingPartners')}
                  </Grid>
                )}
                {getTile('Areas Served', areasServedIcon, null, '/manage/areasServed', !isConditionalChargesEnabled)}
                <Grid item xs={12} className=""></Grid>
              </Grid>
            </Grid>
          )}
        </div>
        <div className={styles.kbc}>
          <Kbc type="shippingAndDelivery" />
        </div>
      </div>
      <Drawer
        PaperProps={{
          classes: {
            root: styles.paper,
          }
        }}
        anchor="bottom"
        open={openDeliveryCharges}
        onClose={() => history.goBack()}
      >
        <div className={styles.center_align}>
          <form
            Validate
            autoComplete="off"
            id="form"
            onSubmit={async (e) => {
              e.preventDefault();
              const payload = {
                from,
                to,
                dimensions: {
                  length,
                  width,
                  height
                },
                weight,
                price,
              };
              try {
                const { price } = await Becca.getCharges(payload);
                setDc(price);
              } catch (exception) {
                const msg = get(exception, 'response.data.message', 'unknown error');
                Snackbar.show(msg, 'error');
              }
            }}
            className={styles.form}
          >
            <Grid container spacing={2}>
              <Header onBack={() => history.goBack()} title="Calculate Delivery Charges" />
              <Grid item xs={6}>
                <Input
                  value={from}
                  type="tel"
                  placeholder="Type here..."
                  label="Enter  Pincode / Zipcode From"
                  setValue={(e) => setFrom(e)}
                  InputProps={{
                    classes: {
                      input: cx(styles.slug, styles.single),
                    },
                  }}
                  // https://github.com/mui-org/material-ui/issues/9046
                  // eslint-disable-next-line react/jsx-no-duplicate-props
                  // inputProps={{
                  //   pattern: '^[1-9][0-9]{5}$',
                  //   title: 'Enter valid pincode',
                  // }}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <Input
                  value={to}
                  type="tel"
                  placeholder="Type here..."
                  label="Enter Pincode / Zipcode To"
                  setValue={(e) => setTo(e)}
                  InputProps={{
                    classes: {
                      input: cx(styles.slug, styles.single),
                    },
                  }}
                  required
                />
              </Grid>
              <Grid item xs={4}>
                <Input
                  value={length}
                  type="number"
                  placeholder="Type here..."
                  label="Enter Box Length (cms)"
                  setValue={(e) => setLength(e)}
                  InputProps={{
                    classes: {
                      input: cx(styles.slug, styles.single),
                    },
                  }}
                  required
                />
              </Grid>
              <Grid item xs={4}>
                <Input
                  value={width}
                  type="number"
                  placeholder="Type here..."
                  label="Enter Box Width (cms)"
                  setValue={(e) => setWidth(e)}
                  InputProps={{
                    classes: {
                      input: cx(styles.slug, styles.single),
                    },
                  }}
                  required
                />
              </Grid>
              <Grid item xs={4}>
                <Input
                  value={height}
                  type="number"
                  placeholder="Type here..."
                  label="Enter Box Height (cms)"
                  setValue={(e) => setHeight(e)}
                  InputProps={{
                    classes: {
                      input: cx(styles.slug, styles.single),
                    },
                  }}
                  required
                />
              </Grid>
              <Grid item xs={4}>
                <Input
                  value={weight}
                  type="number"
                  placeholder="Type here..."
                  label="Enter Box Weight (gms)"
                  setValue={(e) => setWeight(e)}
                  InputProps={{
                    classes: {
                      input: cx(styles.slug, styles.single),
                    },
                  }}
                  required
                />
              </Grid>
              <Grid item xs={4}>
                <Input
                  value={price}
                  type="number"
                  placeholder="Type here..."
                  label="Enter Product Price"
                  setValue={(e) => setPrice(e)}
                  InputProps={{
                    classes: {
                      input: cx(styles.slug, styles.single),
                    },
                  }}
                  required
                />
              </Grid>
              <Grid item xs={12} className={styles.get_charges}>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  size="medium"
                  className={styles.rightS}
                >
                  {' '}
                  GET CHARGES
                  {' '}
                </Button>
              </Grid>
              {dc > 0 && (
                <>
                  <Grid item xs={12} className={styles.dot_flex}>
                    <span className={styles.dot} />
                    <span className={styles.dot_text}>
                      {currency}
                      {dc}
                    </span>
                  </Grid>
                  <Info
                    title="Pro Tip"
                    text={'Above charges are an approximation only, actual charges will vary '
                      + ' based on the actual shipment box and weight.'
                      + '\n Your delivery charges are calculated based on maximum of volumetric weight(length X '
                      + 'width X height / 5) and the actual weight.So optimize your shipping box accordingly!'}
                    onClose={() => setDc(0)}
                  />
                </>
              )}
            </Grid>
          </form>
        </div>
      </Drawer>
    </Drawer>

  );
}
export default ShippingDelivery;
