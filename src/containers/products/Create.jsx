/* eslint-disable react/no-multi-comp */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect, useContext } from 'react';
import {
  Button,
  Grid,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Chip,
  RadioGroup,
  Radio,
  Switch
} from '@material-ui/core';
import cx from 'classnames';
// import { Editor } from '@tinymce/tinymce-react';
import Upload from 'components/cards/Upload/Upload';
import { Becca } from 'api/index';
import SnackBar from 'services/snackbar';
import { useHistory, useParams } from 'react-router-dom';
import { ReactInput, Select, Button as Btn } from 'phoenix-components';
import Variants from 'containers/variants/Variants';
import { ProductContext, UserContext, useShop } from 'contexts';
import {
  isEmpty, get, set, orderBy, cloneDeep
} from 'lodash';
import Loader from 'services/loader';
import { useQueryParams } from 'hooks';
import { BlackButton } from 'components/buttons';
import { StatusSelectionBar } from 'components/shared/StatusSelectionBar';
import DrawerSelection from 'containers/products/Drawers/Category';
import TagDrawerSelection from 'containers/products/Drawers/Tags';
import Delete from 'assets/images/products/create/tag-del.svg';
import Delete1 from 'assets/images/products/create/tag-del1.svg';
import Plus from 'assets/images/products/create/plus.svg';
import Next from 'assets/images/products/create/next.svg';
import Edit from 'assets/images/products/create/edit.svg';
import { makeStyles } from '@material-ui/core/styles';
import { PreviewVariants } from 'components/products';
import Catalog from 'containers/products/Catalog/List';
import { Drawer } from 'components/shared/Drawer';
import Back from 'assets/images/products/create/back.svg';
import styles from './Create.module.css';

const useStyles = makeStyles({
  switch_track: {
    backgroundColor: 'var(--green1)',
  },
  switch_base: {
    color: 'var(--grey)',
    '&.Mui-disabled': {
      color: 'var(--grey)'
    },
    '&.Mui-checked': {
      color: 'var(--green1)'
    },
    '&.Mui-checked + .MuiSwitch-track': {
      backgroundColor: 'var(--green1)',
    }
  },
  switch_primary: {
    '&.Mui-checked': {
      color: 'var(--green1)',
    },
    '&.Mui-checked + .MuiSwitch-track': {
      backgroundColor: 'var(--green1)',
    },
  },
});

function Create() {
  const classes = useStyles();
  const { id } = useParams();
  const isUpdate = !isEmpty(id);
  const params = useQueryParams();
  const openVariants = params.has('openVariants');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [payments, setPayments] = useState(['online']);
  const [images, setImages] = useState([]);
  const [variants, setVariants] = useState([]);
  const [allVariants, setAllVariants] = useState([]);
  const [hashTags, setSelectedHashTags] = useState([]);
  const [catalogs, setCatalogue] = useState([]);
  const [customizable, setIsCustomizable] = useState(true);
  const [videos, setVideos] = useState([]);
  const [availableType, setAvailabilityType] = useState('infinite');
  const [available, setAvailable] = useState('');
  const [editVariant, setEditVariant] = useState(-1);
  const [tab, setTab] = useState('1');

  const getTypeValue = (x, val) => x[val] || '';
  const getCustomType = (x) => Object.keys(x)
    .find(x => x !== 'size' && x !== 'color') || '';

  const context = useContext(UserContext);
  const gstExits = get(context, 'shop.tax.enabled', false);
  const slabValue = gstExits ? get(context, 'shop.tax.slab', 0) : 0;

  const [categories, setCategory] = useState(get(context, 'shop.categories', []));
  const [subCategories, setSubCategory] = useState(get(context, 'shop.subCategories', []));

  const [slab, setSlab] = useState(slabValue);
  const [skuDeliveryCharges, setSkuDeliveryCharges] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const [status, setStatus] = useState('');

  const [transformedCat, setTCat] = useState([]);
  const [transformedSub, setTSub] = useState([]);

  const payOps = ['online', 'cod'];
  const history = useHistory();
  const [mrp, setMrp] = useState('');
  const [sp, setSp] = useState('');
  const step = openVariants ? 1 : 0;
  // eslint-disable-next-line no-unused-vars
  const [statusHistory, setStatusHistory] = useState([]);

  const openCat = params.has('openCat');
  const openCatSub = params.has('openCatSub');
  const openCatalog = params.has('openCatalog');
  const openHash = params.has('openHash');

  const chargeType = get(context, 'shop.delivery.chargeType', '');
  const otherCharges = get(context, 'shop.delivery.otherCharges', []);
  const charges = get(context, 'shop.delivery.charges', 0);

  const [variantTab, setVariantTab] = useState('1');

  const getShippingCharge = () => {
    const sorted = orderBy(otherCharges, 'from', 'desc');
    const filters = sorted.find(x => sp > x.from) || {};
    return filters.charge;
  };

  const deliveryValue = chargeType === 'fixed' ? charges : getShippingCharge();

  const [shippingCharges, setShippingCharges] = useState(deliveryValue);

  // const all = variants.length;
  // const isNew = variants.filter(x => x.isNew).length;
  // const isSaved = variants.filter(x => x.isNew && x.isSaved).length;

  const shop = useShop();

  const getCurrency = (number) => (`${shop?.currencySymbol} ${number || 0}`);

  const getPercentage = () => {
    const original = mrp;
    const discounted = sp;
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

  const [open, setOpen] = useState(openCat || openCatSub);
  const type = openCat
    ? 'c' : (openCatSub ? 's' : (openHash ? 'hash' : (openCatalog ? 'catalog' : '')));
  const [openDrawer, setOpenDrawer] = useState(openCatalog || openHash);

  const slabOptions = [{ label: '0 %', value: 0 }, { label: '5 %', value: 5 },
    { label: '12 %', value: 12 },
    { label: '18 %', value: 18 }, { label: '28 %', value: 28 }];

  const onStateChange = (val) => {
    setTab(val);
  };

  const stateList = [
    {
      label: 'Quantity & Customization',
      value: '1',
    },
    {
      label: 'Variants',
      value: '2',
    },
    {
      label: 'More Details',
      value: '3',
    },
  ];

  const onTabChange = (val) => {
    setVariantTab(val);
  };

  const variantList = [
    {
      label: 'Variants List',
      value: '1',
    },
    {
      label: 'Preview Variants',
      value: '2',
    },
  ];

  const load = () => {
    Becca.getVariants(id).then((x) => {
      // x.variants[0].dimensions
      const firstVariant = x?.variants ? (x.variants.find(x => x.default) || x.variants[0]) : {};
      let newVariants = x.variants;
      setAllVariants(newVariants);
      if (firstVariant?.default) {
        newVariants = x.variants.filter(x => !x.default);
      }
      // setVariants(x?.variants ? (x.variants.find(x => x.default) || x.variants[0]) : {})
      setVariants(newVariants);
      setTitle(x?.title || '');
      setDescription(x?.description || '');
      setCategory(x?.categories || []);
      setSubCategory(x?.subCategories || []);
      setImages(x?.images || []);
      setMrp(firstVariant?.amount || 0);
      setSp(firstVariant?.discountedAmount || 0);
      setShippingCharges(x?.shippingCharges || 0);
      setSkuDeliveryCharges(firstVariant?.deliveryCharges || false);
      setIsCustomizable(x?.customizable);
      setAvailabilityType(firstVariant?.availableType || 'infinite');
      setAvailable(firstVariant?.available || 0);
      setSlab(firstVariant?.tax?.slab || 0);
      setCatalogue(x?.catalogs || []);
      setSelectedHashTags(x?.hashTags);
      setPayments(Object.keys(x?.paymentType || {}));
      setStatusHistory(x?.statusHistory);
      setStatus(x?.status);
      Loader.hide();
    }).catch((e) => {
      console.log(e);
      Loader.hide();
      SnackBar.show('something went wrong', 'error');
    });
  };

  useEffect(() => {
    Becca.getCategories().then(x => {
      const keys = Object.keys(x);
      const transformed = keys.map(x => ({ label: x, value: x }));
      setTCat(transformed);
      setTSub(x);
    }).catch((e) => {
      console.error(e);
    });
    if (isUpdate) {
      Loader.show();
      load();
    }
  }, []);

  // const handleEditorChange = (content) => {
  //   setDescription(content);
  // };

  const getTagsFromSearch = async (str) => {
    const res = await Becca.getHashTags(str);
    return res;
  };

  const getVariantsCount = () => variants.length;

  const isValidData = () => {
    if (isEmpty(title)) {
      SnackBar.show('Please add name', 'error');
      return true;
    }
    if (mrp === 0 || mrp.length === 0) {
      SnackBar.show('Please add original price', 'error');
      return true;
    }
    if (sp === 0 || sp.length === 0) {
      SnackBar.show('Please add Price', 'error');
      return true;
    }
    if (images.length === 0) {
      SnackBar.show('Please add atleast one image', 'error');
      return true;
    }
  };

  const submit = async () => {
    const payload = {
      title,
      description,
      images,
      videos,
      categories,
      subCategories,
      hashTags,
      customizable,
      shippingCharges,
      catalogs,
      paymentType: Object.fromEntries(payments.map(v => [`${v}`, true])),
    };
    if (isUpdate) {
      try {
        Loader.show();
        await Becca.updateProduct(id, payload);
        const defaultVar = allVariants.find(x => x.default) || {};
        if (Object.keys(defaultVar).length > 0) {
          defaultVar.amount = mrp;
          defaultVar.discountedAmount = sp;
          defaultVar.tax = { slab };
          defaultVar.availableType = availableType;
          defaultVar.deliveryCharges = skuDeliveryCharges;
          defaultVar.available = available;
        } else {
          defaultVar.isNew = true;
          defaultVar.default = true;
          defaultVar.amount = mrp;
          defaultVar.discountedAmount = sp;
          defaultVar.tax = { slab };
          defaultVar.availableType = availableType;
          defaultVar.deliveryCharges = skuDeliveryCharges;
          defaultVar.available = available;
        }
        const transVar = variants.concat(defaultVar).map(x => {
          x.skuId = id;
          return x;
        });
        const filterVar = transVar.filter(x => x.isSaved || x.isSaved === undefined);
        const allData = filterVar.map(async (x, i) => {
          try {
            if (x?.isNew) {
              await Becca.createVariant(x);
              return;
            }
            await Becca.updateVariant(x._id, x);
          } catch (e) {
            SnackBar.show(`Variant ${i} failed to create `, 'error');
          }
        });
        await Promise.all(allData);
        SnackBar.show('Product updated Successfully');
        Loader.hide();
        history.push('/products');
      } catch (e) {
        SnackBar.show('Product update failed', 'error');
        Loader.hide();
      }
      return;
    }

    if (isValidData()) {
      return;
    }

    try {
      if (catalogs.length === 0) {
        payload.catalogs = ['all'];
      }
      const { _id } = await Becca.createProduct(payload);
      if (isEmpty(_id)) {
        SnackBar.show('Product Creation Failed', 'error');
        return;
      }
      const transVar = variants.map(x => {
        x.skuId = _id;
        return x;
      });

      const defaultVar = [{
        skuId: _id,
        default: true,
        amount: mrp,
        discountedAmount: sp,
        tax: { slab },
        availableType,
        deliveryCharges: skuDeliveryCharges,
        available
      }];

      const filterVar = defaultVar.concat(transVar.filter(x => x.isNew && x.isSaved));

      const allData = filterVar.map(async (x, i) => {
        try {
          await Becca.createVariant(x);
        } catch (e) {
          SnackBar.show(`Variant ${i} failed to create `, 'error');
        }
      });
      await Promise.all(allData);
      context.refreshOverview();
      SnackBar.show('Product Created Successfully');
      Loader.hide();
      history.push('/products');

      // construct variants payload
    } catch (e) {
      const error = e?.response?.data?.message;
      if (error) {
        SnackBar.show(error, 'error');
      }
    }
  };

  const handleToggle = async (e, item) => {
    const status = e.target.checked ? 'live' : 'unlive';
    await Becca.updateVariantStatus(item._id, { status });
    load();
    e.stopPropagation();
    SnackBar.show(`Status Changed to ${item.status}`);
  };

  const getChecked = (item) => {
    if (item?.status === 'live') {
      return true;
    }
    if (item?.status === 'unlive') {
      return false;
    }
  };

  return (
    <div className={styles.section}>
      <ProductContext.Provider
        value={{
          // skuDimension, skuWeight, mrp, sp, skuDeliveryCharges
          mrp, sp, slab, available, availableType, load, id, skuDeliveryCharges
        }}>
        {step === 0 && (
          <div className="fullWidth">
            <div className={styles.topBar}>
              <img role="none" onClick={history.goBack} src={Back} alt="" />
              <div className={styles.heading}>
                {isUpdate ? 'Update Product' : 'Create Product'}
              </div>
              <div>&nbsp;</div>
            </div>
            <Grid container className={styles.content}>
              <Upload
                type="product"
                items={[...images, ...videos]}
                onSelect={(x) => {
                  const imgs = x.filter(x => x.ext !== 'mp4');
                  const vids = x.filter(x => x.ext === 'mp4');
                  setImages(imgs);
                  setVideos(vids);
                }}
              />
              <div className={cx(styles.labelClass3)}>Product Details </div>
              <Grid item xs={12}>
                <ReactInput
                  value={title}
                  placeholder="Product Name"
                  label="Enter Product Name"
                  setValue={(e) => setTitle(e)}
                />
              </Grid>
              <Grid item xs={6}>
                <ReactInput
                  value={mrp}
                  placeholder="0"
                  label="Price"
                  type="number"
                  setValue={(e) => {
                    if (isUpdate && variants[0]) {
                      const item = variants[0];
                      set(item, 'amount', e);
                    }
                    setMrp(e);
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <ReactInput
                  value={sp}
                  placeholder="0"
                  label="Discounted Price"
                  type="number"
                  setValue={(e) => {
                    const isMin = parseFloat(mrp) < parseFloat(e);
                    if (isMin) {
                      SnackBar.show('Price should be less than Original Price', 'error');
                      return;
                    }
                    if (isUpdate && variants[0]) {
                      const item = variants[0];
                      set(item, 'discountedAmount', e);
                    }
                    setSp(e);
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <div className="fs10">{getPercentage()}</div>
              </Grid>
              <ReactInput
                type="textarea"
                value={description}
                placeholder="Type about your product"
                label="Product Description"
                setValue={(e) => {
                  setDescription(e);
                }}
              />
              {/* <div className={cx(styles.labelClass)}>About Product</div>
              <Editor
                initialValue={description}
                value={description}
                apiKey="jk7y6v6dbe2h16qh13q5klle5sz76ddgevc6ph3v1sa4bgu1"
                scriptLoading={{ async: true }}
                init={{
                  menubar: 'edit',
                  toolbar: false,
                  height: '150px',
                  width: 'calc(100vw - 32px)',
                  placeholder: 'Type here',
                  statusbar: false,
                  branding: false,
                  selector: 'textarea', // change this value according to your HTML
                  paste_data_images: true,
                  plugins: [
                    'paste'
                  ],
                }}
                onEditorChange={handleEditorChange}
              /> */}
              <StatusSelectionBar
                className={styles.tab}
                tabClassName={styles.tabClassName}
                items={stateList}
                activeClass={styles.tabActive}
                onChange={onStateChange}
                active={tab}
              />
              {tab === '1' && (
                <div
                  className={styles.tabSection}
                >
                  <Grid item xs={12}>
                    <div className={cx(styles.labelClass1)}>1. Choose your payments</div>
                    <FormControl component="fieldset">
                      <FormGroup row>
                        {payOps.map((name) => (
                          <FormControlLabel
                            classes={{
                              root: 'textCapital fs14',
                            }}
                            control={(
                              <Checkbox
                                readOnly
                                disabled={name === 'cod'}
                                payment={name}
                                checked={name !== 'cod'}
                                color="primary"
                              />
                            )}
                            label={name === 'cod' ? 'cash' : name}
                          />
                        ))}
                      </FormGroup>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <div>
                      <div className={cx(styles.labelClass1)}>2. Can this be Customized?</div>
                      <FormControl component="fieldset">
                        <RadioGroup
                          row
                          aria-label="position"
                          name="position"
                          value={customizable}
                          defaultValue="top"
                          onChange={(e) => {
                            setIsCustomizable(e.target.value === 'true');
                          }}
                        >
                          <FormControlLabel
                            value={true}
                            classes={{
                              root: 'textCapital fs14',
                            }}
                            // onChange={(e) => setValue(i, 'availableType', e.target.value)}
                            control={<Radio color="primary" />}
                            label="Yes"
                          />
                          <FormControlLabel
                            value={false}
                            classes={{
                              root: 'textCapital fs14',
                            }}
                            control={<Radio color="primary" />}
                            label="No"
                          />
                        </RadioGroup>
                      </FormControl>
                    </div>
                  </Grid>
                  <Grid item xs={12} className="">
                    <FormControl component="fieldset">
                      <div className={cx(styles.labelClass1)}>3. Availability</div>
                      <RadioGroup
                        row
                        aria-label="position"
                        name="position"
                        value={availableType}
                        defaultValue="top"
                        onChange={(e) => {
                          setAvailabilityType(e.target.value);
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
                  <Grid item xs={12} className="">
                    {availableType === 'finite' && (
                      <>
                        <ReactInput
                          type="number"
                          value={available}
                          placeholder="0"
                          label="Quantity"
                          setValue={(e) => {
                            setAvailable(e);
                          }}
                          helperText="Your order will be Out of Stock once Available Quantity
                          becomes 0"
                        />
                      </>
                    )}
                  </Grid>
                  <Grid item xs={4}>
                    <div className={cx(styles.labelClass1)}>4. Tax Details</div>
                    <Select
                      options={slabOptions}
                      placeholder="Type about your product"
                      label="Tax Slab"
                      value={slabOptions.find(x => x.value === slab)}
                      onChange={(e) => setSlab(e.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <div className={cx(styles.labelClass1)}>5. Other Details</div>
                    <FormControl fullWidth>
                      <div
                        className={cx(styles.chipSection1)}
                        onClick={() => {
                          setOpenDrawer(true);
                          params.set('openCatalog', 'true');
                          history.push({
                            search: params.toString(),
                          });
                        }}
                      >
                        <div className={cx(styles.chips)}>
                          {catalogs.length > 0 && catalogs.map(s => (
                            <Chip
                              label={s}
                              className={styles.chip1}
                              deleteIcon={<img className={styles.delIcon} src={Delete1} alt="" />}
                              onMouseDown={(event) => {
                                event.stopPropagation();
                              }}
                              onDelete={() => setCatalogue(catalogs.filter(x => (x !== s)))}
                              color="secondary"
                            />
                          ))}
                          {catalogs.length === 0 && (
                            <div className={cx(styles.noChips)}>
                              Select Catalog
                            </div>
                          )}
                        </div>
                        <img role="none" className={cx(styles.nextImg)} src={Next} alt="" />
                      </div>
                    </FormControl>
                  </Grid>
                </div>
              )}
              {tab === '2' && (
                <div className={styles.tabSection2}>
                  <StatusSelectionBar
                    className={styles.tab1}
                    tabClassName={styles.tabClassName1}
                    items={variantList}
                    activeClass={styles.tabActive1}
                    onChange={onTabChange}
                    active={variantTab}
                  />
                  {variantTab === '2' && <PreviewVariants variants={variants} />}
                  {variantTab === '1' && (
                    <>
                      {getVariantsCount() === 0 && (
                        <Grid item xs={12}>
                          <Button
                            variant="contained"
                            color="secondary"
                            className={styles.border}
                            startIcon={<img role="none" src={Plus} alt="" />}
                            onClick={() => {
                              if (isValidData()) {
                                return;
                              }
                              setEditVariant(-1);
                              params.set('openVariants', 'true');
                              history.push({
                                search: params.toString(),
                              });
                            }}
                          >
                            Add Size/Color/Custom
                          </Button>
                        </Grid>
                      )}
                      {getVariantsCount() > 0 && (
                        <>
                          <div className="fullWidth textRight">
                            <div className={styles.variantsInfo}>
                              Total Variants
                              <span className={styles.count}>{getVariantsCount()}</span>
                            </div>
                          </div>
                          <Grid item xs={12} className="textRight">
                            {variants.map((x, i) => (
                              <div className={styles.variantCard}>
                                <div className={styles.vcTop}>
                                  <div className={styles.part1}>
                                    <div className={styles.text1}>{`${i + 1}`}</div>
                                    <div className={styles.text2}>Variant</div>
                                  </div>
                                  <div className={styles.part1}>
                                    {isUpdate && (
                                      <Switch
                                        checked={getChecked(x)}
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={(e) => handleToggle(e, x)}
                                        classes={{
                                          track: classes.switch_track,
                                          switchBase: classes.switch_base,
                                          colorPrimary: classes.switch_primary,
                                        }}
                                        id="checkbox"
                                        name="checkedA"
                                        color="primary"
                                      />
                                    )}
                                  </div>
                                </div>
                                <div className={styles.vcTop1}>
                                  {getTypeValue(x?.details, 'color').length > 0 && (
                                    <div className={styles.vcSplit25}>
                                      <div className={styles.vTitle}>
                                        Color
                                      </div>
                                      <div
                                        className={styles.vColorValue}
                                        style={{
                                          background: getTypeValue(x?.details, 'color')
                                        }}
                                      >
                                      </div>
                                    </div>
                                  )}
                                  {getTypeValue(x?.details, 'size').length > 0 && (
                                    <div className={styles.vcSplit25}>
                                      <div className={styles.vTitle}>
                                        Size
                                      </div>
                                      <div className={styles.vColorValue1}>
                                        {getTypeValue(x?.details, 'size')}
                                      </div>
                                    </div>
                                  )}
                                  {getTypeValue(x?.details, getCustomType(x?.details)).length > 0 && (
                                    <div className={styles.vcSplit75}>
                                      <div className={styles.vTitle}>
                                        Custom
                                      </div>
                                      <div className={styles.vColorValue1}>
                                        {getCustomType(x?.details)}
                                        {' - '}
                                        {getTypeValue(x?.details, getCustomType(x?.details))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                                <div className={cx(styles.variantActions, 'fullWidth flexCenter')}>
                                  <BlackButton
                                    className={cx(styles.border1, styles.btnL50)}
                                    onClick={() => {
                                      const allCpy = [...variants];
                                      const current = cloneDeep(allCpy[i]);
                                      // tempId to filter duplicate variants
                                      if (isUpdate) {
                                        current.tempId = `duplicate-${current?._id}`;
                                        delete current._id;
                                      } else {
                                        current.tempId = `duplicate-${i}`;
                                      }
                                      current.newId = `new-${variants.length + 1}`;
                                      current.isNew = true;
                                      current.isSaved = false;
                                      // Array(times).fill(elemnt)
                                      const newItems = allCpy.concat(current);
                                      setVariants(newItems);
                                      SnackBar.show('Variant duplication successfull');
                                    }}
                                  >
                                    Duplicate
                                  </BlackButton>
                                  <BlackButton
                                    className={cx(styles.border, styles.btnR50)}
                                    onClick={() => {
                                      setEditVariant(i);
                                      params.set('openVariants', 'true');
                                      history.push({
                                        search: params.toString(),
                                      });
                                    }}
                                  >
                                    <img className={styles.editIcon} src={Edit} alt="" />
                                    Edit Variant
                                  </BlackButton>
                                </div>
                              </div>
                            ))}
                            <Button
                              variant="contained"
                              color="secondary"
                              className={cx(styles.border, styles.border50)}
                              startIcon={<img role="none" src={Plus} alt="" />}
                              onClick={() => {
                                setEditVariant(-1);
                                params.set('openVariants', 'true');
                                history.push({
                                  search: params.toString(),
                                });
                              }}
                            >
                              Add new variants
                            </Button>
                          </Grid>
                        </>
                      )}
                    </>
                  )}
                </div>
              )}
              {tab === '3' && (
                <div
                  id="slugField"
                  className={styles.tabSection1}
                >
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <div className={cx(styles.labelClass2)}>Select Category</div>
                      <div
                        className={cx(styles.chipSection)}
                        onClick={() => {
                          setOpen(true);
                          params.set('openCat', 'true');
                          history.push({
                            search: params.toString(),
                          });
                        }}
                      >
                        <div className={cx(styles.chips)}>
                          {categories.length > 0 && categories.map(s => (
                            <Chip
                              label={s}
                              className={styles.chip}
                              deleteIcon={<img className={styles.delIcon} src={Delete} alt="" />}
                              onMouseDown={(event) => {
                                event.stopPropagation();
                              }}
                              onDelete={() => setCategory(categories.filter(x => (x !== s)))}
                              color="secondary"
                            />
                          ))}
                          {categories.length === 0 && (
                            <div className={cx(styles.noChips)}>
                              Select Category
                            </div>
                          )}
                        </div>
                        <img role="none" src={Next} alt="" />
                      </div>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <div className={cx(styles.labelClass2)}>Select Sub-Category</div>
                      <div
                        className={cx(styles.chipSection)}
                        onClick={() => {
                          setOpen(true);
                          params.set('openCatSub', 'true');
                          history.push({
                            search: params.toString(),
                          });
                        }}
                      >
                        <div className={cx(styles.chips)}>
                          {subCategories.length > 0 && subCategories.map(s => (
                            <Chip
                              label={s}
                              className={styles.chip}
                              deleteIcon={<img className={styles.delIcon} src={Delete} alt="" />}
                              onMouseDown={(event) => {
                                event.stopPropagation();
                              }}
                              onDelete={() => setSubCategory(subCategories.filter(x => (x !== s)))}
                              color="secondary"
                            />
                          ))}
                          {subCategories.length === 0 && (
                            <div className={cx(styles.noChips)}>
                              Select Sub Categories
                            </div>
                          )}
                        </div>
                        <img role="none" src={Next} alt="" />
                      </div>
                    </FormControl>
                  </Grid>
                  {/* <Grid item xs={12}>
                    <FormControl fullWidth>
                      <div className={cx(styles.labelClass2)}>Add HashTags</div>
                      <div
                        className={cx(styles.chipSection)}
                        onClick={() => {
                          setOpenDrawer(true);
                          params.set('openHash', 'true');
                          history.push({
                            search: params.toString(),
                          });
                        }}
                      >
                        <div className={cx(styles.chips)}>
                          {hashTags.length > 0 && hashTags.map(s => (
                            <Chip
                              label={s}
                              className={styles.chip1}
                              deleteIcon={<img className={styles.delIcon} src={Delete1} alt="" />}
                              onMouseDown={(event) => {
                                event.stopPropagation();
                              }}
                              onDelete={() => setSelectedHashTags(hashTags.filter(x => (x !== s)))}
                              color="secondary"
                            />
                          ))}
                          {hashTags.length === 0 && (
                            <div className={cx(styles.noChips)}>
                              Add Hashtags
                            </div>
                          )}
                        </div>
                        <img role="none" src={Next} alt="" />
                      </div>
                    </FormControl>
                  </Grid> */}
                </div>
              )}
              <div className={cx(styles.actionBtn, 'fullWidth', 'flexCenter')}>
                <Btn
                  label={isUpdate ? 'Update Product' : 'Create Product'}
                  onClick={submit}
                  size="large"
                />
              </div>
            </Grid>
          </div>
        )}
        {step === 1 && (
          <Variants
            isUpdate={isUpdate}
            setVariants={setVariants}
            variants={variants}
            selected={variants[editVariant]}
            onBack={() => history.goBack()}
          />
        )}
        {open && (
          <>
            {(type === 'c' || type === 's') && (
              <DrawerSelection
                selected={categories}
                all={transformedCat}
                type="Category"
                title="Select Category"
                onBack={() => history.goBack()}
                onSelect={(e) => setCategory(e)}
                item={transformedSub}
                subSelected={subCategories}
                onSubSelect={(e) => {
                  setSubCategory(e);
                }}
              />
            )}
          </>
        )}
        {openDrawer && (
          <>
            {type === 'hash' && (
              <TagDrawerSelection
                selected={hashTags}
                type="Hashtags"
                title="Pick Or Create Hashtags"
                placeholder="Search (Minimum 3 keys)"
                onBack={() => history.goBack()}
                onSelect={(e) => setSelectedHashTags(e)}
                loadFrom={getTagsFromSearch}
              />
            )}
            {type === 'catalog' && (
              <Drawer title="Select Catalog">
                <Catalog
                  from="product"
                  selected={catalogs}
                  onSelect={setCatalogue}
                />
                <div className={styles.button}>
                  <Btn
                    label="Save"
                    onClick={history.goBack}
                    size="large"
                  />
                </div>
              </Drawer>
            )}
          </>
        )}
      </ProductContext.Provider>
    </div>
  );
}

export default Create;
