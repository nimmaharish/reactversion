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
import cx from 'classnames';
import _ from 'lodash';
import { ImageDrawer } from 'components/products/ImageDrawer';
import { getVideosAndImages } from 'components/products/variantUtils';
import { useImagesLength, useIsFreePlan } from 'contexts';

export function CustomVariant({ index }) {
  const prefix = `variants[${index}]`;
  const [{ value: variant }, , { setValue }] = useField(prefix);
  const [{ value: variants }, , { setValue: setVariants }] = useField('variants');
  const fileLength = useImagesLength(true);
  const isFree = useIsFreePlan();

  const onUnlive = () => {
    setValue({
      ...variant,
      status: variant.status === 'live' ? 'unlive' : 'live',
    });
  };

  const onDelete = () => {
    setVariants(variants.filter((_v, idx) => idx !== index));
  };

  const setVariantTitle = (e) => {
    e.stopPropagation();
    const { value } = e.target;
    setVariants(variants.map(v => {
      _.set(v, 'info.name', value);
      return v;
    }));
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
    <div className={styles.colorV}>
      <div className={styles.title}>
        {_.isEmpty(variant?.info?.name) ? 'Variant' : variant?.info?.name}
        {' '}
        {_.isEmpty(variant?.info?.value) ? index + 1 : variant?.info?.value}
      </div>
      <Card className={styles.desktopCard}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
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
            <FormikInput
              label="Variant Title"
              placeholder="Enter Variant Title"
              name={`${prefix}.info.name`}
              readonly={index !== 0}
              inputProps={{
                onChange: setVariantTitle,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <FormikInput
              label={variant?.info?.name ? `${variant.info.name} Type` : 'Variant Type'}
              placeholder={variant?.info?.name ? `Enter ${variant.info.name} Type` : 'Enter Variant Type'}
              name={`${prefix}.info.value`}
            />
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
          size={fileLength}
          videos={!isFree}
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
  );
}

CustomVariant.propTypes = {
  index: PropTypes.number.isRequired,
};

CustomVariant.defaultProps = {};
