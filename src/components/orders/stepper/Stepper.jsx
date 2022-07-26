import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import { Step1 } from 'components/orders/stepper/Step1';
import { Step2 } from 'components/orders/stepper/Step2';
import { Step3 } from 'components/orders/stepper/Step3';
import Loader from 'services/loader';
import PropTypes from 'prop-types';
import { Factory } from 'api';
import SnackBar from 'services/snackbar';
import { isIND } from 'contexts/userContext';
import backIcon from 'assets/images/orders/details/back.svg';
import {
  useOrder,
  useGetIds
} from 'contexts/orderContext';
import { useDesktop } from 'contexts';
import styles from './Stepper.module.css';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: 'calc(80vh - 136px)'
  },
  button: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

export default function HorizontalLinearStepper({ groupId, order, onClose }) {
  const classes = useStyles();
  const isDesktop = useDesktop();
  const [skipped, setSkipped] = React.useState(new Set());
  const [resGrpId, setResGrpId] = React.useState(null);
  const rootOrder = useOrder();
  const ids = useGetIds();
  // const webview = useIsWebView();
  // const [meta, setMeta] = React.useState({});
  const [activeStep, setActiveStep] = useState(0);
  const [addressId, setAddressId] = useState(null);
  const isIndia = isIND();

  function getSteps() {
    if (isIndia) {
      return ['Shipping Box Details', 'Courier Selection'];
    }
    return ['Shipping Box Details', 'Courier Selection', 'Pickup Time'];
  }

  const steps = getSteps();

  useEffect(() => {
    function handleResize() {
      const container = document.getElementById('resize');
      if (container) {
        container.style.height = `${window.screen.height - container.getBoundingClientRect().top - 68}px`;
        container.style.overflowY = 'auto';
      }
    }

    window.addEventListener('resize', handleResize);
    handleResize();
  });

  useEffect(() => {
    if (rootOrder?._id) {
      Loader.show();
      if (groupId.length > 0) {
        Factory.getShippingMetaWithGroup(rootOrder?._id, groupId, { ids })
          .then((res) => {
          // setMeta(res);
          // const index = 1;
            setResGrpId(res.groupId);
            const index = !res?.details
              ? 0 : (!res?.pricing ? 1 : (!res?.pickup ? 2 : 0));
            setActiveStep(index);
            Loader.hide();
          })
          .catch(() => {
            SnackBar.show('something went wrong', 'error');
            Loader.hide();
          });
      } else {
        Factory.getShippingMeta(rootOrder?._id, { ids })
          .then((res) => {
          // setMeta(res);
          // const index = 1;
            setResGrpId(res.groupId);
            const index = !res?.details
              ? 0 : (!res?.pricing ? 1 : (!res?.pickup ? 2 : 0));
            setActiveStep(index);
            Loader.hide();
          })
          .catch(() => {
            SnackBar.show('something went wrong', 'error');
            Loader.hide();
          });
      }
    }
  }, [order]);

  const isStepSkipped = (step) => skipped.has(step);

  const handleNext = () => {
    if (activeStep === 0) {
      if (!order?.addressId) {
        SnackBar.show('Please Select Address', 'error');
        return;
      }
    }
    setAddressId(order?.addressId);
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    if (activeStep === 0) {
      onClose();
      return;
    }
    setActiveStep((prevActiveStep) => (prevActiveStep === 0 ? 0 : prevActiveStep - 1));
  };

  function getStepContent(step) {
    switch (step) {
      case 0:
        return (
          <Step1
            groupId={groupId || resGrpId}
            order={order}
            handleNext={handleNext}
            handleBack={handleBack}
          />
        );
      case 1:
        return (
          <Step2
            groupId={groupId || resGrpId}
            order={{ ...order, addressId }}
            handleNext={handleNext}
            handleBack={handleBack}
          />
        );
      case 2:
        return (
          <Step3
            groupId={groupId || resGrpId}
            order={order}
            handleBack={handleBack}
          />
        );
      default:
        return 'Unknown step';
    }
  }

  return (
    <div className={classes.root}>
      {!isDesktop && (
        <>
          {activeStep !== 0 && <img className={styles.back} src={backIcon} alt="" onClick={handleBack} />}
        </>
      )}
      <Stepper
        className={styles.stepper}
        activeStep={activeStep}
      >
        {steps.map((label, index) => (
          <Step
            key={index}
            alternativeLabel
          >
            <StepLabel
              classes={{
                active: styles.stepLabelActive,
                label: styles.stepLabelActive
              }}
              StepIconProps={{
                classes: {
                  root: styles.stepRoot,
                  active: styles.stepActive,
                  completed: styles.stepActive
                }
              }}
              className={styles.stepLabel}
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
      {getStepContent(activeStep)}
    </div>
  );
}

HorizontalLinearStepper.propTypes = {
  groupId: PropTypes.string,
  order: PropTypes.any,
  onClose: PropTypes.func,
};

HorizontalLinearStepper.defaultProps = {
  groupId: '',
  order: {},
  onClose: () => {},
};
