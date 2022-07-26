import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import cx from 'classnames';
import { useQueryParams } from 'hooks';
import { TextField, Drawer, InputAdornment } from '@material-ui/core';
import Header from 'containers/products/Header';
import { getCountries } from 'utils/countries';
import Select from 'react-select';
import chevron from 'assets/images/chevron.svg';
import styles from './SelectSearch.module.css';

function Input({
  value, setValue, placeholder, type, disabled
}) {
  const history = useHistory();
  const params = useQueryParams();
  const openDrawer = params.has('countries');
  const onBack = () => history.goBack();
  const options = getCountries().map(x => ({ label: x.countryName, value: x.countryName.toLowerCase() }));
  const title = 'Select Country';
  if (openDrawer) {
    return (
      <Drawer
        PaperProps={{
          classes: {
            root: styles.paper,
          }
        }}
        anchor="bottom"
        open={true}
        onClose={onBack}
      >
        <div className={styles.drawer}>
          <Header onBack={() => history.goBack()} title={title} />
          <div className={styles.content}>
            <Select
              className={styles.select}
              classNamePrefix="react-select"
              placeholder="Select Country"
              value={value}
              onChange={setValue}
              options={options}
            />
          </div>
        </div>
      </Drawer>
    );
  }
  return (
    <>
      <TextField
        value={value}
        type={type}
        disabled={disabled}
        className={cx(styles.slugSec)}
        placeholder={placeholder}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        onClick={(e) => {
          if (disabled) {
            return;
          }
          e.stopPropagation();
          params.set('countries', true);
          history.push({ search: params.toString() });
        }}
        InputProps={{
          classes: {
            input: cx(styles.slug, styles.single),
          },
          readOnly: true,
          endAdornment: (
            <InputAdornment position="end">
              {' '}
              <img className="marginSLeftRight" src={chevron} alt="" />
              {' '}
            </InputAdornment>
          )
        }}
        variant="standard"
      />
    </>
  );
}

Input.propTypes = {
  value: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
  type: PropTypes.string,
  disabled: PropTypes.bool,
};

Input.defaultProps = {
  type: 'text',
  disabled: false
};

export default Input;
