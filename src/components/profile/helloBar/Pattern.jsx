import React, { useState } from 'react';
import { BottomDrawer } from 'components/shared/BottomDrawer';
import { SideDrawer } from 'components/shared/SideDrawer';
import { useToggle } from 'hooks/common';
import {
  useDesktop
} from 'contexts';
import addIcon from 'assets/overview/addIcon.svg';
import closeIcon from 'assets/overview/close.svg';
import patternIcon1 from 'assets/overview/pattern1.svg';
import patternIcon2 from 'assets/overview/pattern2.svg';
import patternIcon3 from 'assets/overview/pattern3.svg';
import checkedIcon from 'assets/v2/products/coverChecked.svg';
import { Clickable, Button } from 'phoenix-components';
import { useField } from 'formik';
import styles from './Pattern.module.css';

const PATTERNS = [
  {
    value: 'pattern1',
    icon: patternIcon1,
  },
  {
    value: 'pattern2',
    icon: patternIcon2,
  },
  {
    value: 'pattern3',
    icon: patternIcon3,
  }
];

export default function Pattern() {
  const isDesktop = useDesktop();
  const [openPatternDrawer, togglePatternDrawer] = useToggle();
  const [{ value: pattern },, { setValue: setPattern }] = useField('background.patternValue');
  const [state, setState] = useState(pattern);

  const onSave = () => {
    setPattern(state);
    togglePatternDrawer();
  };

  return (
    <div className={styles.textColor}>
      <div className={styles.title}>
        Banner Pattern
      </div>
      <div className="spacer" />
      <Clickable
        onClick={togglePatternDrawer}
        className="flexCenter"
      >
        <>
          {pattern?.length > 0 ? (
            <>
              <div className={styles.label}>Change</div>
              <img
                src={closeIcon}
                alt=""
                className={styles.imgC}
              />
            </>
          ) : (
            <>
              <img
                src={addIcon}
                alt=""
                className={styles.imgA}
              />
              Select
            </>
          )}
        </>
      </Clickable>
      {openPatternDrawer && (
        <>
          {isDesktop ? (
            <>
              <SideDrawer
                title="Select Banner Pattern"
                backButton={true}
                onClick={onSave}
                button={true}
                onClose={togglePatternDrawer}
              >
                <div className={styles.containerDesk}>
                  {PATTERNS.map(p => (
                    <Clickable key={pattern.value} onClick={() => setState(p.value)}>
                      <div className={styles.pattern} style={{ backgroundImage: `url(${p.icon})` }}>
                        {state === p.value && <img src={checkedIcon} alt="" className={styles.checked} />}
                      </div>
                    </Clickable>
                  ))}
                </div>
              </SideDrawer>
            </>
          ) : (
            <BottomDrawer
              title="Select Banner Pattern"
              closeButton={true}
              onClose={togglePatternDrawer}
            >
              <div className={styles.container}>
                {PATTERNS.map(p => (
                  <Clickable key={pattern.value} onClick={() => setState(p.value)}>
                    <div className={styles.pattern} style={{ backgroundImage: `url(${p.icon})` }}>
                      {state === p.value && <img src={checkedIcon} alt="" className={styles.checked} />}
                    </div>
                  </Clickable>
                ))}
              </div>
              <div className={styles.btn}>
                <Button
                  fullWidth
                  onClick={onSave}
                  bordered={false}
                  label="save"
                  size="large" />
              </div>
            </BottomDrawer>
          )}
        </>
      )}
    </div>

  );
}
Pattern.propTypes = {};

Pattern.defaultProps = {};
