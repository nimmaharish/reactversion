import React, { useState } from 'react';
import { Upload } from 'components/desktop/product/bulk/Upload';
import {
  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@material-ui/core';
import { useShop } from 'contexts';
import { Button, Clickable } from 'phoenix-components';
import deleteIcon from 'assets/images/address/delete.svg';
import { UploadImage } from 'components/desktop/product/bulk/UploadImage';
import SnackBar from 'services/snackbar';
import Loader from 'services/loader';
import { mapProduct } from 'components/desktop/product/bulk/utils';
import { inSeries } from 'utils/parallel';
import _ from 'lodash';
import { Becca } from 'api';
import styles from './BulkProduct.module.css';

function BulkProduct() {
  const [data, setData] = useState(null);
  const shop = useShop();

  const deleteRow = idx => () => {
    setData(data.filter((_x, i) => i !== idx));
  };

  const onGetData = res => {
    setData(res);
  };

  const onSetImage = idx => (images) => {
    const item = data[idx];
    item.images = images;
    setData([...data]);
  };

  const onCreate = async () => {
    Loader.show();
    try {
      const products = data.map(mapProduct);
      await inSeries(_.chunk(products, 10), async (chunk) => {
        try {
          await Becca.createProductBulk(chunk);
        } catch (e) {
          SnackBar.showError(e);
        }
      });
      SnackBar.show('products created successfully', 'success');
      setData(null);
    } catch (e) {
      SnackBar.showError(e);
    } finally {
      Loader.hide();
    }
  };

  return (
    <div>
      {data ? (
        <div className={styles.table}>
          <TableContainer component={Paper}>
            <div className={styles.topBar}>
              <div className={styles.heading}>Preview</div>
              <Button disabled={!data.length} label="Save and add products" onClick={onCreate} />
            </div>
            <div className={styles.tableContainer}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Images (upto 8)</TableCell>
                    <TableCell>Product Name</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Strike-off Price</TableCell>
                    <TableCell>Availability</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((row, idx) => (
                    <TableRow key={idx}>
                      <TableCell>
                        <UploadImage onSetImage={onSetImage(idx)} item={row} />
                      </TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row?.catalogs?.length ? row.catalogs[0] : ''}</TableCell>
                      <TableCell>
                        {shop.currencySymbol}
                        {' '}
                        {row.discountedAmount}
                      </TableCell>
                      <TableCell>
                        {shop.currencySymbol}
                        {' '}
                        {row.amount || row.discountedAmount}
                      </TableCell>
                      <TableCell>
                        {row.availability}
                      </TableCell>
                      <TableCell>
                        <Clickable onClick={deleteRow(idx)}>
                          <img src={deleteIcon} alt="" />
                        </Clickable>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TableContainer>
        </div>
      ) : (
        <Upload onChange={onGetData} />
      )}
    </div>
  );
}

BulkProduct.propTypes = {};

BulkProduct.defaultProps = {};

export default BulkProduct;
