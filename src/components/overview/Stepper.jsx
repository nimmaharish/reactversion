import React, { useState, useEffect, useRef } from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import DIcon from 'assets/onboarding/done.svg';
import PIcon from 'assets/onboarding/products.svg';
import PDIcon from 'assets/onboarding/productsDisabled.svg';
import { StepConnector } from '@material-ui/core';
import BDIcon from 'assets/onboarding/bankDisabled.svg';
import PlusIcon from 'assets/onboarding/plus.svg';
import PlusDisabledIcon from 'assets/onboarding/plusDisabled.svg';
import { useIsPaymentsEnabled } from 'contexts/userContext';
import { useProducts, } from 'hooks';
import { useHistory } from 'react-router-dom';
import SemiCircleProgressBar from 'react-progressbar-semicircle';
import { Button, Clickable } from 'phoenix-components';
import cx from 'classnames';
import Storage from 'services/storage';
import { CoachMark } from 'components/coachMarks/CoachMark';
import { CmText } from 'constants/coachmarks';
import { useDesktop } from 'contexts';
import styles from './Stepper.module.css';

export default function VerticalLinearStepper() {
  const history = useHistory();
  const isDesktop = useDesktop();
  const sellerProfile = true;
  const [products] = useProducts(0, {
    status: {
      $in: ['live', 'created']
    }
  }, { createdAt: 1 });
  const isEmptyroducts = products?.length === 0;
  const isPaymentsActive = useIsPaymentsEnabled();
  const [elements, setElements] = useState([]);
  const [current, setCurrent] = useState(null);
  const overviewRef = useRef();

  const active = 1;

  const steps = ['Add Products', 'Choose Payment Modes'];

  const percentage = () => {
    let val = 40;
    if (!isEmptyroducts) {
      val += 30;
    }
    if (isPaymentsActive) {
      val += 30;
    }
    console.log(val);
    return val;
  };

  const getStepIcon = (i) => {
    if (i === 0) {
      return (
        <span
          id="stepper"
          className={styles.iconActive}>
          <img
            src={(!isEmptyroducts ? DIcon : (active === 1 ? PIcon : PDIcon))}
            alt="" />
        </span>
      );
    }
    if (i === 1) {
      return (
        <span
          className={(isPaymentsActive ? styles.iconActive : (active === 1 ? styles.iconPassive : styles.iconInactive))}
        >
          <img
            src={(isPaymentsActive ? DIcon : (active === 1 ? BDIcon : BDIcon))}
            alt=""
          />
        </span>
      );
    }
  };

  const getActions = (i) => {
    if (i === 0) {
      return (
        <div>
          {products?.length === 0 && (
            <Button
              primary={false}
              label="Add Products"
              size="small"
              onClick={() => {
                history.push({ pathname: '/products/create' });
              }}
              disabled={active !== 1}
              className={active !== 1 ? styles.disabledButton : ''}
              startIcon={active !== 1 ? PlusDisabledIcon : PlusIcon}
            />
          )}
          {products?.length > 0 && (
            <Clickable
              className={styles.minW}
              onClick={() => {
                history.push('/products');
              }}
            >
              View Products
            </Clickable>
          )}
        </div>
      );
    }
    if (i === 1) {
      return (
        <>
          {isPaymentsActive && (
            <Clickable
              className={styles.minW}
              onClick={() => {
                history.push({ pathname: '/manage/paymentModes' });
              }}
            >
              View Payment Settings
            </Clickable>
          )}
          {!isPaymentsActive && (
            <Button
              primary={false}
              disabled={active !== 1}
              size="small"
              className={active !== 1 ? styles.disabledButton : ''}
              label="Activate Payments"
              startIcon={active !== 1 ? PlusDisabledIcon : PlusIcon}
              onClick={() => {
                history.push({ pathname: '/manage/paymentModes' });
              }}
            />
          )}
        </>
      );
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        if (!isEmptyroducts) {
          return 'Woohoo! You just added products to your shop';
        }
        return 'Go on and stock your shop with products';
      case 1:
        if (isPaymentsActive) {
          return 'You\'re ready to accept payments now!';
        }
        return 'Decide how you want to receive payments for your orders';
      default:
        return 'Add Products';
      case 2:
        if (!sellerProfile) {
          return 'Woohoo! You just added products to your shop';
        }
    }
  };

  useEffect(() => {
    if (!overviewRef.current) {
      return;
    }
    const ids = Storage.getNotWatchedCoachMarks();
    const el = ids.map(x => (document.getElementById(x)));
    const mapped = ids.map((x, i) => ({ [x]: el[i] }));
    setElements(mapped);
    setCurrent(0);
  }, [overviewRef]);

  return (
    <>
      {!isDesktop
        && (
          <div className={styles.root}>
            <div className={styles.percent}>
              <SemiCircleProgressBar
                stroke="#F5603F"
                strokeWidth="15"
                background="rgba(256,256,256,0.5)"
                percentage={percentage()}
                showPercentValue />
            </div>
            <div className={styles.head}>Setup Progress</div>
            <div className={styles.subHead}>Complete these steps to launch your shop!</div>
            <Stepper
              className={styles.stepper}
              activeStep={active}
              orientation="vertical"
              connector={(
                <StepConnector
                  classes={{
                    line: styles.stepRoot
                  }} />
              )}
            >
              {steps.map((label, index) => (
                <Step expanded={true} active={active} key={label}>
                  <StepLabel
                    ref={overviewRef}
                    StepIconComponent={() => getStepIcon(index)}
                    StepIconProps={{
                      classes: {
                        root: styles.stepRoot,
                        active: styles.stepActive,
                        completed: styles.stepActive
                      }
                    }}
                  >
                    <div
                      className={cx(styles.label, {
                        [styles.disabledLabel]: active < index
                      })}
                    >
                      {label}
                    </div>
                  </StepLabel>
                  <StepContent
                    classes={{
                      root: styles.muiStepContent
                    }}>
                    <div className={styles.text}>{getStepContent(index)}</div>
                    <div>
                      {getActions(index)}
                    </div>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
          </div>
        )}
      {isDesktop
        && (
          <div className={styles.root}>
            <div className={styles.percent}>
              <SemiCircleProgressBar
                stroke="#ffffff"
                strokeWidth="15"
                background="rgba(256,256,256,0.5)"
                percentage={percentage()}
                showPercentValue />
            </div>
            <div className={styles.head}>Setup Progress</div>
            <div className={styles.subHead}>Complete these steps to launch your shop!</div>
            <Stepper
              className={styles.stepper}
              activeStep={active}
              orientation="horizontal"
              connector={(
                <StepConnector
                  classes={{
                    line: styles.horizontalLine,
                  }} />
              )}
            >
              {steps.map((label, index) => (
                <Step expanded={true} active={active} key={label} className={styles.stepHorizontal}>
                  <StepLabel
                    ref={overviewRef}
                    StepIconComponent={() => getStepIcon(index)}
                    StepIconProps={{
                      classes: {
                        root: styles.stepRoot,
                        active: styles.stepActive,
                        completed: styles.stepActive
                      }
                    }}
                  >
                  </StepLabel>
                  <div
                    className={cx(styles.label, {
                      [styles.disabledLabel]: active < index
                    })}
                  >
                    {label}
                  </div>
                  <StepContent
                    classes={{
                      root: styles.muiStepContent
                    }}>
                  </StepContent>
                  <div className={styles.text}>{getStepContent(index)}</div>
                  <div>
                    {getActions(index)}
                  </div>
                </Step>
              ))}
            </Stepper>
          </div>
        )}
      {elements.length > 0 && current !== null && (
        <CoachMark
          title={CmText[Object.keys(elements[current])[0]].title}
          subTitle={CmText[Object.keys(elements[current])[0]].sub}
          onSelect={() => {
            const key = Object.keys(elements[current])[0];
            Storage.updateWatchedCoachMarks(key);
            if (elements[current + 1]) {
              setCurrent(current + 1);
              return;
            }
            setElements([]);
          }}
          id={Object.keys(elements[current])[0]}
        />
      )}
    </>

  );
}
