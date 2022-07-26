import CONFIG from 'config';

const isStaging = CONFIG.ENV === 'staging';

function genericShare(type, id, direct = false) {
  const token = encodeURIComponent(btoa(JSON.stringify({
    type,
    id,
    shared: true
  })));
  if (direct) {
    return `https://mywindo.shop/redirect?token=${token}`;
  }
  return `https://windo.onelink.me/HbMF/5d24c4ad?token=${token}`;
}

export function sharePost(id, direct = false) {
  return genericShare('post', id, direct);
}

export function shareProduct(productSlug, shopSlug = 'shop', isCustom, domain) {
  if (isCustom && domain) {
    return `https://${domain}/${productSlug}`;
  }
  return `https://mywindo.shop/${shopSlug}/${productSlug}`;
}

export function shareProfile(id, direct = false) {
  return genericShare('profile', id, direct);
}

export function shareShop(id, isCustom, domain) {
  if (isCustom && domain) {
    return `https://${domain}`;
  }
  return `https://mywindo.shop/${id}`;
}

export function shareCatalog(catalog, shopSlug = 'shop', isCustom, domain) {
  let url = `https://mywindo.shop/${shopSlug}/catalogs`;
  if (isStaging) {
    url = `https://staging.mywindo.shop/${shopSlug}/catalogs`;
  }
  if (isCustom && domain) {
    url = `https://${domain}/catalogs`;
  }
  const link = new URL(url);
  link.searchParams.set('catalog', catalog);
  return link.href;
}

export function shareSellerApp() {
  return 'https://windo-seller.onelink.me/yopW/install';
}
