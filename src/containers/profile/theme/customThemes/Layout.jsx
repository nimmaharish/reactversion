import React from 'react';
import Loader from 'services/loader';
import SnackBar from 'services/snackbar';
import { useLayoutConfig } from 'hooks/common';
import { Becca } from 'api';
import { Formik } from 'formik';
import { ThemeCard } from 'components/themes/ThemeCard';
import { Loading } from 'components/shared/Loading';
import { layoutConfig } from './utils';
import styles from './Layout.module.css';

function Layout() {
  const [layout, loading, refresh] = useLayoutConfig();

  const submitForm = async (values) => {
    try {
      Loader.show();
      await Becca.updateUiConfig('layoutConfig', values);
      refresh();
      SnackBar.show('layout settings updated successfully', 'success');
    } catch (e) {
      SnackBar.showError(e);
    } finally {
      Loader.hide();
    }
  };

  if (loading) {
    return (
      <Loading />
    );
  }

  return (
    <Formik
      initialValues={layoutConfig(layout)}
      onSubmit={submitForm}
    >
      <div className={styles.themesSection}>
        {Object.keys(layoutConfig(layout)).map(key => (
          <ThemeCard name={key} key={key} />
        ))}
      </div>
    </Formik>
  );
}

export default Layout;
