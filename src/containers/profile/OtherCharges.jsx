import React, { useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import importIcon from 'assets/images/profile/add.svg';
import arrowIcon from 'assets/images/profile/arrow.svg';
import editIcon from 'assets/images/profile/edit.svg';
import delIcon from 'assets/images/profile/delete.svg';
import Input from 'components/common/Input';
import { cloneDeep } from 'lodash';
import { useShop } from 'contexts/userContext';
import { InputAdornment } from '@material-ui/core';
import ButtonComponent from './ButtonComponent';
import styles from './OtherCharges.module.css';

function OtherCharges({ values, setValues, update }) {
  values = values?.filter(x => !x.isDeleted);
  const [to, setTo] = useState();
  const [charge, setCharge] = useState();
  const [show, setShow] = useState(false);
  const [index, setIndex] = useState(-1);
  const charges = values;
  const shop = useShop();

  const setValue = (i, type, value) => {
    const val = type !== 'isDeleted' ? parseFloat(value) : value;
    const current = cloneDeep(values);
    // sets from field based on other fields
    if (type === 'to' || type === 'charge') {
      current[i].from = 0;
      if (values[i - 1]) {
        current[i].from = values[i - 1].to;
      }
      setValues(current);
    }
    current[i][type] = val;
    setValues(current);
  };

  // eslint-disable-next-line react/no-multi-comp
  const getForm = (i) => {
    const isNew = i === undefined;
    const isEmptyCharges = values.length === 0;

    const getFromValue = () => {
      if (isNew) {
        if (isEmptyCharges) {
          return 0;
        }
        return values[values.length - 1].to;
      }
      return values[i]?.from || 0;
    };

    const getToValue = () => {
      if (isNew) {
        return to;
      }
      return values[i]?.to;
    };

    const getChargeValue = () => {
      if (isNew) {
        return charge;
      }
      return values[i]?.charge;
    };

    const getMinTo = () => {
      if (isNew) {
        if (isEmptyCharges) {
          return 0;
        }
        return values[values.length - 1].to;
      }
      return values[i - 1]?.to || 0;
    };

    const getMinCharge = () => {
      if (isNew) {
        if (isEmptyCharges) {
          return 0;
        }
        return values[values.length - 1].charge;
      }
      return values[i - 1]?.charge || 0;
    };

    return (
      (
        <div className={styles.section}>
          <form
            Validate
            autoComplete="off"
            onSubmit={async (e) => {
              e.preventDefault();
              e.stopPropagation();
              if (isNew) {
                const payload = { from: getFromValue(), to, charge };
                const temp = charges.concat(payload);
                setValues(temp);
                await update(temp);
                setTo();
                setCharge();
                setShow(false);
                return;
              }
              await update();
              setIndex(-1);
            }}
            className={styles.form}
          >
            <Input
              value={getFromValue()}
              placeholder="0"
              label="Min. Order value"
              type="number"
              className={styles.inputClass}
              InputProps={{
                startAdornment: (
                  <InputAdornment
                    className={styles.adorn}
                    position="start">
                    {shop.currency}
                  </InputAdornment>),
                classes: {
                  input: cx(styles.slug),
                  readOnly: true
                },
              }}
              disabled
            />
            <Input
              value={getToValue()}
              placeholder="0"
              label="Max. Order value"
              className={styles.inputClass}
              setValue={(e) => {
                if (!isNew) {
                  setValue(i, 'to', e);
                  return;
                }
                setTo(parseFloat(e));
              }}
              type="number"
              InputProps={{
                startAdornment: (
                  <InputAdornment
                    className={styles.adorn}
                    position="start">
                    {shop.currency}
                  </InputAdornment>),
                classes: {
                  input: cx(styles.slug),
                },
              }}
              // eslint-disable-next-line react/jsx-no-duplicate-props
              inputProps={{
                min: getMinTo() + 0.01,
                // eslint-disable-next-line no-useless-escape
                pattern: '^\d*(\.\d{0,2})?$',
                step: 0.01
              }}
              required
            />
            <Input
              value={getChargeValue()}
              placeholder="0"
              label="Delivery charges for this range"
              setValue={(e) => {
                if (!isNew) {
                  setValue(i, 'charge', e);
                  return;
                }
                setCharge(parseFloat(e));
              }}
              className={styles.inputClass}
              type="number"
              InputProps={{
                startAdornment: (
                  <InputAdornment
                    className={styles.adorn}
                    position="start">
                    {shop.currency}
                  </InputAdornment>),
                classes: {
                  input: cx(styles.slug),
                },
              }}
              // eslint-disable-next-line react/jsx-no-duplicate-props
              inputProps={{
                min: getMinCharge() + 0.01,
                // eslint-disable-next-line no-useless-escape
                pattern: '^\d*(\.\d{0,2})?$',
                step: 0.01
              }}
              required
            />
            <div className="fullWidth flexBetween">
              <div className={styles.width22}>
                <img
                  src={delIcon}
                  onClick={() => {
                    if (!isNew) {
                      setValue(i, 'isDeleted', !values[i].isDeleted);
                      return;
                    }
                    setTo();
                    setCharge();
                    setShow(!show);
                  }}
                  alt=""
                />
              </div>
              <div className={styles.width78}>
                <ButtonComponent
                  color="secondary"
                  text={isNew ? 'Add' : 'Update'}
                  style={styles.rightS}
                />
              </div>
            </div>
          </form>
        </div>
      )
    );
  };

  return (
    <>
      {values.length > 0 && (
        <div className={styles.ocSection}>
          <div className={styles.listHeader}>
            Conditional Charges List
          </div>
          <div className={styles.listBody}>
            {values.map((x, i) => (
              <>
                <div
                  className={styles.list}
                  onClick={() => {
                    if (i === index) {
                      setIndex(-1);
                      setShow(false);
                      return;
                    }
                    setIndex(i);
                  }}
                >
                  <span className={styles.circle}>{i + 1}</span>
                  <div>
                    <span className={styles.right4}>{shop.currency}</span>
                    <span>{x.from}</span>
                  </div>
                  <span>-</span>
                  <div>
                    <span className={styles.right4}>{shop.currency}</span>
                    <span>{x.to}</span>
                  </div>
                  <img src={arrowIcon} alt="" />
                  <div>
                    <span className={styles.right4}>{shop.currency}</span>
                    <span>{x.charge}</span>
                  </div>
                  <img src={editIcon} alt="" />
                </div>
                {i === index && (getForm(i))}
              </>
            ))}
          </div>
        </div>
      )}
      {show && index === -1 && getForm()}
      <div className="fullWidth textRight">
        <div
          onClick={() => {
            setIndex(-1);
            setShow(!show);
          }}
          className={styles.button}
        >
          <img className={styles.icon} height="20px" width="20px" src={importIcon} alt="" />
          Add More Charges
        </div>
      </div>
    </>
  );
}

OtherCharges.defaultProps = {
  values: []
};

OtherCharges.propTypes = {
  setValues: PropTypes.func.isRequired,
  values: PropTypes.array,
  update: PropTypes.func.isRequired
};

export default OtherCharges;
