import { connector } from './axios';

async function sendMessage(room, payload) {
  const {
    data
  } = await connector.post(`chat/seller/${room}`, payload);
  return data;
}

async function getChat(room, page) {
  const {
    data
  } = await connector.get(`chat/seller/${room}?page=${page}`);
  return data;
}

async function readChat(room, ids) {
  const {
    data
  } = await connector.post(`chat/seller/${room}/read`, {
    ids,
  });
  return data;
}

const Hedwig = {
  getChat,
  sendMessage,
  readChat,
};

export default Hedwig;
