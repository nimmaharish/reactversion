import React from 'react';
import PropTypes from 'prop-types';
import { ImagePicker } from 'components/common/ImagePicker';
import { useToggle } from 'hooks/common';
import { OtherButton } from './OtherButton';
import styles from './Variant.module.css';

export function ImageDrawer({
  onChange, images, accept, isMulti, label, showCover, size, videos,
}) {
  const [open, toggle] = useToggle(false);
  return (
    <div className={styles.imageDrawerContainer}>
      <OtherButton onClick={toggle} label="Add Image" open={open} from="var" />
      {open && (
        <div className={styles.imageDrawer}>
          <ImagePicker
            onChange={onChange}
            isMulti={isMulti}
            images={images}
            accept={accept}
            label={label}
            showCover={showCover}
            size={size}
            videos={videos}
          />
        </div>
      )}
    </div>
  );
}

ImageDrawer.propTypes = {
  images: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  accept: PropTypes.string,
  isMulti: PropTypes.bool,
  label: PropTypes.string,
  showCover: PropTypes.bool,
  size: PropTypes.number,
  videos: PropTypes.bool,
};

ImageDrawer.defaultProps = {
  accept: undefined,
  isMulti: false,
  showCover: false,
  label: 'Upload multiple photos or videos of your product',
  size: -1,
  videos: true,
};
