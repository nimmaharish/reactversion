import React from 'react';
import { Drawer } from 'components/shared/Drawer';
import styles from 'containers/profile/address/List.module.css';
import { Clickable } from 'phoenix-components';
import emptyAddress from 'assets/images/address/empty.svg';
import { useShop } from 'contexts';
import Info from 'components/info/Info';
import { Card } from 'components/address/Card';
import { useToggle } from 'hooks/common';
import addIcon from 'assets/images/address/add.svg';
import { AddressForm } from 'components/address/lazy';
import { useDesktop } from 'contexts';
import chevronLeftDesk from 'assets/v2/common/chevronPrimaryLeft.svg';
import { useHistory } from 'react-router-dom';

function List() {
  const shop = useShop();
  const [open, toggleOpen] = useToggle(false);
  const { addresses = [] } = shop;
  const isDesktop = useDesktop();
  const history = useHistory();
  return (
    isDesktop ? (
      <div className={styles.container}>
        <div onClick={() => history.goBack()} className={styles.maintitle}>
          <img className={styles.backIconForDesktop} src={chevronLeftDesk} alt="" />
          <div>&nbsp;</div>
          <div>&nbsp;</div>
          Shop Address
        </div>
        <div className={styles.main}>
          {addresses.length > 0 ? (
            <>
              <div className={styles.desktopContainer}>
                <div className={styles.title}>Address Book</div>
                {addresses.map(address => (
                  <Card address={address} key={address._id} />
                ))}
                <div className="flexCenter">
                  <Clickable
                    className={styles.add}
                    onClick={toggleOpen}
                  >
                    <img className={styles.addImg1} src={addIcon} alt="" />
                    <span>Add New Address</span>
                  </Clickable>
                </div>
              </div>
            </>
          ) : (
            <div className={styles.emptyGrid}>
              <div className="flexCenter">
                <img className={styles.emptyAddress} src={emptyAddress} alt="" />
              </div>
              <div className={styles.emptyText1}>You don't have any address saved!</div>
              <div className="flexCenter">
                <Clickable
                  className={styles.add}
                  onClick={toggleOpen}
                >
                  <img className={styles.addImg1} src={addIcon} alt="" />
                  <span>Add New Address</span>
                </Clickable>
              </div>
            </div>
          )}
          <div className={styles.info}>
            <Info
              title="Pro Tip"
              text="Your address is required for KYC and shipping purposes only.
          It will not be disclosed to customers or other stakeholders."
            />
          </div>
          {open && (<AddressForm onClose={toggleOpen} />)}
        </div>
        <div className={styles.body}></div>
      </div>
    )
      : (
        <Drawer title="Shop Address">
          <div className={styles.main}>
            {addresses.length > 0 ? (
              <>
                <div className={styles.title}>Saved Address</div>
                {addresses.map(address => (
                  <Card address={address} key={address._id} />
                ))}
              </>
            ) : (
              <>
                <div className="flexCenter">
                  <img className={styles.emptyAddress} src={emptyAddress} alt="" />
                </div>
                <div className={styles.emptyText}>You don't have any address saved!</div>
              </>
            )}
            <Info
              title="Pro Tip"
              text="Your address is required for shipping purposes only.
          It will not be disclosed to customers or other stakeholders."
            />
            {open && (<AddressForm onClose={toggleOpen} />)}
            <Clickable
              className={styles.add}
              onClick={toggleOpen}
            >
              <img className={styles.addImg} src={addIcon} alt="" />
              <span> Add New Address </span>
            </Clickable>
          </div>
        </Drawer>
      )
  );
}

List.propTypes = {};

List.defaultProps = {};

export default List;
