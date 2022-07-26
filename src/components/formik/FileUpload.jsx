/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import { useField } from 'formik';
import addFile from 'assets/images/shared/addFile.svg';
import cx from 'classnames';
import { compressImages } from 'utils/image';
import Loader from 'services/loader';
import SnackBar from 'services/snackbar';
import { FilePreview } from './FilePreview';
import { ErrorMessage } from './ErrorMessage';
import styles from './FileUpload.module.css';

export function FileUpload({
  multi,
  accept,
  // TODO: size limits check
  // eslint-disable-next-line no-unused-vars
  size,
  name,
  className,
  add,
}) {
  const [, meta, helpers] = useField(name);

  const { value } = meta;

  const selectedFiles = value ? (multi ? value : [value]) : null;

  const onChange = async (e) => {
    try {
      Loader.show();
      const files = await compressImages([...e.target.files]);
      if (files.length) {
        const data = multi ? [...files, ...(value || [])] : files[0];
        helpers.setValue(data);
      }
    } catch (e) {
      SnackBar.show('something went wrong while processing files', 'error');
    } finally {
      Loader.hide();
    }
  };

  const onRemove = idx => {
    const files = selectedFiles.filter((_x, i) => idx !== i);
    if (files.length) {
      const data = multi ? files : files[0];
      helpers.setValue(data);
      return;
    }
    helpers.setValue(multi ? [] : null);
  };

  return (
    <>
      <div className={cx(styles.container, className)}>
        {add && (
          <label className={styles.label}>
            <input className={styles.fileInput} type="file" accept={accept} multiple={multi} onChange={onChange} />
            <img src={addFile} alt="" />
          </label>
        )}
        {selectedFiles && (selectedFiles.map((file, idx) => (
          <FilePreview file={file} key={idx} onRemove={() => onRemove(idx)} />
        )))}
      </div>
      <div className={styles.error}>
        <ErrorMessage name={name} />
      </div>
    </>
  );
}

FileUpload.propTypes = {
  multi: PropTypes.bool,
  accept: PropTypes.string,
  size: PropTypes.number,
  name: PropTypes.string.isRequired,
  className: PropTypes.string,
  add: PropTypes.bool,
};

FileUpload.defaultProps = {
  multi: false,
  accept: '',
  size: 0,
  className: '',
  add: true,
};
