import React, { useState } from 'react';
import { Drawer } from 'components/shared/Drawer';
import { Grid } from '@material-ui/core';
import { Formik } from 'formik';
import { FormikInput, Button as Btn } from 'phoenix-components';
import { Becca } from 'api';
import Loader from 'services/loader';
import SnackBar from 'services/snackbar';
import { useLocation, useHistory } from 'react-router-dom';
// import closeIcon from 'assets/images/common/close.svg';
import chevronLeftDesk from 'assets/v2/common/chevronPrimaryLeft.svg';
import errorIcon from 'assets/images/profile/warn.svg';
import sIcon from 'assets/v2/bank/success.svg';
import pIcon from 'assets/v2/bank/process.svg';
import eIcon from 'assets/v2/bank/error.svg';
import { useRefreshShop, useShop } from 'contexts';
import IFSCSearch from 'containers/profile/bank/IFSCSearch';
import { useToggle } from 'hooks/common';
import cx from 'classnames';
// import ButtonComponent from './ButtonComponent';
import Alert from 'components/shared/alert/Alert.jsx';
import EventManager from 'utils/events';
import { useDesktop } from 'contexts';
import styles from './BankDetails.module.css';
import { bankSchema, getInitialValues } from './utils';
import BankDetail from './BankDetail';

function BankDetails() {
  const [error, setError] = useState(null);
  const [openIFSC, toggleIFSC] = useToggle();
  const refreshShop = useRefreshShop();
  const location = useLocation();
  const history = useHistory();
  const isDesktop = useDesktop();

  const { bank = {} } = useShop();

  const { status = '', message } = bank;

  const isEmptyStatus = status === 'created' || status === '';

  const getStatusSection = () => {
    if (isEmptyStatus) {
      return null;
    }
    if (status === 'success') {
      return (
        <div className={cx(styles.success, styles.status)}>
          <img src={sIcon} alt="" />
          <div className={styles.left}> Account verified </div>
        </div>
      );
    }
    if (status === 'processing') {
      return (
        <div className={cx(styles.process, styles.status)}>
          <img src={pIcon} alt="" />
          <div className={styles.left}> Account verification in progress</div>
        </div>
      );
    }
    if (status === 'error') {
      return (
        <div className={cx(styles.error, styles.status1)}>
          <div className="flexEnd">
            <img src={eIcon} alt="" />
            <div className={styles.left}> Account verification failed</div>
          </div>
          <div className={styles.failed}>{message}</div>
        </div>
      );
    }
    return null;
  };

  const onSubmit = async (values) => {
    Loader.show();
    try {
      await Becca.saveBankDetails(values);
      EventManager.emitEvent('bank_detail_added');
      refreshShop();
      SnackBar.show('Details saved successfully', 'success');
      if (location?.state?.redirectTo) {
        if (location?.state?.mainRedirect) {
          history.push(location?.state?.redirectTo, {
            redirectTo: location?.state?.mainRedirect
          });
          return;
        }
        history.push(location.state.redirectTo);
        return;
      }
    } catch (e) {
      setError(e?.response?.data?.message || 'Something went wrong, try again later!');
    } finally {
      Loader.hide();
    }
  };

  return (isDesktop ? (
    <div className={styles.desktopMainContainer}>
      <div onClick={() => history.goBack()} className={styles.maintitle}>
        <img className={styles.backIconForDesktop} src={chevronLeftDesk} alt="" />
        <div>&nbsp;</div>
        <div>&nbsp;</div>
        Bank Details
      </div>
      {getStatusSection()}
      <div className={styles.container}>
        <Formik
          initialValues={getInitialValues(bank)}
          validationSchema={bankSchema}
          onSubmit={onSubmit}
        >
          {({
            submitForm,
            isValid
          }) => (
            <>
              <Grid item xs={12} className={styles.grid}>
                <FormikInput
                  name="accountNumber"
                  placeholder="Enter Account Number"
                  label="Account Number "
                />
              </Grid>
              <Grid item xs={12} className={styles.grid}>
                <FormikInput
                  name="repeatAccountNumber"
                  placeholder="Enter Account Number"
                  label="Confirm Account Number "
                />
              </Grid>
              <Grid item xs={12} className={styles.grid}>
                <FormikInput
                  name="accountName"
                  placeholder="Enter Name"
                  label="Account Holder Name "
                />
              </Grid>
              <Grid item xs={12} className={styles.grid}>
                <FormikInput
                  name="ifsc"
                  placeholder="Enter IFSC Code"
                  label="IFSC Code "
                />
              </Grid>
              <div className="flexEnd">
                <div className={styles.textRight}> Not sure about IFSC</div>
                <p onClick={toggleIFSC} className={styles.ifscButton}>click here?</p>
              </div>
              <BankDetail />
              <Btn
                className={styles.Btn}
                label="Save"
                onClick={submitForm}
                size="large"
                disabled={!isValid}
              />
              {error !== null && (
                <Alert
                  text={error}
                  btnText="Ok"
                  icon={errorIcon}
                  textClass={styles.textClass}
                  onClick={() => setError(null)}
                />
              )}
              {openIFSC && (<IFSCSearch onClose={toggleIFSC} />)}
            </>
          )}
        </Formik>
      </div>
    </div>
  )
    : (
      <Drawer
        title="Bank Details"
        containerClass={styles.drawer}
        topBarClass={styles.drawer}
      >
        <div className={styles.container}>
          {getStatusSection()}
          <Formik
            initialValues={getInitialValues(bank)}
            validationSchema={bankSchema}
            onSubmit={onSubmit}
          >
            {({
              submitForm,
              isValid
            }) => (
              <>
                <Grid item xs={12} className={styles.grid}>
                  <FormikInput
                    name="accountNumber"
                    placeholder="Enter Account Number"
                    label="Account Number "
                  />
                </Grid>
                <Grid item xs={12} className={styles.grid}>
                  <FormikInput
                    name="repeatAccountNumber"
                    placeholder="Enter Account Number"
                    label="Confirm Account Number "
                  />
                </Grid>
                <Grid item xs={12} className={styles.grid}>
                  <FormikInput
                    name="accountName"
                    placeholder="Enter Name"
                    label="Account Holder Name "
                  />
                </Grid>
                <Grid item xs={12} className={styles.grid}>
                  <FormikInput
                    name="ifsc"
                    placeholder="Enter IFSC Code"
                    label="IFSC Code "
                  />
                </Grid>
                <div className="flexEnd">
                  <div className={styles.textRight}> Not sure about IFSC</div>
                  <p onClick={toggleIFSC} className={styles.ifscButton}>click here?</p>
                </div>
                <BankDetail />
                <Btn
                  className={styles.Btn}
                  label="Save"
                  onClick={submitForm}
                  fullWidth={true}
                  size="large"
                  disabled={!isValid}
                />
                {error !== null && (
                  <Alert
                    text={error}
                    btnText="Ok"
                    icon={errorIcon}
                    textClass={styles.textClass}
                    onClick={() => setError(null)}
                  />
                )}
                {openIFSC && (<IFSCSearch onClose={toggleIFSC} />)}
              </>
            )}
          </Formik>
        </div>
      </Drawer>
    )
  );
}

BankDetails.propTypes = {};

BankDetails.defaultProps = {};

export default BankDetails;
