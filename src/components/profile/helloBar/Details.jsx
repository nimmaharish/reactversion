import React from 'react';
import { Clickable, FormikInput } from 'phoenix-components';
import { useField } from 'formik';
import { useToggle } from 'hooks/common';
import { ColorDialog } from 'components/common/ColorDialog';
import cx from 'classnames';
import Pattern from 'components/profile/helloBar/Pattern';
import Color from 'components/profile/helloBar/Color';
import { CustomImage } from 'components/profile/helloBar/CustomImage';
import editIcon from 'assets/overview/edit.svg';
import addIcon from 'assets/overview/addIcon.svg';
import styles from './Details.module.css';

const TABS = [
  {
    label: 'Background Color',
    value: 'color',
  },
  {
    label: 'Background Pattern',
    value: 'pattern',
  },
  {
    label: 'Custom Banner Image',
    value: 'image',
  },
];

export function Details() {
  const [{ value: color },, { setValue: setColor }] = useField('textColor');
  const [{ value: type },, { setValue: setType }] = useField('background.type');
  const [,, { setValue: setBgValue }] = useField('background.value');
  const [openColorPicker, toggleColorPicker] = useToggle();

  const setColorValue = (value) => {
    setColor(value);
    toggleColorPicker();
  };

  const setTab = (value) => {
    setType(value);
    setBgValue('');
  };

  return (
    <div className={styles.container}>
      <FormikInput
        name="title"
        label="Enter Your Hello Bar Text"
        placeholder={'Catch everyone\'s eye with a snazzy hello bar!'}
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
      <div className={styles.titleH}>Select Background Type</div>
      <div className="flexCenter">
        <div className={styles.tabs}>
          {TABS.map(t => (
            <Clickable
              onClick={() => setTab(t.value)}
              className={cx(styles.tab, { [styles.active]: t.value === type })}
            >
              {t.label}
            </Clickable>
          ))}
        </div>
      </div>
      <>
        {type === 'pattern' && (<Pattern />)}
        {type === 'color' && (<Color />)}
        {type === 'image' && (<CustomImage />)}
      </>
    </div>
  );
}

Details.propTypes = {};

Details.defaultProps = {};
