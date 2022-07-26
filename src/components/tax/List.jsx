import React, { useState } from 'react';
import { Drawer } from 'components/shared/Drawer';
import { Clickable } from 'phoenix-components';
import { SideDrawer } from 'components/shared/SideDrawer';
import { useDesktop } from 'contexts';
import addIcon from 'assets/overview/addIcon.svg';
import { useRefreshShop, useShop } from 'contexts';
import { Formik } from 'formik';
import { Becca } from 'api';
import Loader from 'services/loader';
import { useHistory } from 'react-router-dom';
import SnackBar from 'services/snackbar';
import Form from './Form';
import { Card } from './Card';
import styles from './List.module.css';

export default function List() {
  const isDesktop = useDesktop();
  const { taxes = [] } = useShop();
  const [openForm, setOpenForm] = useState(null);
  const refreshShop = useRefreshShop();
  const Component = isDesktop ? SideDrawer : Drawer;
  const history = useHistory();

  const allTaxes = taxes.filter(x => !x.isDeleted);
  const deletedTaxes = taxes.filter(x => x.isDeleted);

  const onSubmit = async (values) => {
    try {
      Loader.show();
      const merged = [...values.taxes, ...deletedTaxes];
      await Becca.updateShop({ taxes: merged });
      refreshShop();
      SnackBar.show('Tax updated successfully', 'success');
    } catch (e) {
      SnackBar.showError(e);
    } finally {
      Loader.hide();
    }
  };

  const onOpenForm = index => {
    setOpenForm(index);
  };

  const closeDraw = () => {
    history.goBack();
  };

  return (
    <Component
      title="Tax Details"
      backButton={true}
      onClose={closeDraw}
    >
      <Formik initialValues={{ taxes: allTaxes }} onSubmit={onSubmit}>
        <>
          {openForm !== null && <Form index={openForm} onClose={() => setOpenForm(null)} />}
          <div className={styles.container}>
            <Clickable
              className={styles.addButton}
              onClick={() => setOpenForm(-1)}
            >
              <img src={addIcon} alt="" />
              <div className={styles.addIconText}>Add Tax Charges</div>
            </Clickable>
          </div>

          {allTaxes.map((tax, idx) => (<Card openForm={onOpenForm} index={idx} key={tax._id} />))}
        </>
      </Formik>
    </Component>
  );
}

List.propTypes = {
};

List.defaultProps = {};
