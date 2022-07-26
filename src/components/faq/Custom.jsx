import React from 'react';
import PropTypes from 'prop-types';
import faqIcon from 'assets/images/shared/faq.svg';
import { useQueryParams } from 'hooks';
import { useHistory } from 'react-router-dom';
import FaqModel from 'containers/faq/Faq';
import cx from 'classnames';
import styles from './Custom.module.css';

function Custom({ showItems, withText, withTextClass }) {
  const history = useHistory();
  const params = useQueryParams();
  const openFaq = params.has('openFaq');
  // eslint-disable-next-line react/no-multi-comp
  const getImage = (className) => (
    <img
      src={faqIcon}
      className={className}
      alt=""
      onClick={() => {
        params.set('openFaq', 'true');
        history.push({ search: params.toString() });
      }}
    />
  );
  return (
    <div>
      {openFaq && (<FaqModel showItems={showItems} />)}
      {withText && (
        <div
          className={cx(styles.bg, withTextClass, styles.withText)}
          onClick={() => {
            params.set('openFaq', 'true');
            history.push({ search: params.toString() });
          }}
        >
          {getImage(styles.img)}
          <span>FAQ</span>
        </div>
      )}
      {!withText && (getImage())}
    </div>
  );
}

Custom.defaultProps = {
  showItems: [],
  withText: false,
  withTextClass: ''
};

Custom.propTypes = {
  showItems: PropTypes.array,
  withText: PropTypes.bool,
  withTextClass: PropTypes.string
};

export default Custom;
