/* eslint-disable react/no-multi-comp */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Card, ReactInput } from 'phoenix-components';

import Snackbar from 'services/snackbar';

import uploadPlusIcon from 'assets/images/products/create/uploadPlus.svg';
import editIcon from 'assets/overview/edit.svg';

import { Drawer } from 'components/shared/Drawer';
import { SideDrawer } from 'components/shared/SideDrawer';
import { BottomDrawer } from 'components/shared/BottomDrawer';
import { FilesUploader } from 'components/common/FilesUploader';
import { InputAlert } from 'components/shared/InputAlert';
import { FooterButton } from 'components/common/FooterButton';

import Header from 'containers/products/Header';

import { useDesktop } from 'contexts';

import styles from './UploadProduct.module.css';

const ProductLinkCard = ({ products, onClick }) => (
  <Card>
    <div className={styles.shareEditBtnsContainer}>
      <Button onClick={onClick} primary={false} endIcon={editIcon} bordered={false} label="Digital Product Link" />
    </div>
    <div className={styles.linkCard}>
      {products[0].value}
    </div>
  </Card>
);

const UploadProductLink = ({ onClose, onSave, products }) => {
  const [link, setLink] = useState(products[0]?.value ?? '');
  const isDektop = useDesktop();

  const handleOnChange = (value) => {
    setLink(value);
  };

  if (isDektop) {
    return (
      <InputAlert
        type="text"
        title="Add Digital Product Link"
        label="Enter Digital Product Link"
        placeholder="Product link"
        defaultValue={link}
        onCancel={onClose}
        onSave={(value) => {
          onSave(value);
          onClose();
        }}
      />
    );
  }

  return (
    <BottomDrawer
      title="Add Digital Product Link"
      closeButton={true}
      onClose={onClose}>
      <div className={styles.line} />
      <ReactInput
        inputClass={styles.productLinkInput}
        type="text"
        label="Enter Digital Product Link"
        placeholder="Product link"
        value={link}
        setValue={handleOnChange}
      />
      <FooterButton>
        <Button
          className={styles.borderRadiusNone}
          primary={true}
          label="Save"
          size="large"
          onClick={() => {
            onSave(link);
            onClose();
          }}
          fullWidth
        />
      </FooterButton>
      {/* </div> */}
    </BottomDrawer>
  );
};

const UploadForm = ({
  onUpload, onSave, digitalProducts, eitherIsMandatory
}) => {
  const [openProductLinkCard, setOpenProductLinkCard] = useState(false);
  const [productLinks, setProductLinks] = useState(
    digitalProducts.filter((product) => product.type === 'url')
  );
  const [productFiles, setProductFiles] = useState(
    digitalProducts.filter((product) => product.type === 'file')
  );

  const isDesktop = useDesktop();

  return (
    <div className={styles.uploadCardContainer}>
      <div>
        <p className={styles.productDetailsText}>ProductDetails</p>
        <div className={styles.uploadCard}>
          <div className={styles.uploadLinkContainer}>
            {productLinks.length > 0 ? (
              <ProductLinkCard
                products={productLinks}
                onClick={() => setOpenProductLinkCard(!openProductLinkCard)} />
            )
              : (
                <div>
                  <Button
                    className={styles.uploadLinkBtn}
                    primary={false}
                    startIcon={uploadPlusIcon}
                    label="Add Digital Product Link"
                    onClick={() => setOpenProductLinkCard(!openProductLinkCard)}
                  />
                </div>
              )}
            {openProductLinkCard ? (
              <UploadProductLink
                products={productLinks}
                onClose={() => setOpenProductLinkCard(!openProductLinkCard)}
                onSave={(link) => {
                  setProductFiles([]);
                  setProductLinks([{ type: 'url', value: link }]);
                }}
              />
            ) : ''}
          </div>
          <div className={styles.orDivider}>
            <div />
            <span>Or</span>
            <div />
          </div>
          <div className={styles.uploadFilesContainer}>
            <p className={styles.uploadFileText}>Upload a File</p>
            <FilesUploader
              files={productFiles}
              accept=""
              label="Upload your file here"
              onChange={(data) => {
                setProductLinks([]);
                setProductFiles(data);
              }}
              isMulti={false}
            />
          </div>
        </div>
      </div>
      <div>
        {isDesktop ? (
          <Button
            className={styles.borderRadiusNone}
            primary={true}
            size="large"
            label="Save"
            onClick={() => {
              if (eitherIsMandatory) {
                if (productLinks.length === 0 && productFiles.length === 0) {
                  Snackbar.showError('Either of the links should be filled in order to proceed.');
                  return;
                }
              }
              onUpload(productLinks.length === 0 ? productFiles : productLinks);
              onSave();
            }}
            fullWidth
          />
        ) : (
          <FooterButton>
            <Button
              className={styles.borderRadiusNone}
              primary={true}
              size="large"
              label="Save"
              onClick={() => {
                if (eitherIsMandatory) {
                  if (productLinks.length === 0 && productFiles.length === 0) {
                    Snackbar.showError('Either of the links should be filled in order to proceed.');
                    return;
                  }
                }
                onUpload(productLinks.length === 0 ? productFiles : productLinks);
                onSave();
              }}
              fullWidth
            />
          </FooterButton>
        )}
      </div>
    </div>
  );
};

const UploadProduct = ({
  onBack,
  onUpload,
  onSave,
  digitalProducts,
  eitherIsMandatory
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const isDesktop = useDesktop();

  const back = () => {
    setIsOpen(false);
    onBack();
  };

  if (isDesktop) {
    return (
      <SideDrawer
        isOpen={isOpen}
        title="Upload Product link"
        backButton={true}
        onClose={back}>
        <UploadForm
          onUpload={onUpload}
          digitalProducts={digitalProducts}
          onSave={onSave}
          eitherIsMandatory={eitherIsMandatory}
        />
      </SideDrawer>
    );
  }

  return (
    <Drawer open={isOpen}>
      <Header
        title="Upload Product link"
        onBack={back}
        showFaq={true} />
      <UploadForm
        onUpload={onUpload}
        digitalProducts={digitalProducts}
        onSave={onSave}
        eitherIsMandatory={eitherIsMandatory}
      />
    </Drawer>
  );
};

UploadProduct.propTypes = {
  onBack: PropTypes.func,
  onUpload: PropTypes.func,
  onSave: PropTypes.func,
  digitalProducts: PropTypes.array,
  eitherIsMandatory: PropTypes.bool
};

UploadProduct.defaultProps = {
  onBack: () => { },
  onUpload: () => { },
  onSave: () => { },
  digitalProducts: [],
  eitherIsMandatory: false
};

UploadForm.propTypes = {
  onUpload: PropTypes.func,
  onSave: PropTypes.func,
  digitalProducts: PropTypes.array,
  eitherIsMandatory: PropTypes.bool
};

UploadForm.defaultProps = {
  onUpload: () => { },
  onSave: () => { },
  digitalProducts: [],
  eitherIsMandatory: false
};

UploadProductLink.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  products: PropTypes.array.isRequired
};

UploadProductLink.defaultProps = {};

ProductLinkCard.propTypes = {
  products: PropTypes.array.isRequired,
  onClick: PropTypes.func.isRequired
};

ProductLinkCard.defaultProps = {};

export default UploadProduct;
