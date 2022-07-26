const { customAlphabet } = require('nanoid');
const fs = require('fs');
const path = require('path');

const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ01234567890', 8);

function run() {
  const id = nanoid();
  const meta = {
    version: id,
    date: (new Date()).toISOString(),
  };
  fs.writeFileSync(path.resolve(__dirname, '..', 'src', 'meta.json'), JSON.stringify(meta, null, 4));
}

run();
