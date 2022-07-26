import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Drawer } from 'components/shared/Drawer';
import { SideDrawer } from 'components/shared/SideDrawer';
import { useField } from 'formik';
import { Editor } from '@tinymce/tinymce-react';
import { Button } from 'phoenix-components';
import CONFIG from 'config';
import Loader from 'services/loader';
import { cssStyle } from 'constants/tinymce';
import { useDesktop } from 'contexts';
import { convertHTML } from 'components/products/variantUtils';
import styles from './DescriptionDraw.module.css';

export function DescriptionDraw({
  onClose, title, placeholder
}) {
  const [{ value: description }, , { setValue }] = useField('description');
  const [, , { setValue: setPlain }] = useField('plainDescription');
  const isDesktop = useDesktop();
  const onChange = (value) => {
    setValue(value);
    if (value) {
      setPlain(convertHTML(value));
    }
  };

  useEffect(() => {
    Loader.show();
  }, []);

  return (
    <>
      {!isDesktop
    && (
      <Drawer
        onClose={onClose}
        closeButton
        title={title}
      >
        <div translate="no">
          {/* {showDummy && (
            <div className={styles.dummy}>
              {placeholder}
            </div>
          )} */}
          <Editor
            value={description}
            apiKey={CONFIG.TINYMCE.key}
            scriptLoading={{ async: true }}
            onInit={() => {
              Loader.hide();
            }}
            init={{
              menubar: false,
              toolbar: false,
              height: '40vh',
              width: '100%',
              placeholder,
              statusbar: false,
              branding: false,
              selector: 'textarea',
              paste_data_images: false,
              plugins: [
                'paste'
              ],
            }}
            onEditorChange={onChange}
          />
          <div className={styles.button}>
            <Button
              label="Save"
              onClick={onClose}
              primary
              fullWidth
              bordered={false}
              size="large"
            />
          </div>
        </div>
      </Drawer>
    )}
      {isDesktop
    && (
      <SideDrawer
        onClose={onClose}
        closeButton
        title="Add Description"
      >
        <div translate="no" className={styles.editor}>
          <Editor
            value={description}
            apiKey={CONFIG.TINYMCE.key}
            scriptLoading={{ async: true }}
            onInit={() => {
              Loader.hide();
            }}
            init={{
              menubar: false,
              toolbar: false,
              height: '40vh',
              width: '100%',
              placeholder,
              statusbar: false,
              branding: false,
              selector: 'textarea',
              paste_data_images: false,
              content_style: cssStyle,
              plugins: [
                'paste'
              ],
            }}
            onEditorChange={onChange}
          />
          <div className={styles.button}>
            <Button
              label="Save"
              onClick={onClose}
              primary
              size="large"
            />
          </div>
        </div>
      </SideDrawer>
    )}
    </>
  );
}

DescriptionDraw.propTypes = {
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  placeholder: PropTypes.string
};

DescriptionDraw.defaultProps = {
  title: 'Add Description',
  placeholder: 'Type about your product'
};

DescriptionDraw.defaultProps = {};
