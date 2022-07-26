/* eslint-disable react/no-multi-comp */
import PropTypes from 'prop-types';
import { InputAdornment, TextField } from '@material-ui/core';
import calendarIcon from 'assets/images/coupons/calendar.svg';
import removeIcon from 'assets/images/coupons/remove.svg';
import React, { useState, useEffect } from 'react';
import cx from 'classnames';
import 'react-modern-calendar-datepicker/lib/DatePicker.css';
import { utils } from 'react-modern-calendar-datepicker';
import DatePicker from 'react-modern-calendar-datepicker';
import styles from './Picker.module.css';

export function Picker({
  onSelect,
  label,
  float,
  inputStyle,
}) {
  const [selectedDayRange, setSelectedDayRange] = useState({
    from: null,
    to: null
  });
  const dateParts = selectedDayRange;

  const isEmptyFrom = selectedDayRange.from === null;
  const isEmptyTo = selectedDayRange.to === null;

  // passing string to prevent infinite call

  const from = `${dateParts.from?.month}/${dateParts.from?.day}/${dateParts.from?.year}`;
  const to = `${dateParts.to?.month}/${dateParts.to?.day}/${dateParts.to?.year}`;

  useEffect(() => {
    if (isEmptyFrom || isEmptyTo) {
      return;
    }
    onSelect({ from, to });
  }, [selectedDayRange]);

  const getAdornment = () => {
    if (float === 'right') {
      return {
        endAdornment: (
          <InputAdornment position="end">
            {' '}
            <img
              className={styles.icon}
              src={label === 'Select Date' ? calendarIcon : removeIcon}
              alt=""
              onClick={(e) => {
                if (label !== 'Select Date') {
                  e.preventDefault();
                  e.stopPropagation();
                  onSelect({});
                  setSelectedDayRange({
                    from: null,
                    to: null
                  });
                }
              }}
            />
            {' '}
          </InputAdornment>
        )
      };
    }
    return {
      startAdornment: (
        <InputAdornment position="end">
          {' '}
          <img
            className={styles.icon}
            src={label === 'Select Date' ? calendarIcon : removeIcon}
            alt=""
            onClick={(e) => {
              if (label !== 'Select Date') {
                e.preventDefault();
                e.stopPropagation();
                onSelect({});
                setSelectedDayRange({
                  from: null,
                  to: null
                });
              }
            }}
          />
          {' '}
        </InputAdornment>
      )
    };
  };

  const inputProps = (inputStyle) => (
    {
      classes: {
        input: cx(styles.slug, styles.single, inputStyle),
      },
      readOnly: true,
      ...getAdornment()
    }
  );

  // eslint-disable-next-line react/prop-types
  const renderCustomInput = ({ ref, onFocus, onBlur }) => (
    <label>
      <TextField
        className={cx(styles.input, {
          [styles.right]: float === 'right',
        }, inputStyle)}
        id="picker"
        value={label}
        ref={ref}
        onFocus={onFocus}
        onBlur={onBlur}
        InputProps={inputProps(inputStyle)}
      />
    </label>
  );

  return (
    <DatePicker
      value={selectedDayRange}
      onChange={setSelectedDayRange}
      renderInput={renderCustomInput}
      maximumDate={utils().getToday()}
    />
  );
}

Picker.defaultProps = {
  float: '',
  inputStyle: ''
};

Picker.propTypes = {
  onSelect: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  float: PropTypes.string,
  inputStyle: PropTypes.string
};
