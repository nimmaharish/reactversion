import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useGetIds, useOrder } from 'contexts/orderContext';
import { Factory } from 'api';
import Loader from 'services/loader';
import cx from 'classnames';
import SnackBar from 'services/snackbar';
import { useHistory } from 'react-router-dom';
import { isIND } from 'contexts/userContext';
import selectIcon from 'assets/v2/orders/select.svg';
import unselectIcon from 'assets/v2/orders/unselect.svg';
import chevronTop from 'assets/v2/common/chevronGreyTop.svg';
import chevronBottom from 'assets/v2/common/chevronGreyBottom.svg';
import { useToggle } from 'hooks/common';
import { useShop } from 'contexts';
import Alert from 'components/shared/alert/Alert';
import { Badge, Button, Clickable } from 'phoenix-components';
import { inParallelWithLimit } from 'utils/parallel';
import emptyShipping from 'assets/v2/orders/emptyShipping.svg';
import EventManager from 'utils/events';
import styles from './Step.module.css';

export function Step2({
  handleNext,
  groupId,
  handleBack,
  order,
}) {
  const rootOrder = useOrder();
  const weight = order?.weight;
  const height = order?.dimensions?.height;
  const length = order?.dimensions?.length;
  const width = order?.dimensions?.width;
  const addressId = order?.addressId;
  const codAmount = +order._shippingCodAmount || 0;
  const shop = useShop();
  const ids = useGetIds();
  const isIndia = isIND();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [shippingRates, setShippingRates] = useState([]);
  const [selectedRate, setSelectedRate] = useState(-1);
  const [selectedVendor, setSelectedVendor] = useState('');
  const [pickUpEnable, setPickUpEnable] = useState(false);
  const [inSuffDetails, setInSufDetails] = useState({});
  const [showError, setShowError] = useToggle(false);
  const [subPartners, setSubPartners] = useState({});
  const [subPartnersOpen, setSubPartnersOpen] = useState({});

  console.log(subPartners);

  const toggleWallet = () => history.replace('/payments?open=1&tab=wallet&type=cash&state=credits');

  const showInSuffAlert = +inSuffDetails?.shortage > 0 && +inSuffDetails?.requested > 0;

  const onSubmit = async () => {
    if ((selectedRate === -1 && selectedVendor === 'shiprocket') || selectedVendor.length === 0) {
      setShowError(true);
      return;
    }
    try {
      Loader.show();
      const payload = {
        addressId,
        weight: +weight,
        dimensions: {
          length: +length,
          width: +width,
          height: +height,
        },
        vendor: selectedVendor,
        type: 'windo',
        partnerId: selectedRate,
        ids,
        codAmount,
      };
      const {
        groupId: grpId,
        orderId
      } = await Factory.shipOrder(rootOrder._id, groupId, payload);
      history.push({
        pathname: `/orders/${orderId}/thankyou`,
        state: {
          groupId: grpId,
          id: orderId
        }
      });
      EventManager.emitEvent('order_shipped', {
        type: payload.type,
        id: orderId,
        groupId: grpId || '',
      });
    } catch (e) {
      if (e?.response?.status === 403) {
        setInSufDetails({
          shortage: e?.response?.data?.shortage?.toFixed(2),
          requested: e?.response?.data?.requested?.toFixed(2)
        });
        return;
      }
      if (e?.response?.status === 412) {
        SnackBar.show('Please add shop address to ship', 'error');
        history.push('/manage/address', {
          redirectTo: `/orders/${rootOrder._id}`,
        });
        return;
      }
      if (e?.response?.status === 422) {
        SnackBar.showError(e);
        return;
      }
      SnackBar.showError(e);
    } finally {
      Loader.hide();
    }
  };

  const getShippingRates = async () => {
    try {
      setIsLoading(true);
      Loader.show();
      const payload = {
        weight: +weight,
        addressId,
        dimensions: {
          length: +length,
          width: +width,
          height: +height,
        },
        codAmount
      };
      const response = await Factory.getShippingRates(rootOrder._id, groupId, payload);
      const filtered = response.filter(x => x.subPartners)
        .map(x => ({ name: x.vendor }));

      const subPartners1 = await inParallelWithLimit(filtered, 5, async vendor => {
        try {
          const res = await Factory.getPartnerShippingRates(rootOrder._id, groupId, vendor.name, payload);
          return { [vendor.name]: res };
        } catch (e) {
          const message = e?.response?.data?.message || e?.message || 'Something went wrong';
          SnackBar.showError(`unable to fetch ${vendor.name} shipping rates ${message}`);
          return null;
        }
      });
      setShippingRates(response);
      const values = Object.assign({}, ...(subPartners1.filter(x => x)));
      const transform = Object.keys(values)
        .map(x => ({ [x]: false }));
      setSubPartnersOpen(Object.assign({}, ...transform));
      setSubPartners(values);
    } catch (e) {
      if (e?.response?.data?.message) {
        SnackBar.show(e?.response?.data?.message, 'error');
        return;
      }
      SnackBar.show('Something went wrong', 'error');
    } finally {
      Loader.hide();
      setIsLoading(false);
    }
  };

  const createOrder = async (scheduledRequire) => {
    if (selectedRate === -1 || selectedVendor.length === 0) {
      setShowError(true);
      return;
    }
    try {
      Loader.show();
      const payload = {
        addressId,
        weight: +weight,
        dimensions: {
          length: +length,
          width: +width,
          height: +height,
        },
        vendor: selectedVendor,
        type: 'windo',
        partnerId: selectedRate,
        ids,
        codAmount,
      };
      const {
        groupId: grpId,
        orderId
      } = await Factory.shipOrder(rootOrder._id, groupId, payload);
      if (scheduledRequire) {
        handleNext();
      }
      if (!scheduledRequire) {
        history.push({
          pathname: `/orders/${orderId}/thankyou`,
          state: {
            groupId: grpId,
            id: orderId
          }
        });
      }
    } catch (e) {
      if (e?.response?.status === 403) {
        setInSufDetails({
          shortage: e?.response?.data?.shortage?.toFixed(2),
          requested: e?.response?.data?.requested?.toFixed(2)
        });
        return;
      }
      if (e?.response?.status === 412) {
        SnackBar.show('Please add shop address to ship', 'error');
        history.push('/manage/address', {
          redirectTo: `/orders/${rootOrder._id}`,
        });
        return;
      }
      if (e?.response?.status === 422) {
        SnackBar.showError(e);
        return;
      }
      SnackBar.show('Something went wrong', 'error');
    } finally {
      Loader.hide();
    }
  };

  useEffect(() => {
    // others
    if (!weight || !height || !width || !length) {
      handleBack();
      return;
    }
    getShippingRates();
  }, [order?.dimensions]);

  const onSelectVendor = (id) => setSelectedVendor(id);
  const onSelectRate = (id) => setSelectedRate(id);

  const rates = shippingRates;

  const card = (items, vendor) => items.map(y => (
    <div className="marginSTopBottom">
      <div className={styles.content}>
        <div
          className={cx(styles.courierSection,
            { [styles.selected]: y.id === selectedRate })}
          onClick={(e) => {
            if (y.id === selectedRate) {
              onSelectVendor('');
              onSelectRate(-1);
              setPickUpEnable(false);
              return;
            }
            onSelectVendor(vendor);
            onSelectRate(y.id);
            setPickUpEnable(y.pickUpAvailable);
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <div className={cx(styles.flex)}>
            <div className={styles.courSection}>
              <div className="flexBetween marginSTopBottom">
                <div className={styles.cName}>{y.provider}</div>
                <div
                  className={styles.cPrice}>
                  {`${shop.currency} ${y?.amount?.toFixed(2)}`}
                </div>
              </div>
              {isIndia && (
                <div className="flexBetween marginSTopBottom">
                  <Badge
                    size="small"
                    variant="secondary"
                    className={styles.doorStep}
                  >
                    Door-Step Pickup
                  </Badge>
                  <span className={styles.ratingContainer}>
                    <img src={y.id === selectedRate ? selectIcon : unselectIcon} alt="" />
                  </span>
                </div>
              )}
              {!isIndia && (
                <div className="flexBetween marginSTopBottom">
                  <Badge
                    size="small"
                    variant="secondary"
                  >
                    {y.pickUpAvailable
                      ? 'Door-Step Pickup' : 'No Door-Step Pickup'}
                  </Badge>
                  <span className={styles.ratingContainer}>
                    <img src={y.id === selectedRate ? selectIcon : unselectIcon} alt="" />
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  ));

  if (isLoading) {
    return null;
  }

  return (
    <div className={cx(styles.couriersSection, pickUpEnable && styles.alterHeight)}>
      {showError && (
        <Alert
          text="Please select provider"
          btnText="Ok"
          textClass={styles.textClass}
          onClick={setShowError}
        />
      )}
      {rates.length === 0 && (
        <div className={styles.emptyCouriers}>
          <img src={emptyShipping} alt="" />
          <div>
            No Shipping Partners Connected
          </div>
        </div>
      )}
      {rates.length > 0 && rates.map((y) => (
        <div className="marginSTopBottom">
          <div className={styles.content}>
            <div
              className={cx(styles.courierSection,
                { [styles.selected]: y.vendor === selectedVendor && !y.subPartners })}
              onClick={() => {
                if (y.vendor === selectedVendor && !y.subPartners) {
                  onSelectVendor('');
                  setPickUpEnable(false);
                  return;
                }
                onSelectVendor(y.vendor);
                setPickUpEnable(y.schedulePickUp);
              }}
            >
              <div className={cx(styles.flex)}>
                {/* <img className={styles.courImg} src={x.providerImage} alt="" /> */}
                <div className={styles.courSection}>
                  <div className="flexBetween marginSTopBottom">
                    <div className={styles.cName}>
                      {!y.subPartners && (
                        <>
                          {y.displayName}
                        </>
                      )}
                      {y.subPartners && (
                        <Clickable
                          onClick={() => {
                            const value = subPartnersOpen[y.vendor];
                            setSubPartnersOpen({
                              ...subPartnersOpen,
                              [y.vendor]: !value
                            });
                          }}
                          className={styles.cPrice}
                        >
                          {y.displayName}
                        </Clickable>
                      )}
                    </div>
                    {!y?.subPartners && (
                      <div
                        className={styles.cPrice}>
                        {`${shop.currency} ${y?.total?.toFixed(2)}`}
                      </div>
                    )}
                    {y?.subPartners && (
                      <Clickable
                        onClick={() => {
                          const value = subPartnersOpen[y.vendor];
                          setSubPartnersOpen({
                            ...subPartnersOpen,
                            [y.vendor]: !value
                          });
                        }}
                        className={styles.cPrice}
                      >
                        <img src={subPartnersOpen[y.vendor] ? chevronTop : chevronBottom} alt="" />
                      </Clickable>
                    )}
                  </div>
                  {isIndia && !y?.subPartners && (
                    <div className="flexBetween marginSTopBottom">
                      <Badge
                        size="small"
                        variant="secondary"
                        className={styles.doorStep}
                      >
                        Door-Step Pickup
                      </Badge>
                      <span className={styles.ratingContainer}>
                        <img src={y.vendor === selectedVendor ? selectIcon : unselectIcon} alt="" />
                      </span>
                    </div>
                  )}
                  {!isIndia && (
                    <div className="flexBetween marginSTopBottom">
                      <Badge
                        size="small"
                        variant="secondary"
                      >
                        {y.schedulePickUp || isIndia
                          ? 'Door-Step Pickup' : 'No Door-Step Pickup'}
                      </Badge>
                    </div>
                  )}
                  {subPartnersOpen[y.vendor] && card(subPartners[y.vendor] || [], y.vendor)}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      {!isIndia && rates.length > 0 && (
        <>
          {pickUpEnable && (
            <div className={styles.actions}>
              <div className={styles.label}> Need Doorstep Pickup?</div>
              <div className={styles.buttons}>
                <Button
                  onClick={() => createOrder(false)}
                  size="large"
                  primary={false}
                  label="No"
                />
                <Button
                  onClick={() => createOrder(true)}
                  size="large"
                  label="Yes"
                />
              </div>
            </div>
          )}
          {!pickUpEnable && (
            <div className={styles.buttonContainer}>
              <Button
                onClick={() => createOrder(false)}
                size="large"
                label="Next"
                fullWidth={true}
              />
            </div>
          )}
        </>
      )}
      {isIndia && (
        <>
          {rates.length > 0 && (
            <div className={styles.buttonContainer}>
              <Button
                onClick={onSubmit}
                size="large"
                label="Confirm"
                fullWidth={true}
              />
            </div>
          )}
        </>
      )}
      {rates.length === 0 && (
        <div>
          <Button
            onClick={() => {
              history.push('/manage/shippingPartners');
            }}
            label="Connect Shipping Partner"
            fullWidth={true}
          />
        </div>
      )}
      <div className={styles.spacer}></div>
      {showInSuffAlert && (
        <Alert
          text={`Your estimated shipping charges are
             ${shop.currency} ${inSuffDetails.requested}. Please add sufficient balance
             to proceed`}
          btnText={`Add ${shop.currency} ${inSuffDetails.shortage}`}
          textClass={styles.textClass}
          onClick={toggleWallet}
        />
      )}
    </div>
  );
}

Step2.propTypes = {
  handleNext: PropTypes.func.isRequired,
  handleBack: PropTypes.func.isRequired,
  groupId: PropTypes.string,
  order: {},
};

Step2.defaultProps = {
  groupId: '',
  order: {},
};
