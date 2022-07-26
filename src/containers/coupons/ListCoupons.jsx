import React, { useState } from 'react';
import { Coupon } from 'components/coupons/Coupon';
import { Drawer } from 'components/shared/Drawer';
import { useQueryParams } from 'hooks';
import { useHistory } from 'react-router-dom';
// import ChevronLeft from '@material-ui/icons/ChevronLeft';
import { InfiniteLoader, List } from 'react-virtualized';
import { LightBlueTile } from 'components/cards';
import emptyCoupon from 'assets/images/coupons/emptyCoupons.svg';
import { CreateCoupon } from 'components/coupons/CreateCoupon';
import { useInfiniteCoupons } from 'hooks/coupons';
import { Button as Btn } from 'phoenix-components';
import { useDesktop } from 'contexts';
import chevronLeftDesk from 'assets/v2/common/chevronPrimaryLeft.svg';
// import { SideDrawer } from 'components/shared/SideDrawer';
import Kbc from 'components/knowBaseCards/KnowBaseCards';
import styles from './ListCoupons.module.css';

function ListCoupons() {
  // TODO: filtering
  // eslint-disable-next-line no-unused-vars
  const [filters, setFilters] = useState({});
  const [coupons, loadMore, hasMore, , refresh] = useInfiniteCoupons(filters, { updatedAt: -1 });
  const history = useHistory();
  const params = useQueryParams();
  const id = params.has('coupon');
  const isDesktop = useDesktop();

  const rowCount = hasMore ? 10000 : coupons.length;

  const isLoaded = i => !!coupons[i];

  const height = window.screen.height - 78 - 36;

  const onCreate = () => {
    params.set('coupon', '');
    history.push({
      search: params.toString(),
    });
  };

  // eslint-disable-next-line react/no-multi-comp
  const renderItem = (item) => (
    <div key={item.key} style={item.style}>
      <Coupon refresh={refresh} coupon={coupons[item.index]} />
    </div>
  );

  if (isDesktop) {
    return (
      <div className={styles.desktopContainer}>
        <div onClick={() => history.goBack()} className={styles.maintitle}>
          <img className={styles.backIconForDesktop} src={chevronLeftDesk} alt="" />
          <div>&nbsp;</div>
          <div>&nbsp;</div>
          Discount Coupons
        </div>
        <>
          {coupons.length > 0 ? (
            <>
              <div className={styles.couponBox}>
                <div className="flexCenter">
                  <Btn
                    label="Create Coupon"
                    className={styles.button}
                    onClick={onCreate}
                    size="large"
                  />
                </div>
                <InfiniteLoader
                  loadMoreRows={loadMore}
                  isRowLoaded={isLoaded}
                  rowCount={rowCount}
                  minimumBatchSize={10}
                >
                  {({
                    onRowsRendered,
                    registerChild
                  }) => (
                    <List
                      height={window.screen.height - 336 - 36}
                      onRowsRendered={onRowsRendered}
                      ref={registerChild}
                      rowCount={coupons.length}
                      rowHeight={140}
                      rowRenderer={renderItem}
                      width={window.screen.width - 826}
                    />
                  )}
                </InfiniteLoader>
              </div>
            </>
          ) : (
            <div className={styles.couponBox}>
              <LightBlueTile className={styles.emptyCoupons}>
                <img src={emptyCoupon} alt="" />
              </LightBlueTile>
              <div className={styles.text}>You haven’t created any coupons yet!</div>
              <div className="flexCenter">
                <Btn
                  label="Create Coupon"
                  className={styles.button}
                  onClick={onCreate}
                  size="large"
                />
              </div>
            </div>
          )}
        </>
        {id && <CreateCoupon refresh={refresh} />}
        <div className={styles.kbc}>
          <Kbc type="discountCoupon" />
        </div>
      </div>
    );
  }

  return (
    <Drawer
      onClose={() => history.goBack()}
      title="Discount Coupons"
      containerClass={styles.drawer}
      topBarClass={styles.drawer}
    >
      <div className={styles.container}>
        {coupons.length > 0 ? (
          <InfiniteLoader
            loadMoreRows={loadMore}
            isRowLoaded={isLoaded}
            rowCount={rowCount}
            minimumBatchSize={10}
          >
            {({
              onRowsRendered,
              registerChild
            }) => (
              <List
                height={height}
                onRowsRendered={onRowsRendered}
                ref={registerChild}
                rowCount={coupons.length}
                rowHeight={120}
                rowRenderer={renderItem}
                width={window.screen.width}
              />
            )}
          </InfiniteLoader>
        ) : (
          <>
            <LightBlueTile className={styles.emptyCoupons}>
              <img src={emptyCoupon} alt="" />
            </LightBlueTile>
            <div className={styles.text}>You haven’t created any coupons yet!</div>
          </>
        )}
        <div className={styles.buttonM}>
          <Btn
            label="Create Coupon"
            onClick={onCreate}
            size="large"
            fullWidth
            bordered={false}
          />
        </div>
        {id && <CreateCoupon refresh={refresh} />}
        <div className={styles.kbc}>
          <Kbc type="discountCoupon" />
        </div>
      </div>
    </Drawer>
  );
}

ListCoupons.propTypes = {};

ListCoupons.defaultProps = {};

export default ListCoupons;
