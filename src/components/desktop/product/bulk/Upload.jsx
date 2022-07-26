import React, { useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { useQueryParams } from 'hooks';
import { useHistory } from 'react-router-dom';
import { Button } from 'phoenix-components';
import SnackBar from 'services/snackbar';
import { Becca } from 'api';
import { useIsBulkEnabled } from 'contexts/userContext';
import Loader from 'services/loader';
import Kbc from 'components/knowBaseCards/KnowBaseCards';
import styles from './Upload.module.css';

export function Upload({ onChange }) {
  const [file, setFile] = useState(null);
  const history = useHistory();
  const params = useQueryParams();
  const [dragging, setDrag] = useState(false);
  const isBulkEnabled = useIsBulkEnabled();
  console.log(isBulkEnabled);

  const validateAndSetFile = file => {
    if (!['xlsx', 'xls'].includes(file.name.split('.')
      .pop()
      .toLowerCase())) {
      SnackBar.show('upload excel file', 'warning');
      return;
    }
    setFile(file);
  };

  const onDrop = (e) => {
    e.preventDefault();
    const { files } = e.dataTransfer;
    validateAndSetFile(files[0]);
    setDrag(false);
  };

  const onDrag = (value) => (e) => {
    e.preventDefault();
    setDrag(value);
  };

  const onFileAdd = (e) => {
    if (!isBulkEnabled) {
      params.set('openPlans', 'generic');
      history.push({
        search: params.toString(),
      });
      return;
    }
    const fileObj = e.target.files[0];
    validateAndSetFile(fileObj);
  };

  const handleFileUpload = async () => {
    Loader.show();
    try {
      const payload = new FormData();
      payload.append('file', file);
      const result = await Becca.parseProductXLSX(payload);
      if (!result?.length) {
        SnackBar.showError('products not found in sheet');
        return;
      }
      onChange(result);
    } catch (e) {
      SnackBar.showError(e);
    } finally {
      Loader.hide();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.heading}>Upload products from CSV file</div>
      <div className={styles.subHeading}>
        Download sample
        {' '}
        <a
          className={styles.link}
          href="https://becca-cdn.windo.live/templates/windo-bulk-product-upload-sample.xlsx"
        >
          XLSX template
        </a>
        {' '}
        to see an example of the format required
      </div>
      <label>
        <div
          onDrop={onDrop}
          onDragEnter={onDrag(true)}
          onDragOver={onDrag(true)}
          onDragLeave={onDrag(false)}
          className={cx(styles.fileContainer, {
            [styles.dragging]: dragging,
          })}
        >
          {file && (
            <div className={styles.fileName}>{file.name}</div>
          )}
          <div className={styles.button}>
            {file ? 'Replace' : 'Add'}
          </div>
          <span className={styles.drag}>or drag files to upload</span>
        </div>
        <input
          className={styles.input}
          type="file"
          accept=".xlsx, .xls"
          onChange={onFileAdd}
        />
      </label>
      {file && (
        <div className={styles.upload}>
          <Button
            label="Continue"
            onClick={handleFileUpload}
          />
        </div>
      )}
      <div className="flexCenter fullWidth">
        <Kbc type="bulkProductCreation" />
      </div>
    </div>
  );
}

Upload.propTypes = {
  onChange: PropTypes.func.isRequired,
};

Upload.defaultProps = {};
