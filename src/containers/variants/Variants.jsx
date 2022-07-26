/* eslint-disable react/no-multi-comp */
import React, { useContext, useState } from 'react';
import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup
} from '@material-ui/core';
import Snackbar from 'services/snackbar';
import WindoInput from 'components/common/Input';
import { useHistory } from 'react-router-dom';
import cx from 'classnames';
import Upload from 'components/cards/Upload/Upload';
import { ProductContext, useShop } from 'contexts';
import PropTypes from 'prop-types';
import { Becca } from 'api/index';
import Info from 'components/info/Info';
import {
  get, set, pickBy
} from 'lodash';
import { useQueryParams } from 'hooks';
import Header from 'containers/products/Header';
import sizeIcon from 'assets/images/products/create/size.svg';
import colorIcon from 'assets/images/products/create/color.svg';
import customIcon from 'assets/images/products/create/custom.svg';
import moreIcon from 'assets/images/products/create/more.svg';
import lessIcon from 'assets/images/products/create/less.svg';
import Delete1 from 'assets/images/products/create/tag-del.svg';
import Delete2 from 'assets/images/products/create/delVariant.svg';
import ButtonComponent from 'containers/profile/ButtonComponent';
import { PreviewVariants } from 'components/products';
import styles from './Variants.module.css';

function Variants({
  setVariants,
  variants,
  onBack,
  selected,
  isUpdate
}) {
  const {
    mrp,
    sp,
    availableType,
    available,
    slab,
    load,
    id,
    skuDeliveryCharges
  } = useContext(ProductContext);
  const [refresh, setRefresh] = useState(false);
  const [openModal, setModal] = useState(false);
  const [newVariant, setNewVariant] = useState(selected);
  const [addVariantType, setAddVariantType] = useState('');
  const [more, setMore] = useState(false);
  const [, setIsSaveBtnClicked] = useState(false);
  const history = useHistory();
  const params = useQueryParams();
  const openSub = params.has('openSub');
  const shop = useShop();
  // const isAnyNewVariants = !isEmpty(variants.find(x => x.isNew));
  const getCustomType = (x) => Object.keys(x)
    .find(x => x !== 'size' && x !== 'color') || '';
  const getTypeValue = (x = {}, val) => x[val] || '';
  const showVariant = openSub;
  const sizeValue = getTypeValue(newVariant?.details || {}, 'size');
  const colorValue = getTypeValue(newVariant?.details || {}, 'color');
  const customTitle = getCustomType(newVariant?.details || {});
  const customValue = getTypeValue(newVariant?.details || {}, customTitle);

  const showAddSize = sizeValue.length === 0;
  const showAddColor = colorValue.length === 0;
  const showAddCustom = customTitle.length === 0 || customValue.length === 0;

  const isNewOne = newVariant ? (!newVariant?.createdAt ? true : !!newVariant?.tempId) : true;

  const reload = () => {
    setRefresh(!refresh);
    setTimeout(() => {
      setRefresh(!refresh);
    }, 100);
  };

  const deleteVariantKey = (key) => {
    delete newVariant.details[key];
    reload();
  };

  const generateVariants = (type) => {
    let variant = {
      type,
      isNew: true,
      isSaved: false,
      isSamePrice: true,
      amount: mrp || '',
      discountedAmount: sp || '',
      availableType,
      available,
      details: { [type]: type === 'color' ? '#000000' : '' },
      tax: { slab },
      images: [],
      videos: [],
      deliveryCharges: skuDeliveryCharges || false,
    };
    if (newVariant) {
      newVariant.details[type] = type === 'color' ? '#000000' : '';
      variant = newVariant;
    }
    setAddVariantType(type);
    setNewVariant(variant);
    reload();
    params.set('openSub', 'true');
    history.push({ search: params.toString() });
  };

  const setValue = (index, key, value) => {
    // update only newly added variant
    if (!index) {
      set(newVariant, key, value);
      setNewVariant(newVariant);
      reload();
      return;
    }
    const item = variants[index];
    set(item, key, value);
    setVariants(variants);
    reload();
  };

  const getValue = (index, key, onlyValue = false) => {
    const item = !index ? newVariant : variants[index];
    if (key === 'deliveryCharges' || key === 'weight') {
      return item[key];
    }
    const newItem = get(item, key);
    if (newItem || newItem === 0) {
      const type = newItem;
      if (onlyValue) {
        return type;
      }
      return { [key]: type };
    }
    return '';
  };

  const getCurrency = (number) => (`${shop?.currency} ${number || 0}`);

  const getPercentage = (i) => {
    const original = getValue(i, 'amount', true);
    const discounted = getValue(i, 'discountedAmount', true);
    const percent = (((original - discounted) * 100) / original).toFixed();
    if (sp <= 0 || mrp <= 0) {
      return '';
    }
    return (
      <span>
        {`Price to customer: ${getCurrency(sp)}`}
        <span className="strikeLine marginSLeftRight">{`${getCurrency(mrp)}`}</span>
        <span>{`${percent}% OFF`}</span>
      </span>
    );
  };

  const getSizeSection = () => (
    <Grid item xs={12}>
      <div className={styles.head}>
        Size
      </div>
      <WindoInput
        placeholder="Enter Size"
        value={sizeValue}
        className={cx(styles.inputClass, styles.right8)}
        labelClassName={styles.labelClass}
        type="text"
        setValue={(e) => {
          setValue(null, 'details.size', e);
        }}
        InputProps={{
          classes: {
            input: cx(styles.slug, styles.single1),
          },
        }}
      />
    </Grid>
  );

  const getColorSection = () => (
    <Grid item xs={12}>
      <div className={styles.head}>
        Color
      </div>
      <div className={styles.colorBody}>
        <WindoInput
          value={colorValue}
          className={cx(styles.inputClass, styles.right81)}
          labelClassName={styles.labelClass}
          type="color"
          setValue={(e) => {
            setValue(null, 'details.color', e);
          }}
          InputProps={{
            classes: {
              input: cx(styles.slug, styles.single2),
            },
          }}
        />
        <div className={styles.vSection}>
          <label>
            Pick a color
          </label>
          <WindoInput
            value={colorValue}
            className={cx(styles.inputClass, styles.right82)}
            type="color"
            setValue={(e) => {
              setValue(null, 'details.color', e);
            }}
            InputProps={{
              classes: {
                input: cx(styles.slug, styles.single3),
              },
            }}
          />
        </div>
        {/* <WindoInput
          value={colorValue}
          className={cx(styles.inputClass, styles.right83)}
          type="text"
          InputProps={{
            classes: {
              input: cx(styles.slug, styles.single),
            },
          }}
          disabled
        /> */}
      </div>
    </Grid>
  );

  const getCustomSection = () => (
    <div className={styles.tabSection1}>
      <Grid item xs={12}>
        <div className={styles.head}>
          Custom
        </div>
        <WindoInput
          placeholder="Variant Type"
          // helperText="e.g. Material, Box type, Accessories type"
          value={customTitle === 'custom' ? '' : customTitle}
          className={cx(styles.inputClass, styles.bottom8, 'marginMTopBottom')}
          labelClassName={styles.labelClass}
          setValue={(e) => {
            const type = customTitle;
            delete newVariant.details[type];
            setValue(null, `details.${e}`, '');
          }}
          InputProps={{
            classes: {
              input: cx(styles.slug, styles.single),
            },
          }}
        />
        <WindoInput
          placeholder="Variant Value"
          value={customValue}
          className={cx(styles.inputClass, styles.bottom8, 'marginMTopBottom')}
          labelClassName={styles.labelClass}
          setValue={(e) => {
            const type = customTitle;
            setValue(null, `details.${type}`, e);
          }}
          InputProps={{
            classes: {
              input: cx(styles.slug, styles.single),
            },
          }}
        />
      </Grid>
    </div>
  );

  const getTitle = () => {
    if (!showVariant) {
      return 'Variants';
    }
    if (addVariantType === 'size') {
      return 'Add Size';
    }
    if (addVariantType === 'color') {
      return 'Add Color';
    }
    return 'Add Custom';
  };

  const onTypeClick = (value) => {
    setAddVariantType(value);
    params.set('openSub', 'true');
    history.push({ search: params.toString() });
  };

  return (
    <div className={styles.section}>
      <Header
        onBack={() => {
          if (showVariant) {
            const filterValues = pickBy(newVariant?.details, v => v.length > 0);
            newVariant.details = filterValues;
            setNewVariant(newVariant);
          }
          onBack();
        }}
        title={getTitle()}
      />
      {!showVariant && (
        <Grid container className={styles.main}>
          {showAddSize && (
            <Grid item xs={12} className={cx(styles.btnSec, 'flexBetween')}>
              <div className={styles.btnText}> Size </div>
              <Button
                className={cx(styles.btnBorder, 'capitalize bold')}
                onClick={() => {
                  generateVariants('size');
                }}
                startIcon={(
                  <img
                    src={sizeIcon}
                    alt=""
                  />
                )}>
                Add Size
              </Button>
            </Grid>
          )}
          {!showAddSize && (
            <Grid item xs={12} className={cx(styles.btnSec)}>
              <div className={styles.btnText}> Size </div>
              <div className={styles.chip1}>
                <span
                  role="none"
                  onClick={() => onTypeClick('size')}
                >
                  {' '}
                  {sizeValue}
                  {' '}
                </span>
                <img
                  role="none"
                  onClick={() => deleteVariantKey('size')}
                  className={styles.delIcon1}
                  src={Delete1}
                  alt=""
                />
              </div>
            </Grid>
          )}
          {showAddColor && (
            <Grid item xs={12} className={cx(styles.btnSec, 'flexBetween')}>
              <div className={styles.btnText}> Color </div>
              <Button
                className={cx(styles.btnBorder, 'capitalize bold')}
                onClick={() => {
                  generateVariants('color');
                }}
                startIcon={(
                  <img
                    src={colorIcon}
                    alt=""
                  />
                )}>
                Add Color
              </Button>
            </Grid>
          )}
          {!showAddColor && (
            <Grid item xs={12} className={cx(styles.btnSec)}>
              <div className={styles.btnText}> Color </div>
              <div className={styles.chip1}>
                <div
                  className={styles.color}
                  role="none"
                  onClick={() => onTypeClick('color')}
                  style={{
                    background: colorValue
                  }}>
                </div>
                <img
                  role="none"
                  onClick={() => deleteVariantKey('color')}
                  className={styles.delIcon1}
                  src={Delete1}
                  alt=""
                />
              </div>
            </Grid>
          )}
          {showAddCustom && (
            <Grid item xs={12} className={cx(styles.btnSec, 'flexBetween')}>
              <div className={styles.btnText}> Custom </div>
              <Button
                className={cx(styles.btnBorder, 'capitalize bold')}
                onClick={() => {
                  generateVariants('custom');
                }}
                startIcon={(
                  <img
                    src={customIcon}
                    alt=""
                  />
                )}>
                Add Custom
              </Button>
            </Grid>
          )}
          {!showAddCustom && (
            <Grid item xs={12} className={cx(styles.btnSec)}>
              <div className={styles.btnText}> Custom </div>
              <div className={styles.chip1}>
                <span
                  role="none"
                  onClick={() => onTypeClick(customTitle)}
                >
                  {' '}
                  {`${customTitle || 'N/A'} - ${customValue || 'N/A'}`}
                  {' '}
                </span>
                <img
                  role="none"
                  onClick={() => deleteVariantKey(customTitle)}
                  className={styles.delIcon1}
                  src={Delete1}
                  alt=""
                />
              </div>
            </Grid>
          )}
          {isNewOne && (
            <img
              role="none"
              onClick={() => {
                const filtered = variants.filter(x => x.tempId !== newVariant?.tempId);
                setVariants(filtered);
                onBack();
              }}
              src={Delete2}
              alt=""
            />
          )}
          {((customTitle.length > 0 && customValue.length > 0)
          || sizeValue.length > 0 || colorValue.length > 0) && (
            <>
              <div className="marginSTopBottom fullWidth">
                <PreviewVariants variants={[newVariant]} />
              </div>
              <div className="fullWidth textCenter">
                <ButtonComponent
                  color="primary"
                  text={isUpdate && newVariant?._id ? 'Update Variant' : 'Save Variant'}
                  style={styles.blackButton}
                  onclick={async () => {
                    setIsSaveBtnClicked(true);
                    if (!isUpdate) {
                      const newItems = [...variants];
                      if (!newVariant?.newId) {
                        newVariant.newId = `new-${variants.length}`;
                        newVariant.isSaved = true;
                        newItems.push(newVariant);
                        setVariants(newItems);
                        onBack();
                        return;
                      }
                      const selectedVariant = variants.find(x => x.newId === newVariant.newId);
                      selectedVariant.isSaved = true;
                      variants[variants.indexOf(selectedVariant)] = selectedVariant;
                      const filtered = variants.map(x => x);
                      setVariants(filtered);
                      onBack();
                    }
                    if (isUpdate) {
                      try {
                        if (newVariant?.isNew) {
                          newVariant.skuId = id;
                          await Becca.createVariant(newVariant);
                          Snackbar.show('Variant saved');
                          load();
                          onBack();
                          return;
                        }
                        await Becca.updateVariant(newVariant._id, newVariant);
                        load();
                        onBack();
                      } catch (e) {
                        Snackbar.show('Variant update failed', 'error');
                      }
                      load();
                    }
                    setIsSaveBtnClicked(false);
                    Snackbar.show('Variant saved');
                  }}
                />
              </div>
            </>
          )}
        </Grid>
      )}
      {showVariant && (
        <div className={styles.content}>
          {!(addVariantType === 'size' || addVariantType === 'color') && getCustomSection()}
          {(addVariantType === 'size') && getSizeSection()}
          {(addVariantType === 'color') && getColorSection()}
          <div
            onClick={() => setMore(!more)}
            className={styles.head1}
          >
            <div> Configure Details </div>
            <img src={!more ? moreIcon : lessIcon} alt="" />
          </div>
          {more && (
            <div className={styles.tabSection}>
              <Grid item xs={6}>
                <div className={cx(styles.labelClass1)}>Product Price</div>
              </Grid>
              <Grid item xs={6}>
                <FormControlLabel
                  value="end"
                  control={(
                    <Checkbox
                      onChange={(e) => setValue(null, 'isSamePrice', e.target.checked)}
                      checked={newVariant?.isSamePrice}
                      color="primary"
                    />
                  )}
                  classes={{
                    root: 'textCapital fs14',
                  }}
                  label="Same as Original Price"
                  labelPlacement="end"
                  className={styles.same_mrp}
                />
              </Grid>
              {!newVariant?.isSamePrice && (
                <>
                  <Grid item xs={6}>
                    <WindoInput
                      value={getValue(null, 'amount', true)}
                      className={cx(styles.inputClass, styles.right8)}
                      labelClassName={styles.labelClass}
                      placeholder="0"
                      label="Original Price"
                      type="number"
                      setValue={(e) => setValue(null, 'amount', e)}
                      InputProps={{
                        classes: {
                          input: cx(styles.slug, styles.single),
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <WindoInput
                      value={getValue(null, 'discountedAmount', true)}
                      className={styles.inputClass}
                      labelClassName={styles.labelClass}
                      placeholder="0"
                      label="Price"
                      type="number"
                      setValue={(e) => {
                        const mrp = getValue(null, 'amount', true);
                        const isMin = parseFloat(mrp) < parseFloat(e);
                        if (isMin) {
                          setValue(null, 'discountedAmount', mrp);
                          Snackbar.show('Price should be less than Original Price', 'error');
                          return;
                        }
                        setValue(null, 'discountedAmount', e);
                      }}
                      InputProps={{
                        classes: {
                          input: cx(styles.slug, styles.single),
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <div className="fs10 marginSTopBottom">{getPercentage(null)}</div>
                  </Grid>
                </>
              )}
              <Grid item xs={6} className="marginSTopBottom">
                <FormControl component="fieldset">
                  <div className={cx(styles.labelClass1)}>Availability</div>
                  <RadioGroup
                    row
                    aria-label="position"
                    name="position"
                    value={getValue(null, 'availableType', true)}
                    defaultValue="top"
                    onChange={(e) => {
                      setValue(null, 'availableType', e.target.value);
                    }}
                  >
                    <FormControlLabel
                      value="finite"
                      classes={{
                        root: 'textCapital fs14',
                      }}
                      control={<Radio color="primary" />}
                      label="Limited Stock"
                    />
                    <FormControlLabel
                      value="infinite"
                      classes={{
                        root: 'textCapital fs14',
                      }}
                      control={<Radio color="primary" />}
                      label="Always In-Stock"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={3} className="">
                {newVariant.availableType === 'finite' && (
                  <>
                    <div className={cx(styles.labelClass1)}>Quantity</div>
                    <WindoInput
                      value={getValue(null, 'available', true)}
                      className={cx(styles.inputClass, styles.right8)}
                      labelClassName={styles.labelClass}
                      placeholder="0"
                      type="number"
                      setValue={(e) => setValue(null, 'available', e)}
                      InputProps={{
                        classes: {
                          input: cx(styles.slug1, styles.single),
                        },
                      }}
                    />
                  </>
                )}
              </Grid>
              <Grid item xs={12}>
                <Upload
                  type="variant"
                  items={[...getValue(null, 'images', true), ...getValue(null, 'videos', true)]}
                  onSelect={(x) => {
                    const imgs = x.filter(x => x.ext !== 'mp4');
                    const vids = x.filter(x => x.ext === 'mp4');
                    setValue(null, 'images', imgs);
                    setValue(null, 'videos', vids);
                  }}
                />
              </Grid>
            </div>
          )}
          {getTypeValue(newVariant?.details, addVariantType).length > 0 && (
            <div className="marginSTopBottom fullWidth">
              <PreviewVariants
                variants={[{ details: { [addVariantType]: getTypeValue(newVariant?.details, addVariantType) } }]}
              />
            </div>
          )}
          <Grid
            className={styles.variant}
            item
            xs={12}
          >
            <ButtonComponent
              color="primary"
              text="Add"
              style={styles.blackButton}
              onclick={() => {
                const filterValues = pickBy(newVariant?.details, v => v.length > 0);
                newVariant.details = filterValues;
                setNewVariant(newVariant);
                onBack();
              }}
            />
          </Grid>
        </div>
      )}
      <div className={styles.contens}>
        <Dialog
          open={openModal}
          onClose={() => setModal(false)}
        >
          <DialogContent>
            <Info
              title="Pro Tip"
              text={'Want to add more colors for a given size or more sizes for the same color?'
               + ' try creating new variant combinations. Eg: To create Size L,M of colors Red and White for each,'
               + ' Create Size L and add color Red as one variant and create another'
               + ' variant Size L and color White and so on.'
               + ' This is applicable for custom variants too.'}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

Variants.propTypes = {
  variants: PropTypes.array.isRequired,
  setVariants: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  isUpdate: PropTypes.bool.isRequired,
  selected: PropTypes.object,
};

Variants.defaultProps = {
  selected: null,
};

export default Variants;
