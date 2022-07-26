import React, { useEffect, useState } from 'react';
import { Becca } from 'api/index';
import PropTypes from 'prop-types';
import { Drawer } from 'components/shared/Drawer';
import Loader from 'services/loader';
import SnackBar from 'services/snackbar';
import { startCase } from 'lodash';
import cuIcon from 'assets/v2/faq/chevUp.svg';
import cdIcon from 'assets/v2/faq/chevDown.svg';
import { useDesktop } from 'contexts';
import styles from './Level.module.css';
function Level({ value = 'shippingAndDelivery', search }) {
  const [items, setItems] = useState([]);
  const [expanded, setExpanded] = useState([]);
  const isDesktop = useDesktop();
  useEffect(() => {
    Loader.show();
    Becca.getFaqs({ filters: { category: value } }).then((x) => {
      // x.variants[0].dimensions
      setItems(x[value]);
      Loader.hide();
    }).catch((e) => {
      console.log(e);
      Loader.hide();
      SnackBar.show('something went wrong', 'error');
    });
  }, [value, search]);

  const getItems = () => {
    if (search.length === 0) {
      return items;
    }
    return items.filter(x => x.q.toLowerCase().indexOf(search.toLowerCase()) > -1);
  };

  if (isDesktop) {
    return (
      <div>
        {getItems().map((x, i) => (
          <div
            className={styles.flex}
            onClick={() => {
              if (expanded.includes(i)) {
                setExpanded(expanded.filter(x => x !== i));
                return;
              }
              setExpanded(expanded.concat(i));
            }}>
            <div className={styles.sub}>
              <div className={styles.label}>
                {x.q}
              </div>
              {expanded.includes(i) && (
                <img src={cuIcon} alt="" />
              )}
              {!expanded.includes(i) && (
                <img src={cdIcon} alt="" />
              )}
            </div>
            {expanded.includes(i) && (
              <div className={styles.answer}>
                {x.a}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }
  return (
    <Drawer title={startCase(value)}>
      {items.map((x, i) => (
        <div
          className={styles.flex}
          onClick={() => {
            if (expanded.includes(i)) {
              setExpanded(expanded.filter(x => x !== i));
              return;
            }
            setExpanded(expanded.concat(i));
          }}>
          <div className={styles.sub}>
            <div className={styles.label}>
              {x.q}
            </div>
            {expanded.includes(i) && (
              <img src={cuIcon} alt="" />
            )}
            {!expanded.includes(i) && (
              <img src={cdIcon} alt="" />
            )}
          </div>
          {expanded.includes(i) && (
            <div className={styles.answer}>
              {x.a}
            </div>
          )}
        </div>
      ))}
    </Drawer>
  );
}

Level.propTypes = {
  value: PropTypes.string.isRequired,
  search: PropTypes.string
};

Level.defaultProps = {
  search: ''
};

export default Level;
