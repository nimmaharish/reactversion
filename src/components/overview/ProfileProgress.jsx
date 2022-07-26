import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { LinearProgress } from '@material-ui/core';
import { LightBlueTile } from 'components/cards';
import { BlackButton } from 'components/buttons';
import { useHistory } from 'react-router-dom';
import { useQueryParams } from 'hooks';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { getLabelName } from 'constants/profile';
import cx from 'classnames';
import { isEmpty } from 'lodash';
import Storage from 'services/storage';
import moreIcon from 'assets/overview/more.svg';
import lessIcon from 'assets/overview/less.svg';
import nextIcon from 'assets/images/profile/next.svg';
import ButtonComponent from 'containers/profile/ButtonComponent';
import styles from './ProfileProgress.module.css';

export function ProfileProgress({ shop, mini }) {
  const history = useHistory();
  const pending = shop?.completion?.inCompleteFields ?? [];
  const completed = (shop?.completion?.percentage || 1) * 100;
  const params = useQueryParams();
  const isIND = shop?.country?.toLowerCase() === 'india';
  const isWatchedAlert = Storage.isWatchedOverviewAlert();
  let conditions = false;
  if (!isWatchedAlert) {
    if (pending.includes('bank')) {
      conditions = true;
    }
    if (pending.includes('address')) {
      conditions = true;
    }
  }
  const [more, setMore] = useState(conditions);

  if (completed === 100) {
    return null;
  }

  const keys = {
    address: 'openAddress',
    bank: 'openBank',
    delivery: 'openDD'
  };

  return (
    <div
      className={cx({
        [styles.mini]: mini
      })}>
      <div
        className={cx({
          [styles.heading1]: mini
        }, styles.heading)}
      >
        Complete your profile to start accepting orders.

      </div>
      <LightBlueTile
        className={cx({
          [styles.className]: mini
        })}
      >
        <div
          className={cx({
            [styles.width100]: mini
          }, styles.progressContainer)}
        >
          <div className="fs12">Profile</div>
          <div className="fs12">
            {completed.toFixed(0)}
            /100
          </div>
        </div>
        <div className="flexBetween">
          <LinearProgress
            color="primary"
            variant="determinate"
            value={completed}
            className={cx({
              [styles.width100]: mini
            }, styles.progress)}
          />
          {!mini && <img onClick={() => setMore(!more)} src={!more ? moreIcon : lessIcon} alt="" role="none" />}
        </div>
        {more && (
          <div className={styles.buttons}>
            {pending.map(p => (
              <BlackButton
                key={p}
                id={p}
                className={styles.button}
                endIcon={<AddCircleIcon className={styles.icon} />}
                onClick={() => {
                  const val = keys[p];
                  if (val) {
                    if (val === 'openBank') {
                      if (isIND) {
                        history.push('/manage/bank', {
                          redirectTo: '/overview',
                        });
                        return;
                      }
                      history.push('/payments?open=2');
                      return;
                    }
                    if (val === 'openAddress') {
                      history.push('/manage/address', {
                        redirectTo: '/overview',
                      });
                      return;
                    }
                    params.set(val, 'true');
                    history.push({ pathname: 'manage', search: params.toString() });
                  } else {
                    history.push({ pathname: 'manage/shop' });
                  }
                }}
              >
                {getLabelName(p)}
              </BlackButton>
            ))}
          </div>
        )}
        {mini && (
          <div className="textRight fullWidth">
            <ButtonComponent
              style={styles.action}
              text="Complete"
              color="secondary"
              onClick={() => {
                if (!isEmpty(pending)) {
                  if (['categories', 'subCategories'].includes(pending[0])) {
                    history.push('/manage/shop');
                    return;
                  }
                  if (pending[0] === 'bank') {
                    if (isIND) {
                      history.push('/manage/bank', {
                        redirectTo: '/overview',
                      });
                      return;
                    }
                    history.push('/payments?open=2');
                    return;
                  }
                  if (pending[0] === 'address') {
                    history.push('/manage/address', {
                      redirectTo: '/overview',
                    });
                    return;
                  }
                  params.set(keys[pending[0]], 'true');
                  history.push({ pathname: 'manage', search: params.toString() });
                }
              }}
              endIcon={<img src={nextIcon} alt="" />}
              fullwidth={true}
              id="complete"
            />
          </div>
        )}
      </LightBlueTile>
    </div>
  );
}

ProfileProgress.propTypes = {
  shop: PropTypes.object.isRequired,
  mini: PropTypes.bool,
};

ProfileProgress.defaultProps = {
  mini: false,
};
