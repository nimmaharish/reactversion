import React from 'react';
import { Clickable } from 'phoenix-components';
import { useField } from 'formik';
import { useToggle } from 'hooks/common';
import editIcon from 'assets/overview/edit.svg';
import addIcon from 'assets/overview/addIcon.svg';
import { ColorDialog } from 'components/common/ColorDialog';
import styles from './Color.module.css';

export default function Color() {
  const [{ value: color },, { setValue: setColor }] = useField('background.colorValue');
  const [openColorPicker, toggleColorPicker] = useToggle();

  const setColorValue = (value) => {
    setColor(value);
    toggleColorPicker();
  };

  return (
    <div>
      <div className={styles.textColor}>
        <div className={styles.title}>
          {color?.length > 0 ? (
            <> Selected Color</>
          ) : (
            <> Select Color</>
          )}
        </div>
        <div className="spacer" />
        <Clickable
          onClick={toggleColorPicker}
          className="flexCenter"
        >
          {color?.length > 0 ? (
            <>
              <div className={styles.colorBox} style={{ backgroundColor: color }} />
              <img src={editIcon} alt="" />
            </>
          ) : (
            <>
              <img
                src={addIcon}
                alt=""
                className={styles.imgA}
              />
              Pick Color
            </>
          )}
        </Clickable>
      </div>
      {openColorPicker && (
        <ColorDialog onChange={setColorValue} />
      )}
    </div>
  );
}
Color.propTypes = {};

Color.defaultProps = {};
