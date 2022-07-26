import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogContent } from '@material-ui/core';
import SnackBar from 'services/snackbar';
import { Factory } from 'api';
import { useIsCod, useOrder } from 'contexts/orderContext';
import Loader from 'services/loader';
import { useToggle } from 'hooks/common';
import deliveryTag from 'assets/images/workingslides/4.svg';
import {
  Badge, Button, Card, Clickable, ReactInput
} from 'phoenix-components';
import cx from 'classnames';
import { isIND, useShop } from 'contexts/userContext';
import locIcon from 'assets/images/orders/details/location.svg';
import { CodPopUp } from 'components/common/CodPopUp';
import { useHistory } from 'react-router';
import AddIcon from 'assets/v2/orders/plus.svg';
import { useDesktop } from 'contexts';
import styles from './Step.module.css';

export function Step1({
  groupId,
  order,
  handleNext,
  handleBack
}) {
  const rootOrder = useOrder();
  const [weight, setWeight] = useState(order?.weight);
  const [height, setHeight] = useState(order?.dimensions?.height);
  const [length, setLength] = useState(order?.dimensions?.length);
  const [width, setWidth] = useState(order?.dimensions?.width);
  const isCod = useIsCod();
  const [codAmount, setCodAmount] = useState(isCod ? (order?.shippingCodAmount || 0) : 0);
  const [showMore, setMoreAddress] = useToggle(false);
  const shop = useShop();
  const defaultShop = shop?.addresses?.find(x => x.default);
  const [addressId, setAddressId] = useState(defaultShop?._id || -1);
  const selectedShop = shop?.addresses?.find(x => x._id === addressId);
  const [open, toggle] = useToggle(false);
  const [openCod, toggleCod] = useToggle(false);
  const isIndia = isIND();
  const history = useHistory();
  const isDesktop = useDesktop();

  const locationClick = () => {
    setMoreAddress();
  };

  const getShippingRates = async () => {
    try {
      Loader.show();
      const payload = {
        weight: +weight,
        addressId,
        dimensions: {
          length: +length,
          width: +width,
          height: +height,
        },
        codAmount,
      };
      await Factory.getShippingRates(rootOrder._id, groupId, payload);
      handleNext();
    } catch (e) {
      if (e?.response?.data?.message) {
        SnackBar.show(e?.response?.data?.message, 'error');
        return;
      }
      SnackBar.show('Something went wrong', 'error');
    } finally {
      Loader.hide();
    }
  };

  const onAcceptCod = () => {
    if (isIndia) {
      handleNext();
    } else {
      getShippingRates();
    }
  };

  const onNext = () => {
    onAcceptCod();
  };

  if (open) {
    return (
      <Dialog open={true} onClose={toggle} fullWidth>
        <DialogContent>
          <img className={styles.deliveryTag} src={deliveryTag} alt="" />
          <div className={styles.deliveryTagTitle}>
            Download the delivery tag, Print it and paste it on your shipment box.
            Our pickup executive will pickup your shipment only if the tag is attached.
          </div>
          <div className={styles.buttonContainer}>
            <Button
              onClick={toggle}
              type="large"
              label="Close"
            />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className={styles.couriersSection}>
      {openCod && (
        <CodPopUp onClose={toggleCod} onAccept={onAcceptCod} />
      )}
      <div className={styles.addressContainer}>
        <div className={styles.address}>
          <div className={styles.left1}>
            <img src={locIcon} alt="" />
          </div>
          <div className={cx(styles.center1)} onClick={locationClick}>
            <div>
              Pickup Location
              <Badge
                variant="primary"
                rounded
                size="small"
                className={styles.badge}
              >
                {selectedShop?.nick}
              </Badge>
            </div>
            <div className={styles.addressText}>
              {' '}
              {`${selectedShop?.addressLine1} ${selectedShop?.addressLine2} ${selectedShop?.pincode}`}
              {' '}
            </div>
          </div>
          <div className={cx(styles.right12)} onClick={locationClick}>
            <div className={styles.change}>
              Change
            </div>
          </div>
        </div>
        {showMore && shop?.addresses?.map(x => (
          <div
            className={styles.addressSection}
            onClick={() => {
              setAddressId(x._id);
              setMoreAddress(!showMore);
            }}
          >
            <Card outlined={x._id === addressId}>
              <div className="flexBetween">
                <div className={cx(styles.name)}>{x.name}</div>
                <Badge
                  variant="primary"
                  rounded
                >
                  {x.nick}
                </Badge>
              </div>
              <div className={styles.addressSelection}>
                {`${x?.addressLine1} ${x?.addressLine2}`}
                <br />
                {`${x?.city}, ${x?.state}, ${x?.country} - ${x?.pincode} `}
                <br />
                {`${x?.phone}`}
              </div>
            </Card>
          </div>
        ))}
        {showMore && (
          <div className="flexCenter marginMTopBottom">
            <Clickable
              className={styles.add}
              onClick={() => {
                history.push('/manage/address', {
                  redirectTo: `/orders/${rootOrder._id}`,
                });
              }}
            >
              <img className={styles.addImg} src={AddIcon} alt="" />
              <span> Add New Address </span>
            </Clickable>
          </div>
        )}
      </div>
      <div className={styles.boxTitle}>Shipping Box Details</div>
      <div className={isDesktop ? styles.desktopC : null}>
        <ReactInput
          value={weight}
          setValue={(e) => setWeight(e)}
          label="Weight in grams"
          placeholder="e.g. 200"
          type="number"
          inputClass={styles.input}
        />
        <ReactInput
          value={length}
          setValue={(e) => setLength(e)}
          label="Length in cm"
          placeholder="e.g. 34"
          type="number"
          inputClass={styles.input}
        />
        <ReactInput
          value={width}
          setValue={(e) => setWidth(e)}
          label="Width in cm"
          placeholder="e.g. 34"
          type="number"
          inputClass={styles.input}
        />
        <ReactInput
          value={height}
          setValue={(e) => setHeight(e)}
          label="Height in cm"
          placeholder="e.g. 34"
          type="number"
          inputClass={styles.input}
        />
        {(isCod || codAmount > 0) && (
          <ReactInput
            value={codAmount}
            setValue={(e) => setCodAmount(e)}
            label="Cod Amount"
            placeholder="e.g. 34"
            type="number"
            inputClass={styles.input}
          />
        )}
      </div>
      <div className={isDesktop ? styles.spacerDesktop : styles.spacer}></div>
      {isIndia && (
        <div className={styles.buttonContainer}>
          {!isDesktop && (
            <>
              <Button
                onClick={handleBack}
                primary={false}
                label="Back"
                size="large"
                fullWidth={true}
              />
              <Button
                onClick={() => {
                  const isNotFilled = !weight || !length || !width || !height;
                  if (isNotFilled) {
                    SnackBar.show('Please enter shipping box details', 'error');
                    return;
                  }
                  order.addressId = addressId;
                  order.weight = weight;
                  order.dimensions = {
                    length: +length,
                    width: +width,
                    height: +height,
                  };
                  order._shippingCodAmount = codAmount;
                  onNext();
                }}
                label="Next"
                size="large"
                fullWidth={true}
              />
            </>
          )}
          {isDesktop && (
            <>
              <Button
                onClick={() => {
                  const isNotFilled = !weight || !length || !width || !height;
                  if (isNotFilled) {
                    SnackBar.show('Please enter shipping box details', 'error');
                    return;
                  }
                  order.addressId = addressId;
                  order.weight = weight;
                  order.dimensions = {
                    length: +length,
                    width: +width,
                    height: +height,
                  };
                  order._shippingCodAmount = codAmount;
                  onNext();
                }}
                label="Next"
                size="large"
                fullWidth={true}
              />
            </>
          )}
        </div>
      )}
      {!isIndia && (
        <div className={styles.buttonContainer}>
          {!isDesktop && (
            <>
              <Button
                onClick={handleBack}
                primary={false}
                label="Back"
                size="large"
                fullWidth={true} />
              <Button
                onClick={() => {
                  const isNotFilled = !weight || !length || !width || !height;
                  if (isNotFilled) {
                    SnackBar.show('Please enter shipping box details', 'error');
                    return;
                  }
                  order.addressId = addressId;
                  order.weight = weight;
                  order.dimensions = {
                    length: +length,
                    width: +width,
                    height: +height,
                  };
                  order._shippingCodAmount = codAmount;
                  onNext();
                }}
                label="Next"
                size="large"
                fullWidth={true} />
            </>
          )}
          {isDesktop && (
            <>
              <Button
                onClick={handleBack}
                primary={false}
                label="Back"
                size="large"
                fullWidth={true} />
              <Button
                onClick={() => {
                  const isNotFilled = !weight || !length || !width || !height;
                  if (isNotFilled) {
                    SnackBar.show('Please enter shipping box details', 'error');
                    return;
                  }
                  order.addressId = addressId;
                  order.weight = weight;
                  order.dimensions = {
                    length: +length,
                    width: +width,
                    height: +height,
                  };
                  order._shippingCodAmount = codAmount;
                  onNext();
                }}
                label="Next"
                size="large"
                fullWidth={true} />
            </>
          )}
        </div>
      )}
    </div>
  );
}

Step1.propTypes = {
  handleNext: PropTypes.func.isRequired,
  handleBack: PropTypes.func.isRequired,
  groupId: PropTypes.string,
  order: PropTypes.any
};

Step1.defaultProps = {
  groupId: '',
  order: {}
};
