import React, { useState } from 'react';
import { useToggle } from 'hooks/common';
import Loader from 'services/loader';
import { Becca } from 'api';
import emptyTemplatesIcon from 'assets/v2/settings/emptyTemplates.svg';
import addedIcon from 'assets/v2/settings/added.svg';
import addWebsiteIcon from 'assets/v2/settings/addWebsite.svg';
import { useTemplates, useRefreshTemplates } from 'contexts';
import SnackBar from 'services/snackbar';
import { Clickable } from 'phoenix-components';
import { Card } from './Card';
import Form from './Form';
import styles from './Saved.module.css';

export function Saved() {
  const templates = useTemplates();
  const refresh = useRefreshTemplates();
  const [open, close] = useToggle(false);
  const [selected, setSelected] = useState(null);
  const isTemplatesEmpty = templates?.length === 0;

  const getText = (item) => {
    if (item.status === 'live') {
      return 'Added';
    }
    return 'Add to website';
  };

  const getClass = (item) => {
    if (item.status === 'live') {
      return styles.green;
    }
    return styles.blue;
  };

  const getIcon = (item) => {
    if (item.status === 'live') {
      return addedIcon;
    }
    return addWebsiteIcon;
  };

  const patchTemplate = async (payload) => {
    try {
      Loader.show();
      const status = payload.status === 'live' ? 'created' : 'live';
      await Becca.patchTemplate(payload._id, { status });
      refresh();
    } catch (e) {
      SnackBar.showError(e);
    } finally {
      Loader.hide();
    }
  };

  return (
    <div className={styles.section}>
      {open && <Form values={selected} onClose={close} />}
      <div className={styles.head}>
        Saved Templates
      </div>
      <div className={styles.body}>
        {isTemplatesEmpty && (
          <div className="flexColumn">
            <img src={emptyTemplatesIcon} alt="" />
            <div className={styles.emptyText}>
              Saved templates will appear here
            </div>
          </div>
        )}
        {!isTemplatesEmpty && (
          <div className={styles.single}>
            {templates.map(y => (
              <div className={styles.card}>
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
                  onClick={() => patchTemplate(y)}
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

Saved.propTypes = {};

Saved.defaultProps = {};
