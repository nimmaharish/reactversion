import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Grid } from '@material-ui/core';
// import { Radio } from 'phoenix-components/lib/formik';
import deleteIcon from 'assets/v2/products/delete.svg';
import {
  Card, Clickable, Switch, FormikInput
} from 'phoenix-components';
import { useField } from 'formik';
import { useToggle } from 'hooks/common';
import { ColorDialog } from 'components/common/ColorDialog';
import cx from 'classnames';
import { useDesktop, useImagesLength } from 'contexts';
import { ImageDrawer } from 'components/products/ImageDrawer';
import styles from './Variant.module.css';

export function ColorVariant({ index }) {
  const isDesktop = useDesktop();
  // const isFreePlan = useIsFreePlan();
  // const freeRange = '0';
  // const plusRange = '2';
  const prefix = `colors[${index}]`;
  const [{ value: color }, , { setValue }] = useField(prefix);
  const [{ value: colors }, , { setValue: setColors }] = useField('colors');
  const [open, toggleOpen] = useToggle();
  const fileLength = useImagesLength(true);

  const onUnlive = () => {
    setValue({
      ...color,
      status: color.status === 'live' ? 'unlive' : 'live',
    });
  };

  const onDelete = () => {
    setColors(colors.filter((_c, idx) => idx !== index));
  };

  const onChange = hex => {
    setValue({
      ...color,
      hex,
    });
    toggleOpen();
  };

  const onChangeImages = (images) => {
    setValue({
      ...color,
      images,
    });
  };

  return (
    <>
      {!isDesktop
        && (
          <div>
            {open && (
              <ColorDialog onChange={onChange} color={color?.hex} />
            )}
            <div className={styles.title}>
              Color
              {' '}
              {_.isEmpty(color.name) ? index + 1 : color.name}
            </div>
            <Card className={styles.colorBgn}>
              <Grid container spacing={2}>
                <Grid item xs={7}>
                  <Clickable onClick={toggleOpen}>
                    <div className={styles.selectColor}>
                      <div className={styles.colorBlock} style={{ background: color.hex }} />
                      <div>Pick A Color</div>
                    </div>
                  </Clickable>
                </Grid>
                <Grid item xs={5}>
                  {color?._id?.length > 0 && (
                    <div className={styles.switch}>
                      <div
                        className={cx(styles.status, {
                          [styles.statusLive]: color.status === 'live',
                          [styles.statusUnlive]: color.status !== 'live',
                        })}
                      >
                        <span />
                        {' '}
                        {color.status}
                      </div>
                      <Switch active={color.status === 'live'} onChange={onUnlive} />
                    </div>
                  )}
                </Grid>
              </Grid>
              <ImageDrawer
                onChange={onChangeImages}
                isMulti={true}
                images={[...color.images]}
                accept="image/*"
                label="Upload multiple photos for your product"
                size={fileLength}
              />
              <div className={styles.delete}>
                <Clickable onClick={onDelete}>
                  <img src={deleteIcon} alt="" />
                </Clickable>
              </div>
            </Card>
          </div>
        )}
      {isDesktop
        && (
          <div className={styles.colorV}>
            {open && (
              <ColorDialog onChange={onChange} color={color?.hex} />
            )}
            <div className={styles.title}>
              Color
              {' '}
              {_.isEmpty(color.name) ? index + 1 : color.name}
            </div>
            <Card className={styles.sizeCard}>
              <div className={styles.switch}>
                <div
                  className={cx(styles.status, {
                    [styles.statusLive]: color.status === 'live',
                    [styles.statusUnlive]: color.status !== 'live',
                  })}
                >
                  <span />
                  {' '}
                  {color.status}
                </div>
                <Switch active={color.status === 'live'} onChange={onUnlive} />
              </div>
              <Clickable onClick={toggleOpen}>
                <div className={styles.selectColor}>
                  <div className={styles.colorBlock} style={{ background: color.hex }} />
                  <div>Pick A Color</div>
                </div>
              </Clickable>
              {/* <Grid item xs={12}>
                <div className={styles.heading}>Availability</div>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Radio name={`${prefix}.availableType`} value="finite" label="Limited Stock" />
                  </Grid>
                  <Grid item xs={6}>
                    <Radio name={`${prefix}.availableType`} value="infinite" label="Always in Stock" />
                  </Grid>
                </Grid>
              </Grid> */}
              {color?.availableType === 'finite' && (
                <Grid item xs={12}>
                  <FormikInput
                    label="Availability"
                    name={`${prefix}.available`}
                    placeholder="0"
                    type="number"
                  />
                </Grid>
              )}
              <ImageDrawer
                onChange={onChangeImages}
                isMulti={true}
                images={[...color.images]}
                accept="image/*"
                label="Upload multiple photos for your product"
                size={fileLength}
              />
              <div className={styles.delete}>
                <Clickable onClick={onDelete}>
                  <img src={deleteIcon} alt="" />
                </Clickable>
              </div>
            </Card>
          </div>
        )}
    </>
  );
}

ColorVariant.propTypes = {
  index: PropTypes.number.isRequired,
};

ColorVariant.defaultProps = {};
