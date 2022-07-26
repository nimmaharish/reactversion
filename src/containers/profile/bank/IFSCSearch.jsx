import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useBankListDetails } from 'hooks/bank';
import { Drawer } from 'components/shared/Drawer';
// import Select from 'react-select';
import { Grid } from '@material-ui/core';
import { useField } from 'formik';
import { Select } from 'phoenix-components';
import { Loading } from 'components/shared/Loading';
import { useDesktop } from 'contexts';
import { SideDrawer } from 'components/shared/SideDrawer';
import styles from './BankDetails.module.css';

const arrayToOptions = data => data.map(item => ({
  label: item,
  value: item
}));

const makeBranchOptions = data => data.map(item => ({
  label: `${item.branch} - ${item.ifsc}`,
  value: item
}));

function IFSCSearch({
  onClose,
}) {
  const [params, setParams] = useState({});
  const [, , helpers] = useField('ifsc');
  const banks = useBankListDetails({}, 'listBanks', false, []);
  const states = useBankListDetails(params, 'listBankStates', 'bank', []);
  const districts = useBankListDetails(params, 'listBankDistricts', 'state', []);
  const cities = useBankListDetails(params, 'listBankCities', 'district', []);
  const branches = useBankListDetails(params, 'listBankBranches', 'city', []);
  const isDesktop = useDesktop();

  const onBankChange = (e) => {
    setParams({ bank: e });
  };

  const onStateChange = (e) => {
    setParams({
      bank: params.bank,
      state: e
    });
  };

  const onDistrictChange = (e) => {
    setParams({
      bank: params.bank,
      state: params.state,
      district: e
    });
  };

  const onCityChange = (e) => {
    setParams({
      bank: params.bank,
      state: params.state,
      district: params.district,
      city: e
    });
  };

  const onIFSCSelect = (e) => {
    helpers.setValue(e.value.ifsc);
    onClose();
  };

  if (banks.length === 0) {
    return (
      <Loading />
    );
  }

  return (isDesktop ? (
    <div>
      <SideDrawer
        backButton={true}
        onClose={onClose}
        title="Search IFSC"
      >
        <div className={styles.ifscContainer}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Select
                className={styles.select}
                classNamePrefix="react-select"
                label="Select Bank"
                placeholder="Select Bank"
                value={params.bank}
                onChange={onBankChange}
                options={banks}
              />
            </Grid>
            {params.bank && (
              <Grid item xs={12}>
                <Select
                  className={styles.select}
                  classNamePrefix="react-select"
                  label="Select State"
                  placeholder="Select State"
                  value={params.state}
                  onChange={onStateChange}
                  options={arrayToOptions(states)}
                />
              </Grid>
            )}
            {params.state && (
              <Grid item xs={12}>
                <Select
                  className={styles.select}
                  classNamePrefix="react-select"
                  label="Select District"
                  placeholder="Select District"
                  value={params.district}
                  onChange={onDistrictChange}
                  options={arrayToOptions(districts)}
                />
              </Grid>
            )}
            {params.district && (
              <Grid item xs={12}>
                <Select
                  className={styles.select}
                  classNamePrefix="react-select"
                  label="Select City"
                  placeholder="Select City"
                  value={params.city}
                  onChange={onCityChange}
                  options={arrayToOptions(cities)}
                />
              </Grid>
            )}
            {params.city && (
              <Grid item xs={12}>
                <Select
                  className={styles.select}
                  label="Select Branch"
                  classNamePrefix="react-select"
                  placeholder="Select Branch"
                  onChange={onIFSCSelect}
                  options={makeBranchOptions(branches)}
                />
              </Grid>
            )}
          </Grid>
        </div>
      </SideDrawer>
    </div>
  )
    : (
      <Drawer
        title="Search IFSC"
        onClose={onClose}
        containerClass={styles.drawer}
        topBarClass={styles.drawer}
      >
        <div className={styles.container}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Select
                className={styles.select}
                classNamePrefix="react-select"
                label="Select Bank"
                placeholder="Select Bank"
                value={params.bank}
                onChange={onBankChange}
                options={banks}
              />
            </Grid>
            {params.bank && (
              <Grid item xs={12}>
                <Select
                  className={styles.select}
                  classNamePrefix="react-select"
                  label="Select State"
                  placeholder="Select State"
                  value={params.state}
                  onChange={onStateChange}
                  options={arrayToOptions(states)}
                />
              </Grid>
            )}
            {params.state && (
              <Grid item xs={12}>
                <Select
                  className={styles.select}
                  classNamePrefix="react-select"
                  label="Select District"
                  placeholder="Select District"
                  value={params.district}
                  onChange={onDistrictChange}
                  options={arrayToOptions(districts)}
                />
              </Grid>
            )}
            {params.district && (
              <Grid item xs={12}>
                <Select
                  className={styles.select}
                  classNamePrefix="react-select"
                  label="Select City"
                  placeholder="Select City"
                  value={params.city}
                  onChange={onCityChange}
                  options={arrayToOptions(cities)}
                />
              </Grid>
            )}
            {params.city && (
              <Grid item xs={12}>
                <Select
                  className={styles.select}
                  label="Select Branch"
                  classNamePrefix="react-select"
                  placeholder="Select Branch"
                  onChange={onIFSCSelect}
                  options={makeBranchOptions(branches)}
                />
              </Grid>
            )}
          </Grid>
        </div>
      </Drawer>
    )
  );
}

IFSCSearch.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default IFSCSearch;
