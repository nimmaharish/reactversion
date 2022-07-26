import React from 'react';
import chatIcon from 'assets/overview/chat.svg';
import { useHistory, useLocation } from 'react-router-dom';
import { useQueryParams } from 'hooks';
import PropTypes from 'prop-types';
import cx from 'classnames';
import styles from './ChatIcon.module.css';

const DisabledLocations = ['/coupons', '/products', '/manage'];

export function ChatIcon({ unread, isFixed }) {
  const history = useHistory();
  const params = useQueryParams();
  const location = useLocation();

  const disabled = DisabledLocations.find(l => location.pathname.startsWith(l));

  if (disabled) {
    return null;
  }

  const onClick = () => {
    params.set('chat', '');
    history.push({
      search: params.toString(),
    });
  };
  return (
    <div
      onClick={onClick}
      className={cx({ [styles.padd]: isFixed, [styles.padd]: !isFixed })}>
      <img src={chatIcon} alt="" />
      {unread >= 0 && (
        <div className={styles.unread}>
          {unread}
        </div>
      )}
    </div>
  );
}

ChatIcon.propTypes = {
  unread: PropTypes.number,
  isFixed: PropTypes.bool

};

ChatIcon.defaultProps = {
  unread: 0,
  isFixed: true
};
