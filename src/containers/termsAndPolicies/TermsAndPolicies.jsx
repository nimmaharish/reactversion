import React from 'react';
import { useState, useRef } from 'react';
import deleteIcon from 'assets/overview/deleteIcon.svg';
import editIcon from 'assets/overview/edit.svg';
import addIcon from 'assets/overview/addIcon.svg';
import { Becca } from 'api';
import Loader from 'services/loader';
import SnackBar from 'services/snackbar';
import { useHistory } from 'react-router-dom';
import { Button, Clickable } from 'phoenix-components';
import { DeleteAlert } from 'components/shared/DeleteAlert';
import { Formik } from 'formik';
import { useShop, useRefreshShop } from 'contexts';
import { useToggle } from 'hooks/common';
import {
  useIsAboutEnabled
} from 'contexts/userContext';
import { useQueryParams } from 'hooks';
import { useDesktop } from 'contexts';
import chevronLeftDesk from 'assets/v2/common/chevronPrimaryLeft.svg';
import { TermsDrawer } from '../../components/shared/TermsDrawer';
import styles from './TermsAndPolicies.module.css';
import { getInitialValues } from './utils';
import { Drawer } from '../../components/shared/Drawer';

function TermsAndPolicies() {
  const history = useHistory();
  const shop = useShop();
  const refresh = useRefreshShop();
  const saveRef = useRef();
  const [openTerms, toggleTerms] = useToggle(false);
  const [openDelete, toggleDelete] = useToggle(false);
  const [delVal, setDelVal] = useState('');
  const [index, setIndex] = useState(0);
  const params = useQueryParams();
  const isAboutEnabled = useIsAboutEnabled();
  const isDesktop = useDesktop();
  const deleteTitle = 'Hold up! Are you sure you want to delete this policy?';

  const onSubmit = async (values) => {
    if (!isAboutEnabled) {
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
      if (isDesktop) {
        history.goBack();
      }
    } catch (e) {
      SnackBar.showError(e);
    } finally {
      Loader.hide();
    }
  };

  const toggleSave = () => {
    if (saveRef.current) {
      saveRef.current.firstElementChild.click();
    }
  };

  if (isDesktop) {
    return (
      <div className={styles.desktopContainer}>
        <div onClick={() => history.goBack()} className={styles.maintitle}>
          <img className={styles.backIconForDesktop} src={chevronLeftDesk} alt="" />
          <div>&nbsp;</div>
          <div>&nbsp;</div>
          Shop Policies
        </div>
        <Formik
          initialValues={getInitialValues(shop)}
          // validationSchema={schema}
          onSubmit={onSubmit}
        >
          {({ values, setFieldValue, submitForm }) => (
            <div>
              {openDelete && (
                <DeleteAlert
                  title={deleteTitle}
                  onCancel={() => {
                    toggleDelete();
                    setDelVal('');
                  }}
                  onDelete={() => {
                    const newValues = values?.tncs?.filter(x => x !== delVal);
                    setFieldValue('tncs', newValues);
                    toggleDelete();
                    toggleSave();
                  }} />
              )}
              <div className={styles.desktopBox}>
                <div
                  className={styles.desktopBox2}
                  onClick={() => {
                    setIndex(values?.tncs?.length);
                    toggleTerms();
                  }}
                >
                  <img src={addIcon} alt="" />
                  <div className={styles.addIconText}>Add Policy</div>
                </div>
                {values?.tncs?.length > 0 && (
                  <>
                    <div className={styles.previewHead}>
                      Added Policies
                    </div>
                    <div className={styles.previewBox}>
                      <div className={styles.previewBlock}>
                        <ul className={styles.tncPreviewUl}>
                          {values?.tncs?.length > 0 && values?.tncs.map((s, i) => (
                            <li className={styles.tncPreview}>
                              <div className={styles.html} dangerouslySetInnerHTML={{ __html: s }}></div>
                              <div className={styles.icons}>
                                <Clickable
                                  className={styles.deleteIcon}
                                  onClick={() => {
                                    setDelVal(s);
                                    toggleDelete();
                                  }}
                                >
                                  <img src={deleteIcon} alt="" />
                                </Clickable>
                                <Clickable
                                  className={styles.editIcon}
                                  onClick={() => {
                                    setIndex(i);
                                    setDelVal(s);
                                    toggleTerms();
                                  }}
                                >
                                  <img src={editIcon} alt="" />
                                </Clickable>
                              </div>
                              <div className={styles.spacer}></div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </>
                )}
              </div>
              {openTerms && (
                <TermsDrawer
                  onClose={toggleTerms}
                  title="Shop Policies"
                  onSubmit={toggleSave}
                  placeholder="Tell customers more about this policy"
                  index={index} />
              )}
              <div ref={saveRef} className={styles.button}>
                <Button
                  label="Save"
                  primary
                  size="large"
                  onClick={submitForm}
                >
                </Button>
              </div>
            </div>
          )}
        </Formik>
      </div>
    );
  }

  return (
    <Drawer
      title="Shop Policies"
    >
      <div className={styles.mainContainer}>
        <Formik
          initialValues={getInitialValues(shop)}
          // validationSchema={schema}
          onSubmit={onSubmit}
        >
          {({ values, setFieldValue, submitForm }) => (
            <>
              <>
                {openDelete && (
                  <DeleteAlert
                    title={deleteTitle}
                    onCancel={() => {
                      toggleDelete();
                      setDelVal('');
                    }}
                    onDelete={() => {
                      const newValues = values?.tncs?.filter(x => x !== delVal);
                      setFieldValue('tncs', newValues);
                      toggleDelete();
                      toggleSave();
                    }} />
                )}
                {values?.tncs?.length < 1 && (
                  <Clickable
                    className={styles.addIcon}
                    onClick={toggleTerms}
                  >
                    <img src={addIcon} alt="" />
                    <div className={styles.addIconText}>Add Policy</div>
                  </Clickable>
                )}
                {values?.tncs?.length > 0 && (
                  <Clickable
                    className={styles.addIcon}
                    onClick={() => {
                      setIndex(values?.tncs?.length);
                      toggleTerms();
                    }}
                  >
                    <img src={addIcon} alt="" />
                    <div className={styles.addIconText}>Add Policy</div>
                  </Clickable>
                )}
                {values?.tncs?.length > 0 && (
                  <>
                    <div className={styles.previewHead}>
                      Added Policies
                    </div>
                    <div className={styles.previewBlock}>
                      <ul className={styles.tncPreviewUl}>
                        {values?.tncs?.length > 0 && values?.tncs.map((s, i) => (
                          <li className={styles.tncPreview}>
                            <div className={styles.html} dangerouslySetInnerHTML={{ __html: s }}></div>
                            <div className={styles.icons}>
                              <Clickable
                                className={styles.deleteIcon}
                                onClick={() => {
                                  setDelVal(s);
                                  toggleDelete();
                                }}
                              >
                                <img src={deleteIcon} alt="" />
                              </Clickable>
                              <Clickable
                                className={styles.editIcon}
                                onClick={() => {
                                  setIndex(i);
                                  setDelVal(s);
                                  toggleTerms();
                                }}
                              >
                                <img src={editIcon} alt="" />
                              </Clickable>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
                {openTerms && (
                  <TermsDrawer
                    onClose={toggleTerms}
                    onSubmit={toggleSave}
                    title="Shop Policies"
                    placeholder="Tell customers more about this policy"
                    index={index} />
                )}
              </>
              <div ref={saveRef} className={styles.button}>
                <Button
                  fullWidth
                  bordered={false}
                  label="Save"
                  primary
                  size="large"
                  onClick={submitForm}
                >
                </Button>
              </div>
            </>
          )}
        </Formik>
      </div>
    </Drawer>
  );
}
export default TermsAndPolicies;
