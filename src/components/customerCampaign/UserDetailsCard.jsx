import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import unchecked from 'assets/images/payments/unselect.svg';
import checked from 'assets/v2/products/checked.svg';
import CallLogo from 'assets/logos/call.svg';
import CallDisLogo from 'assets/logos/callDis.svg';
import MailLogo from 'assets/logos/mail.svg';
import MailDisLogo from 'assets/logos/mailDis.svg';
import MessageLogo from 'assets/logos/message.svg';
import MessageDisLogo from 'assets/logos/messageDis.svg';
import WhatsappLogo from 'assets/logos/whatsapp.svg';
import WhatsappDisLogo from 'assets/logos/whatsappDis.svg';
import { Clickable } from 'phoenix-components';
import { useToggle } from 'hooks/common';
import Loader from 'services/loader';
import Avatar from '@material-ui/core/Avatar';
import WebView from 'services/webview';
import {
  useIsCustomerCampaignEnabled,
} from 'contexts/userContext';
import Snackbar from 'services/snackbar';
import { useOpenPlans } from 'contexts';
import chevronTop from 'assets/v2/common/chevronGreyTop.svg';
import chevronBottom from 'assets/v2/common/chevronGreyBottom.svg';
import styles from './UserDetailsCard.module.css';

function UserDetailsCard({
  details, trackCheckedIds, index, getAddressReq
}) {
  const [po, setPo] = useToggle(false);
  const [checkedId, setChecked] = useState(null);
  const isCustomerCampaignEnabled = useIsCustomerCampaignEnabled();
  const openPlans = useOpenPlans(false, 'generic', 'premium');
  const [address, setAddress] = useState({ id: -1, value: '' });

  const getAddress = async (id) => {
    if (id === address.id) {
      return;
    }
    try {
      Loader.show();
      const data = await getAddressReq(id);
      const res = { id, value: data };
      setAddress(res);
    } finally {
      Loader.hide();
    }
  };

  const openField = () => {
    if (!isCustomerCampaignEnabled) {
      openPlans();
      return;
    }
    setPo();
  };

  useEffect(() => {
    if (po) {
      getAddress(details.id);
    }
  }, [po]);

  const handleChecks = (id) => {
    if (checkedId === null) {
      setChecked(true);
    }
    if (checkedId !== null) {
      setChecked(null);
    }
    trackCheckedIds(id);
  };

  const getCheckStatus = () => {
    if (checkedId === null) {
      return false;
    }
    if (checkedId !== null) {
      return true;
    }
  };

  const open = (url) => {
    if (!isCustomerCampaignEnabled) {
      openPlans();
      return;
    }
    if (WebView.isWebView()) {
      WebView.openUrl(url);
    } else {
      window.open(url, '_blank');
    }
  };

  const openWhatsapp = (phone) => {
    if (!phone) {
      Snackbar.show('phone not available', 'error');
      return;
    }
    const url = `https://wa.me/${phone.replace(/\s/g, '')}`;
    open(url);
  };

  const openEmail = (email) => {
    if (!email) {
      Snackbar.show('email not available', 'error');
      return;
    }
    const url = `mailto:${email}`;
    open(url);
  };

  const openPhone = (phone) => {
    if (!phone) {
      Snackbar.show('phone not available', 'error');
      return;
    }
    const url = `tel:${phone.replace(/\s/g, '')}`;
    open(url);
  };

  const openMsg = (phone) => {
    if (!phone) {
      Snackbar.show('phone not available', 'error');
      return;
    }
    const url = `sms:${phone.replace(/\s/g, '')}`;
    open(url);
  };

  if (!details) {
    return null;
  }

  return (
    <div key={index} className={styles.userDetailsTileCon}>
      <div className="fullWidth flexBetween">
        <div className={styles.con1}>
          <div className={styles.profilePic}>
            <Avatar>{(details?.name || 'Guest').charAt(0)}</Avatar>
          </div>
          <div
            className={cx(styles.line1)}>
            {details?.name || 'Guest'}
          </div>
        </div>
        <div className={styles.con2}>
          <div
            className={cx(styles.checkedIcon, { [styles.opacity]: !details?.email })}
          >
            <img
              src={getCheckStatus() ? checked : unchecked}
              alt=""
              onClick={() => {
                if (details?.email) {
                  handleChecks(index);
                } else {
                  Snackbar.show('email not available', 'error');
                }
              }}
            />
          </div>
          <div className={styles.threeDotsIcon}>
            <img
              src={po ? chevronTop : chevronBottom}
              alt=""
              onClick={openField}
            />
          </div>
        </div>
      </div>
      {po && (
        <div className={styles.popover}>
          <div className={styles.head}>
            Customer Details
          </div>
          <div>
            <div className={styles.aHead}>Address</div>
            <div className={styles.aContent}>
              {address?.value}
            </div>
          </div>
          <div className="fullWidth flexBetween">
            <div
              className={cx(styles.IconDiv, styles.NoBorder, { [styles.opacity]: !details?.email })}>
              <Clickable
                onClick={() => {
                  openEmail(details?.email);
                }}
              >
                <img src={!details?.email ? MailDisLogo : MailLogo} alt="" className={styles.emailIcon} />
                <div className={styles.iconTexts}>Email</div>
              </Clickable>
            </div>
            <div
              className={cx(styles.IconDiv, { [styles.opacity]: !details?.phone })}>
              <Clickable
                onClick={() => {
                  openMsg(details?.phone);
                }}>
                <img src={!details?.phone ? MessageDisLogo : MessageLogo} alt="" className={styles.msgIcon} />
                <div className={styles.iconTexts}>Message</div>
              </Clickable>
            </div>
            <div
              className={cx(styles.IconDiv, { [styles.opacity]: !details?.phone })}>
              <Clickable
                onClick={() => {
                  openPhone(details?.phone);
                }}>
                <img src={!details?.phone ? CallDisLogo : CallLogo} alt="" className={styles.callIcon} />
                <div className={styles.iconTexts}>Call</div>
              </Clickable>
            </div>
            <div
              className={cx(styles.IconDiv, { [styles.opacity]: !details?.phone })}
            >
              <Clickable
                onClick={() => {
                  openWhatsapp(details?.phone);
                }}>
                <img src={!details?.phone ? WhatsappDisLogo : WhatsappLogo} alt="" className={styles.whatsappIcon} />
                <div className={styles.iconTexts}>Whatsapp</div>
              </Clickable>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

UserDetailsCard.propTypes = {
  details: PropTypes.object.isRequired,
  trackCheckedIds: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  getAddressReq: PropTypes.func.isRequired
};

export default UserDetailsCard;
