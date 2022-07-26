import EventEmitter from 'eventemitter3';

const emitter = new EventEmitter();

export const RatingService = {
  on: (fn) => emitter.on('openRating', fn),
  off: (fn) => emitter.off('openRating', fn),
  open: () => emitter.emit('openRating', true),
  close: () => emitter.emit('openRating', false),
};
