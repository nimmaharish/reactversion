export function getChipNameForNick(nick) {
  switch (nick.toLowerCase()) {
    case 'home':
      return 'Home';
    case 'shop':
      return 'Shop';
    case 'warehouse':
      return 'Warehouse';
    default:
      return 'Others';
  }
}
