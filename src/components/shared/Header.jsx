import React from 'react';
import chevronLeftDesk from 'assets/v2/common/chevronPrimaryLeft.svg';
import { useHistory } from 'react-router-dom';
import { useDesktop } from 'contexts';
import PropTypes from 'prop-types';
import styles from './Header.module.css';

export function Header({ title, onBack }) {
  const history = useHistory();
  const isDesktop = useDesktop();

  const onClick = () => {
    if (onBack) {
      onBack();
      return;
    }
    history.push('/');
  };

  if (!isDesktop) {
    return null;
  }

  return (
    <div onClick={onClick} className={styles.maintitle}>
      <img className={styles.backIconForDesktop} src={chevronLeftDesk} alt="" />
      <div>&nbsp;</div>
      <div>&nbsp;</div>
      {title}
    </div>
  );
}

Header.propTypes = {
  title: PropTypes.string,
  onBack: PropTypes.func
};

Header.defaultProps = {
  title: 'Overview',
  onBack: null,
};
