/* eslint-disable max-len */

const { spawn } = require('child_process');

async function spawnChild(command) {
  return new Promise((resolve, reject) => {
    const proc = spawn(command, [], {
      shell: true,
    });
    proc.stdout.pipe(process.stdout);
    proc.stderr.pipe(process.stderr);
    proc.on('close', (code) => {
      console.info(`child process exited with code ${code}`);
      if (code === 0) {
        resolve('ok');
      } else {
        reject(new Error('Something went wrong'));
      }
    });
  });
}

async function deploy() {
  const pr1 = spawnChild(
    `aws s3 sync --acl public-read --cache-control max-age=31536000,public  ./build/static s3://${process.env.S3_BUCKET}/static`
  );
  const pr2 = spawnChild(
    `aws s3 sync --acl public-read --cache-control max-age=31536000,public  ./build/assets s3://${process.env.S3_BUCKET}/assets`
  );
  const pr3 = spawnChild(
    `aws s3 sync --acl public-read --exclude static,assets --cache-control max-age=0,no-cache,must-revalidate,no-store  ./build s3://${process.env.S3_BUCKET}`
  );
  await Promise.all([pr1, pr2, pr3]);

  const ids = process.env.CF_ID.split(',').map(x => x.trim());

  const prs = ids.map(id => spawnChild(
    `aws cloudfront create-invalidation --distribution-id ${id} --paths "/*"`
  ));

  await Promise.all(prs);
}

deploy()
  .then(console.log)
  .catch(console.error);
