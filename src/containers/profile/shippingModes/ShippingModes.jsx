import React, { useState } from 'react';
import { Drawer } from 'components/shared/Drawer';
import { Clickable } from 'phoenix-components';
import { Formik } from 'formik';
import { Becca } from 'api';
import Loader from 'services/loader';
import SnackBar from 'services/snackbar';
import { useHistory, useLocation } from 'react-router-dom';
import { useRefreshShop, useShop } from 'contexts';
import { useDesktop } from 'contexts';
import { SideDrawer } from 'components/shared/SideDrawer';
import { useToggle } from 'hooks/common';
import cx from 'classnames';
import plusIcon from 'assets/v2/orders/plus.svg';
import { getInitialValues, schema } from './utils';
import Card from './Card';
import styles from './ShippingModes.module.css';
import { Form } from './Form';

function ShippingModes() {
  const history = useHistory();
  const location = useLocation();
  const {
    delivery: { shippingModes },
  } = useShop();
  const refresh = useRefreshShop();
  const isDesktop = useDesktop();
  const [openForm, toggleForm] = useToggle(false);
  const [index, setIndex] = useState(null);

  const onSubmit = async (values) => {
    try {
      Loader.show();
      await Becca.updateShop({
        shippingModes: values,
      });
      SnackBar.show('Shipping modes updated successfully', 'success');
      refresh();
      if (location?.state?.redirectTo) {
        history.push(location.state.redirectTo);
      }
    } catch (e) {
      SnackBar.showError(e);
    } finally {
      Loader.hide();
    }
  };

  const Component = isDesktop ? SideDrawer : Drawer;

  const onClose = () => {
    history.goBack();
  };

  const onEdit = (idx) => {
    toggleForm();
    setIndex(idx);
  };

  const props = !isDesktop ? {
    title: 'Shipping Modes',
    onClose,
    className: styles.title
  } : {
    title: 'Shipping Modes',
    className: styles.desktopContainer,
    onClose,
    backButton: true
  };

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Component {...props}>
      <Formik
        validationSchema={schema}
        initialValues={getInitialValues(shippingModes)}
        onSubmit={onSubmit}
      >
        {({ values }) => (
          <div className={styles.container}>
            <p className={styles.modesText}>Choose Shipping Modes</p>
            <>
              <div className={styles.box}>
                <Card
                  key="delivery"
                  path="delivery"
                />
                <Card
                  key="pickup"
                  path="pickup"
                />
                {(values?.custom?.map((item, idx) => (
                  <Card
                    onEdit={onEdit}
                    idx={idx}
                    path={`custom[${idx}]`}
                    type="custom"
                  />
                )))}
              </div>
              <Clickable
                className={cx(styles.marginTop, styles.customBox, styles.w100)}
                onClick={() => {
                  setIndex(null);
                  toggleForm();
                }}
              >
                <div className={cx(styles.flex)}>
                  Add Custom
                  <img
                    src={plusIcon}
                    alt="plus"
                  />
                </div>
              </Clickable>
            </>
            {openForm && (
              <Form
                onClose={toggleForm}
                index={index}
              />
            )}
          </div>
        )}
      </Formik>
    </Component>
  );
}

export default ShippingModes;
