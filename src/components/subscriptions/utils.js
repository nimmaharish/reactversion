export const getPreFeatures = (plan) => {
  if (plan === 'free') {
    return ['Upgrade now to unlock more  features'];
  }
  if (plan === 'plus') {
    return ['Everything in Sprout plan + '];
  }
  if (plan === 'premium') {
    return ['Everything in Blossom plan + '];
  }
  return [];
};
