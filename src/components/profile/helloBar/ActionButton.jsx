import React from 'react';
import { Clickable, FormikInput } from 'phoenix-components';
import { useToggle } from 'hooks/common';
import { useField } from 'formik';
import editIcon from 'assets/overview/edit.svg';
import touchIcon from 'assets/overview/touch.svg';
import { ColorDialog } from 'components/common/ColorDialog';
import addIcon from 'assets/overview/addIcon.svg';
import styles from './ActionButton.module.css';

export function ActionButton() {
  const [openColorPicker, toggleColorPicker] = useToggle();
  const [openBgColorPicker, toggleBgColorPicker] = useToggle();
  const [{ value: color },, { setValue: setColor }] = useField('button.color');
  const [{ value: bgColor },, { setValue: setBgColor }] = useField('button.backgroundColor');

  const setColorValue = (value) => {
    setColor(value);
    toggleColorPicker();
  };
  const setBgColorValue = (value) => {
    setBgColor(value);
    toggleBgColorPicker();
  };

  return (
    <div className={styles.container}>
      <div className={styles.hintContainer}>
        <img
          src={touchIcon}
          className={styles.imgH}
          alt="" />
        <div className={styles.hintText}>
          Add button to your Hello Bar and land your
          customers directly on the specific products.
        </div>
      </div>
      <FormikInput
        name="button.text"
        label="Button Text"
        placeholder="e.g. Shop Now"
      />
      <div className={styles.textColor}>
        <div className={styles.title}>
          Text Color
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
        <ColorDialog onChange={setColorValue} color={color} />
      )}
      <div className={styles.textColor}>
        <div className={styles.title}>
          Background Color
        </div>
        <div className="spacer" />
        <Clickable
          onClick={toggleBgColorPicker}
          className="flexCenter"
        >
          {bgColor?.length > 0 ? (
            <>
              <div className={styles.colorBox} style={{ backgroundColor: bgColor }} />
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
      {openBgColorPicker && (
        <ColorDialog onChange={setBgColorValue} color={bgColor} />
      )}
      <div className={styles.inputContainer}>
      </div>
      <FormikInput
        name="button.url"
        label="Link"
        placeholder="e.g. https://dummytext"
      />
    </div>

  );
}

ActionButton.propTypes = {};

ActionButton.defaultProps = {};
