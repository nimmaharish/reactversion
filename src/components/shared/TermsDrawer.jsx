import React from 'react';
import PropTypes from 'prop-types';
import { Drawer } from 'components/shared/Drawer';
import { useField } from 'formik';
import { Editor } from '@tinymce/tinymce-react';
import { Button } from 'phoenix-components';
import CONFIG from 'config';
import { FooterButton } from 'components/common/FooterButton';
import { useDesktop } from 'contexts';
import { cssStyle } from 'constants/tinymce';
import { SideDrawer } from 'components/shared/SideDrawer';
import styles from './TermsDrawer.module.css';

export function TermsDrawer({
  onClose, title, placeholder, index, onSubmit
}) {
  const [{ value: description }, , { setValue }] = useField(`tncs.${index}`);
  const onChange = (value) => {
    setValue(value);
  };
  const isDesktop = useDesktop();

  if (isDesktop) {
    return (
      <SideDrawer
        backButton={true}
        title="Shop Policy"
        classes={{
          container: styles.customBody,
        }}
        onClose={onClose}
      >
        <div className={styles.editor}>
          <Editor
            value={description || ''}
            apiKey={CONFIG.TINYMCE.key}
            scriptLoading={{ async: true }}
            init={{
              menubar: false,
              toolbar: false,
              height: 'calc(100vh - 59px - 52px - 50px - 60px)',
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
        </div>
        <div className={styles.button}>
          <Button
            label="Save"
            onClick={() => {
              onSubmit();
              onClose();
            }}
            primary
            size="large"
          />
        </div>
      </SideDrawer>
    );
  }
  return (
    <Drawer
      onClose={onClose}
      closeButton
      title={title}
    >
      <div className={styles.section}>
        <div className={styles.editor}>
          <Editor
            value={description || ''}
            apiKey={CONFIG.TINYMCE.key}
            scriptLoading={{ async: true }}
            init={{
              menubar: false,
              toolbar: false,
              height: 'calc(100vh - 59px - 52px - 50px - 16px)',
              width: '100%',
              placeholder,
              statusbar: false,
              branding: false,
              selector: 'textarea',
              paste_data_images: false,
              plugins: [
                'paste'
              ],
              content_style: cssStyle,
            }}
            onEditorChange={onChange}
          />
        </div>
        <FooterButton>
          <Button
            fullWidth
            bordered={false}
            label="Save"
            onClick={() => {
              onSubmit();
              onClose();
            }}
            primary
            size="large"
          />
        </FooterButton>
      </div>
    </Drawer>
  );
}

TermsDrawer.propTypes = {
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  placeholder: PropTypes.string,
  index: PropTypes.number,
  onSubmit: PropTypes.func
};

TermsDrawer.defaultProps = {
  title: 'Add Description',
  placeholder: 'Shop Terms & Policies',
  index: 0,
  onSubmit: () => {}
};

TermsDrawer.defaultProps = {};
