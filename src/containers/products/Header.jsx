import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import logo from 'assets/images/windo.svg';
import review from 'assets/images/products/review.svg';
import Back from 'assets/images/products/create/back.svg';
import Faq from 'components/faq/Custom';
import styles from './Header.module.css';

function Header({
  onBack, title, showLogo, showFaq, showItems, showReview, onReviewClick
}) {
  return (
    <div className={styles.topBar}>
      <div className={styles.sub}>
        {!showLogo && (<img role="none" onClick={(e) => onBack(e)} src={Back} alt="" />)}
        {showLogo && (
          <img
            role="none"
            src={logo}
            className={styles.logo_icon}
            alt=""
          />
        )}
        <div className={cx(styles.heading)}>
          {title}
        </div>
      </div>
      <div className={styles.right}>
        {showReview && (
          <div className={styles.review} onClick={onReviewClick}>
            <img src={review} alt="" />
            Reviews
          </div>
        )}
        {!showReview && (
          <>
            {showFaq && (
              <Faq withText={false} showItems={showItems} />
            )}
          </>
        )}
      </div>
    </div>
  );
}

Header.propTypes = {
  onBack: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  showLogo: PropTypes.bool,
  showFaq: PropTypes.bool,
  showItems: PropTypes.array,
  showReview: PropTypes.bool,
  onReviewClick: PropTypes.func
};

Header.defaultProps = {
  showLogo: false,
  showFaq: false,
  showItems: ['payments', 'windoCashAndCredits'],
  showReview: false,
  onReviewClick: null
};

export default Header;
