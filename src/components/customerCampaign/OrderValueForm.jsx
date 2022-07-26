import React from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import { useDesktop, useShop } from 'contexts';
import { FormikInput, Button } from 'phoenix-components';
import { FooterButton } from 'components/common/FooterButton';
import { SideDrawer } from 'components/shared/SideDrawer';
import { BottomDrawer } from '../shared/BottomDrawer';
import styles from './OrderValueForm.module.css';

export function OrderValueForm({
  onSubmit, onClose,
}) {
  const shop = useShop();
  const isDesktop = useDesktop();
  const Component = isDesktop ? SideDrawer : BottomDrawer;

  return (
    <Formik
      initialValues={{
        min: 0,
        max: 0,
      }}
      onSubmit={onSubmit}
    >
      {({ submitForm }) => (
        <Component
          title="Filter by order value"
          closeButton={false}
          backButton
          onClose={onClose}
        >
          <div>
            <div className={styles.paddingBottom}>
              <FormikInput
                name="min"
                label="Minimum Order Value"
                type="number"
                readonly={false}
                placeholder={`${shop.currency} 2000`}
              />
            </div>
            <div className={styles.paddingBottom}>
              <FormikInput
                name="max"
                label="Maximum order value"
                type="number"
                placeholder={`${shop.currency} 5000`}
              />
            </div>
            {isDesktop ? (
              <div className={styles.chargeButtons}>
                <Button
                  bordered={false}
                  label="Apply"
                  className={styles.button}
                  onClick={submitForm}
                />
              </div>
            ) : (
              <div className={styles.chargeButtons}>
                <FooterButton>
                  <Button
                    fullWidth
                    bordered={false}
                    label="Apply"
                    className={styles.button}
                    onClick={submitForm}
                    variant="outlined"
                    size="small"
                  />
                </FooterButton>
              </div>
            )}

          </div>
        </Component>
      )}
    </Formik>
  );
}

OrderValueForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

OrderValueForm.defaultProps = {
};
