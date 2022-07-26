import moment from 'moment';

export function canTakeRating() {
  const date = localStorage.getItem('lastRatingShown');
  if (!date) {
    return true;
  }
  const lastDate = moment(date);
  return moment().diff(lastDate, 'days') >= 3;
}

export function setRatingShown() {
  localStorage.setItem('lastRatingShown', moment().toISOString());
}
