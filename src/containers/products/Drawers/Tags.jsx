import React from 'react';
import {
  Drawer,
  Button
} from '@material-ui/core';
import PropTypes from 'prop-types';
import Header from 'containers/products/Header';
import { useHistory } from 'react-router-dom';
import Info from 'components/info/Info';
import AutoComplete from 'components/autoComplete/Search';
import { HashTagSelect } from './HashTagSelect';
import styles from './Tags.module.css';

function Tags({
  onBack, selected, placeholder, type, onSelect, loadFrom, title
}) {
  const history = useHistory();
  const isCatalog = type === 'Catalog';
  return (
    <Drawer
      PaperProps={{
        classes: {
          root: styles.paper,
        }
      }}
      anchor="bottom"
      open={true}
      onClose={onBack}
    >
      <div className={styles.drawer}>
        <Header onBack={() => history.goBack()} title={title} />
        <div className={styles.content}>
          {isCatalog && (
            <AutoComplete
              variant="filled"
              selected={selected || []}
              placeholder={placeholder}
              loadItems={loadFrom}
              setSelected={onSelect}
            />
          )}
          {!isCatalog && (
            <HashTagSelect
              className="fullWidth"
              placeholder="Hash Tags"
              setValue={(e) => {
                onSelect(e.map(x => x.value));
              }}
              value={selected.map(x => ({ label: x, value: x }))}
              isMulti
            />
          )}
          {isCatalog && (
            <Info
              title="Pro Tip"
              text={'Collections are for you to categorize your products. '
                + 'You can create collection of your choice like Art or Lehengas'
                + ' or Hair Care Shampoos and tag your relevant products to those catalog to browse them at once. '
                + ' Collections won\'t be visible to customer.'}
            />
          )}
          <div className="textCenter fullWidth">
            <Button
              onClick={onBack}
              color="primary"
              variant="contained"
              className={styles.close}
            >
              {`Add ${type}`}
            </Button>
          </div>
        </div>
      </div>
    </Drawer>
  );
}

Tags.propTypes = {
  onBack: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  loadFrom: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  selected: PropTypes.array.isRequired,
  placeholder: PropTypes.string.isRequired,
};

export default Tags;
