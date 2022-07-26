import React, { useState } from 'react';
import { useToggle } from 'hooks/common';
import Loader from 'services/loader';
import { Becca } from 'api';
import emptyPreviewIcon from 'assets/v2/settings/emptyPreview.svg';
import addWebsiteIcon from 'assets/v2/settings/removeWebsite.svg';
import { useTemplates, useRefreshTemplates } from 'contexts';
import SnackBar from 'services/snackbar';
import { Clickable } from 'phoenix-components';
import { sortBy } from 'lodash';
import { DeleteAlert } from 'components/shared/DeleteAlert';
import { useDesktop } from 'contexts';
import { Card } from './Card';
import Form from './Form';
import styles from './Preview.module.css';

export function Preview() {
  const refresh = useRefreshTemplates();
  const [open, close] = useToggle(false);
  const [openDelete, toggleDelete] = useToggle(false);
  const [deleteId, setDeleteId] = useState(null);
  const [selected, setSelected] = useState(null);
  const isDesktop = useDesktop();

  const templates = useTemplates();
  const getText = (item) => {
    if (item.status === 'live') {
      return 'Remove';
    }
    return 'Add to website';
  };

  const getClass = (item) => {
    if (item.status === 'live') {
      return styles.red;
    }
    return styles.blue;
  };

  const getIcon = (item) => {
    if (item.status === 'live') {
      return addWebsiteIcon;
    }
    return addWebsiteIcon;
  };

  const patchTemplate = async (payload) => {
    try {
      Loader.show();
      const status = payload.status === 'live' ? 'created' : 'live';
      await Becca.patchTemplate(payload._id, { status });
      refresh();
      setDeleteId(null);
      toggleDelete();
    } catch (e) {
      SnackBar.showError(e);
    } finally {
      Loader.hide();
    }
  };

  const items = sortBy(templates?.filter(x => x.status === 'live'), ['updatedAt']).reverse();
  const isPreviewEmpty = items?.length === 0;

  if (isDesktop) {
    return (
      <div className={styles.section}>
        {open && <Form values={selected} onClose={close} />}
        <div className={styles.head}>
          Banner Preview
        </div>
        <div className={styles.body}>
          {isPreviewEmpty && (
            <div className="flexColumn">
              <img src={emptyPreviewIcon} alt="" />
              <div className={styles.emptyText}>
                You haven’t added any banners to your
                website yet!
              </div>
            </div>
          )}
          {!isPreviewEmpty && (
            <div className={styles.single}>
              {items.map(y => (
                <div className={styles.card}>
                  {openDelete && y._id === deleteId && (
                    <DeleteAlert
                      title="Are you sure want to remove this banner?"
                      onCancel={toggleDelete}
                      primary="Yes"
                      secondary="No"
                      onDelete={() => patchTemplate(y)}
                    />
                  )}
                  <Card
                    title={y.title}
                    description={y.description}
                    image={y.image}
                    showEdit={true}
                    onClick={() => {
                      setSelected(y);
                      close();
                    }}
                  />
                  <Clickable
                    onClick={() => {
                      setDeleteId(y._id);
                      toggleDelete();
                    }}
                    className={getClass(y)}>
                    <img className={styles.icon} src={getIcon(y)} alt="" />
                    {getText(y)}
                  </Clickable>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.section}>
      {open && <Form values={selected} onClose={close} />}
      <div className={styles.head}>
        Banner Preview
      </div>
      <div className={styles.body}>
        {isPreviewEmpty && (
          <div className="flexColumn">
            <img src={emptyPreviewIcon} alt="" />
            <div className={styles.emptyText}>
              You haven’t added any banners to your
              website yet!
            </div>
          </div>
        )}
        {!isPreviewEmpty && (
          <div className={styles.single}>
            {items.map(y => (
              <div className={styles.card}>
                {openDelete && y._id === deleteId && (
                  <DeleteAlert
                    title="Are you sure want to remove this banner?"
                    onCancel={toggleDelete}
                    primary="Yes"
                    secondary="No"
                    onDelete={() => patchTemplate(y)}
                  />
                )}
                <Card
                  title={y.title}
                  description={y.description}
                  image={y.image}
                  showEdit={true}
                  onClick={() => {
                    setSelected(y);
                    close();
                  }}
                />
                <Clickable
                  onClick={() => {
                    setDeleteId(y._id);
                    toggleDelete();
                  }}
                  className={getClass(y)}>
                  <img className={styles.icon} src={getIcon(y)} alt="" />
                  {getText(y)}
                </Clickable>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

Preview.propTypes = {};

Preview.defaultProps = {};
