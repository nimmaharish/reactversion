import free from 'assets/images/subscriptions/free.png';
import plus from 'assets/images/subscriptions/plus.png';
import premium from 'assets/images/subscriptions/premium.png';
import _ from 'lodash';

export function convertValidityToString(days) {
  switch (days) {
    case 30:
    case 31:
      return 'Monthly';
    case 365:
    case 366:
      return 'Yearly  (Flat 30% OFF)';
    case 7:
      return 'Weekly';
    case 1:
      return 'Daily';
    case -1:
      return 'Unlimited';
    default:
      return `${days} Days`;
  }
}

export function getPlanImg(type) {
  switch (type?.toLowerCase()) {
    case 'free':
      return free;
    case 'plus':
      return plus;
    case 'premium':
      return premium;
    default:
      return free;
  }
}

export function getFeatures(plan, plans) {
  if (!plan?.features) {
    return [];
  }

  const idx = plans.findIndex(x => x.name === plan.name);
  const prevPlans = plans.slice(0, idx);
  const set = new Set([]);
  prevPlans.forEach(p => (p?.features || []).forEach(f => {
    if (f.enabled) {
      set.add(f.name);
    }
  }));

  return _.orderBy(plan?.features?.filter(x => !(x.enabled && set.has(x.name))), ['enabled'], ['desc']);
}
