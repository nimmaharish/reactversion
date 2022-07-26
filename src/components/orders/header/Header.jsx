import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import Back from 'assets/images/products/create/back.svg';
import Faq from 'components/faq/Custom';
import { ChatDrawer } from 'components/chat/ChatDrawer';
import { useRouteMatch } from 'react-router-dom';
import styles from './Header.module.css';

function Header({
  onBack, title, showFaq, showItems
}) {
  const isOrdersGrid = useRouteMatch('/orders');
  return (
    <div className={styles.topBar}>
      <div className={styles.sub}>
        <img role="none" onClick={(e) => onBack(e)} src={Back} alt="" />
        <div className={cx(styles.heading)}>
          {title}
        </div>
      </div>
      <div className={styles.right}>
        {showFaq && (
          <Faq withText={false} showItems={showItems} />
        )}
        {!isOrdersGrid && (
          <ChatDrawer isFixed={false} />
        )}
      </div>
    </div>
  );
}

Header.propTypes = {
  onBack: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  showFaq: PropTypes.bool,
  showItems: PropTypes.array
};

Header.defaultProps = {
  showFaq: false,
  showItems: ['payments', 'windoCashAndCredits'],
};

export default Header;
