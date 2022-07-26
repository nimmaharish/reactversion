import React, { useEffect, useState } from 'react';
import { Drawer } from 'components/shared/Drawer';
import WebView from 'services/webview';
import PropTypes from 'prop-types';
import debbyIcon from 'assets/v2/login/debby.svg';
import { FooterButton } from 'components/common/FooterButton';
import { Button } from 'phoenix-components';
import { Loading } from 'components/shared/Loading';
import { useDesktop } from 'contexts';
import { SideDrawer } from 'components/shared/SideDrawer';
import styles from './Sample.module.css';

export function Sample({ onBack, onClose }) {
  const [open, setOpen] = useState(true);
  const isDesktop = useDesktop();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setOpen(false);
    }, 1000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      {isDesktop ? (
        <SideDrawer
          backButton={true}
          onClose={onBack}
          title="Sample Shops"
        >
          {open && (<Loading />)}
          <div className={styles.container}>
            {/* <div className={styles.head}>
              Our Best Shops
            </div> */}
            <div className={styles.shop}>
              <div className={styles.title}>
                Anabella Women
              </div>
              <div className={styles.helper}>
                Simply a Woman- Boho Chic Urban Dresses & Clothing
              </div>
              <div className={styles.imgContainer}>
                <img src={debbyIcon} alt="shop" className={styles.shopIcon} />
              </div>
            </div>
            <div className="marginMTopBottom" />
            <div className="flexCenter">
              <Button
                label="View Shop"
                size="medium"
                bordered={true}
                onClick={() => {
                  const ind = 'https://mywindo.shop/anabellawomen?themeName=lilac';
                  if (WebView.isWebView()) {
                    WebView.openUrl(ind);
                    return;
                  }
                  window.open(ind, '_blank');
                }}
              />
            </div>
            <div className="marginMTopBottom" />
            <div className={styles.shop}>
              <div className={styles.title}>
                Kiara Fashion
              </div>
              <div className={styles.helper}>
                silk/half saree/embroidery sarees/lehenga choli/jewelry
              </div>
              <div className={styles.imgContainer}>
                <img src={debbyIcon} alt="shop" className={styles.shopIcon} />
              </div>
            </div>
            <div className="marginMTopBottom" />
            <div className="flexCenter">
              <Button
                label="View Shop"
                size="medium"
                bordered={true}
                onClick={() => {
                  const ind = 'https://mywindo.shop/kiarafashion?themeName=daffodil';
                  if (WebView.isWebView()) {
                    WebView.openUrl(ind);
                    return;
                  }
                  window.open(ind, '_blank');
                }}
              />
            </div>
            <div className="marginMTopBottom" />
            <div className={styles.shop}>
              <div className={styles.title}>
                Get Fish
              </div>
              <div className={styles.helper}>
                Fish & Fish Accessories
              </div>
              <div className={styles.imgContainer}>
                <img src={debbyIcon} alt="shop" className={styles.shopIcon} />
              </div>
            </div>
            <div className="marginMTopBottom" />
            <div className="flexCenter">
              <Button
                label="View Shop"
                size="medium"
                bordered={true}
                onClick={() => {
                  const ind = 'https://mywindo.shop/getfish';
                  if (WebView.isWebView()) {
                    WebView.openUrl(ind);
                    return;
                  }
                  window.open(ind, '_blank');
                }}
              />
            </div>
            <div className="marginMTopBottom" />
            <div className={styles.btns}>
              <Button
                label="Create Shop"
                size="large"
                fullWidth
                bordered={false}
                primary={true}
                onClick={onClose}
              />
            </div>
          </div>
        </SideDrawer>
      ) : (
        <Drawer
          title="Sample Shops"
          onClose={onBack}
        >
          {open && (<Loading />)}
          <div className={styles.container}>
            {/* <div className={styles.head}>
              Our Best Shops
            </div> */}
            <div className={styles.shop}>
              <div className={styles.title}>
                Anabella Women
              </div>
              <div className={styles.helper}>
                Simply a Woman- Boho Chic Urban Dresses & Clothing
              </div>
              <div className={styles.imgContainer}>
                <img src={debbyIcon} alt="shop" className={styles.shopIcon} />
              </div>
            </div>
            <div className="marginMTopBottom" />
            <div className="flexCenter">
              <Button
                label="View Shop"
                size="medium"
                bordered={true}
                onClick={() => {
                  const ind = 'https://mywindo.shop/anabellawomen?themeName=lilac';
                  if (WebView.isWebView()) {
                    WebView.openUrl(ind);
                    return;
                  }
                  window.open(ind, '_blank');
                }}
              />
            </div>
            <div className="marginMTopBottom" />
            <div className={styles.shop}>
              <div className={styles.title}>
                Kiara Fashion
              </div>
              <div className={styles.helper}>
                silk/half saree/embroidery sarees/lehenga choli/jewelry
              </div>
              <div className={styles.imgContainer}>
                <img src={debbyIcon} alt="shop" className={styles.shopIcon} />
              </div>
            </div>
            <div className="marginMTopBottom" />
            <div className="flexCenter">
              <Button
                label="View Shop"
                size="medium"
                bordered={true}
                onClick={() => {
                  const ind = 'https://mywindo.shop/kiarafashion?themeName=daffodil';
                  if (WebView.isWebView()) {
                    WebView.openUrl(ind);
                    return;
                  }
                  window.open(ind, '_blank');
                }}
              />
            </div>
            <div className="marginMTopBottom" />
            <div className="marginMTopBottom" />
            <div className={styles.shop}>
              <div className={styles.title}>
                Get Fish
              </div>
              <div className={styles.helper}>
                Fish & Fish Accessories
              </div>
              <div className={styles.imgContainer}>
                <img src={debbyIcon} alt="shop" className={styles.shopIcon} />
              </div>
            </div>
            <div className="marginMTopBottom" />
            <div className="flexCenter">
              <Button
                label="View Shop"
                size="medium"
                bordered={true}
                onClick={() => {
                  const ind = 'https://mywindo.shop/getfish';
                  if (WebView.isWebView()) {
                    WebView.openUrl(ind);
                    return;
                  }
                  window.open(ind, '_blank');
                }}
              />
            </div>
            <div className="marginMTopBottom" />
          </div>
          <FooterButton>
            <div className={styles.btns}>
              <Button
                label="Create Shop"
                size="large"
                fullWidth
                primary={true}
                bordered={false}
                onClick={onClose}
              />
            </div>
          </FooterButton>
        </Drawer>
      )}
    </>
  );
}

Sample.propTypes = {
  onBack: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};
