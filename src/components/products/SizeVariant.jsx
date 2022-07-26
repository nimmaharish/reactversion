import React from 'react';
import PropTypes from 'prop-types';
import { useField } from 'formik';
import {
  Card, Clickable, FormikInput, Switch
} from 'phoenix-components';
import { Radio } from 'phoenix-components/lib/formik';
import { Grid } from '@material-ui/core';
import deleteIcon from 'assets/v2/products/delete.svg';
import styles from 'components/products/Variant.module.css';
import _ from 'lodash';
import { useDesktop, useImagesLength } from 'contexts';
import cx from 'classnames';
import { ImageDrawer } from 'components/products/ImageDrawer';
import {
  useIsFreePlan
} from 'contexts';
import { getVideosAndImages } from 'components/products/variantUtils';

export function SizeVariant({ index }) {
  const isFreePlan = useIsFreePlan();
  // const freeRange = '0';
  // const plusRange = '2';
  const isDesktop = useDesktop();
  const prefix = `variants[${index}]`;
  const [{ value: variant }, , { setValue }] = useField(prefix);
  const [{ value: variants }, , { setValue: setVariants }] = useField('variants');
  const fileLength = useImagesLength(true);

  const onUnlive = () => {
    setValue({
      ...variant,
      status: variant.status === 'live' ? 'unlive' : 'live',
    });
  };

  const onDelete = async () => {
    setVariants(variants.filter((_v, idx) => idx !== index));
  };

  const onChangeImages = (files) => {
    const {
      videos,
      images
    } = getVideosAndImages(files);
    setValue({
      ...variant,
      images,
      videos,
    });
  };

  return (
    <>
      {!isDesktop
        && (
          <>
            <div>
              <div className={styles.title}>
                Size
                {' '}
                {_.isEmpty(variant?.info?.value) ? index + 1 : variant?.info?.value}
              </div>
              <Card className={styles.cardBgn}>
                <Grid container spacing={2}>
                  <Grid item xs={7}>
                    <FormikInput
                      label="Size"
                      placeholder="e.g. S"
                      name={`${prefix}.info.value`}
                    />
                  </Grid>
                  <Grid item xs={5}>
                    {variant?._id?.length > 0 && (
                      <div className={styles.switch}>
                        <div
                          className={cx(styles.status, {
                            [styles.statusLive]: variant.status === 'live',
                            [styles.statusUnlive]: variant.status !== 'live',
                          })}
                        >
                          <span />
                          {' '}
                          {variant.status}
                        </div>
                        <Switch active={variant.status === 'live'} onChange={onUnlive} />
                      </div>
                    )}
                  </Grid>
                  <Grid item xs={12}>
                    <div className={styles.heading}>Product Price</div>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <FormikInput
                          label="Price"
                          placeholder="e.g. 160"
                          name={`${prefix}.discountedAmount`}
                          type="number"
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <FormikInput
                          label="Strike-off Price"
                          placeholder="e.g. 200"
                          name={`${prefix}.amount`}
                          type="number"
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <div className={styles.heading}>Availability</div>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Radio name={`${prefix}.availableType`} value="infinite" label="Always in Stock" />
                      </Grid>
                      <Grid item xs={6}>
                        <Radio name={`${prefix}.availableType`} value="finite" label="Limited Stock" />
                      </Grid>
                    </Grid>
                  </Grid>
                  {variant?.availableType === 'finite' && (
                    <Grid item xs={12}>
                      <FormikInput
                        label="Availability"
                        name={`${prefix}.available`}
                        placeholder="0"
                        type="number"
                      />
                    </Grid>
                  )}
                </Grid>
                <ImageDrawer
                  onChange={onChangeImages}
                  isMulti={true}
                  images={[...variant.images, ...variant.videos]}
                  accept="image/*,video/mp4,video/x-m4v,video/*"
                  videos={!isFreePlan}
                  size={fileLength}
                />
                {!variant._id && (
                  <div className={styles.delete}>
                    <Clickable onClick={onDelete}>
                      <img src={deleteIcon} alt="" />
                    </Clickable>
                  </div>
                )}
              </Card>
            </div>
          </>
        )}
      {isDesktop
        && (
          <div>
            <div className={styles.title}>
              Size
              {' '}
              {_.isEmpty(variant?.info?.value) ? index + 1 : variant?.info?.value}
            </div>
            <Card className={styles.sizeCard}>
              <Grid container spacing={2}>
                <Grid item xs={7}>
                  <FormikInput
                    label="Size"
                    placeholder="e.g. S, XL, A3, A5 etc., "
                    name={`${prefix}.info.value`}
                  />
                </Grid>
                <Grid item xs={5}>
                  <div className={styles.switch}>
                    <div
                      className={cx(styles.status, {
                        [styles.statusLive]: variant.status === 'live',
                        [styles.statusUnlive]: variant.status !== 'live',
                      })}
                    >
                      <span />
                      {' '}
                      {variant.status}
                    </div>
                    <Switch active={variant.status === 'live'} onChange={onUnlive} />
                  </div>
                </Grid>
                <Grid item xs={12}>
                  <div className={styles.heading}>Product Price</div>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <FormikInput
                        label="Price"
                        placeholder="e.g. 160"
                        name={`${prefix}.discountedAmount`}
                        type="number"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <FormikInput
                        label="Strike-off Price"
                        placeholder="e.g. 200"
                        name={`${prefix}.amount`}
                        type="number"
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <div className={styles.heading}>Availability</div>
                  <Grid container spacing={2} className={styles.gridContent}>
                    <Grid item xs={4}>
                      <Radio name={`${prefix}.availableType`} value="finite" label="Limited Stock" />
                    </Grid>
                    <Grid item xs={4}>
                      <Radio name={`${prefix}.availableType`} value="infinite" label="Always in Stock" />
                    </Grid>
                  </Grid>
                </Grid>
                {variant?.availableType === 'finite' && (
                  <Grid item xs={12}>
                    <FormikInput
                      label="Availability"
                      name={`${prefix}.available`}
                      placeholder="0"
                      type="number"
                    />
                  </Grid>
                )}
              </Grid>
              <div className={styles.imageDrawer1}>
                <ImageDrawer
                  onChange={onChangeImages}
                  isMulti={true}
                  images={[...variant.images, ...variant.videos]}
                  accept="image/*,video/mp4,video/x-m4v,video/*"
                  videos={!isFreePlan}
                  size={fileLength}
                />
              </div>
              {!variant._id && (
                <div className={styles.delete}>
                  <Clickable onClick={onDelete}>
                    <img src={deleteIcon} alt="" />
                  </Clickable>
                </div>
              )}
            </Card>
          </div>
        )}
    </>
  );
}

SizeVariant.propTypes = {
  index: PropTypes.number.isRequired,
};

SizeVariant.defaultProps = {};
