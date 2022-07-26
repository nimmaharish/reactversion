import React, { useState } from 'react';
import PropTypes from 'prop-types';
import uploadIcon from 'assets/images/uploader.svg';
import { FilesPreview } from 'components/common/FilesPreview';
import { validateFiles } from 'utils/files';
import Snackbar from 'services/snackbar';
import Loader from 'services/loader';
import { Becca } from 'api';
import { inParallelWithLimit } from 'utils/parallel';
import styles from './FilesUploader.module.css';

export function FilesUploader({
  files,
  onChange,
  accept,
  isMulti,
  label,
  showCover,
  disabled,
  showClose,
  bottomLabel,
  showImg
}) {
  const [err, setErr] = useState();

  const removeFile = (index) => {
    onChange(files.filter((_i, idx) => idx !== index));
  };

  const onCoverSelect = (index) => {
    const otherItems = files.filter((_i, idx) => idx !== index);
    const selectedItems = files.filter((_i, idx) => idx === index);
    onChange([...selectedItems, ...otherItems]);
  };

  const onFileAdd = async (e) => {
    Loader.show();
    setErr(false);
    try {
      const validatedFiles = validateFiles([...e.target.files]);
      if (validatedFiles.length) {
        let uploaded = await inParallelWithLimit(validatedFiles, 3, async file => {
          const fileName = file?.name;
          try {
            const payload = new FormData();
            const ext = fileName.split('.')
              .pop();
            payload.append('name', fileName);
            payload.append('purpose', 'shop');
            payload.append('type', 'file');
            payload.append('file', file);
            const { url } = await Becca.uploadAsset(payload);
            return {
              name: fileName,
              ext,
              url,
            };
          } catch (e) {
            Snackbar.show(`${fileName} failed to upload `, 'error');
          }
        });

        uploaded = uploaded.filter(x => x)
          .map((x) => ({
            type: 'file',
            name: x.name,
            value: x.url,
          }));
        const allFiles = [];
        if (isMulti) {
          allFiles.push(...files);
        }
        allFiles.push(...uploaded);
        onChange(allFiles);
      }
      if (files.length === 0) {
        setErr(true);
      }
    } catch (e) {
      Snackbar.showError(e);
    } finally {
      Loader.hide();
    }
  };

  return (
    <>
      <label>
        <div className={styles.container}>
          <div className={styles.row}>
            {files.map((file, idx) => (
              <FilesPreview
                key={idx}
                onDelete={removeFile}
                index={idx}
                item={file}
                showClose={showClose}
                showImg={showImg}
                onCoverClick={showCover ? onCoverSelect : null}
              />
            ))}
          </div>
          {files.length === 0 || isMulti ? (
            <div className={styles.filesUploader}>
              <div className={styles.label}>
                {label}
              </div>
              <img className={styles.image} src={uploadIcon} alt="" />
              <input
                type="file"
                className={styles.input}
                accept={accept}
                onChange={onFileAdd}
                multiple={isMulti}
                disabled={disabled}
              />
            </div>
          ) : ''}
          {files.length === 0 && bottomLabel && (
            <div className={styles.bottomLabelContainer}>
              <label className={styles.bottomLabel}>
                {bottomLabel}
              </label>
            </div>
          )}
        </div>
      </label>
      <div className={styles.info}>
        Maximum file upload size is 50MB
      </div>
      <div>{err}</div>
    </>
  );
}

FilesUploader.propTypes = {
  files: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  accept: PropTypes.string,
  isMulti: PropTypes.bool,
  showCover: PropTypes.bool,
  label: PropTypes.string,
  bottomLabel: PropTypes.string,
  disabled: PropTypes.bool,
  showClose: PropTypes.bool,
  showImg: PropTypes.bool
};

FilesUploader.defaultProps = {
  accept: '',
  isMulti: false,
  showCover: false,
  label: 'Upload multiple photos or videos of your product',
  bottomLabel: '',
  disabled: false,
  showClose: true,
  showImg: true
};
