import React, { useState } from 'react';
import { Drawer } from 'components/shared/Drawer';
import { Formik } from 'formik';
import { Button, Clickable, FormikInput } from 'phoenix-components';
import { Becca } from 'api';
import Loader from 'services/loader';
import SnackBar from 'services/snackbar';
import * as Yup from 'yup';
import { FooterButton } from 'components/common/FooterButton';
import copyIcon from 'assets/v2/settings/domain/copy.svg';
import editIcon from 'assets/v2/settings/domain/edit.svg';
import blogIcon from 'assets/v2/settings/domain/blog.svg';
import chevronGreyRight from 'assets/v2/common/chevronGreyRight.svg';
import {
  useIsCustomDomainEnabled,
  useIsFreeTrialSubscribed,
  useIsOnFreeTrial,
  useOpenPlans,
  useRefreshShop,
  useShop
} from 'contexts';
import { useHistory } from 'react-router-dom';
import { DeleteAlert } from 'components/shared/DeleteAlert';
import { HelpLine } from 'components/overview';
import WebView from 'services/webview';
import cx from 'classnames';
import { useDesktop } from 'contexts';
import chevronLeftDesk from 'assets/v2/common/chevronPrimaryLeft.svg';
import Kbc from 'components/knowBaseCards/KnowBaseCards';
import DeviceUtils from '../../../utils/deviceUtils';
import styles from './CustomDomain.module.css';

const schema = Yup.object()
  .shape({
    domain: Yup.string()
      // eslint-disable-next-line
      .matches(/^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/, 'invalid domain')
      .required()
      .label('domain'),
  });

const getStatus = (status) => {
  switch (status) {
    case 'created':
      return 'Connected';
    case 'failed':
      return 'Failed';
    case 'progress':
      return 'In-Progress';
    case 'deleted':
      return 'Deleted';
    default:
      return null;
  }
};

function CustomDomain() {
  const shop = useShop();
  const host = shop?.domain?.host;
  const [hide, setHide] = useState(!!host);
  const [valid, setValid] = useState(null);
  const refreshShop = useRefreshShop();
  const isCustomDomainEnabled = useIsCustomDomainEnabled();
  const isInFreeTrail = useIsOnFreeTrial();
  const isSubscribed = useIsFreeTrialSubscribed();
  const openPlans = useOpenPlans();
  const isDesktop = useDesktop();
  const enabled = isInFreeTrail ? isSubscribed && isCustomDomainEnabled : isCustomDomainEnabled;
  const history = useHistory();

  const onCopy = (url) => async () => {
    DeviceUtils.copy(url);
    SnackBar.show('Copied !!!');
  };

  const buyDomain = () => {
    const url = 'https://godaddy.com/';
    if (WebView.isWebView()) {
      WebView.openUrl(url);
      return;
    }
    window.open(url, '_blank');
  };

  const openBlog = () => {
    const url = 'https://www.getwindo.shop/blog/connect-custom-domain-to-windo-shop';
    if (WebView.isWebView()) {
      WebView.openUrl(url);
      return;
    }
    window.open(url, '_blank');
  };

  const onSubmit = async ({ domain }) => {
    if (!enabled) {
      openPlans();
      return;
    }
    if (domain.endsWith('mywindo.shop')) {
      SnackBar.showError('This domain cannot be connected');
      return;
    }
    Loader.show();
    try {
      if (valid === null) {
        const { result } = await Becca.verifyDomain(domain);
        setValid(result);
        if (!result) {
          return;
        }
      }
      await Becca.connectDomain(domain);
      await refreshShop();
      setValid(null);
      setHide(true);
    } catch (e) {
      SnackBar.showError(e);
    } finally {
      Loader.hide();
    }
  };

  const status = getStatus(shop?.domain?.status);

  if (isDesktop) {
    return (
      <div className={styles.container}>
        <div onClick={() => history.goBack()} className={styles.maintitle}>
          <img className={styles.backIconForDesktop} src={chevronLeftDesk} alt="" />
          <div>&nbsp;</div>
          <div>&nbsp;</div>
          Custom Domain
        </div>
        <div className={styles.desktopC}>
          <div className={styles.h1}>
            Connect Your Own Domain
          </div>
          <div className={styles.info}>
            Have your own domain?
            Connect it in a flash by pasting the nameserver details below in the DNS settings of your domain provider.
          </div>
          <div className={styles.desktopSpacer}></div>
          <Clickable className={styles.blog} onClick={openBlog}>
            <img src={blogIcon} alt="" className={styles.blogIcon} />
            <div>
              Read Step-by-Step Guide to Connect Domain.
            </div>
            <img className={styles.blogChevron} src={chevronGreyRight} alt="" />
          </Clickable>
          <div className={styles.h2}>
            Use CNAME record
          </div>
          <div className={styles.menu}>
            <Clickable onClick={onCopy('connect.mywindo.shop')} className={styles.menuItem}>
              connect.mywindo.shop
              <img src={copyIcon} alt="" />
            </Clickable>
          </div>
          <div className={styles.or}>
            OR
          </div>
          <div className={styles.h2}>
            Use A records
          </div>
          <div className={styles.menu}>
            <Clickable onClick={onCopy('65.1.212.223')} className={styles.menuItem}>
              65.1.212.223
              <img src={copyIcon} alt="" />
            </Clickable>
            <Clickable onClick={onCopy('15.207.212.132')} className={styles.menuItem}>
              15.207.212.132
              <img src={copyIcon} alt="" />
            </Clickable>
          </div>
          <div className={styles.desktopBox}>
            <div className={styles.h1}>
              Connect Domain
            </div>
            <Formik
              initialValues={{ domain: host || '' }}
              validationSchema={schema}
              onSubmit={onSubmit}
            >
              {({
                submitForm,
                isValid
              }) => (
                <>
                  <div>
                    <div className={styles.inputContainer}>
                      <FormikInput
                        label="Enter Domain Name"
                        placeholder="e.g. www.xyz.com"
                        name="domain"
                        readonly={hide}
                        inputClass={styles.input}
                      />
                      {hide && (
                        <Clickable className={styles.editIcon} onClick={() => setHide(false)}>
                          <img src={editIcon} alt="" />
                        </Clickable>
                      )}
                    </div>
                    <div className={styles.info}>
                      It may take up to 72 hours for your domain to be linked.
                      This timeline varies from provider to provider.
                    </div>
                    {!hide && (
                      <div className={styles.button}>
                        <Button
                          label="Connect"
                          onClick={submitForm}
                          size="large"
                          className={styles.buttonW}
                          disabled={!isValid}
                        />
                      </div>
                    )}
                  </div>
                  {valid === false && (
                    <DeleteAlert
                      title={`Oops your domain is not pointing to above records. 
                You can still continue we will retry and attach when it is available`}
                      primary="Continue"
                      secondary="Cancel"
                      onCancel={() => {
                        setValid(null);
                      }}
                      onDelete={() => {
                        setValid(true);
                        setTimeout(() => {
                          Loader.show();
                          submitForm();
                        }, 1000);
                      }}
                    />
                  )}
                </>
              )}
            </Formik>
            {status && (
              <div className={cx(styles.domain, styles[shop?.domain?.status])}>
                Domain Connection Status:
                <span>
                  {status}
                </span>
                {shop?.domain?.status === 'progress' && (
                  <div className={styles.helperText}>
                    Unable to verify connection with your domain. It might take 24-48 hours to reflect DNS changes.
                  </div>
                )}
              </div>
            )}
            <div className={styles.buyDomain}>
              Don’t own a domain?
              <Clickable onClick={buyDomain} className={styles.greenLink}>
                Buy a domain
              </Clickable>
            </div>
            <div
              className={styles.contact}
            >
              Have any questions?&nbsp;
              <HelpLine isFloating={false} />
            </div>
          </div>
        </div>
        <div className={styles.kbcDesk}>
          <Kbc type="customDomain" />
        </div>
      </div>
    );
  }

  return (
    <Drawer title="Custom Domain" containerClass={styles.drawer} topBarClass={styles.drawer}>
      <div className={styles.container}>
        <div className={styles.h1}>
          Connect Your Own Domain
        </div>
        <div className={styles.info}>
          Have your own domain?
          Connect it in a flash by pasting the nameserver details below in the DNS settings of your domain provider.
        </div>
        <Clickable className={styles.blog} onClick={openBlog}>
          <img src={blogIcon} alt="" className={styles.blogIcon} />
          <div>
            Read Step-by-Step Guide to Connect Domain.
          </div>
          <img className={styles.blogChevron} src={chevronGreyRight} alt="" />
        </Clickable>
        <div className={styles.h2}>
          Use CNAME record
        </div>
        <div className={styles.menu}>
          <Clickable onClick={onCopy('connect.mywindo.shop')} className={styles.menuItem}>
            connect.mywindo.shop
            <img src={copyIcon} alt="" />
          </Clickable>
        </div>
        <div className={styles.or}>
          OR
        </div>
        <div className={styles.h2}>
          Use A records
        </div>
        <div className={styles.menu}>
          <Clickable onClick={onCopy('65.1.212.223')} className={styles.menuItem}>
            65.1.212.223
            <img src={copyIcon} alt="" />
          </Clickable>
          <Clickable onClick={onCopy('15.207.212.132')} className={styles.menuItem}>
            15.207.212.132
            <img src={copyIcon} alt="" />
          </Clickable>
        </div>
        <div className={styles.h1}>
          Connect Domain
        </div>
        <Formik
          initialValues={{ domain: host || '' }}
          validationSchema={schema}
          onSubmit={onSubmit}
        >
          {({
            submitForm,
            isValid
          }) => (
            <>
              <div className={styles.inputContainer}>
                <FormikInput
                  label="Enter Domain Name"
                  placeholder="e.g. www.xyz.com"
                  name="domain"
                  readonly={hide}
                  inputClass={styles.input}
                />
                {hide && (
                  <Clickable className={styles.editIcon} onClick={() => setHide(false)}>
                    <img src={editIcon} alt="" />
                  </Clickable>
                )}
              </div>
              <div className={styles.info}>
                It may take up to 72 hours for your domain to be linked.
                This timeline varies from provider to provider.
              </div>
              {valid === false && (
                <DeleteAlert
                  title={`Oops your domain is not pointing to above records. 
                You can still continue we will retry and attach when it is available`}
                  primary="Continue"
                  secondary="Cancel"
                  onCancel={() => {
                    setValid(null);
                  }}
                  onDelete={() => {
                    setValid(true);
                    setTimeout(() => {
                      Loader.show();
                      submitForm();
                    }, 1000);
                  }}
                />
              )}
              {!hide && (
                <FooterButton>
                  <Button
                    label="Connect"
                    onClick={submitForm}
                    size="large"
                    disabled={!isValid}
                    fullWidth
                    className={styles.buttonD}
                    bordered={false}
                  />
                </FooterButton>
              )}
            </>
          )}
        </Formik>
        {status && (
          <div className={cx(styles.domain, styles[shop?.domain?.status])}>
            Domain Connection Status:
            <span>
              {status}
            </span>
            {shop?.domain?.status === 'progress' && (
              <div className={styles.helperText}>
                Unable to verify connection with your domain. It might take 24-48 hours to reflect DNS changes.
              </div>
            )}
          </div>
        )}
        <div className={styles.buyDomain}>
          Don’t own a domain?
          <Clickable onClick={buyDomain} className={styles.greenLink}>
            Buy a domain
          </Clickable>
        </div>
        <div
          className={styles.contact}
        >
          Have any questions?&nbsp;
          <HelpLine isFloating={false} />
        </div>
        <div className={styles.kbc}>
          <Kbc type="customDomain" />
        </div>
      </div>
    </Drawer>
  );
}

CustomDomain.propTypes = {};

CustomDomain.defaultProps = {};

export default CustomDomain;
