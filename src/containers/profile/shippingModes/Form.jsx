import React from 'react';
import PropTypes from 'prop-types';
import { FormikInput, Button } from 'phoenix-components';
import { useDesktop, useShop } from 'contexts';
import { SideDrawer } from 'components/shared/SideDrawer';
import { Drawer } from 'components/shared/Drawer';
import { Formik, useFormikContext } from 'formik';
import { Select } from 'phoenix-components/lib/formik';
import SnackBar from 'services/snackbar';
import { useHistory } from 'react-router-dom';
import styles from './Form.module.css';
import { getIntitalCustomValues, typeOptions, shippingSchema } from './utils';

export function Form({
  onClose, index
}) {
  const isDesktop = useDesktop();
  const Component = isDesktop ? SideDrawer : Drawer;
  const { values, submitForm: parentSubmit, setValues } = useFormikContext();
  const {
    addresses = []
  } = useShop();

  const history = useHistory();

  const props = !isDesktop ? {
    title: 'Add Custom',
    onClose,
  } : {
    title: 'Add Custom',
    onClose,
    backButton: true
  };

  const onSubmit = async (value) => {
    if (index === null) {
      values.custom.push(value);
    } else {
      values.custom[index] = value;
    }
    setValues({ ...values });
    parentSubmit();
  };

  return (
    <Component
      classes={isDesktop ? undefined : {
        heading: styles.bottomDrawerContainer,
      }}
      closeButton={!isDesktop}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}>
      <div className={styles.container}>
        <Formik
          initialValues={getIntitalCustomValues(index, values)}
          validationSchema={shippingSchema}
          onSubmit={onSubmit}
        >
          {({ values, setFieldValue, submitForm }) => (
            <>
              <FormikInput
                name="title"
                fullWidth
                label="Shipping Title"
                placeholder="Title Name"
              />
              <div className={styles.spacer} />
              <Select
                label="Choose Shipping Type,"
                name="type"
                onChange={(val) => {
                  if (val.value === 'pickup' && addresses.length === 0) {
                    SnackBar.show('please add shop address', 'error');
                    history.push('/manage/address', {
                      redirectTo: '/manage/shippingModes',
                    });
                  }
                  setFieldValue('type', val.value);
                }}
                options={typeOptions}
                value={typeOptions.find(x => x.value === values?.type)}
              />
              <br />
              <Button
                label="Save"
                fullwidth={true}
                className={styles.saveButton}
                variant="primary"
                onClick={submitForm}
              />
            </>
          )}
        </Formik>
      </div>
    </Component>
  );
}

Form.propTypes = {
  onClose: PropTypes.func.isRequired,
  index: PropTypes.number,
};

Form.defaultProps = {
  index: null,
};
