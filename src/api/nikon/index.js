import { connector } from './axios';

async function getProfile() {
  const { data } = await connector.get('/seller/profile');
  return data;
}

async function getLivePosts(page = 0, filters = {}, sorts = {}) {
  const { data } = await connector.get('/seller/posts/all', {
    params: {
      page,
      filters,
      sorts
    }
  });
  return data;
}
async function getPostsMedia(page = 0, filters = {}, sorts = {}) {
  const { data } = await connector.get('/seller/posts/media', {
    params: {
      page,
      filters,
      sorts
    }
  });
  return data;
}

async function getDraftPosts(page = 0, filters = {}, sorts = {}) {
  const { data } = await connector.get('/seller/posts/draft', {
    params: {
      page,
      filters,
      sorts
    }
  });
  return data;
}

async function getShoppablePosts(page = 0, filters = {}, sorts = {}) {
  const { data } = await connector.get('/seller/posts/shoppable', {
    params: {
      page,
      filters,
      sorts
    }
  });
  return data;
}

async function getPost(id) {
  const { data } = await connector.get(`/seller/post/${id}`);
  return data;
}

async function tagProducts(id, products) {
  const { data } = await connector.post(`/seller/post/${id}/attachProducts`, {
    products,
  });
  return data;
}

async function createInstagramProfile(url) {
  const { data } = await connector.post('/seller/instagram', {
    url
  });
  return data;
}

async function getInstagramAccount() {
  const { data } = await connector.get('/seller/instagram');
  return data;
}

async function syncInstagramProfile(code, redirectUrl) {
  const { data } = await connector.post('/seller/instagram/sync', {
    code,
    redirectUrl,
  });
  return data;
}

async function deletePosts(ids) {
  const { data } = await connector.post('/seller/posts/delete', {
    ids
  });
  return data;
}

async function unlivePosts(ids) {
  const { data } = await connector.post('/seller/posts/draft', {
    ids
  });
  return data;
}

async function livePosts(ids) {
  const { data } = await connector.post('/seller/posts/live', {
    ids
  });
  return data;
}

async function createPost(req, onProgress) {
  const { data } = await connector.post('/seller/post/', req, {
    onUploadProgress: onProgress,
  });
  return data;
}

async function createProduct(req, id) {
  const { data } = await connector.post(`/seller/post/${id}/product`, req);
  return data;
}

async function unlinkInstagram(deletePosts) {
  const { data } = await connector.post('/seller/instagram/unlink', {
    deletePosts,
  });
  return data;
}

async function syncInstagramNow() {
  const { data } = await connector.post('/seller/instagram/sync/now');
  return data;
}

const Nikon = {
  getProfile,
  getLivePosts,
  getDraftPosts,
  getShoppablePosts,
  getPost,
  tagProducts,
  createInstagramProfile,
  deletePosts,
  unlivePosts,
  livePosts,
  createPost,
  createProduct,
  syncInstagramProfile,
  getInstagramAccount,
  unlinkInstagram,
  syncInstagramNow,
  getPostsMedia,
};

export default Nikon;
