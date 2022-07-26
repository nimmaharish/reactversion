import EventManager from 'utils/events';

function setSessionItem(name, value) {
  sessionStorage.setItem(name, value);
}

function getSessionItem(name) {
  return sessionStorage.getItem(name);
}

function isWatchedOverviewAlert() {
  const value = getSessionItem('overviewAlert');
  if (value !== null && value?.length > 0) {
    return value !== 'false';
  }
  return true;
}

function setItem(name, value) {
  localStorage.setItem(name, value);
  if (name === 'token') {
    const coachMarksList = JSON.stringify({
      stepper: false,
      products: false,
      payments: false,
      orders: false,
      settings: false,
    });
    localStorage.setItem('coachmarks', coachMarksList);
    setSessionItem('overviewAlert', 'false');
  }
}

function getItem(name) {
  return localStorage.getItem(name);
}

function getFaqs() {
  const items = getItem('recentFaqs');
  return JSON.parse(items) || [];
}

function setFaqs(item) {
  const items = getFaqs();
  const newItems = items.filter(x => x !== item);
  newItems.unshift(item);
  setItem('recentFaqs', JSON.stringify(newItems));
}

function isLoggedIn() {
  const token = getItem('token');
  return token !== null && token?.length > 0;
}

function isWatchedCoachMark(item) {
  const value = getItem('coachmarks');
  if (value !== null && value?.length > 0 && value !== 'true') {
    const parsed = JSON.parse(value);
    return parsed[item];
  }
  return true;
}

function updateWatchedCoachMarks(item) {
  const value = getItem('coachmarks');
  if (value !== null && value?.length > 0 && value !== 'true') {
    const parsed = JSON.parse(value);
    parsed[item] = true;
    setItem('coachmarks', JSON.stringify(parsed));
  }
}

function getNotWatchedCoachMarks() {
  const value = getItem('coachmarks');
  if (value !== null && value?.length > 0 && value !== 'true') {
    const parsed = JSON.parse(value);
    const items = Object.keys(parsed).filter(x => !parsed[x]);
    return items;
  }
  return [];
}

function getUnits() {
  const value = getItem('units');
  if (value !== null && value?.length > 0 && value !== 'true') {
    const parsed = JSON.parse(value);
    return parsed;
  }
  return [];
}

function addUnit(item) {
  const value = getItem('units');
  if (value !== null && value?.length > 0 && value !== 'true') {
    const parsed = JSON.parse(value);
    parsed.push(item);
    setItem('units', JSON.stringify(parsed));
    return;
  }
  setItem('units', JSON.stringify([item]));
}

async function logout(history) {
  localStorage.removeItem('token');
  localStorage.removeItem('coachmarks');
  localStorage.removeItem('units');
  sessionStorage.removeItem('overviewAlert');
  EventManager.resetGlobalData();
  history.replace('/');
  history.go();
}

const Storage = {
  getItem,
  setItem,
  isLoggedIn,
  logout,
  setSessionItem,
  getSessionItem,
  isWatchedCoachMark,
  updateWatchedCoachMarks,
  getNotWatchedCoachMarks,
  isWatchedOverviewAlert,
  setFaqs,
  getFaqs,
  getUnits,
  addUnit
};

export default Storage;
