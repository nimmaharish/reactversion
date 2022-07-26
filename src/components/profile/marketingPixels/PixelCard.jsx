import React from 'react';
import PropTypes from 'prop-types';
import { Button, Clickable, Switch } from 'phoenix-components';
import { useField, useFormikContext } from 'formik';
import _ from 'lodash';
import WebView from 'services/webview';
import cx from 'classnames';
import styles from './PixelCard.module.css';

export function PixelCard({
  icon, title, description, blog, onConnect, name
}) {
  const [{ value }] = useField(name);
  const { submitForm } = useFormikContext();
  const [{ value: enabled }, , { setValue }] = useField(`${name}.enabled`);

  const connected = !_.isEmpty(value.id);

  const onToggle = () => {
    setValue(!enabled);
    submitForm();
  };

  const openUrl = () => {
    if (WebView.isWebView()) {
      WebView.openUrl(blog);
      return;
    }
    window.open(blog, '_blank');
  };

  return (
    <div className={styles.card}>
      <div className={styles.topRow}>
        <img className={styles.icon} src={icon} alt="" />
        <div className={styles.title}>{title}</div>
        <div className="spacer" />
        {!connected && !_.isEmpty(blog) && (
          <Clickable onClick={openUrl} className={styles.greenLink}>
            Know More
          </Clickable>
        )}
        {connected && (
          <div className={styles.switch}>
            <span
              className={cx(styles.enabled, {
                [styles.active]: value.enabled,
              })}
            >
              {value.enabled ? 'Active' : 'In Active'}
            </span>
            <Switch active={value.enabled} onChange={onToggle} />
          </div>
        )}
      </div>
      <div className={styles.description}>
        {description}
      </div>
      <div className={styles.button}>
        <Button onClick={onConnect} label={connected ? 'Edit' : 'Connect'} fullWidth />
      </div>
    </div>
  );
}

PixelCard.propTypes = {
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  blog: PropTypes.string,
  onConnect: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
};

PixelCard.defaultProps = {
  blog: null,
};
