import React, { useState } from 'react';
import { useOrder } from 'contexts/orderContext';
import PropTypes from 'prop-types';
import { Button } from 'phoenix-components';
import cx from 'classnames';
import { useDefaultAddress } from 'contexts/userContext';
import { useUser } from 'contexts';
import locIcon from 'assets/images/orders/details/location.svg';
import nextIcon from 'assets/images/orders/details/next.svg';
// import { useQueryParams } from 'hooks';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import Input from 'components/common/Input';
import SelectSearch from 'react-select';
import SnackBar from 'services/snackbar';
import Loader from 'services/loader';
import { InputAdornment } from '@material-ui/core';
import {
  DateTimePicker,
} from '@material-ui/pickers';
import { Factory } from 'api';
import styles from './Step.module.css';

export function Step3({ handleBack, groupId }) {
  const order = useOrder();
  // const params = useQueryParams();
  const history = useHistory();
  const defAddress = useDefaultAddress();
  const user = useUser();
  const [startAt, setStartAt] = useState(null);
  const [endAt, setEndAt] = useState(null);
  const [buildingType, setBuildingType] = useState('');
  const [instructions, setInstructions] = useState('');

  const options = ['Front Door', 'Back Door', 'Security', 'Other'].map(x => ({ label: x, value: x }));

  const toBank = () => {
    // params.set('openAddress', 'true');
    // history.push({ pathname: 'manage', search: params.toString() });
  };

  const info = `Your pickup has been scheduled on ${moment(startAt).format('MMMM Do YYYY, h:mm a')} - 
  ${moment(endAt).format('MMMM Do YYYY, h:mm a')}. Download your Shipping Label and Print it, 
  attach it on your shipment, keep it ready for the PickUp`;

  const createPickup = async () => {
    if (buildingType.length === 0) {
      SnackBar.show('Please select building location type', 'error');
      return;
    }
    if (buildingType === 'Other' && instructions.length < 20) {
      SnackBar.show('Please enter instructions more than 20 characters', 'error');
      return;
    }
    try {
      const payload = {
        startAt: moment(startAt).seconds(0).milliseconds(0).toISOString(),
        endAt: moment(endAt).seconds(0).milliseconds(0).toISOString(),
        instructions,
        buildingLocationType: buildingType,
        email: user.email,
      };
      Loader.show();
      await Factory.createPickup(order._id, groupId, payload);
      history.push({ pathname: `/orders/${order._id}/thankyou`, state: { info, groupId, id: order._id } });
    } catch (e) {
      if (e?.response?.data?.message) {
        SnackBar.show(e?.response?.data?.message, 'error');
        return;
      }
      if (e?.response?.data?.messages?.length > 0) {
        history.push({ pathname: `/orders/${order._id}/thankyou`, state: { info, groupId, id: order._id } });
        SnackBar.show('Shipment created successfully');
        return;
      }

      SnackBar.show('Something went wrong', 'error');
    } finally {
      Loader.hide();
    }
  };

  return (
    <div className={cx(styles.couriersSection, styles.alterHeight)}>
      <div className={styles.address}>
        <div className={styles.left1}>
          <img src={locIcon} alt="" />
        </div>
        <div className={cx(styles.center1)} onClick={toBank}>
          <div> Pickup Location </div>
          <div className={styles.addressText}>
            {' '}
            {`${defAddress?.addressLine1}  ${defAddress?.addressLine2} ${defAddress?.pincode}`}
            {' '}
          </div>
        </div>
        <div className={cx(styles.right1)} onClick={toBank}>
          <img src={nextIcon} alt="" />
        </div>
      </div>
      <div className={cx(styles.head3)}>Select Building Location Type</div>
      <SelectSearch
        className={styles.select}
        classNamePrefix="react-select"
        placeholder="Select"
        value={options.find(x => x.value === buildingType)}
        onChange={(e) => setBuildingType(e.value)}
        options={options}
      />
      {buildingType === 'Other' && (
        <>
          <div className={cx(styles.head3)}>Delivery Instructions</div>
          <Input
            value={instructions}
            placeholder="Type here..."
            setValue={(e) => setInstructions(e)}
            InputProps={{
              classes: {
                input: cx(styles.slug, styles.single),
              },
            }}
          />
        </>
      )}
      <div className={cx(styles.head4)}>Select Date & Time</div>
      <div className={cx(styles.head3)}>From</div>
      <DateTimePicker
        clearable
        fullWidth
        value={startAt}
        disablePast={true}
        InputProps={{
          endAdornment: (
            <InputAdornment className={cx(styles.adorn)} position="end">
              <img src={nextIcon} alt="" />
            </InputAdornment>
          ),
          classes: {
            input: cx(styles.slug, styles.single),
            root: styles.grey1
          },
        }}
        onChange={setStartAt}
      />
      <div className={cx(styles.head3)}>To</div>
      <DateTimePicker
        clearable
        fullWidth
        minDate={startAt}
        value={endAt}
        InputProps={{
          endAdornment: (
            <InputAdornment className={cx(styles.adorn)} position="end">
              <img src={nextIcon} alt="" />
            </InputAdornment>
          ),
          classes: {
            input: cx(styles.slug, styles.single),
            root: styles.grey1
          },
        }}
        onChange={setEndAt}
      />
      <div className={styles.actions}>
        <div className={styles.label}> Confirm your Door-Step Pickup </div>
        <div className={styles.buttons}>
          <Button
            onClick={handleBack}
            type="large"
            primary={false}
            label="No"
          />
          <Button
            onClick={() => createPickup(true)}
            type="large"
            label="Yes, Proceed"
          />
        </div>
      </div>
    </div>
  );
}

Step3.propTypes = {
  handleBack: PropTypes.func.isRequired,
  groupId: PropTypes.string,
};

Step3.defaultProps = {
  groupId: ''
};
