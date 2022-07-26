import React, { useState } from 'react';
import {
  Grid,
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { Drawer } from 'components/shared/Drawer';
import { Becca } from 'api/index';
import { get } from 'lodash';
import Snackbar from 'services/snackbar';
import Alert from 'components/profile/delivery/Alert';
import { useShop } from 'contexts/userContext';
import { Button, FormikInput } from 'phoenix-components';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDesktop } from 'contexts';
import { SideDrawer } from 'components/shared/SideDrawer';
import styles from './DeliveryCalculator.module.css';

function deliveryCalculator() {
  const history = useHistory();
  const [dc, setDc] = useState(0);

  const shoppe = useShop();
  const { currency } = shoppe;
  const isDesktop = useDesktop();

  const schema = Yup.object()
    .shape({
      from: Yup.number().required('From Pincode/Zipcode Required'),
      to: Yup.number().required('To Pincode/Zipcode Required'),
      dimensions: Yup.object()
        .shape({
          length: Yup.number().required('Length Required'),
          width: Yup.number().required('Width Required'),
          height: Yup.number().required('Height Required'),
        }),
      price: Yup.number().required('Order Amount Required'),
      weight: Yup.number().required('Weight Required'),
    });

  function getInitialValues() {
    return {
      from: '',
      to: '',
      dimensions: {
        height: '',
        width: '',
        length: ''
      },
      weight: '',
      price: ''
    };
  }

  const onSubmit = async (values) => {
    try {
      const { price } = await Becca.getCharges(values);
      setDc(price);
    } catch (exception) {
      const msg = get(exception, 'response.data.message', 'unknown error');
      Snackbar.show(msg, 'error');
    }
  };

  if (isDesktop) {
    return (

      <>
        <Formik
          initialValues={getInitialValues()}
          validationSchema={schema}
          onSubmit={onSubmit}
        >
          {({ submitForm }) => (
            <SideDrawer
              backButton={true}
              title="Delivery Calculator"
              onClose={() => history.goBack()}
              button={true}
              btnLabel="Get Charges"
              buttonSize="large"
              onClick={() => submitForm()}
            >
              <div className={styles.center_align}>
                {dc > 0 && (
                  <Alert
                    amount={`${currency} ${dc.toFixed(2)}`}
                    onClick={() => setDc(0)}
                  />
                )}
                <>
                  <Grid container spacing={2} className={styles.calculatorForm}>
                    <div className="fullWidth">
                      <FormikInput
                        name="from"
                        type="number"
                        placeholder="e.g. 560047"
                        label="Enter Pickup Postal Code"
                      />
                    </div>
                    <div className="fullWidth">
                      <FormikInput
                        name="to"
                        type="number"
                        placeholder="e.g. 560085"
                        label="Enter Destination Postal Code"
                      />
                    </div>
                    <div className={styles.box_flex}>
                      <div item xs={6} className={styles.box_input}>
                        <FormikInput
                          name="dimensions.length"
                          type="number"
                          placeholder="e.g. 11"
                          label="Enter Package Length (cm)"
                        />
                      </div>
                      <div item xs={6} className={styles.box_input1}>
                        <FormikInput
                          name="dimensions.width"
                          type="number"
                          placeholder="e.g. 8"
                          label="Enter Package Width (cm)."
                          required={true}
                        />
                      </div>
                    </div>
                    <div className={styles.box_flex}>
                      <div className={styles.box_input}>
                        <FormikInput
                          name="dimensions.height"
                          type="number"
                          placeholder="e.g. 4"
                          label="Enter Package Height (cm)"
                        // required={true}
                        />
                      </div>
                      <div className={styles.box_input1}>
                        <FormikInput
                          name="weight"
                          type="number"
                          placeholder="e.g. 18"
                          label="Enter Package weight (gm)"
                        // required={true}
                        />
                      </div>
                    </div>
                    <div className="fullWidth">
                      <FormikInput
                        name="price"
                        type="number"
                        placeholder="Input the worth of your order"
                        label="Enter Order Value"
                        required={true}
                      />
                    </div>
                  </Grid>
                </>
              </div>
            </SideDrawer>
          )}
        </Formik>
      </>

    );
  }

  return (
    <div className={styles.center_align}>
      <Drawer
        onBack={() => history.goBack()}
        title="Delivery Calculator"
      >
        {dc > 0 && (
          <Alert
            amount={`${currency} ${dc.toFixed(2)}`}
            onClick={() => setDc(0)}
          />
        )}
        <Formik
          initialValues={getInitialValues()}
          validationSchema={schema}
          onSubmit={onSubmit}
        >
          {({ submitForm }) => (
            <>
              <Grid container className={styles.calculatorForm}>
                <div className="fullWidth">
                  <FormikInput
                    name="from"
                    type="number"
                    placeholder="e.g. 560047"
                    label="Enter Pickup Postal Code"
                  />
                </div>
                <div className="fullWidth">
                  <FormikInput
                    name="to"
                    type="number"
                    placeholder="e.g. 560085"
                    label="Enter Destination Postal Code"
                  />
                </div>
                <div className={styles.box_flex}>
                  <div item xs={6} className={styles.box_input}>
                    <FormikInput
                      name="dimensions.length"
                      type="number"
                      placeholder="e.g. 11"
                      label="Enter Package Length (cm)"
                    />
                  </div>
                  <div item xs={6} className={styles.box_input1}>
                    <FormikInput
                      name="dimensions.width"
                      type="number"
                      placeholder="e.g. 8"
                      label="Enter Package Width (cm)."
                      required={true}
                    />
                  </div>
                </div>
                <div className={styles.box_flex}>
                  <div className={styles.box_input}>
                    <FormikInput
                      name="dimensions.height"
                      type="number"
                      placeholder="e.g. 4"
                      label="Enter Package Height (cm)"
                      // required={true}
                    />
                  </div>
                  <div className={styles.box_input1}>
                    <FormikInput
                      name="weight"
                      type="number"
                      placeholder="e.g. 18"
                      label="Enter Package weight (gm)"
                      // required={true}
                    />
                  </div>
                </div>
                <div className="fullWidth">
                  <FormikInput
                    name="price"
                    type="number"
                    placeholder="Input the worth of your order"
                    label="Enter Order Value"
                    required={true}
                  />
                </div>
                <div className={styles.chargesBtn}>
                  <Button
                    label="Get Charges"
                    size="large"
                    onClick={submitForm}
                  >
                    Get Charges
                  </Button>
                </div>
              </Grid>
            </>
          )}
        </Formik>
      </Drawer>
    </div>
  );
}
export default deliveryCalculator;
