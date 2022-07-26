import React from 'react';
import { useHistory } from 'react-router-dom';
// import { useShop } from 'contexts/userContext';
import editIcon from 'assets/overview/edit.svg';
import shipRocketIcon from 'assets/images/orders/multi/shiprocket.png';
import shippoIcon from 'assets/images/orders/multi/shippo.svg';
import pickrrIcon from 'assets/images/orders/multi/pickrr.png';
import acceptIcon from 'assets/v2/settings/snapshot/active.svg';
// import notacceptIcon from 'assets/v2/settings/snapshot/notactive.svg';
import { useShopShippingPartners } from 'hooks/shop';
import Accordion from './Accordion';
import styles from './Overview.module.css';

const PARTNERS = {
  shiprocket: {
    label: 'Ship Roket',
    image: shipRocketIcon
  },
  goshippo: {
    label: 'Shippo',
    image: shippoIcon
  },
  pickrr: {
    label: 'Pickerr',
    image: pickrrIcon
  }
};

function ShippingPartner() {
//   const shop = useShop();
  const history = useHistory();
  const [shippingPartners,, isLoading] = useShopShippingPartners();

  if (isLoading) {
    return null;
  }

  return (
    <>
      <Accordion
        label="Shipping Partners"
        labelHelper="View Shipping Partners"
      >
        <div className={styles.padded}>
          <div
            className={styles.top}
            onClick={() => {
              history.push('/manage/shippingPartners');
            }}
          >
            <div className={styles.head1}>
              Enabled Shipping Partners
            </div>
            <img src={editIcon} alt="snapshot" />
          </div>
          <>
            {Object.entries(shippingPartners).map(([key, value]) => (
              <div className={styles.partner}>
                <img src={PARTNERS[key]?.image} alt="" />
                {PARTNERS[key]?.label}
                {value.enabled && (
                  <img src={acceptIcon} alt="" />
                )}
              </div>
            ))}
          </>
        </div>
      </Accordion>
    </>
  );
}

export default ShippingPartner;
