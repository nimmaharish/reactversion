import React from 'react';
import PropTypes from 'prop-types';
import { useFile } from 'hooks';
import closeIcon from 'assets/images/shared/close.svg';
import DescriptionIcon from '@material-ui/icons/Description';
import styles from './FilePreview.module.css';

export function FilePreview({ file, onRemove }) {
  const [data, type] = useFile(file);

  // eslint-disable-next-line react/no-multi-comp
  const renderFile = () => {
    switch (type) {
      case 'image':
        return (<img className={styles.image} src={data} alt="" />);
      case 'video':
        return (<video src={data} autoPlay muted loop className={styles.video} />);
      default:
        return (<DescriptionIcon style={{ fontSize: '32px' }} />);
    }
  };

  return (
    <div className={styles.main}>
      {onRemove && (<img onClick={onRemove} className={styles.close} src={closeIcon} alt="" />)}
      <div className={styles.container}>
        {renderFile()}
      </div>
    </div>
  );
}

FilePreview.propTypes = {
  file: PropTypes.object.isRequired,
  onRemove: PropTypes.func,
};

FilePreview.defaultProps = {
  onRemove: null,
};
