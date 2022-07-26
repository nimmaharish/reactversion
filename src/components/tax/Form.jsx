import React from 'react';
import { Formik, useFormikContext } from 'formik';
import { useHistory } from 'react-router-dom';
import { Drawer } from 'components/shared/Drawer';
import { SideDrawer } from 'components/shared/SideDrawer';
import { useDesktop } from 'contexts';
import PropTypes from 'prop-types';
import { Button, FormikInput } from 'phoenix-components';
import { getInitialValues, schema } from './utils';
import styles from './List.module.css';

export default function Form({ onClose, index }) {
  const isDesktop = useDesktop();
  const history = useHistory();
  const Component = isDesktop ? SideDrawer : Drawer;
  const { values: { taxes = [] }, submitForm: submit } = useFormikContext();
  const closeDraw = () => {
    history.push('/settings/tax');
  };

  const onSubmit = async (values) => {
    if (index === -1) {
      taxes.push(values);
    } else {
      taxes[index] = values;
    }
    submit();
  };

  return (
    <Component
      title="Enter Tax Details"
      backButton={true}
      onClose={onClose || closeDraw}
    >
      <Formik
        validationSchema={schema}
        initialValues={getInitialValues(taxes, index)}
        onSubmit={onSubmit}
      >
        {({ submitForm }) => (
          <>
            <div className={styles.container}>
              <FormikInput
                name="title"
                label="Tax Title"
                placeholder="e.g. GST" />
              <div className="marginMTopBottom"></div>
              <FormikInput
                name="identifier"
                label="Tax Identification Number (optional)"
                placeholder="Mention your unique tax ID"
              />
              <div className="marginMTopBottom"></div>
              <FormikInput
                name="value"
                type="number"
                label="Tax Percentage"
                placeholder="e.g. 18.5"
              />
            </div>
            {isDesktop ? (
              <div className={styles.buttonForm}>
                <Button
                  bordered={true}
                  label="Save"
                  size="large"
                  onClick={submitForm}
                />
              </div>
            ) : (
              <div className={styles.buttonForm}>
                <Button
                  fullWidth
                  bordered={false}
                  label="Save"
                  size="large"
                  onClick={submitForm}

                />
              </div>
            )}
          </>
        )}
      </Formik>
    </Component>
  );
}

Form.propTypes = {
  onClose: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
};

Form.defaultProps = {};
