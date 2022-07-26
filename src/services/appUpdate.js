import EventEmitter from 'eventemitter3';

const emitter = new EventEmitter();

export const AppUpdateService = {
  on: (fn) => emitter.on('appUpdate', fn),
  off: (fn) => emitter.off('appUpdate', fn),
  open: (type = 'web') => emitter.emit('appUpdate', true, type),
  close: () => emitter.emit('appUpdate', false),
};
