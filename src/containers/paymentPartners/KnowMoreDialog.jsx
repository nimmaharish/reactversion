import React from 'react';
import PropTypes from 'prop-types';
import { Drawer } from 'components/shared/Drawer';
import { Button, Clickable } from 'phoenix-components';
import { useDesktop, useShop } from 'contexts';
import { SideDrawer } from 'components/shared/SideDrawer';
import WebView from 'services/webview';
import Info from 'components/info/Info';
import { PAYPAL_SUPPORTED_CURRENCY } from 'containers/paymentPartners/utils';
import styles from './KnowMoreDialog.module.css';

// eslint-disable-next-line max-len
const paypalNote = 'Paypal doesn\'t support your currency yet, so your orders will be processed in USD by default during order checkout. Please note that your currency to USD conversion will be calculated in 1 Hour intervals and the effective price in the last hour will be used to calculate the order amount during checkout.';

export function KnowMoreDialog({
  title,
  list,
  onAction,
  description,
  onBack,
  heading,
  url,
  name,
}) {
  const isDesktop = useDesktop();
  const { currency } = useShop();

  const openUrl = (e) => {
    e.stopPropagation();
    if (WebView.isWebView()) {
      e.preventDefault();
      WebView.openUrl(url);
      return;
    }
    window.open(url);
  };

  const body = () => (
    <div className={styles.drawer}>
      <div className={styles.heading}>{heading}</div>
      <div>{description}</div>
      <ul className={styles.list}>
        {list.map((x) => (
          <>
            {typeof x !== 'string' && (
              <>
                <li className={styles.item}>{`${x.label}`}</li>
                <ul className={styles.list}>
                  {x.items.map((y) => <li className={styles.item}>{`${y}`}</li>)}
                </ul>
              </>
            )}
            {typeof x === 'string' && <li className={styles.item}>{`${x}`}</li>}
          </>
        ))}
      </ul>
      <>
        <div className={styles.textB}>
          Don’t have an account?
          <Clickable
            onClick={openUrl}
            className={styles.greenLink}>
            Create
          </Clickable>
        </div>
        {isDesktop ? (
          <div className={styles.buttonD}>
            <Button
              onClick={onAction}
              type="large"
              label="Connect"
            />
          </div>
        ) : (
          <div className={styles.button}>
            <Button
              fullWidth
              className={styles.buttonH}
              bordered={false}
              onClick={onAction}
              type="large"
              label="Connect"
            />
          </div>
        )}
      </>
      {name === 'paypal' && !PAYPAL_SUPPORTED_CURRENCY.has(currency) && (
        <Info
          text={paypalNote}
          title="Note"
        />
      )}
    </div>
  );

  return !isDesktop ? (
    <Drawer title={title} onBack={onBack}>
      {body()}
    </Drawer>
  ) : (
    <SideDrawer
      backButton={true}
      onClose={onBack}
      title={title}
    >
      {body()}
    </SideDrawer>
  );
}

KnowMoreDialog.propTypes = {
  title: PropTypes.string.isRequired,
  heading: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  note: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  list: PropTypes.array.isRequired,
  onAction: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
};

KnowMoreDialog.defaultProps = {};
