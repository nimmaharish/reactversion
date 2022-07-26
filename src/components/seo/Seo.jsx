import React from 'react';
import { useHistory } from 'react-router-dom';
import { Drawer } from 'components/shared/Drawer';
import { SideDrawer } from 'components/shared/SideDrawer';
import { useDesktop } from 'contexts';
import { Formik } from 'formik';
import SnackBar from 'services/snackbar';
import Loader from 'services/loader';
import { useSeo } from 'hooks/common';
import { Loading } from 'components/shared/Loading';
import { Button, FormikInput } from 'phoenix-components';
import PropTypes from 'prop-types';
import { Becca } from '../../api';
import { schema, getInitialValues } from './utils';
import styles from './Seo.module.css';

export default function Seo({ onClose }) {
  const isDesktop = useDesktop();
  const history = useHistory();
  const [seo, loading, refresh] = useSeo();
  const Component = isDesktop ? SideDrawer : Drawer;
  const closeDraw = () => {
    history.push('/settings/profile');
  };

  if (loading) {
    return <Loading />;
  }
  const onSubmit = async (values) => {
    try {
      Loader.show();
      await Becca.updateUiConfig('seo', values);
      refresh();
      onClose();
      SnackBar.show('SEO updated successfully', 'success');
    } catch (e) {
      SnackBar.showError(e);
    } finally {
      Loader.hide();
    }
  };

  return (
    <Component
      title="SEO Settings"
      backButton={true}
      onClose={onClose || closeDraw}
    >
      <Formik
        validationSchema={schema}
        initialValues={getInitialValues(seo)}
        onSubmit={onSubmit}>
        {({ submitForm }) => (
          <>
            <div className={styles.container}>
              <FormikInput
                name="title"
                label="Enter Meta Title"
                placeholder="Tite Name" />
              <div className="marginMTopBottom"></div>
              <FormikInput
                name="description"
                type="textarea"
                rows={4}
                label="Enter Meta Description"
                placeholder="Type Discription" />
              <div className="marginMTopBottom"></div>
              <FormikInput
                name="keywords"
                type="textarea"
                rows={4}
                label="Enter Key Words"
                placeholder="Type keywords" />
            </div>
            {isDesktop ? (
              <div className={styles.button}>
                <Button
                  bordered={true}
                  label="Save"
                  size="large"
                  onClick={submitForm} />
              </div>
            ) : (
              <div className={styles.button}>
                <Button
                  fullWidth
                  bordered={false}
                  label="Save"
                  size="large"
                  onClick={submitForm} />
              </div>
            )}
          </>
        )}
      </Formik>
    </Component>
  );
}

Seo.propTypes = {
  onClose: PropTypes.func.isRequired,
};

Seo.defaultProps = {};
