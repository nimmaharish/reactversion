import React from 'react';
import { Formik } from 'formik';
import { useDesktop } from 'contexts';
import { Drawer } from 'components/shared/Drawer';
import { useHistory } from 'react-router-dom';
import distanceBasedIcon from 'assets/images/areasServed/distanceBased.svg';
import regionBasedIcon from 'assets/images/areasServed/regionBased.svg';
import { Clickable, Switch } from 'phoenix-components';
import checkedIcon from 'assets/images/areasServed/checked.svg';
import uncheckedIcon from 'assets/images/areasServed/unchecked.svg';
import rightArrowIcon from 'assets/images/areasServed/rightArrow.svg';
import distanceBasedMiniIcon from 'assets/images/areasServed/distanceBasedMini.svg';
import regionBasedMiniIcon from 'assets/images/areasServed/regionBasedMini.svg';
import { useQueryParams } from 'hooks';
import { useToggle } from 'hooks/common';
import plusIcon from 'assets/images/areasServed/plus.svg';
import { CountryDrawer } from 'components/common/CountryDrawer';
import _ from 'lodash';
import checkedBoxIcon from 'assets/images/orders/multi/check.svg';
import unCheckedBoxIcon from 'assets/images/orders/multi/uncheck.svg';
import { useState } from 'react';
import editIcon from 'assets/images/areasServed/edit.svg';
import { getCountries } from 'utils/countries';
// import { DebugValues } from 'components/formik';
import cx from 'classnames';
import { Becca } from 'api';
import { useAreaConfig } from 'hooks/areasServed';
import SnackBar from 'services/snackbar';
import Loader from 'services/loader';
import { Loading } from 'components/shared/Loading';
import chevronLeftDesk from 'assets/v2/common/chevronPrimaryLeft.svg';
import {
  useIsConditionalChargesEnabled
} from 'contexts/userContext';
import Distance from './Distance';
import Zones from './Zones';
import {
  getInitialValues, getInitialCountryValues, getInitialRegionValues,
  getIntialValuesForDistanceMatrix
} from './utils';
import styles from './Overview.module.css';

function AreasServed() {
  const isDesktop = useDesktop();
  const params = useQueryParams();
  const history = useHistory();
  const isRegionConfig = params.get('region');
  const isDistanceConfig = params.get('distance');
  const [openCountryDrawer, toggleCountryDrawer] = useToggle(false);
  const [countryType, setCountryType] = useState('');
  const [openDistanceDrawer, toggleDistanceDrawer] = useToggle(false);
  const [zoneId, setZoneId] = useState(null);
  const [distanceId, setDistanceId] = useState(null);
  const [countryId, setCountryId] = useState(null);
  const [distanceType, setDistanceType] = useState(null);
  const [config, refresh, isLoading] = useAreaConfig();
  const [isZoneEdit, setIsZoneEdit] = useState(false);
  const isConditionalChargesEnabled = useIsConditionalChargesEnabled();

  const addZone = (values, countryId, type) => {
    setCountryType(type);
    if (type === 'included') {
      setZoneId(values?.region?.countries[countryId]?.regions?.length.toString());
      const zoneObj = getInitialRegionValues();
      setIsZoneEdit(false);
        values?.region?.countries[countryId]?.regions.push(zoneObj);
    }
    return null;
  };

  const editZone = (countryId, zoneIdx) => {
    setCountryId(countryId);
    setZoneId(zoneIdx);
    setIsZoneEdit(true);
    return null;
  };

  const editDistanceZone = (zoneIdx, type) => {
    setDistanceId(zoneIdx.toString());
    setDistanceType(type);
    toggleDistanceDrawer();
    return null;
  };

  const onCountryChange = ({ value }, countries, setValue) => {
    if (countryType === 'included') {
      setValue('region.type', 'included');
      if (_.isEmpty(countries.find(a => a.name === value))) {
        const countryObj = getInitialCountryValues(countries, null);
        countryObj.name = value;
        countryObj.enabled = true;
        setValue('region.countries', [...countries, countryObj]);
      } else {
        setValue('region.countries', countries.filter(s => s.name !== value));
      }
    } else {
      setValue('region.type', 'excluded');
      if (countries.includes(value)) {
        setValue('region.excluded', [...countries.filter(s => s !== value)]);
        return;
      }
      setValue('region.excluded', [...countries, value]);
    }
  };

  const addDistanceZone = (values, setField, type) => {
    const distanceObj = getIntialValuesForDistanceMatrix();
    // const index = values?.distance[type]?.distanceMatrix?.length;
    // setField('distance.active', true);
    setField('distance.type', type);
    // setField(`distance[${type}].distanceMatrix[${index}]`, distanceObj)
    setField(`distance[${type}].distanceMatrix`, [...values?.distance[type]?.distanceMatrix, distanceObj]);
    setDistanceType(type);
    toggleDistanceDrawer();
    // setDistanceId((values.distance[type].distanceMatrix.length === 0 ? 0 : values.distance[type].distanceMatrix.length -1).toString());
    return null;
  };

  const types = ['included', 'excluded'];

  const options = [
    {
      title: 'Region-Based',
      subtitle: 'Restrict by region',
      icon: regionBasedIcon,
      key: 'region',
    },
    {
      title: 'Distance-Based',
      subtitle: 'Restrict by distance',
      icon: distanceBasedIcon,
      key: 'distance',
    }
  ];

  const onSubmit = async (values) => {
    try {
      Loader.show();
      await Becca.createAreaConfig(values);
      SnackBar.show('successfully Updated');
      await refresh();
    } catch (e) {
      SnackBar.showError(e);
    } finally {
      Loader.hide();
    }
  };

  const onSaveCountries = (values) => {
    toggleCountryDrawer();
    onSubmit(values);
  };

  const handleSwitchChange = async (idx, setField, values, submitForm) => {
    setField(`region.countries[${idx}].enabled`, !values.region.countries[idx].enabled);
    submitForm();
  };
  const handleSwitchChangeForDistance = async (idx, setField, values, type, submitForm) => {
    setField(`distance[${type}].distanceMatrix[${idx}].enabled`, !values.distance[type].distanceMatrix[idx].enabled);
    submitForm();
  };

  const handleOptionEnable = (setField, values, type, submitForm) => {
    if (type === 'region') {
      setField('region.active', !values.region.active);
      if (values.distance.active) {
        setField('distance.active', false);
      }
      if (values?.region?.countries?.length === 0 && values.region.active !== true) {
        params.set(type, true);
        history.push({
          search: params.toString(),
        });
      }
      submitForm();
    } else {
      setField('distance.active', !values.distance.active);
      if (values.region.active) {
        setField('region.active', false);
      }
      if (values?.distance?.included?.distanceMatrix?.length === 0 && values.distance.active !== true) {
        params.set(type, true);
        history.push({
          search: params.toString(),
        });
      }
      submitForm();
    }
  };

  const onSave = (values) => {
    onSubmit(values);
    setZoneId(null);
  };

  const getCountryDiv = (values, setField, type, submitForm) => (
    type === 'included' ? (
            values?.region?.countries.map((countryObj, idx) => (
              <div className={styles.countryDiv}>
                <div className={styles.flex}>
                  {(getCountries().find(a => a.countryName === countryObj?.name)?.label)}
                  <div className={styles.toggleSwitch}>
                    <Switch
                      active={countryObj?.enabled}
                      onChange={() => handleSwitchChange(idx, setField, values, submitForm)}
                    />
                  </div>
                </div>
                <div className={styles.zoneDiv}>
                  <div className={styles.zoneTitle}>
                    <img
                      onClick={() => { setField(`region.countries[${idx}].whole`, !values.region.countries[idx].whole); submitForm(); }}
                      src={countryObj.whole ? checkedBoxIcon : unCheckedBoxIcon}
                      alt="" />
                    &nbsp;
                    Enable for entire country
                  </div>
                  {!countryObj.whole && (
                    <>
                      {countryObj?.regions?.map((regionObj, zoneIdx) => (
                        <div className={styles.zoneEditDiv}>
                          {_.upperCase(regionObj.name)}
                          <img src={editIcon} onClick={() => { editZone(idx.toString(), zoneIdx.toString()); }} alt="" />
                        </div>
                      ))}
                      <Clickable
                        onClick={() => { setCountryId(idx.toString()); addZone(values, idx, type); }}
                        className={cx(styles.addZoneDiv, { [styles.borderTop]: countryObj.regions?.length === 0 })}>
                        <img src={plusIcon} alt="" />
                        &nbsp;
                        Add Zones
                      </Clickable>
                    </>
                  )}
                </div>
              </div>
            ))
    )
      : (
                values?.region?.excluded.map((countryObj) => (
                  <div className={styles.countryDiv}>
                    <div className={styles.flex}>
                      {(countryObj)}
                    </div>
                  </div>
                ))
      )

  );

  const getDistanceZone = (type, values, setField, submitForm) => (
    values?.distance[type]?.distanceMatrix?.map((distanceObj, idx) => (
      <div className={styles.countryDiv}>
        <div className={styles.flex}>
          {_.capitalize(distanceObj?.name)}
          <div className={styles.toggleSwitch}>
            <Switch
              active={distanceObj?.enabled}
              onChange={() => handleSwitchChangeForDistance(idx, setField, values, type, submitForm)}
            />
          </div>
        </div>
        <div className={styles.showInput}>
          {`${distanceObj?.min} (${distanceObj?.type}) - ${distanceObj?.max} (${distanceObj?.type})`}
          <img onClick={() => editDistanceZone(idx, type)} src={editIcon} alt="" />
        </div>
      </div>
    )));

  // const onClickOptions = (type) => {
  //   if(type === "region"){

  //   }
  // }
  //   if(type === "region"){
  //     setField('region.active', true);
  //     setField('distance.active', false);
  //     return;
  //   }else{
  //       setField('distance.active', true);
  //       setField('region.active', false);
  //       return;
  //   }
  // }

  const getLandingPage = (values, setField, submitForm) => (
    options.map(obj => (
      <Clickable
        onClick={() => {
          if (!isConditionalChargesEnabled) {
            params.set('openPlans', 'generic');
            history.push({
              search: params.toString(),
            });
          } else {
            params.set(obj.key, true);
            history.push({
              search: params.toString(),
            });
          }
        }}
        className={styles.tab}>
        <div className={styles.options}>
          <img src={obj.icon} alt="" />
          <div className={styles.optionsText}>
            <span className={styles.title}>{obj.title}</span>
            <div className={styles.marginTop} />
            <span className={styles.subTitle}>{obj.subtitle}</span>
          </div>
          <div className={styles.optionButton}>
            <div className={styles.radio}>
              <img
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  if (!isConditionalChargesEnabled) {
                    params.set('openPlans', 'generic');
                    history.push({
                      search: params.toString(),
                    });
                  } else {
                    handleOptionEnable(setField, values, obj.key, submitForm);
                  }
                }}
                src={obj.key === 'region' ? (values.region.active ? checkedIcon : uncheckedIcon) : (
                  values.distance.active ? checkedIcon : uncheckedIcon)}
                alt="" />
              <div className={styles.marginTop} />
              <Clickable
                onClick={() => {
                  if (!isConditionalChargesEnabled) {
                    params.set('openPlans', 'generic');
                    history.push({
                      search: params.toString(),
                    });
                  } else {
                    params.set(obj.key, true);
                    history.push({
                      search: params.toString(),
                    });
                  }
                }}
                className={styles.config}>
                Config
              </Clickable>
            </div>
          </div>
          <Clickable
            onClick={() => {
              if (!isConditionalChargesEnabled) {
                params.set('openPlans', 'generic');
                history.push({
                  search: params.toString(),
                });
              } else {
                params.set(obj.key, true);
                history.push({
                  search: params.toString(),
                });
              }
            }}>
            <img className={styles.arrow} src={rightArrowIcon} alt="" />
          </Clickable>
        </div>
      </Clickable>
    ))

  );

  const Component = isDesktop ? 'div' : Drawer;

  const props = !isDesktop ? {
    title: 'Areas Served',
    onClose: () => {
      history.goBack();
    },
  } : {
    className: styles.desktopContainer,
  };

  if (isLoading) {
    return (
      <Loading />
    );
  }

  return (
    <Formik
      initialValues={getInitialValues(config)}
      onSubmit={onSubmit}
    >
      {({ values, setFieldValue, submitForm }) => (
        // eslint-disable-next-line react/jsx-props-no-spreading
        <Component {...props}>
          {isDesktop && (
            <div onClick={() => history.goBack()} className={styles.maintitle}>
              <img className={styles.backIconForDesktop} src={chevronLeftDesk} alt="" />
              <div>&nbsp;</div>
              <div>&nbsp;</div>
              Areas Served
            </div>
          )}
          <div className={styles.container}>
            {!isRegionConfig && !isDistanceConfig && (
              <>
                <div className={styles.initialText}>Define where you want to sell</div>
                {getLandingPage(values, setFieldValue, submitForm)}
              </>
            )}
            {(isRegionConfig || isDistanceConfig) && (
              <>
                <div className={styles.ConfigText}>
                  <img src={isRegionConfig ? regionBasedMiniIcon : distanceBasedMiniIcon} alt="ConfigBased" />
                  <div className={styles.marginLeft}>
                    {isRegionConfig ? 'Restrict by Region' : 'Restrict by Distance'}
                  </div>

                </div>
                {types.map(type => (
                  <div className={styles.configOptions}>
                    <div className={styles.box}>
                      <div>
                        {isRegionConfig ? 'Add countries to' : `${type === 'included' ? 'Inclusion' : 'Exclusion'} Zones in Miles/Km`}
                        {' '}
                        {isRegionConfig && (type === 'included' ? 'include' : 'exclude')}
                      </div>
                      <img
                        onClick={() => { setFieldValue(isRegionConfig ? 'region.type' : 'distance.type', type); submitForm(); }}
                        src={isRegionConfig ? (values.region.type === type ? checkedIcon : uncheckedIcon)
                          : (values.distance.type === type ? checkedIcon : uncheckedIcon)}
                        alt="" />
                    </div>
                    {isDistanceConfig && getDistanceZone(type, values, setFieldValue, submitForm)}
                    {isRegionConfig && (values.region.countries?.length > 0 || values.region?.excluded?.length > 0)
                     && getCountryDiv(values, setFieldValue, type, submitForm)}
                    <div
                      className={styles.addCountries}
                      onClick={() => {
                        if (isRegionConfig) {
                          setCountryType(type);
                          toggleCountryDrawer();
                        } else {
                          addDistanceZone(values, setFieldValue, type);
                        }
                      }}>
                      <img src={plusIcon} alt="" />
                      &nbsp;
                      {isRegionConfig ? 'Add Countries' : 'Add Zones'}
                    </div>
                  </div>
                ))}
                <Clickable
                  onClick={() => {
                    history.push('/manage/delivery');
                  }}
                  className={cx(styles.configOptions, styles.f500, styles.tab)}>
                  Add Shipping Charges
                  <div className={styles.addCountries}>
                    <img src={plusIcon} alt="" />
                    &nbsp;
                    Add
                  </div>
                </Clickable>
              </>
            ) }
            {openCountryDrawer && (
              <CountryDrawer
                onSelect={(value) => onCountryChange(value, (countryType === 'included' ? values.region.countries : values.region.excluded), setFieldValue)}
                onBack={toggleCountryDrawer}
                countriesList={countryType === 'included' ? values.region.countries : values.region.excluded}
                multiSelect={true}
                type={countryType}
                onSave={() => onSaveCountries(values)} />
            )}
            {openDistanceDrawer && (
              <Distance
                onClose={toggleDistanceDrawer}
                idx={distanceId || values.distance[distanceType].distanceMatrix.length - 1}
                type={distanceType}
                submitForm={submitForm} />
            )}
            {zoneId && (
              <Zones
                onClose={setZoneId}
                countryId={countryId}
                zoneId={zoneId}
                onSave={submitForm}
                isZoneEdit={isZoneEdit} />
            )}
          </div>
        </Component>
      )}
    </Formik>
  );
}

export default AreasServed;
