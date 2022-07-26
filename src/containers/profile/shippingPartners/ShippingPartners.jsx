import React from 'react';
import { Drawer } from 'components/shared/Drawer';
import { Clickable } from 'phoenix-components';
import cx from 'classnames';
import ChevronRight from 'assets/images/orders/multi/rightChev.svg';
import shipRocketIcon from 'assets/images/orders/multi/shiprocket.png';
import shippoIcon from 'assets/images/orders/multi/shippo.svg';
import pickrrIcon from 'assets/images/orders/multi/pickrr.png';
import { useShop } from 'contexts';
import { Loading } from 'components/shared/Loading';
import { useHistory } from 'react-router-dom';
import { usePartners } from 'contexts';
import { useQueryParams } from 'hooks';
import chevronLeftDesk from 'assets/v2/common/chevronPrimaryLeft.svg';
import { useDesktop } from 'contexts';
import Kbc from 'components/knowBaseCards/KnowBaseCards';
import Partner from './Partner.jsx';
import styles from './ShippingPartners.module.css';

function ShippingPartners() {
  const shop = useShop();
  const isIndia = shop?.country?.toLowerCase() === 'india';
  const params = useQueryParams();
  const history = useHistory();
  const partner = params.get('partner') || '';

  const partners = usePartners();
  const isDesktop = useDesktop();

  const setPartner = (val) => {
    params.set('partner', val);
    history.push({
      search: params.toString(),
    });
  };

  const getText = (partner) => {
    const item = partners[partner];
    if (item) {
      if (item.enabled) {
        return 'Active';
      }
      return 'Connected';
    }
    return 'Connect';
  };

  const getClass = (partner) => {
    const value = getText(partner);
    if (value === 'Connect') {
      return styles.primary;
    }
    if (value === 'Connected') {
      return styles.blue;
    }
    return styles.green;
  };

  const body = () => (
    <div className={styles.mainContainer}>
      {partner.length > 0 && <Partner name={partner} partners={partners} /> }
      {isIndia && (
        <div className={styles.con2}>
          <div className={styles.line}></div>
          <Clickable
            className={styles.cardContainer}
            onClick={() => setPartner('shiprocket')}
          >
            <div className={isDesktop && 'flexCenter'}>
              <img
                src={shipRocketIcon}
                alt="" />
              {isDesktop && (
                <span className={styles.name}>
                  Shiprocket
                </span>
              )}
            </div>
            <div className={styles.content1}>
              <div className={cx(styles.text, getClass('shiprocket'))}>
                {getText('shiprocket')}
              </div>
              <img
                src={ChevronRight}
                alt="" />
            </div>
          </Clickable>
          <div fullWidth className={styles.line}></div>
          <Clickable
            className={styles.cardContainer}
            onClick={() => setPartner('pickrr')}
          >
            <div className={isDesktop && 'flexCenter'}>
              <img
                src={pickrrIcon}
                alt="" />
              {isDesktop && (
                <span className={styles.name}>
                  Pickrr
                </span>
              )}
            </div>
            <div className={styles.content1}>
              <div className={cx(styles.text, getClass('pickrr'))}>
                {getText('pickrr')}
              </div>
              <img
                src={ChevronRight}
                alt="" />
            </div>
          </Clickable>
        </div>
      )}
      {!isIndia && (
        <>
          <div className={styles.line}></div>
          <Clickable
            className={styles.cardContainer}
            onClick={() => setPartner('goshippo')}
          >
            <div className={isDesktop && 'flexCenter'}>
              <img
                src={shippoIcon}
                alt="" />
              {isDesktop && (
                <span className={styles.name}>
                  Shippo
                </span>
              )}
            </div>
            <div className={styles.content1}>
              <div className={cx(styles.text, getClass('shippo'))}>
                {getText('goshippo')}
              </div>
              <img
                src={ChevronRight}
                alt="" />
            </div>
          </Clickable>
          <div className="styles.kbc">
            <Kbc type="shippingPartnerInt" />
          </div>
        </>
      )}
    </div>
  );

  if (!partners) {
    return <Loading />;
  }

  return !isDesktop ? (
    <Drawer title="Shipping Partners">
      {body()}
      <div className={styles.kbc}>
        <Kbc type="shippingPartnerInt" />
      </div>
    </Drawer>
  ) : (
    <div className={styles.container}>
      <div onClick={() => history.goBack()} className={styles.maintitle}>
        <img className={styles.backIconForDesktop} src={chevronLeftDesk} alt="" />
        <div>&nbsp;</div>
        <div>&nbsp;</div>
        Shipping Partners
      </div>
      <div className={styles.main}>
        {body()}
      </div>
    </div>
  );
}

export default ShippingPartners;
