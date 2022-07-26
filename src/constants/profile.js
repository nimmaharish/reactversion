export function getLabelName(name) {
  switch (name) {
    case 'bank':
      return 'bank Details';
    case 'delivery':
      return 'delivery Details';
    default:
      return name;
  }
}
