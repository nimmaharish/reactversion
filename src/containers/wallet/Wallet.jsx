import React, { useEffect } from 'react';
import { Drawer } from 'components/shared/Drawer';
import { useWallet } from 'hooks/wallet';
import { Loading } from 'components/shared/Loading';
import { StatusSelectionBar } from 'components/shared/StatusSelectionBar';
import { useQueryParams } from 'hooks';
import { useHistory } from 'react-router-dom';
import { WalletCredits } from 'components/wallet/WalletCredits';
import { WalletBalance } from 'components/wallet/WalletBalance';
import Loader from 'services/loader';
import { SnackBar } from 'services';
import { Piggy } from 'api';
import { useDesktop } from 'contexts';
import { Button } from 'phoenix-components';
import styles from './Wallet.module.css';

const stateList = [
  {
    label: 'Windo Cash',
    value: 'cash',
  },
  {
    label: 'Windo Credits',
    value: 'credits',
  }
];

function Wallet() {
  const [wallet, refresh, loading] = useWallet();
  const params = useQueryParams();
  const state = params.get('type') || 'cash';
  const history = useHistory();
  const isDesktop = useDesktop();

  const checkStatus = async (pgTid, id, interval) => {
    try {
      const { status } = await Piggy.pollPayment(id, pgTid);
      if (status === 'received') {
        if (interval) {
          clearInterval(interval);
        }
        Loader.hide();
        SnackBar.show('Windo Cash added successfully!', 'success');
        refresh();
        history.replace('/payments?open=1&tab=wallet&type=cash&state=credits');
        return true;
      }
      if (status === 'failed') {
        if (interval) {
          clearInterval(interval);
        }
        Loader.hide();
        SnackBar.show('Payment failed try again', 'error');
        refresh();
        history.replace('/payments?open=1&tab=wallet&type=cash&state=credits');
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  const pollStatus = async (pgTid, id) => {
    Loader.show();
    const interval = setInterval(async () => {
      checkStatus(pgTid, id, interval);
    }, 5000);
  };

  useEffect(() => {
    if (params.has('payment')) {
      pollStatus(params.get('pgTid'), params.get('id'));
    }
  }, []);

  if (loading) {
    return <Loading />;
  }

  const onStateChange = (val) => {
    params.set('type', val);
    params.delete('state');
    history.replace({
      search: params.toString(),
    });
  };

  return (isDesktop ? (
    <div className={styles.main}>
      <div className={styles.desktopContainer}>
        <div className={styles.desktopButton}>
          <Button
            primary={false}
            onClick={() => onStateChange('cash')}
            label="Windo Cash"
            className={state === 'cash' ? null : styles.button}
          />
          <Button
            primary={false}
            onClick={() => onStateChange('credits')}
            label="Windo Credits"
            className={state === 'cash' ? styles.button : null}
          />
        </div>
        {state === 'credits' && <WalletCredits wallet={wallet} />}
        {state === 'cash' && <WalletBalance wallet={wallet} />}
      </div>
    </div>
  )
    : (
      <Drawer title="Wallet Transactions">
        <StatusSelectionBar
          tabClassName={styles.tabClassName}
          className={styles.tab}
          activeClass={styles.tabActive}
          items={stateList}
          onChange={onStateChange}
          active={state}
        />
        {state === 'credits' && <WalletCredits wallet={wallet} />}
        {state === 'cash' && <WalletBalance wallet={wallet} />}
      </Drawer>
    )
  );
}

Wallet.propTypes = {};

Wallet.defaultProps = {};

export default Wallet;
