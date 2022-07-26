import React, { useEffect } from 'react';
import { useState } from 'react';
import { Becca } from 'api';
import Loader from 'services/loader';
import SnackBar from 'services/snackbar';
import { useHistory } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import editIcon from 'assets/overview/edit.svg';
import { Button, Clickable } from 'phoenix-components';
import { Formik } from 'formik';
import { useShop, useRefreshShop } from 'contexts';
import { useToggle } from 'hooks/common';
import {
  useIsAboutEnabled,
  isAboutShopFilled,
  isLegalPrivacyFilled,
  isLegalTermsFilled,
} from 'contexts/userContext';
import { useQueryParams } from 'hooks';
import { useDesktop } from 'contexts';
import { FooterButton } from 'components/common/FooterButton';
import { SideDrawer } from 'components/shared/SideDrawer';
import chevronLeftDesk from 'assets/v2/common/chevronPrimaryLeft.svg';
import { Drawer } from 'components/shared/Drawer';
import cx from 'classnames';
import styles from './AboutSeller.module.css';
import {
  getValues, getPlaceholder, getValue,
  getTitle
} from './utils';

function AboutSeller() {
  const history = useHistory();
  const shop = useShop();
  const refresh = useRefreshShop();
  const [openEdit, toggleEdit] = useToggle(false);
  const params = useQueryParams();
  const whatToShow = params.get('type') || '';
  const isAboutEnabled = useIsAboutEnabled();
  const isDesktop = useDesktop();
  const [sideDrawer, setSideDrawer] = useState(false);

  const isAboutFilled = isAboutShopFilled();
  const isLpFilled = isLegalPrivacyFilled();
  const isLtFilled = isLegalTermsFilled();

  useEffect(() => {
    if (isDesktop) {
      return;
    }
    if (openEdit) {
      Loader.show();
      return;
    }
    Loader.hide();
  }, [openEdit]);

  useEffect(() => {
    if (!isDesktop) {
      return;
    }
    if (sideDrawer) {
      Loader.show();
      return;
    }
    Loader.hide();
  }, [sideDrawer]);

  const isAboutPage = whatToShow === '' || whatToShow === 'about';
  const isLegalPolicyPage = whatToShow === 'lp';
  const isLegalTncPage = whatToShow === 'lt';

  useEffect(() => {
    if (isAboutPage && !isAboutFilled) {
      toggleEdit(!openEdit);
      if (isDesktop) {
        setSideDrawer(true);
      }
    }
    if (isLegalPolicyPage && !isLpFilled) {
      toggleEdit(!openEdit);
      if (isDesktop) {
        setSideDrawer(true);
      }
    }
    if (isLegalTncPage && !isLtFilled) {
      toggleEdit(!openEdit);
      if (isDesktop) {
        setSideDrawer(true);
      }
    }
  }, [whatToShow]);

  const getType = () => {
    if (isAboutPage) {
      return 0;
    }
    if (isLegalPolicyPage) {
      return 1;
    }
    if (isLegalTncPage) {
      return 2;
    }
  };

  const onSubmit = async (values) => {
    if (!isAboutEnabled && isAboutPage) {
      params.set('openPlans', 'generic');
      history.push({
        search: params.toString(),
      });
      return;
    }
    try {
      Loader.show();
      await Becca.updateShop(values);
      refresh();
      SnackBar.show('updated successfully', 'success');
      if (!isDesktop) {
        history.goBack();
      }
    } catch (e) {
      SnackBar.showError(e);
    } finally {
      Loader.hide();
    }
  };

  if (isDesktop) {
    return (
      <div className={styles.desktopContainer}>
        <div onClick={() => history.goBack()} className={styles.maintitle}>
          <img className={styles.backIconForDesktop} src={chevronLeftDesk} alt="" />
          <div>&nbsp;</div>
          <div>&nbsp;</div>
          {getTitle(getType())}
        </div>
        <Formik
          initialValues={getValues(shop, getType())}
          // validationSchema={schema}
          onSubmit={onSubmit}
        >
          {({ values, setFieldValue, submitForm }) => (
            <>
              {!openEdit && (
                <Clickable
                  onClick={() => { toggleEdit(); setSideDrawer(true); }}
                  className={styles.previewCard}
                >
                  <div className={styles.previewHeader}>
                    <div className={styles.previewHeadTitle}>{getTitle(getType())}</div>
                    <img src={editIcon} alt="edit" />
                  </div>
                  <div dangerouslySetInnerHTML={{ __html: getValue(values, getType()) }} />
                </Clickable>
              )}
              {openEdit && sideDrawer && (
                <SideDrawer
                  backButton={true}
                  title={getTitle(getType())}
                  classes={{
                    container: styles.customBody,
                  }}
                  onClose={() => {
                    setSideDrawer(!sideDrawer);
                    toggleEdit(!toggleEdit);
                  }}
                >
                  <div className={styles.sidebarDiv}>
                    <div className={styles.editor}>
                      <Editor
                        value={getValue(values, getType())}
                        apiKey="jk7y6v6dbe2h16qh13q5klle5sz76ddgevc6ph3v1sa4bgu1"
                        scriptLoading={{ async: true }}
                        init={{
                          menubar: false,
                          toolbar: false,
                          height: 'calc(100vh - 59px - 52px - 50px - 40px)',
                          width: '100%',
                          placeholder: getPlaceholder(getType()),
                          statusbar: false,
                          branding: false,
                          selector: 'textarea',
                          paste_data_images: false,
                          plugins: [
                            'paste'
                          ],
                        }}
                        onInit={() => {
                          Loader.hide();
                        }}
                        onEditorChange={(e) => {
                          if (isAboutPage) {
                            setFieldValue('about', e);
                          }
                          if (isLegalPolicyPage) {
                            setFieldValue('legalPrivacyPolicy', e);
                          }
                          if (isLegalTncPage) {
                            setFieldValue('legalTncs', e);
                          }
                        }}
                      />
                    </div>
                    <div className={cx(styles.button, 'flexCenter')}>
                      <Button
                        bordered={true}
                        label="Save"
                        primary
                        size="large"
                        onClick={submitForm}
                        onClose={() => {
                          // setSideDrawer(!sideDrawer);
                          // toggleEdit(!toggleEdit);
                          submitForm();
                        }}
                      >
                      </Button>
                    </div>
                  </div>
                </SideDrawer>
              )}
            </>
          )}
        </Formik>
      </div>
    );
  }

  return (
    <Drawer
      title={getTitle(getType())}
    >
      <div className={styles.mainContainer}>
        <Formik
          initialValues={getValues(shop, getType())}
          // validationSchema={schema}
          onSubmit={onSubmit}
        >
          {({ values, setFieldValue, submitForm }) => (
            <>
              {!openEdit && (
                <div
                  className={styles.previewCard}
                >
                  <div className={styles.previewHeader}>
                    <div className={styles.previewHeadTitle}>{getTitle(getType())}</div>
                    <Clickable onClick={toggleEdit}>
                      <img src={editIcon} alt="edit" />
                    </Clickable>
                  </div>
                  <div dangerouslySetInnerHTML={{ __html: getValue(values, getType()) }} />
                </div>
              )}
              {openEdit && (
                <>
                  <div className={styles.editor}>
                    <Editor
                      value={getValue(values, getType())}
                      apiKey="jk7y6v6dbe2h16qh13q5klle5sz76ddgevc6ph3v1sa4bgu1"
                      scriptLoading={{ async: true }}
                      init={{
                        menubar: false,
                        toolbar: false,
                        height: 'calc(100vh - 59px - 52px - 50px - 16px)',
                        width: '100%',
                        placeholder: getPlaceholder(getType()),
                        statusbar: false,
                        branding: false,
                        selector: 'textarea',
                        paste_data_images: false,
                        plugins: [
                          'paste'
                        ],
                      }}
                      onInit={() => {
                        Loader.hide();
                      }}
                      onEditorChange={(e) => {
                        console.log(e);
                        if (isAboutPage) {
                          setFieldValue('about', e);
                        }
                        if (isLegalPolicyPage) {
                          setFieldValue('legalPrivacyPolicy', e);
                        }
                        if (isLegalTncPage) {
                          setFieldValue('legalTncs', e);
                        }
                      }}
                    />
                  </div>
                  <FooterButton>
                    <Button
                      fullWidth
                      bordered={false}
                      label="Save"
                      primary
                      size="large"
                      onClick={submitForm}
                    >
                    </Button>
                  </FooterButton>
                </>
              )}
            </>
          )}
        </Formik>
      </div>
    </Drawer>
  );
}
export default AboutSeller;
