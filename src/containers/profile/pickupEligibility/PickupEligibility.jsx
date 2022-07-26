import React, { useState } from 'react';
import { Drawer } from 'components/shared/Drawer';
import { Dialog, DialogContent } from '@material-ui/core';
import { Formik } from 'formik';
import { FormikInput, Button } from 'phoenix-components';
import { Becca } from 'api';
import Loader from 'services/loader';
import SnackBar from 'services/snackbar';
import * as Yup from 'yup';
import checkIcon from 'assets/images/profile/check.svg';
import errorIcon from 'assets/images/profile/error.svg';
import cx from 'classnames';
import { useDesktop } from 'contexts';
import { SideDrawer } from 'components/shared/SideDrawer';
import { useHistory } from 'react-router-dom';
import styles from './PickupEligibility.module.css';

const schema = Yup.object()
  .shape({
    pincode: Yup.string().min(6, 'invalid pincode').max(6, 'invalid pincode')
      .required()
      .label('pincode'),
  });

function PickupEligibility() {
  const [eligible, setEligible] = useState(null);
  const isDesktop = useDesktop();
  const history = useHistory();

  const onSubmit = async ({ pincode }) => {
    Loader.show();
    try {
      const { result } = await Becca.checkPickupEligibility(pincode);
      setEligible(result);
    } catch (e) {
      SnackBar.showError(e);
    } finally {
      Loader.hide();
    }
  };

  if (isDesktop) {
    return (
      <SideDrawer
        backButton={true}
        title="Check Pickup Availability"
        onClose={() => history.goBack()}
      >
        <div className={styles.container}>
          <Formik
            initialValues={{ pincode: '' }}
            validationSchema={schema}
            onSubmit={onSubmit}
          >
            {({ submitForm, values, isValid }) => (
              <>
                <div>
                  <FormikInput
                    label="Enter Pincode"
                    placeholder="Enter Code"
                    name="pincode"
                    type="number"
                  />
                  <div className="flexCenter">
                    <Button
                      label="Check Availabilty"
                      className={styles.button}
                      onClick={submitForm}
                      size="large"
                      disabled={!isValid}
                    />
                  </div>
                </div>
                {eligible !== null && (
                  <Dialog open={true} maxWidth="md" onClose={() => setEligible(null)}>
                    <DialogContent>
                      <div className={cx(styles.popup, 'textCenter')}>
                        <img src={eligible === true ? checkIcon : errorIcon} alt="" className={styles.icon} />
                        <div className={eligible === true ? styles.success : styles.error}>
                          Pincode -
                          {' '}
                          {values.pincode}
                        </div>
                        <div className={styles.message}>
                          {eligible === true
                            ? 'Pincode you entered is eligible for pickup'
                            : 'Pincode you entered is not eligible for pickup'}
                        </div>
                        <div className="flexCenter">
                          <Button
                            label="ok"
                            className={styles.okButton}
                            onClick={() => setEligible(null)}
                            size="medium"
                          />
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </>
            )}
          </Formik>
        </div>
      </SideDrawer>
    );
  }

  return (
    <Drawer title="Checkup Pickup Availability" containerClass={styles.drawer} topBarClass={styles.drawer}>
      <div className={styles.container}>
        <Formik
          initialValues={{ pincode: '' }}
          validationSchema={schema}
          onSubmit={onSubmit}
        >
          {({ submitForm, values, isValid }) => (
            <>
              <div>
                <FormikInput
                  label="Enter Pincode"
                  placeholder="Enter Code"
                  name="pincode"
                  type="number"
                />
                <div className="flexCenter">
                  <Button
                    label="Check Availabilty"
                    className={styles.button}
                    onClick={submitForm}
                    size="large"
                    disabled={!isValid}
                  />
                </div>
              </div>
              {eligible !== null && (
                <Dialog open={true} maxWidth="md" fullWidth onClose={() => setEligible(null)}>
                  <DialogContent>
                    <div className={cx(styles.popup, 'textCenter')}>
                      <img src={eligible === true ? checkIcon : errorIcon} alt="" className={styles.icon} />
                      <div className={eligible === true ? styles.success : styles.error}>
                        Pincode -
                        {' '}
                        {values.pincode}
                      </div>
                      <div className={styles.message}>
                        {eligible === true
                          ? 'Pincode you entered is eligible for pickup'
                          : 'Pincode you entered is not eligible for pickup'}
                      </div>
                      <div className="flexCenter">
                        <Button
                          label="ok"
                          className={styles.okButton}
                          onClick={() => setEligible(null)}
                          size="medium"
                        />
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </>
          )}
        </Formik>
      </div>
    </Drawer>
  );
}

PickupEligibility.propTypes = {};

PickupEligibility.defaultProps = {};

export default PickupEligibility;
