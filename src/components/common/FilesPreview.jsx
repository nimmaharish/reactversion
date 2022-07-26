import React from 'react';
import PropTypes from 'prop-types';

import closeIcon from 'assets/v2/common/closeBlack.svg';
import uploadedFileIcon from 'assets/images/uploadedFile.svg';

import styles from './FilesPreview.module.css';

export function FilesPreview({
  item, onDelete, index, showClose, showImg
}) {
  const image = showImg && item?.value ? item.value : uploadedFileIcon;
  return (
    <div className={styles.container}>
      {showClose && (
        <div className={styles.closeContainer}>
          <img className={styles.close} src={closeIcon} alt="" onClick={() => onDelete(index)} />
        </div>
      )}
      <div className={styles.row}>
        <img className={showImg && item?.value ? styles.image : styles.icon} src={image} alt="" />
        <div className={styles.label}>
          {item?.name ?? 'Uploaded file name'}
        </div>
      </div>
    </div>
  );
}

FilesPreview.propTypes = {
  item: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  onDelete: PropTypes.func.isRequired,
  showClose: PropTypes.bool,
  showImg: PropTypes.bool
};

FilesPreview.defaultProps = {
  showClose: true,
  showImg: true
};
