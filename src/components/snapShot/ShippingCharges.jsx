import React from 'react';
import { useHistory } from 'react-router-dom';
import { useShop } from 'contexts/userContext';
import editIcon from 'assets/overview/edit.svg';
import {
  Table, TableBody, TableCell, TableHead, TableRow, TableContainer
} from '@material-ui/core';
import Accordion from './Accordion';
import styles from './Overview.module.css';

function ShippingCharges() {
  const shop = useShop();
  const currency = shop?.currency;
  const history = useHistory();

  return (
    <>
      <Accordion
        label="Shipping Charges"
        labelHelper="View Shipping Charges"
      >
        <div className={styles.padded}>
          <div
            className={styles.top}
            onClick={() => {
              history.push('/manage/delivery');
            }}
          >
            <div className={styles.head1}>
              Enabled Shipping Charges
            </div>
            <img src={editIcon} alt="snapshot" />
          </div>
          <>
            {shop?.delivery?.chargeType === 'free' && (
              <div className={styles.type}>
                Free Shipping
              </div>
            )}
            {shop?.delivery?.chargeType === 'distance' && (
              <>
                <div className={styles.type}>
                  Distance Based Shipping
                </div>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Min Order Value</TableCell>
                        <TableCell>Max Order Value</TableCell>
                        <TableCell>range from </TableCell>
                        <TableCell>range to</TableCell>
                        <TableCell>
                          Charges
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {shop?.delivery?.distanceMatrix?.map((key) => (
                        <TableRow>
                          <TableCell>
                            {currency}
                            {' '}
                            {key?.from}
                          </TableCell>
                          <TableCell>
                            {currency}
                            {' '}
                            {key?.to}
                          </TableCell>
                          <TableCell>
                            {key.unit}
                            {' '}
                            {key?.fromDistance}
                          </TableCell>
                          {' '}
                          <TableCell>
                            {key.unit}
                            {' '}
                            {key?.toDistance}
                          </TableCell>
                          <TableCell>
                            {currency}
                            {' '}
                            {key?.charge}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}
            {shop?.delivery?.chargeType === 'conditional' && (
              <>
                <div className={styles.type}>
                  Order Value Based Shipping
                </div>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Min Order Value</TableCell>
                        <TableCell>Max Order Value</TableCell>
                        <TableCell>Charges</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {shop?.delivery?.otherCharges?.map((key) => (
                        <TableRow>
                          <TableCell>
                            {currency}
                            {' '}
                            {key?.from}
                          </TableCell>
                          <TableCell>
                            {currency}
                            {' '}
                            {key?.to}
                          </TableCell>
                          <TableCell>
                            {currency}
                            {' '}
                            {key?.charge}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}
            {shop?.delivery?.chargeType === 'fixed' && (
              <>
                <div className={styles.type}>
                  Fixed Charges
                </div>
                <div className={styles.valueContainer}>
                  <div className={styles.minValue}>
                    <div className={styles.text}>
                      Min order value
                    </div>
                    <div className={styles.value}>
                      {currency}
                      {' '}
                      {shop?.delivery?.freeDeliveryValue}
                    </div>
                  </div>
                  <div className={styles.lineV} />
                  <div className={styles.minValue}>
                    <div className={styles.text}>
                      Fixed delivery charge
                    </div>
                    <div className={styles.value}>
                      {currency}
                      {' '}
                      {shop?.delivery?.charges}
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        </div>
      </Accordion>
    </>
  );
}

export default ShippingCharges;
