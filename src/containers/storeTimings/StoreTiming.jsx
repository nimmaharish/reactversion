import React, { useState, useEffect } from 'react';
import { Formik } from 'formik';
import Loader from 'services/loader';
import SnackBar from 'services/snackbar';
import Header from 'containers/products/Header';
import { useHistory } from 'react-router-dom';
import ChevronRight from 'assets/images/sellerProfile/chevronRight.svg';
import editIcon from 'assets/images/sellerProfile/edit.svg';
import { Drawer } from 'components/shared/Drawer';
import { startCase, } from 'lodash';
import {
  Switch, Button, Select, ReactInput
} from 'phoenix-components';
import checkedIcon from 'assets/images/orders/multi/check.svg';
import unCheckedIcon from 'assets/images/orders/multi/uncheck.svg';
import { BottomDrawer } from 'components/shared/BottomDrawer';
import searchIcon from 'assets/images/address/search.svg';
import { Becca } from 'api/index';
import { useDesktop } from 'contexts';
import chevronLeftDesk from 'assets/v2/common/chevronPrimaryLeft.svg';
import { SideDrawer } from 'components/shared/SideDrawer';
import styles from './StoreTiming.module.css';
import { getInitialValues } from './utils';
import { typeOptions, timings, getCountryFromTimeZone } from './utils';

function StoreTiming() {
  const history = useHistory();
  const [toogleTimeZone, openTimeZone] = useState(false);
  const [editTime, setEditTime] = useState(false);
  const [currentDay, setCurrentDay] = useState(null);
  // const [search, setSearch] = useState(true);
  const [searchString, setSearchString] = useState(null);
  const [data, setData] = useState(null);
  const isDesktop = useDesktop();
  const [states, setStates] = useState({});

  const is12Clicked = () => {
    const day = states[currentDay];
    return day?.is12Clicked || false;
  };

  const is24by7 = (values) => values?.storeTimings?.[currentDay]?.opensAt === '00:00'
    && values?.storeTimings?.[currentDay]?.closesAt === '24:00';

  const onSubmit = async (values) => {
    try {
      Loader.show();
      const actualStoreTimings = Object.entries(values.storeTimings).reduce((acc, [key, value]) => {
        if (value?.opensAt === '24:00') {
          value.opensAt = '00:00';
          value.closesAt = '24:00';
        }
        acc[key] = value;
        return acc;
      }, {});
      const request = { storeTimings: actualStoreTimings, timezone: values?.timezone };
      await Becca.updateStoreTimings(request);
      history.goBack();
    } catch (e) {
      SnackBar.showError(e);
    } finally {
      Loader.hide();
    }
  };

  const editTimings = (day) => {
    setCurrentDay(day);
    setEditTime(true);
  };

  useEffect(() => {
    Becca.getShop()
      .then(x => {
        if (x?.response?.status === 404) {
          return;
        }
        setData({ storeTimings: x?.storeTimings, timezone: x?.timezone });
      })
      .catch((e) => {
        console.error(e);
      });
  }, []);

  const onSearch = (value) => {
    try {
      // eslint-disable-next-line no-unused-expressions
      setSearchString(value);
      // eslint-disable-next-line no-unused-expressions
      // searchString === '' ? setSearch(false) : setSearch(true);
    } catch (e) {
      SnackBar.showError(e);
    }
  };

  const getCloseTimings = (value) => {
    const index = timings().findIndex(i => i.label === value);
    return timings().filter((s, i) => i > index);
  };

  const getCloseValue = (values) => {
    const value = timings().find(x => x.value === values?.storeTimings?.[currentDay]?.closesAt);
    return value;
  };

  if (isDesktop) {
    return (
      <div className={styles.mainContainer}>
        <div onClick={() => history.goBack()} className={styles.maintitle}>
          <img className={styles.backIconForDesktop} src={chevronLeftDesk} alt="" />
          <div>&nbsp;</div>
          <div>&nbsp;</div>
          Store Timings
        </div>
        <Formik
          initialValues={getInitialValues(data)}
          onSubmit={onSubmit}
          enableReinitialize={true}
        >
          {({ values, setFieldValue }) => (
            <div className={styles.container}>
              <span className={styles.maintitle}>Set your store timing</span>
              <div className={styles.text}>
                You can choose to take orders only in the allowed store timings
                or even beyond that as per your choice.
              </div>
              {toogleTimeZone && (
                <SideDrawer
                  backButton={true}
                  title="Timezone"
                  onClose={() => openTimeZone(false)}
                >
                  <div className={styles.drawerContainer}>
                    Select Time Zone
                    <div className={styles.options}>
                      <ReactInput
                        startIcon={searchIcon}
                        labelClass={styles.inputClass}
                        placeholder="Enter Location"
                        setValue={e => {
                          onSearch(e);
                        }}
                      />
                      { searchString
                        ? typeOptions.filter(s => s.label.toLowerCase().includes(searchString?.toLowerCase()))
                          .map((s) => (
                            <div
                              className={styles.optionsText}
                              onClick={() => { setFieldValue('timezone', s.utc); openTimeZone(false); }}>
                              {s.label}
                            </div>
                          ))
                        : typeOptions.map((s) => (
                          <div
                            className={styles.optionsText}
                            onClick={() => { setFieldValue('timezone', s.utc); openTimeZone(false); }}>
                            {s.label}
                          </div>
                        ))}
                    </div>
                  </div>
                </SideDrawer>
              )}
              <div className={styles.desktopBlock}>
                <div className={styles.timezoneDiv} onClick={() => openTimeZone(true)}>
                  <div className={styles.timeZoneText}>
                    Select Timezone
                    <img src={ChevronRight} alt="" />
                  </div>
                  <div className={styles.selectedTimezone}>{getCountryFromTimeZone(values?.timezone)}</div>
                </div>
                {values.timezone && Object.entries(values.storeTimings).map(([k, v]) => (
                  <div className={styles.days}>
                    <div className={styles.top}>
                      {startCase(k)}
                      <Switch
                        active={v?.status === 'live'}
                        onChange={() => {
                          setFieldValue(`storeTimings[${k}].status`,
                        v?.status === 'live' ? 'created' : 'live');
                        }}
                      />
                    </div>
                    <div className={styles.maginTop}>
                      <div>
                        Open:
                        &nbsp;
                        {((v.opensAt === '00:00' && v.closesAt === '24:00')
                    || v.opensAt === '24:00') ? <span className={styles.green}>24 Hours</span>
                          : (
                            <span className={styles.green}>
                              {v.opensAt}
                              {' '}
                              <span className={styles.black}>To</span>
                              {' '}
                              {v.closesAt}
                            </span>
                          )}
                      </div>
                      <img src={editIcon} alt="" onClick={() => editTimings(k)} />
                    </div>
                    <div className={styles.checkbox}>
                      <img
                        onClick={() => setFieldValue(`storeTimings[${k}].acceptOrders`,
                          !(values.storeTimings[k].acceptOrders))}
                        src={values.storeTimings[k].acceptOrders === true ? checkedIcon : unCheckedIcon}
                        alt=""
                      />
                      &nbsp;
                      Accept orders after store timings?
                    </div>
                  </div>
                ))}
                <div className={styles.containerB}>
                  <Button
                    size="large"
                    label="Save"
                    primary={true}
                    className={styles.button}
                    onClick={() => onSubmit(values)}
                  />
                </div>
              </div>
              {editTime
              && (
                <SideDrawer
                  backButton={true}
                  title="Set Store Timing"
                  onClose={() => setEditTime(false)}
                  button={false}
                >
                  <div className={styles.drawer}>
                    <div className={styles.editTimings}>
                      {`Store Timing On ${startCase(currentDay)}`}
                    </div>
                    <div>
                      <div className={styles.select}>
                        <div className={styles.width}>
                          <Select
                            isSearchable={false}
                            options={[...[{ label: '24 Hours', value: '-1' }], ...timings()]}
                            placeholder="Opens At"
                            value={is24by7(values) && !is12Clicked()
                              ? { label: '24 Hours', value: '-1' }
                              : timings().find(x => x.value === values?.storeTimings?.[currentDay].opensAt)}
                            onChange={(e) => {
                              if (e.value !== '-1') {
                                if (e.value === '00:00') {
                                  const items = { ...states, [currentDay]: { is12Clicked: true } };
                                  setStates(items);
                                }
                                setFieldValue(`storeTimings[${currentDay}].opensAt`, e.value);
                              } else {
                                const items = { ...states, [currentDay]: { is12Clicked: false } };
                                setStates(items);
                                setFieldValue(`storeTimings[${currentDay}].opensAt`, '00:00');
                                setFieldValue(`storeTimings[${currentDay}].closesAt`, '24:00');
                              }
                            }}
                          />
                        </div>
                        {(!is24by7(values) || is12Clicked()) && (<span className={styles.marginLeft}>To</span>)}
                        {(!is24by7(values) || is12Clicked())
                        && (
                          <div className={styles.width2}>
                            <Select
                              // eslint-disable-next-line array-callback-return
                              isSearchable={false}
                              options={getCloseTimings(values?.storeTimings?.[currentDay]?.opensAt)}
                              placeholder="Closes at"
                              value={getCloseValue(values)}
                              onChange={(e) => setFieldValue(`storeTimings[${currentDay}].closesAt`, e.value)}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className={styles.desktopSaveButton}>
                      <Button
                        size="large"
                        label="Save"
                        primary={true}
                        onClick={() => setEditTime(false)}
                      />
                    </div>
                  </div>
                </SideDrawer>
              )}
            </div>
          )}
        </Formik>
      </div>
    );
  }
  return (
    <div className={styles.mainContainer}>
      <Header onBack={() => history.goBack()} title="Store Timings" />
      <Formik
        initialValues={getInitialValues(data)}
        onSubmit={onSubmit}
        enableReinitialize={true}
      >
        {({ values, setFieldValue }) => (
          <div className={styles.container}>
            <span className={styles.maintitle}>Set your store timing</span>
            <div className={styles.text}>
              You can choose to take orders only in the allowed store timings
              or even beyond that as per your choice.
            </div>
            <div className={styles.timezoneDiv} onClick={() => openTimeZone(true)}>
              <div className={styles.timeZoneText}>
                Select Timezone
                <img src={ChevronRight} alt="" />
              </div>
              <div className={styles.selectedTimezone}>{getCountryFromTimeZone(values?.timezone)}</div>
            </div>
            {toogleTimeZone && (
              <Drawer
                title="Timezone"
                onClose={() => openTimeZone(false)}
              >
                <div className={styles.drawerContainer}>
                  Select Timezone
                  <div className={styles.options}>
                    <ReactInput
                      startIcon={searchIcon}
                      labelClass={styles.inputClass}
                      placeholder="Enter Location"
                      setValue={e => {
                        onSearch(e);
                      }}
                    />
                    { searchString
                      ? typeOptions.filter(s => s.label.toLowerCase().includes(searchString?.toLowerCase()))
                        .map((s) => (
                          <div
                            className={styles.optionsText}
                            onClick={() => { setFieldValue('timezone', s.utc); openTimeZone(false); }}>
                            {s.label}
                          </div>
                        ))
                      : typeOptions.map((s) => (
                        <div
                          className={styles.optionsText}
                          onClick={() => { setFieldValue('timezone', s.utc); openTimeZone(false); }}>
                          {s.label}
                        </div>
                      ))}
                  </div>
                </div>
              </Drawer>
            )}
            {values.timezone && Object.entries(values.storeTimings).map(([k, v]) => (
              <div className={styles.days}>
                <div className={styles.top}>
                  {startCase(k)}
                  <Switch
                    active={v?.status === 'live'}
                    onChange={() => {
                      setFieldValue(`storeTimings[${k}].status`,
                        v?.status === 'live' ? 'created' : 'live');
                    }}
                  />
                </div>
                <div className={styles.maginTop}>
                  <div>
                    Open:
                    &nbsp;
                    {((v.opensAt === '00:00' && v.closesAt === '24:00')
                    || v.opensAt === '24:00') ? <span className={styles.green}>24 Hours</span>
                      : (
                        <span className={styles.green}>
                          {v.opensAt}
                          {' '}
                          <span className={styles.black}>To</span>
                          {' '}
                          {v.closesAt}
                        </span>
                      )}
                  </div>
                  <img src={editIcon} alt="" onClick={() => editTimings(k)} />
                </div>
                <div className={styles.checkbox}>
                  <img
                    onClick={() => setFieldValue(`storeTimings[${k}].acceptOrders`,
                      !(values.storeTimings[k].acceptOrders))}
                    src={values.storeTimings[k].acceptOrders === true ? checkedIcon : unCheckedIcon}
                    alt=""
                  />
                  &nbsp;
                  Accept orders after store timings?
                </div>
              </div>
            ))}
            {editTime
              && (
                <BottomDrawer
                  onClose={() => setEditTime(false)}
                  title="Set Store Timing"
                  closeButton
                >
                  <div className={styles.drawer}>
                    <div className={styles.editTimings}>
                      {`Store Timing On ${startCase(currentDay)}`}
                    </div>
                    <div>
                      <div className={styles.select}>
                        <div className={styles.width}>
                          <Select
                            isSearchable={false}
                            className={styles.textField}
                            options={[...[{ label: '24 Hours', value: '-1' }], ...timings()]}
                            placeholder="Opens At"
                            value={is24by7(values) && !is12Clicked()
                              ? { label: '24 Hours', value: '-1' }
                              : timings().find(x => x.value === values?.storeTimings?.[currentDay].opensAt)}
                            onChange={(e) => {
                              if (e.value !== '-1') {
                                if (e.value === '00:00') {
                                  const items = { ...states, [currentDay]: { is12Clicked: true } };
                                  setStates(items);
                                }
                                setFieldValue(`storeTimings[${currentDay}].opensAt`, e.value);
                              } else {
                                const items = { ...states, [currentDay]: { is12Clicked: false } };
                                setStates(items);
                                setFieldValue(`storeTimings[${currentDay}].opensAt`, '00:00');
                                setFieldValue(`storeTimings[${currentDay}].closesAt`, '24:00');
                              }
                            }}
                          />
                        </div>
                        {(!is24by7(values) || is12Clicked()) && (<span className={styles.marginLeft}>To</span>)}
                        {(!is24by7(values) || is12Clicked())
                        && (
                          <div className={styles.width2}>
                            <Select
                              isSearchable={false}
                              options={getCloseTimings(values?.storeTimings?.[currentDay]?.opensAt)}
                              placeholder="Closes at"
                              value={getCloseValue(values)}
                              onChange={(e) => setFieldValue(`storeTimings[${currentDay}].closesAt`, e.value)}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className={styles.bdBtn}>
                      <Button
                        size="large"
                        label="Save"
                        fullWidth
                        bordered={false}
                        primary={true}
                        onClick={() => setEditTime(false)}
                      />
                    </div>
                  </div>
                </BottomDrawer>
              )}
            <div className={styles.buttonC}>
              <Button
                size="large"
                label="Save"
                primary={true}
                fullWidth
                bordered={false}
                onClick={() => onSubmit(values)}
              />
            </div>
          </div>
        )}
      </Formik>
    </div>
  );
}

export default StoreTiming;
