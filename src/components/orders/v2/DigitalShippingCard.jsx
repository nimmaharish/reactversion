import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Clickable } from 'phoenix-components';

import chevUp from 'assets/v2/orders/chevUpPrimary.svg';
import chevDown from 'assets/v2/orders/chevDownPrimary.svg';
import uploadIcon from 'assets/images/uploader.svg';

import { FilesUploader } from 'components/common/FilesUploader';
import UploadProduct from 'components/products/UploadProduct.jsx';
import { DeleteAlert } from 'components/shared/DeleteAlert.jsx';

import { useToggle } from 'hooks/common';

import styles from './DigitalShippingCard.module.css';

function DigitalShippingCard({ digitalProducts, onUpload }) {
  const [open, toggleOpen] = useToggle(true);
  const productLinks = digitalProducts.filter((product) => product.type === 'url');
  const productFiles = digitalProducts.filter((product) => product.type === 'file');
  const isEmpty = productFiles.length === 0 && productLinks.length === 0;
  const [openForm, toggleOpenForm] = useToggle(false);
  const [openSendProduct, toggleSendProduct] = useToggle(false);
  const [links, setLinks] = useState([]);

  const uploadForm = () => (
    <>
      <div>
        <Clickable onClick={() => toggleOpenForm(!openForm)} fullWidth>
          <div className={styles.uploadCard}>
            <div className={styles.filesUploader}>
              <img className={styles.image} src={uploadIcon} alt="" />
              <div className={styles.label}>
                Upload your file here
              </div>
            </div>
          </div>
        </Clickable>
      </div>
      {
        openForm && (
          <UploadProduct
            onBack={() => {
              toggleOpenForm(!openForm);
            }}
            onUpload={setLinks}
            onSave={() => {
              toggleSendProduct(!openSendProduct);
            }}
            eitherIsMandatory={true}
          />
        )
      }
      {
        openSendProduct
        && (
          <DeleteAlert
            title="Your digital product will be sent by mail to the customer and
               the status of the order will be updated as Delivered."
            primary="Confirm"
            onCancel={() => {
              toggleSendProduct(!openSendProduct);
            }}
            onDelete={() => {
              onUpload(links);
              toggleSendProduct(!openSendProduct);
              toggleOpenForm(!openForm);
            }}
          />
        )
      }
    </>
  );

  return (
    <div className={styles.container}>
      <Clickable onClick={() => toggleOpen(!open)} className={styles.opener}>
        <span className={styles.title}>Shipping Details</span>
        <span className="spacer" />
        <img src={open ? chevUp : chevDown} alt="" />
      </Clickable>
      <div className={styles.accordionContainer}>
        {open && productLinks.length > 0 && (
          <div>
            <p>Digital Product Link:</p>
            <p className={styles.linkText}>{productLinks[0].value}</p>
          </div>
        )}
        {open && productFiles.length > 0 && (
          <div className={styles.uploaderContainer}>
            <p className={styles.uploadFileText}>Uploaded file:</p>
            <FilesUploader
              files={productFiles}
              accept=""
              label="Uploaded File"
              disabled={false}
              onChange={() => { }}
              isMulti={false}
              showClose={false}
              showImg={false}
            />
          </div>
        )}
        {open && isEmpty && uploadForm()}
      </div>
    </div>
  );
}

DigitalShippingCard.propTypes = {
  digitalProducts: PropTypes.array,
  onUpload: PropTypes.func.isRequired
};

DigitalShippingCard.defaultProps = {
  digitalProducts: [],
};

export default DigitalShippingCard;
