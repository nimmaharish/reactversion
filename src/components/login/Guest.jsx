import React from 'react';
// import { useQueryParams } from 'hooks';
import { useToggle } from 'hooks/common';
import { Drawer } from 'components/shared/Drawer';

import shopIcon from 'assets/v2/login/shop.svg';
import productIcon from 'assets/v2/login/products.svg';
import paymentsIcon from 'assets/v2/login/payments.svg';
import shareIcon from 'assets/v2/login/share.svg';
import { Button } from 'phoenix-components';
import PropTypes from 'prop-types';
import { useDesktop } from 'contexts';
import { SideDrawer } from 'components/shared/SideDrawer';
import { Sample } from './Sample';
import styles from './Guest.module.css';

export function Guest({ onBack }) {
  const [openSample, toggleSample] = useToggle(false);
  const isDesktop = useDesktop();

  return (
    <>
      {isDesktop ? (
        <>
          <SideDrawer
            backButton={true}
            onClose={onBack}
            title="Continue as Guest"
          >
            <div className={styles.container}>
              <div className={styles.content}>
                <div className={styles.headText}>
                  Welcome to WINDO
                </div>
                <div className={styles.helperText}>
                  create your own online store in just 2 minutes and take your business online.
                </div>
              </div>
              <div className={styles.card}>
                <img src={shopIcon} alt="shop" className={styles.shopIcon} />
              </div>
              <div className={styles.steps}>
                <div className={styles.stepCard}>
                  <img src={productIcon} alt="" />
                  <div className={styles.stepCard1}>
                    <div className={styles.stepText}>
                      Add Products
                    </div>
                    <div className={styles.stepHelper}>
                      upload from device or sync your instagram media or bulk-upload by file
                    </div>
                  </div>
                </div>
                <div className={styles.lineV} />
                <div className={styles.stepCard}>
                  <img src={paymentsIcon} alt="" />
                  <div className={styles.stepCard1}>
                    <div className={styles.stepText}>
                      Enable Payments
                    </div>
                    <div className={styles.stepHelper}>
                      connect your online payment gateway or get it to your bank directly or by cash
                    </div>
                  </div>
                </div>
                <div className={styles.lineV} />
                <div className={styles.stepCard}>
                  <img src={shareIcon} alt="" />
                  <div className={styles.stepCard1}>
                    <div className={styles.stepText}>
                      Share & Grow
                    </div>
                    <div className={styles.stepHelper}>
                      share your online store link via social media to reach more customers
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.buttonContainerDesk}>
                <Button
                  label="Take a Tour"
                  className={styles.button}
                  onClick={toggleSample}
                />
              </div>
            </div>
            {openSample && <Sample onBack={toggleSample} onClose={onBack} />}
          </SideDrawer>
        </>
      ) : (
        <Drawer
          title="Continue as Guest"
          onClose={onBack}
        >
          <div className={styles.container}>
            <div className={styles.content}>
              <div className={styles.headText}>
                Welcome to WINDO
              </div>
              <div className={styles.helperText}>
                create your own online store in just 2 minutes and take your business online.
              </div>
            </div>
            <div className={styles.card}>
              <img src={shopIcon} alt="shop" className={styles.shopIcon} />
            </div>
            <div className={styles.steps}>
              <div className={styles.stepCard}>
                <img src={productIcon} alt="" />
                <div className={styles.stepCard1}>
                  <div className={styles.stepText}>
                    Add Products
                  </div>
                  <div className={styles.stepHelper}>
                    upload from device or sync your instagram media or bulk-upload by file
                  </div>
                </div>
              </div>
              <div className={styles.lineV} />
              <div className={styles.stepCard}>
                <img src={paymentsIcon} alt="" />
                <div className={styles.stepCard1}>
                  <div className={styles.stepText}>
                    Enable Payments
                  </div>
                  <div className={styles.stepHelper}>
                    connect your online payment gateway or get it to your bank directly or by cash
                  </div>
                </div>
              </div>
              <div className={styles.lineV} />
              <div className={styles.stepCard}>
                <img src={shareIcon} alt="" />
                <div className={styles.stepCard1}>
                  <div className={styles.stepText}>
                    Share & Grow
                  </div>
                  <div className={styles.stepHelper}>
                    share your online store link via social media to reach more customers
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.buttonContainer}>
            <Button
              label="Take a Tour"
              fullWidth
              bordered={false}
              className={styles.button}
              onClick={toggleSample}
            />
          </div>
          {openSample && <Sample onBack={toggleSample} onClose={onBack} />}
        </Drawer>
      )}

    </>
  );
}

Guest.propTypes = {
  onBack: PropTypes.func.isRequired,
};
