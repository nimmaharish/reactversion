import React from 'react';
import {
  Drawer,
  Button
} from '@material-ui/core';
import PropTypes from 'prop-types';
import Tiles from 'components/cards/Tiles/Tiles';
import styles from './Category.module.css';

function Category({
  onBack, all, selected, title, onSelect, subSelected, item, onSubSelect
}) {
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
        <Tiles
          item={all}
          selected={selected}
          customHeader={true}
          title={title}
          titleStyles={styles.label}
          onSelect={(x) => onSelect(x)}
        />
        {selected.length > 0 && <div className="fs16 textCenter marginMTopBottom"> Select Sub Categories </div>}
        {selected.map(x => (
          <Tiles
            item={item[x]}
            selected={subSelected}
            customHeader={false}
            title={x}
            titleStyles={styles.textRight}
            onSelect={(y) => onSubSelect(y)}
          />
        ))}

        {/* item={transformedSub}
        subSelected={subCategories}
        onSubSelect={(e) => {
          setSubCategory(e);
        }} */}
        <div className="textCenter">
          <Button
            onClick={onBack}
            className={styles.close}
            color="primary"
            variant="contained"
          >
            Save
          </Button>
        </div>
      </div>
    </Drawer>
  );
}

Category.propTypes = {
  onBack: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  all: PropTypes.array.isRequired,
  selected: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  subSelected: PropTypes.array.isRequired,
  item: PropTypes.array.isRequired,
  onSubSelect: PropTypes.func.isRequired,
};

export default Category;
