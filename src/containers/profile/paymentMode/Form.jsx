import React from 'react';
import { useField } from 'formik';
import PropTypes from 'prop-types';
import { Button, FormikInput, Card } from 'phoenix-components';
import { OnlineMode } from 'components/profile/payments/OnlineMode';
import { FilesUploader } from 'components/common/FilesUploader';
import { Editor } from '@tinymce/tinymce-react';
import { ErrorMessage } from 'formik';
import { useDesktop } from 'contexts';
import { FooterButton } from 'components/common/FooterButton';
import deleteIcon from 'assets/images/address/delete.svg';
import SnackBar from 'services/snackbar';
import { cssStyle } from 'constants/tinymce';
import styles from './Form.module.css';

function Form({ index, onSave }) {
  const prefix = `custompayment.configured[${index}]`;
  const isDesktop = useDesktop();
  const [{ value: customPayment }, , { setValue }] = useField(prefix);
  const [{ value: customPayments }, , { setValue: setCustomPayments }] = useField('custompayment.configured');
  const [, , { setValue: setCpEnabled }] = useField('custompayment.enabled');
  const isNew = customPayment?.isNew;
  const images = customPayment?.media?.map((imgUrl, index) => ({ index, value: imgUrl, name: '' })) ?? [];

  const onDelete = () => {
    const newValues = (customPayments.filter((_v, idx) => idx !== index)) || [{
      mode: '', details: '', receiptsRequired: true, status: 'live', isNew: true, media: []
    }];
    setCustomPayments(newValues);
    if (newValues.length === 0) {
      setCpEnabled(false);
    }
    onSave();
  };

  const onImageUpload = (links) => {
    customPayment.media = links.map(x => x.value);
    setValue(customPayment);
  };

  return (
    <>
      {!isDesktop && (
        <div className={styles.main}>
          <FormikInput
            label="Enter Payment Method"
            placeholder="e.g. Bank Transfer, Venmo, UPI etc.."
            name={`${prefix}.mode`}
          />
          <div className={styles.editor}>
            <div className={styles.aboutLabel}>
              Enter Payment Details
            </div>
            <Editor
              value={customPayment?.details}
              apiKey="jk7y6v6dbe2h16qh13q5klle5sz76ddgevc6ph3v1sa4bgu1"
              scriptLoading={{ async: true }}
              init={{
                menubar: false,
                toolbar: false,
                height: '100px',
                width: '100%',
                placeholder: 'e.g. UPI ID, Venmo ID, Bank Account Number etc..',
                statusbar: false,
                branding: false,
                selector: 'textarea',
                content_style: cssStyle,
                paste_data_images: false,
                plugins: [
                  'paste'
                ],
              }}
              onEditorChange={(e) => {
                setValue({
                  ...customPayment,
                  details: e,
                });
              }}
            />
          </div>
          <div className={styles.imgContainer}>
            <p>Payment Media Upload (optional)</p>
            <FilesUploader
              label=""
              onChange={onImageUpload}
              isMulti={false}
              files={images}
              accept="image/*"
              showClose={true}
              showImg={true}
              bottomLabel="Upload QR code Image or custom payment Image"
            />
          </div>
          <div className={styles.error}>
            <ErrorMessage name={`${prefix}.details`} />
          </div>
          <OnlineMode
            label="Upload Payment Screenshot to Confirm the Order."
            name={`${prefix}.receiptsRequired`}
            onChange={(value) => {
              setValue({
                ...customPayment,
                receiptsRequired: value,
              });
            }}
          />
          {!isNew && (
            <div className="flexEnd">
              <img src={deleteIcon} alt="" onClick={() => onDelete()} />
            </div>
          )}
          <FooterButton>
            <Button
              size="large"
              fullWidth
              bordered={false}
              label="Save"
              onClick={() => {
                if (!customPayment?.mode && !customPayment?.details) {
                  SnackBar.show('Please add all required fields', 'error');
                  return;
                }
                onSave();
              }}
            />
          </FooterButton>
        </div>
      )}
      {isDesktop && (
        <Card className={styles.card}>
          <div className={styles.main}>
            <div className={styles.heading}>Details of Custom Payment</div>
            <FormikInput
              label="Enter Payment Method"
              placeholder="e.g. Bank Transfer, Venmo, UPI etc.."
              name={`${prefix}.mode`}
            />
            <div className={styles.editor}>
              <div className={styles.aboutLabel}>
                Enter Payment Details
              </div>
              <Editor
                value={customPayment?.details}
                apiKey="jk7y6v6dbe2h16qh13q5klle5sz76ddgevc6ph3v1sa4bgu1"
                scriptLoading={{ async: true }}
                init={{
                  menubar: false,
                  toolbar: false,
                  height: '100px',
                  width: '100%',
                  placeholder: 'e.g. UPI ID, Venmo ID, Bank Account Number etc..',
                  statusbar: false,
                  branding: false,
                  selector: 'textarea',
                  content_style: 'body { font-family: inherit; }'
                    + '.mce-content-body {  margin: 0 } p { margin: 4px 0; } ',
                  paste_data_images: false,
                  plugins: [
                    'paste'
                  ],
                }}
                onEditorChange={(e) => {
                  setValue({
                    ...customPayment,
                    details: e,
                  });
                }}
              />
            </div>
            <div className={styles.error}>
              <ErrorMessage name={`${prefix}.details`} />
            </div>
            <div className={styles.imgContainer}>
              <p>Payment Media Upload (optional)</p>
              <FilesUploader
                label=""
                onChange={onImageUpload}
                isMulti={false}
                files={images}
                accept="image/*"
                showClose={true}
                showImg={true}
                bottomLabel="Upload QR code Image or custom payment Image"
              />
            </div>
            <OnlineMode
              label="Upload Payment Screenshot to Confirm the Order."
              name={`${prefix}.receiptsRequired`}
              onChange={(value) => {
                setValue({
                  ...customPayment,
                  receiptsRequired: value,
                });
              }}
            />
            {!isNew && (
              <div className="flexEnd">
                <img
                  src={deleteIcon}
                  alt=""
                  onClick={() => {
                    if (!customPayment?.mode && !customPayment?.details) {
                      return null;
                    }
                    onDelete();
                  }} />
              </div>
            )}
            <div className={styles.footer1}>
              <Button
                size="large"
                label="Save"
                onClick={() => {
                  if (!customPayment?.mode && !customPayment?.details) {
                    SnackBar.show('Please add all required fields', 'error');
                    return;
                  }
                  onSave();
                }}
              />
            </div>
          </div>
        </Card>
      )}
    </>
  );
}

Form.propTypes = {
  index: PropTypes.number,
  onSave: PropTypes.func.isRequired
};

Form.defaultProps = {
  index: -1,
};

export default Form;
