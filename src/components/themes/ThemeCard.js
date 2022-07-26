import styles from 'containers/profile/theme/customThemes/Layout.module.css';
import dotIcon from 'assets/images/profile/dot.svg';
import dotInactiveIcon from 'assets/images/profile/dotInactive.svg';
import { Switch } from 'phoenix-components/lib/formik';
import React from 'react';
import PropTypes from 'prop-types';
import { LAYOUT_CONFIG } from 'containers/profile/theme/customThemes/utils';
import { useField, useFormikContext } from 'formik';
import { useDesktop } from 'contexts';

export function ThemeCard({ name }) {
  const {
    name: title,
    images,
    key
  } = LAYOUT_CONFIG[name];
  const isDesktop = useDesktop();
  const [{ value: enabled }, , { setValue }] = useField(`${key}.enabled`);

  const { submitForm } = useFormikContext();

  const onChange = () => {
    setValue(!enabled);
    submitForm();
  };

  const image = images?.[isDesktop ? 'desktop' : 'mobile'];

  return (
    <>
      <div className={styles.cardMain}>
        <div className={styles.title}>
          {title}
        </div>
        <div className={styles.switch}>
          <div className={enabled ? styles.active : styles.inActive}>
            <img
              src={enabled ? dotIcon : dotInactiveIcon}
              alt=""
              className={styles.dot}
            />
            {enabled ? 'Active' : 'Inactive'}
          </div>
          <Switch
            name={`${key}.enabled`}
            onChange={onChange}
          />
        </div>
      </div>
      <div className={styles.imgContainer}>
        <img src={image} alt="" />
      </div>
    </>
  );
}

ThemeCard.propTypes = {
  name: PropTypes.string.isRequired,
};
